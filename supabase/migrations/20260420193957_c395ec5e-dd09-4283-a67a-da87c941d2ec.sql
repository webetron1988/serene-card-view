
-- Enable RLS on all existing audit_log partitions
DO $$
DECLARE
  v_part record;
BEGIN
  FOR v_part IN
    SELECT c.relname
    FROM pg_inherits i
    JOIN pg_class c    ON c.oid = i.inhrelid
    JOIN pg_class p    ON p.oid = i.inhparent
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.relname = 'audit_log' AND n.nspname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', v_part.relname);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', v_part.relname);
  END LOOP;
END $$;

-- Update partition creator to enable RLS on each new partition
CREATE OR REPLACE FUNCTION public.ensure_audit_log_partition(_month date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start date := date_trunc('month', _month)::date;
  v_end   date := (date_trunc('month', _month) + interval '1 month')::date;
  v_name  text := format('audit_log_%s', to_char(v_start, 'YYYYMM'));
BEGIN
  IF to_regclass(format('public.%I', v_name)) IS NOT NULL THEN
    RETURN;
  END IF;

  EXECUTE format(
    'CREATE TABLE public.%I PARTITION OF public.audit_log FOR VALUES FROM (%L) TO (%L);',
    v_name, v_start, v_end
  );
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', v_name);
  EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', v_name);
END;
$$;
