-- ============================================================
-- Stage 0.3: Self-Service Payment Gateways (retry: rename `overlaps` CTE)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgsodium;

-- ENUMS
DO $$ BEGIN
  CREATE TYPE public.payment_provider AS ENUM ('stripe', 'razorpay');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_environment AS ENUM ('test', 'live');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.gateway_country_scope AS ENUM ('all', 'selected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.gateway_verify_status AS ENUM ('unverified', 'ok', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- TABLES
CREATE TABLE IF NOT EXISTS public.payment_gateways (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider        public.payment_provider NOT NULL,
  display_name    text NOT NULL,
  environment     public.payment_environment NOT NULL DEFAULT 'test',
  country_scope   public.gateway_country_scope NOT NULL DEFAULT 'all',
  publishable_key text,
  is_active       boolean NOT NULL DEFAULT false,
  verify_status   public.gateway_verify_status NOT NULL DEFAULT 'unverified',
  verify_error    text,
  last_verified_at timestamptz,
  notes           text,
  created_by      uuid,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_gateways_active
  ON public.payment_gateways (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_payment_gateways_provider
  ON public.payment_gateways (provider);

CREATE TABLE IF NOT EXISTS public.payment_gateway_countries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_id  uuid NOT NULL REFERENCES public.payment_gateways(id) ON DELETE CASCADE,
  country_code char(2) NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (gateway_id, country_code),
  CONSTRAINT chk_country_uppercase CHECK (country_code = upper(country_code))
);

CREATE INDEX IF NOT EXISTS idx_pgc_country  ON public.payment_gateway_countries (country_code);
CREATE INDEX IF NOT EXISTS idx_pgc_gateway  ON public.payment_gateway_countries (gateway_id);

CREATE TABLE IF NOT EXISTS public.payment_gateway_secrets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_id  uuid NOT NULL REFERENCES public.payment_gateways(id) ON DELETE CASCADE,
  secret_name text NOT NULL,
  vault_secret_id uuid NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (gateway_id, secret_name)
);

CREATE INDEX IF NOT EXISTS idx_pgs_gateway ON public.payment_gateway_secrets (gateway_id);

-- updated_at triggers
DROP TRIGGER IF EXISTS trg_payment_gateways_updated ON public.payment_gateways;
CREATE TRIGGER trg_payment_gateways_updated
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_payment_gateway_secrets_updated ON public.payment_gateway_secrets;
CREATE TRIGGER trg_payment_gateway_secrets_updated
  BEFORE UPDATE ON public.payment_gateway_secrets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateway_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateway_secrets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform users view payment gateways" ON public.payment_gateways;
CREATE POLICY "Platform users view payment gateways"
  ON public.payment_gateways FOR SELECT TO authenticated
  USING (public.get_user_tier(auth.uid()) = 'platform');

DROP POLICY IF EXISTS "Super admins insert payment gateways" ON public.payment_gateways;
CREATE POLICY "Super admins insert payment gateways"
  ON public.payment_gateways FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins update payment gateways" ON public.payment_gateways;
CREATE POLICY "Super admins update payment gateways"
  ON public.payment_gateways FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins delete payment gateways" ON public.payment_gateways;
CREATE POLICY "Super admins delete payment gateways"
  ON public.payment_gateways FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Platform users view gateway countries" ON public.payment_gateway_countries;
CREATE POLICY "Platform users view gateway countries"
  ON public.payment_gateway_countries FOR SELECT TO authenticated
  USING (public.get_user_tier(auth.uid()) = 'platform');

DROP POLICY IF EXISTS "Super admins manage gateway countries" ON public.payment_gateway_countries;
CREATE POLICY "Super admins manage gateway countries"
  ON public.payment_gateway_countries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "No client access to gateway secrets" ON public.payment_gateway_secrets;
CREATE POLICY "No client access to gateway secrets"
  ON public.payment_gateway_secrets FOR SELECT TO authenticated
  USING (false);

DROP POLICY IF EXISTS "Super admins insert gateway secrets" ON public.payment_gateway_secrets;
CREATE POLICY "Super admins insert gateway secrets"
  ON public.payment_gateway_secrets FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins delete gateway secrets" ON public.payment_gateway_secrets;
CREATE POLICY "Super admins delete gateway secrets"
  ON public.payment_gateway_secrets FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- VAULT HELPERS
CREATE OR REPLACE FUNCTION public.set_payment_gateway_secret(
  _gateway_id uuid,
  _secret_name text,
  _value text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  v_existing_vault_id uuid;
  v_new_vault_id uuid;
  v_vault_name text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only super_admin may set payment gateway secrets';
  END IF;
  IF _value IS NULL OR length(_value) = 0 THEN
    RAISE EXCEPTION 'Secret value cannot be empty';
  END IF;

  v_vault_name := format('pg_%s_%s_%s', _gateway_id::text, _secret_name, gen_random_uuid()::text);
  v_new_vault_id := vault.create_secret(_value, v_vault_name, format('Payment gateway %s secret %s', _gateway_id, _secret_name));

  SELECT vault_secret_id INTO v_existing_vault_id
    FROM public.payment_gateway_secrets
   WHERE gateway_id = _gateway_id AND secret_name = _secret_name;

  IF v_existing_vault_id IS NOT NULL THEN
    DELETE FROM vault.secrets WHERE id = v_existing_vault_id;
    UPDATE public.payment_gateway_secrets
       SET vault_secret_id = v_new_vault_id, updated_at = now()
     WHERE gateway_id = _gateway_id AND secret_name = _secret_name;
  ELSE
    INSERT INTO public.payment_gateway_secrets (gateway_id, secret_name, vault_secret_id)
    VALUES (_gateway_id, _secret_name, v_new_vault_id);
  END IF;

  RETURN v_new_vault_id;
END;
$$;

REVOKE ALL ON FUNCTION public.set_payment_gateway_secret(uuid, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.set_payment_gateway_secret(uuid, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_payment_gateway_secret(
  _gateway_id uuid,
  _secret_name text
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  v_value text;
BEGIN
  IF NOT (public.has_role(auth.uid(), 'super_admin') OR auth.role() = 'service_role') THEN
    RAISE EXCEPTION 'Not authorised to read payment gateway secrets';
  END IF;

  SELECT ds.decrypted_secret INTO v_value
  FROM public.payment_gateway_secrets pgs
  JOIN vault.decrypted_secrets ds ON ds.id = pgs.vault_secret_id
  WHERE pgs.gateway_id = _gateway_id AND pgs.secret_name = _secret_name;

  RETURN v_value;
END;
$$;

REVOKE ALL ON FUNCTION public.get_payment_gateway_secret(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_payment_gateway_secret(uuid, text) TO authenticated, service_role;

-- HARD-BLOCK TRIGGER
CREATE OR REPLACE FUNCTION public.gateway_covered_countries(_gateway_id uuid)
RETURNS TABLE(country_code text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_scope public.gateway_country_scope;
BEGIN
  SELECT country_scope INTO v_scope FROM public.payment_gateways WHERE id = _gateway_id;
  IF v_scope = 'all' THEN
    RETURN QUERY SELECT 'ALL'::text;
  ELSE
    RETURN QUERY
      SELECT pgc.country_code::text
        FROM public.payment_gateway_countries pgc
       WHERE pgc.gateway_id = _gateway_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_one_active_gateway_per_country()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_my_count int;
  v_conflicts text[];
BEGIN
  IF NEW.is_active = false THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = true
     AND OLD.country_scope = NEW.country_scope THEN
    RETURN NEW;
  END IF;

  IF NEW.country_scope = 'selected' THEN
    SELECT COUNT(*) INTO v_my_count
      FROM public.payment_gateway_countries WHERE gateway_id = NEW.id;
    IF v_my_count = 0 THEN
      RAISE EXCEPTION 'Cannot activate gateway %: country_scope is "selected" but no countries are listed', NEW.id
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  WITH my_countries AS (
    SELECT country_code FROM public.gateway_covered_countries(NEW.id)
  ),
  other_active AS (
    SELECT pg.id, pg.display_name, pg.provider, gcc.country_code AS other_cc
    FROM public.payment_gateways pg
    CROSS JOIN LATERAL public.gateway_covered_countries(pg.id) gcc
    WHERE pg.is_active = true AND pg.id <> NEW.id
  ),
  conflict_rows AS (
    SELECT oa.id, oa.display_name, oa.provider,
           CASE
             WHEN EXISTS (SELECT 1 FROM my_countries mc WHERE mc.country_code = 'ALL') THEN 'ALL'
             WHEN oa.other_cc = 'ALL' THEN 'ALL'
             ELSE oa.other_cc
           END AS conflict_cc
    FROM other_active oa
    WHERE
      EXISTS (SELECT 1 FROM my_countries mc WHERE mc.country_code = 'ALL')
      OR oa.other_cc = 'ALL'
      OR EXISTS (SELECT 1 FROM my_countries mc WHERE mc.country_code = oa.other_cc)
  )
  SELECT array_agg(DISTINCT format('%s (%s) -> %s', display_name, provider, conflict_cc))
    INTO v_conflicts FROM conflict_rows;

  IF v_conflicts IS NOT NULL AND array_length(v_conflicts, 1) > 0 THEN
    RAISE EXCEPTION 'PAYMENT_GATEWAY_CONFLICT: % already active in overlapping countries: %',
      array_length(v_conflicts, 1),
      array_to_string(v_conflicts, '; ')
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_active_gateway ON public.payment_gateways;
CREATE TRIGGER trg_enforce_active_gateway
  BEFORE INSERT OR UPDATE OF is_active, country_scope ON public.payment_gateways
  FOR EACH ROW EXECUTE FUNCTION public.enforce_one_active_gateway_per_country();

-- AUDIT
DROP TRIGGER IF EXISTS trg_audit_payment_gateways ON public.payment_gateways;
CREATE TRIGGER trg_audit_payment_gateways
  AFTER INSERT OR UPDATE OR DELETE ON public.payment_gateways
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

DROP TRIGGER IF EXISTS trg_audit_payment_gateway_countries ON public.payment_gateway_countries;
CREATE TRIGGER trg_audit_payment_gateway_countries
  AFTER INSERT OR DELETE ON public.payment_gateway_countries
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

-- PERMISSIONS
INSERT INTO public.permissions (key, category, label, description, is_destructive, tier_scope, sort_order) VALUES
  ('payment_gateways.view',     'Payment Gateways', 'View Payment Gateways',     'See configured gateways and coverage',   false, 'platform', 1),
  ('payment_gateways.manage',   'Payment Gateways', 'Manage Payment Gateways',   'Create, edit, set credentials',          false, 'platform', 2),
  ('payment_gateways.activate', 'Payment Gateways', 'Activate / Deactivate',     'Toggle gateway active state',            true,  'platform', 3),
  ('payment_gateways.delete',   'Payment Gateways', 'Delete Payment Gateways',   'Remove a gateway and all credentials',   true,  'platform', 4),
  ('payment_gateways.verify',   'Payment Gateways', 'Verify Credentials',        'Run a live verification ping',           false, 'platform', 5)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', r, k
FROM (VALUES ('super_admin'), ('admin')) AS roles(r)
CROSS JOIN (VALUES
  ('payment_gateways.view'),
  ('payment_gateways.manage'),
  ('payment_gateways.activate'),
  ('payment_gateways.delete'),
  ('payment_gateways.verify')
) AS keys(k)
ON CONFLICT DO NOTHING;