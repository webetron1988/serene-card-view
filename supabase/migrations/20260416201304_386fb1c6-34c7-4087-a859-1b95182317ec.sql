-- ============================================
-- AchievHR — Phase 0 Foundational Schema
-- ============================================

-- ─── 1. ENUMS ───────────────────────────────
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'admin',
  'consultant',
  'hr_admin',
  'employee',
  'auditor'
);

CREATE TYPE public.tenant_status AS ENUM (
  'trial',
  'active',
  'suspended',
  'archived'
);

CREATE TYPE public.user_status AS ENUM (
  'available',
  'away',
  'busy',
  'dnd',
  'offline'
);

-- ─── 2. SHARED TIMESTAMP TRIGGER ────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─── 3. PROFILES ────────────────────────────
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  locale TEXT NOT NULL DEFAULT 'en-US',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  status public.user_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── 4. PLANS ───────────────────────────────
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10, 2),
  price_yearly NUMERIC(10, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  feature_flags JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── 5. TENANTS ─────────────────────────────
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status public.tenant_status NOT NULL DEFAULT 'trial',
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  branding JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_domain TEXT UNIQUE,
  contact_email TEXT,
  contract_starts_at TIMESTAMP WITH TIME ZONE,
  contract_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_tenants_code ON public.tenants(code);
CREATE INDEX idx_tenants_status ON public.tenants(status);

-- ─── 6. TENANT MEMBERS ──────────────────────
CREATE TABLE public.tenant_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_tenant_members_user ON public.tenant_members(user_id);
CREATE INDEX idx_tenant_members_tenant ON public.tenant_members(tenant_id);

-- ─── 7. USER ROLES (separate table for security) ───
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  -- tenant_id NULL = platform-level role; otherwise tenant-scoped role
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, tenant_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_tenant ON public.user_roles(tenant_id);

-- ─── 8. AUDIT LOG ───────────────────────────
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  event_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  severity TEXT NOT NULL DEFAULT 'info',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_audit_log_tenant ON public.audit_log(tenant_id);
CREATE INDEX idx_audit_log_actor ON public.audit_log(actor_user_id);
CREATE INDEX idx_audit_log_event ON public.audit_log(event_type);
CREATE INDEX idx_audit_log_created ON public.audit_log(created_at DESC);

-- ─── 9. SECURITY DEFINER FUNCTIONS ──────────

-- Check platform-level role (tenant_id IS NULL)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND tenant_id IS NULL
  )
$$;

-- Check tenant-scoped role
CREATE OR REPLACE FUNCTION public.has_tenant_role(_user_id UUID, _tenant_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
      AND role = _role
  )
$$;

-- Check tenant membership
CREATE OR REPLACE FUNCTION public.is_tenant_member(_user_id UUID, _tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenant_members
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 10. RLS POLICIES ───────────────────────

-- profiles: signed-in users can view all profiles, only update own
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- plans: signed-in can view active plans; super admins manage
CREATE POLICY "Active plans viewable by authenticated"
  ON public.plans FOR SELECT
  TO authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can insert plans"
  ON public.plans FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update plans"
  ON public.plans FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete plans"
  ON public.plans FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- tenants: super admins see all; members see their tenants
CREATE POLICY "Super admins can view all tenants"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Members can view their tenants"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (public.is_tenant_member(auth.uid(), id));

CREATE POLICY "Super admins can insert tenants"
  ON public.tenants FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update tenants"
  ON public.tenants FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete tenants"
  ON public.tenants FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- tenant_members
CREATE POLICY "Super admins can view all memberships"
  ON public.tenant_members FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their own memberships"
  ON public.tenant_members FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Tenant admins can view their tenant memberships"
  ON public.tenant_members FOR SELECT
  TO authenticated
  USING (public.has_tenant_role(auth.uid(), tenant_id, 'super_admin')
      OR public.has_tenant_role(auth.uid(), tenant_id, 'admin'));

CREATE POLICY "Super admins can insert memberships"
  ON public.tenant_members FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete memberships"
  ON public.tenant_members FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- user_roles: users see own; super admins manage
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- audit_log: append-only; viewable by super admins, auditors, and tenant admins
CREATE POLICY "Super admins can view all audit entries"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Auditors can view all audit entries"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'auditor'));

CREATE POLICY "Tenant admins can view their tenant audit entries"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (
    tenant_id IS NOT NULL
    AND (public.has_tenant_role(auth.uid(), tenant_id, 'super_admin')
      OR public.has_tenant_role(auth.uid(), tenant_id, 'admin')
      OR public.has_tenant_role(auth.uid(), tenant_id, 'auditor'))
  );

CREATE POLICY "Authenticated users can insert audit entries"
  ON public.audit_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = actor_user_id);

-- No UPDATE or DELETE policies on audit_log = append-only enforced