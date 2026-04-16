-- Enforce one tenant per user (tenant = license-holder, orgs live within a tenant)
-- Drop existing non-unique index/constraint if any, then add the unique constraint.
ALTER TABLE public.tenant_members
  DROP CONSTRAINT IF EXISTS tenant_members_user_id_unique;

ALTER TABLE public.tenant_members
  ADD CONSTRAINT tenant_members_user_id_unique UNIQUE (user_id);