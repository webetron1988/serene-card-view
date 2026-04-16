-- 1. Create the tier enum
CREATE TYPE public.user_tier AS ENUM ('platform', 'tenant');

-- 2. Add user_tier column to profiles (default 'tenant' is the safe default)
ALTER TABLE public.profiles
  ADD COLUMN user_tier public.user_tier NOT NULL DEFAULT 'tenant';

-- 3. Backfill: anyone with a platform-level role becomes 'platform'
UPDATE public.profiles p
SET user_tier = 'platform'
WHERE EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = p.user_id AND ur.tenant_id IS NULL
);

-- 4. Helper: get a user's tier
CREATE OR REPLACE FUNCTION public.get_user_tier(_user_id uuid)
RETURNS public.user_tier
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_tier FROM public.profiles WHERE user_id = _user_id
$$;

-- 5. Trigger: block tenant_members inserts for platform users
CREATE OR REPLACE FUNCTION public.enforce_tenant_member_tier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT user_tier FROM public.profiles WHERE user_id = NEW.user_id) = 'platform' THEN
    RAISE EXCEPTION 'Platform-tier users cannot be added as tenant members (user_id=%)', NEW.user_id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_tenant_member_tier
  BEFORE INSERT OR UPDATE ON public.tenant_members
  FOR EACH ROW EXECUTE FUNCTION public.enforce_tenant_member_tier();

-- 6. Trigger: block role assignments that mismatch tier
--    - platform-scoped role (tenant_id IS NULL) → user must be 'platform'
--    - tenant-scoped role (tenant_id IS NOT NULL) → user must be 'tenant'
CREATE OR REPLACE FUNCTION public.enforce_user_role_tier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier public.user_tier;
BEGIN
  SELECT user_tier INTO v_tier FROM public.profiles WHERE user_id = NEW.user_id;

  IF v_tier IS NULL THEN
    RAISE EXCEPTION 'Cannot assign role: profile not found for user_id=%', NEW.user_id;
  END IF;

  IF NEW.tenant_id IS NULL AND v_tier <> 'platform' THEN
    RAISE EXCEPTION 'Only platform-tier users can hold platform-scoped roles (user_id=%)', NEW.user_id
      USING ERRCODE = 'check_violation';
  END IF;

  IF NEW.tenant_id IS NOT NULL AND v_tier <> 'tenant' THEN
    RAISE EXCEPTION 'Only tenant-tier users can hold tenant-scoped roles (user_id=%)', NEW.user_id
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_user_role_tier
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_user_role_tier();

-- 7. Trigger: block changing user_tier if it would violate existing memberships/roles
CREATE OR REPLACE FUNCTION public.enforce_profile_tier_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_tier = OLD.user_tier THEN
    RETURN NEW;
  END IF;

  -- Switching to platform: must have no tenant memberships and no tenant-scoped roles
  IF NEW.user_tier = 'platform' THEN
    IF EXISTS (SELECT 1 FROM public.tenant_members WHERE user_id = NEW.user_id) THEN
      RAISE EXCEPTION 'Cannot switch to platform tier while user has tenant memberships';
    END IF;
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND tenant_id IS NOT NULL) THEN
      RAISE EXCEPTION 'Cannot switch to platform tier while user has tenant-scoped roles';
    END IF;
  END IF;

  -- Switching to tenant: must have no platform-scoped roles
  IF NEW.user_tier = 'tenant' THEN
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND tenant_id IS NULL) THEN
      RAISE EXCEPTION 'Cannot switch to tenant tier while user has platform-scoped roles';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_profile_tier_change
  BEFORE UPDATE OF user_tier ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_tier_change();

-- 8. RLS: only super admins can change user_tier (regular users update their own profile but not tier)
--    Existing "Users can update their own profile" policy still applies, but we add a guard:
CREATE OR REPLACE FUNCTION public.guard_profile_tier_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_tier <> OLD.user_tier
     AND NOT public.has_role(auth.uid(), 'super_admin')
  THEN
    RAISE EXCEPTION 'Only super_admin can change user_tier';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_guard_profile_tier_update
  BEFORE UPDATE OF user_tier ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_tier_update();