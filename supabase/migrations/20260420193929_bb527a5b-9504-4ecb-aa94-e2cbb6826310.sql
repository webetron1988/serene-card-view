
-- ============================================================
-- Step 4: Partition audit_log monthly + 7-year retention
-- ============================================================

-- 1) Rename existing table; we'll migrate rows into the partitioned parent
ALTER TABLE public.audit_log RENAME TO audit_log_legacy;

-- 2) Create partitioned parent table (PARTITION BY RANGE on created_at)
--    PK must include the partition key.
CREATE TABLE public.audit_log (
  id              uuid           NOT NULL DEFAULT gen_random_uuid(),
  tenant_id       uuid           NULL REFERENCES public.tenants(id) ON DELETE SET NULL,
  actor_user_id   uuid           NULL,
  actor_email     text           NULL,
  event_type      text           NOT NULL,
  resource_type   text           NULL,
  resource_id     text           NULL,
  severity        text           NOT NULL DEFAULT 'info',
  metadata        jsonb          NOT NULL DEFAULT '{}'::jsonb,
  ip_address      inet           NULL,
  user_agent      text           NULL,
  created_at      timestamptz    NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- 3) Helpful indexes on parent (propagate to all partitions)
CREATE INDEX audit_log_created_at_idx     ON public.audit_log (created_at DESC);
CREATE INDEX audit_log_tenant_idx         ON public.audit_log (tenant_id, created_at DESC);
CREATE INDEX audit_log_actor_idx          ON public.audit_log (actor_user_id, created_at DESC);
CREATE INDEX audit_log_event_idx          ON public.audit_log (event_type, created_at DESC);
CREATE INDEX audit_log_severity_idx       ON public.audit_log (severity, created_at DESC);
CREATE INDEX audit_log_resource_idx       ON public.audit_log (resource_type, resource_id);
CREATE INDEX audit_log_metadata_gin_idx   ON public.audit_log USING GIN (metadata);

-- 4) Default partition catches anything outside known monthly ranges
CREATE TABLE public.audit_log_default PARTITION OF public.audit_log DEFAULT;

-- 5) Maintenance function: ensure a monthly partition exists for a given month
CREATE OR REPLACE FUNCTION public.ensure_audit_log_partition(_month date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start  date := date_trunc('month', _month)::date;
  v_end    date := (date_trunc('month', _month) + interval '1 month')::date;
  v_name   text := format('audit_log_%s', to_char(v_start, 'YYYYMM'));
  v_sql    text;
BEGIN
  IF to_regclass(format('public.%I', v_name)) IS NOT NULL THEN
    RETURN;
  END IF;

  v_sql := format(
    'CREATE TABLE public.%I PARTITION OF public.audit_log
       FOR VALUES FROM (%L) TO (%L);',
    v_name, v_start, v_end
  );
  EXECUTE v_sql;
END;
$$;

-- 6) Pre-create partitions: previous month, current, and next 12 months
DO $$
DECLARE
  i int;
BEGIN
  FOR i IN -1..12 LOOP
    PERFORM public.ensure_audit_log_partition((date_trunc('month', now()) + (i || ' months')::interval)::date);
  END LOOP;
END $$;

-- 7) Migrate existing rows from legacy table (if any)
INSERT INTO public.audit_log
  (id, tenant_id, actor_user_id, actor_email, event_type, resource_type, resource_id,
   severity, metadata, ip_address, user_agent, created_at)
SELECT
   id, tenant_id, actor_user_id, actor_email, event_type, resource_type, resource_id,
   severity, metadata, ip_address, user_agent, created_at
FROM public.audit_log_legacy;

-- 8) Drop legacy table
DROP TABLE public.audit_log_legacy CASCADE;

-- 9) Re-enable RLS + recreate policies (mirrors original)
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view all audit entries"
  ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Auditors can view all audit entries"
  ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'auditor'));

CREATE POLICY "Tenant admins can view their tenant audit entries"
  ON public.audit_log FOR SELECT TO authenticated
  USING (
    tenant_id IS NOT NULL AND (
      public.has_tenant_role(auth.uid(), tenant_id, 'super_admin')
      OR public.has_tenant_role(auth.uid(), tenant_id, 'admin')
      OR public.has_tenant_role(auth.uid(), tenant_id, 'auditor')
    )
  );

CREATE POLICY "Authenticated users can insert audit entries"
  ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_user_id);

-- 10) Reattach the role-change audit trigger (it inserts into public.audit_log)
DROP TRIGGER IF EXISTS trg_audit_user_roles ON public.user_roles;
CREATE TRIGGER trg_audit_user_roles
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

DROP TRIGGER IF EXISTS trg_audit_role_permissions ON public.role_permissions;
CREATE TRIGGER trg_audit_role_permissions
AFTER INSERT OR UPDATE OR DELETE ON public.role_permissions
FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

DROP TRIGGER IF EXISTS trg_audit_role_permission_denies ON public.role_permission_denies;
CREATE TRIGGER trg_audit_role_permission_denies
AFTER INSERT OR UPDATE OR DELETE ON public.role_permission_denies
FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

-- 11) Retention: drop partitions older than 7 years (84 months)
CREATE OR REPLACE FUNCTION public.prune_audit_log_partitions(_retain_months int DEFAULT 84)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cutoff date := (date_trunc('month', now()) - (_retain_months || ' months')::interval)::date;
  v_part   record;
  v_count  int := 0;
  v_to     date;
BEGIN
  FOR v_part IN
    SELECT c.relname AS part_name,
           pg_get_expr(c.relpartbound, c.oid) AS bound_expr
    FROM pg_inherits i
    JOIN pg_class c    ON c.oid = i.inhrelid
    JOIN pg_class p    ON p.oid = i.inhparent
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.relname = 'audit_log'
      AND n.nspname = 'public'
      AND c.relname <> 'audit_log_default'
  LOOP
    -- Bound looks like: FOR VALUES FROM ('2024-01-01') TO ('2024-02-01')
    v_to := substring(v_part.bound_expr from 'TO \(''([0-9-]+)''\)')::date;
    IF v_to <= v_cutoff THEN
      EXECUTE format('DROP TABLE public.%I', v_part.part_name);
      v_count := v_count + 1;
    END IF;
  END LOOP;
  RETURN v_count;
END;
$$;

-- 12) Rolling maintenance: ensure next 3 months exist + prune old ones
CREATE OR REPLACE FUNCTION public.maintain_audit_log_partitions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  i int;
BEGIN
  FOR i IN 0..3 LOOP
    PERFORM public.ensure_audit_log_partition((date_trunc('month', now()) + (i || ' months')::interval)::date);
  END LOOP;
  PERFORM public.prune_audit_log_partitions(84);
END;
$$;
