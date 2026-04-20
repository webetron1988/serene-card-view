-- Unschedule any existing job with the same name (idempotent re-runs)
DO $$
DECLARE v_jobid bigint;
BEGIN
  SELECT jobid INTO v_jobid FROM cron.job WHERE jobname = 'audit-log-partition-maintenance';
  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;
END $$;

-- Run on the 1st of each month at 02:15 UTC
SELECT cron.schedule(
  'audit-log-partition-maintenance',
  '15 2 1 * *',
  $$ SELECT public.maintain_audit_log_partitions(); $$
);