-- =========================================
-- 1. ENUMS
-- =========================================

CREATE TYPE public.permission_tier_scope AS ENUM ('platform', 'tenant', 'both');
CREATE TYPE public.role_kind AS ENUM ('system', 'platform_custom', 'tenant_custom');
CREATE TYPE public.tenant_role_origin AS ENUM ('platform_default', 'tenant_custom');

-- =========================================
-- 2. PERMISSIONS CATALOG
-- =========================================

CREATE TABLE public.permissions (
  key TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  tier_scope public.permission_tier_scope NOT NULL DEFAULT 'platform',
  is_destructive BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permissions readable by authenticated"
  ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admins can insert permissions"
  ON public.permissions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update permissions"
  ON public.permissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete permissions"
  ON public.permissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- =========================================
-- 3. PLATFORM CUSTOM ROLES
-- =========================================

CREATE TABLE public.platform_custom_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_custom_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform users can view platform custom roles"
  ON public.platform_custom_roles FOR SELECT TO authenticated
  USING (public.get_user_tier(auth.uid()) = 'platform');

CREATE POLICY "Super admins can insert platform custom roles"
  ON public.platform_custom_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update platform custom roles"
  ON public.platform_custom_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete platform custom roles"
  ON public.platform_custom_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER platform_custom_roles_updated_at
  BEFORE UPDATE ON public.platform_custom_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- 4. TENANT CUSTOM ROLES (schema-ready, no UI yet)
-- =========================================

CREATE TABLE public.tenant_custom_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  origin public.tenant_role_origin NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- platform_default rows have NULL tenant_id; tenant_custom must have a tenant_id
  CONSTRAINT tenant_role_origin_consistency CHECK (
    (origin = 'platform_default' AND tenant_id IS NULL) OR
    (origin = 'tenant_custom' AND tenant_id IS NOT NULL)
  ),
  UNIQUE (tenant_id, name, origin)
);

ALTER TABLE public.tenant_custom_roles ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can see platform_default templates
CREATE POLICY "Platform default tenant roles visible to all"
  ON public.tenant_custom_roles FOR SELECT TO authenticated
  USING (origin = 'platform_default');

-- Tenant members see their tenant's custom roles
CREATE POLICY "Tenant members can view their tenant custom roles"
  ON public.tenant_custom_roles FOR SELECT TO authenticated
  USING (origin = 'tenant_custom' AND tenant_id IS NOT NULL AND public.is_tenant_member(auth.uid(), tenant_id));

-- Super admins manage platform_default templates only
CREATE POLICY "Super admins manage platform default tenant roles"
  ON public.tenant_custom_roles FOR ALL TO authenticated
  USING (origin = 'platform_default' AND public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (origin = 'platform_default' AND public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER tenant_custom_roles_updated_at
  BEFORE UPDATE ON public.tenant_custom_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- 5. ROLE PERMISSIONS (grants)
-- =========================================

CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_kind public.role_kind NOT NULL,
  role_ref TEXT NOT NULL,         -- enum value for system, UUID string for custom roles
  permission_key TEXT NOT NULL REFERENCES public.permissions(key) ON DELETE CASCADE,
  granted_by UUID,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (role_kind, role_ref, permission_key)
);

CREATE INDEX idx_role_permissions_lookup ON public.role_permissions (role_kind, role_ref);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read grants (they need to know their own permissions)
CREATE POLICY "Authenticated can read role permissions"
  ON public.role_permissions FOR SELECT TO authenticated USING (true);

-- Only super admins can mutate grants for now (admin-with-roles.manage handled in app)
CREATE POLICY "Super admins can insert role permissions"
  ON public.role_permissions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete role permissions"
  ON public.role_permissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- =========================================
-- 6. AUDIT TRIGGER FUNCTION
-- =========================================

CREATE OR REPLACE FUNCTION public.audit_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event TEXT;
  v_resource_id TEXT;
  v_metadata JSONB;
BEGIN
  v_event := TG_TABLE_NAME || '.' || lower(TG_OP);

  IF TG_OP = 'DELETE' THEN
    v_resource_id := OLD.id::text;
    v_metadata := to_jsonb(OLD);
  ELSE
    v_resource_id := NEW.id::text;
    v_metadata := jsonb_build_object('new', to_jsonb(NEW), 'old', CASE WHEN TG_OP='UPDATE' THEN to_jsonb(OLD) ELSE NULL END);
  END IF;

  INSERT INTO public.audit_log (event_type, resource_type, resource_id, actor_user_id, metadata, severity)
  VALUES (v_event, TG_TABLE_NAME, v_resource_id, auth.uid(), v_metadata, 'info');

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_platform_custom_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.platform_custom_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

CREATE TRIGGER audit_tenant_custom_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.tenant_custom_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

CREATE TRIGGER audit_role_permissions
  AFTER INSERT OR UPDATE OR DELETE ON public.role_permissions
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

-- =========================================
-- 7. SEED PERMISSIONS CATALOG (~45)
-- =========================================

INSERT INTO public.permissions (key, category, label, description, tier_scope, is_destructive, sort_order) VALUES
-- Tenant Management
('tenants.view',          'Tenant Management', 'View Tenants',          'View the tenant list and details',           'platform', false, 10),
('tenants.create',        'Tenant Management', 'Create Tenants',        'Provision new tenant accounts',              'platform', false, 11),
('tenants.edit',          'Tenant Management', 'Edit Tenants',          'Modify tenant configuration',                'platform', false, 12),
('tenants.suspend',       'Tenant Management', 'Suspend Tenants',       'Suspend or reactivate tenants',              'platform', false, 13),
('tenants.delete',        'Tenant Management', 'Delete Tenants',        'Permanently remove tenants',                 'platform', true,  14),
('tenants.impersonate',   'Tenant Management', 'Impersonate Tenants',   'Log in as a tenant for support',             'platform', true,  15),

-- Plans & Billing
('plans.view',            'Plans & Billing',   'View Plans',            'View plan configurations',                   'platform', false, 20),
('plans.create',          'Plans & Billing',   'Create Plans',          'Create new subscription plans',              'platform', false, 21),
('plans.edit',            'Plans & Billing',   'Edit Plans',            'Modify plans and feature flags',             'platform', false, 22),
('plans.delete',          'Plans & Billing',   'Delete Plans',          'Remove plans',                               'platform', true,  23),
('billing.invoices.view', 'Plans & Billing',   'View Invoices',         'Access billing history',                     'platform', false, 24),
('billing.refund',        'Plans & Billing',   'Issue Refunds',         'Process refunds',                            'platform', true,  25),

-- Users
('users.view',            'Users',             'View Users',            'View platform users',                        'platform', false, 30),
('users.invite',          'Users',             'Invite Users',          'Send invitations to new platform users',     'platform', false, 31),
('users.edit',            'Users',             'Edit Users',            'Modify user profiles',                       'platform', false, 32),
('users.deactivate',      'Users',             'Deactivate Users',      'Suspend platform user access',               'platform', false, 33),
('users.delete',          'Users',             'Delete Users',          'Permanently remove platform users',          'platform', true,  34),

-- Roles & Permissions
('roles.view',            'Roles & Permissions', 'View Roles',          'View roles and their permissions',           'platform', false, 40),
('roles.create',          'Roles & Permissions', 'Create Custom Roles', 'Create new custom platform roles',           'platform', false, 41),
('roles.manage',          'Roles & Permissions', 'Manage Permissions',  'Edit which permissions each role has',       'platform', false, 42),
('roles.archive',         'Roles & Permissions', 'Archive Roles',       'Archive or restore custom roles',            'platform', false, 43),

-- Platform Settings
('settings.general.view', 'Platform Settings',   'View General Settings', 'View global configuration',                'platform', false, 50),
('settings.general.edit', 'Platform Settings',   'Edit General Settings', 'Change global configuration',              'platform', false, 51),
('settings.security.view','Platform Settings',   'View Security Settings','View security policies',                   'platform', false, 52),
('settings.security.edit','Platform Settings',   'Edit Security Settings','Change security policies and 2FA',         'platform', true,  53),
('settings.branding',     'Platform Settings',   'Manage Branding',     'Edit platform-wide branding and locale',     'platform', false, 54),
('settings.email',        'Platform Settings',   'Email Settings',      'Configure email and SMTP',                   'platform', false, 55),
('settings.notifications','Platform Settings',   'Notification Settings','Configure platform notifications',          'platform', false, 56),

-- Audit & Compliance
('audit.view',            'Audit & Compliance',  'View Audit Log',      'View the platform audit log',                'platform', false, 60),
('audit.export',          'Audit & Compliance',  'Export Audit Log',    'Export audit data',                          'platform', false, 61),
('compliance.policies',   'Audit & Compliance',  'Manage Policies',     'Edit governance and compliance policies',    'platform', false, 62),

-- Analytics
('analytics.view',        'Analytics',           'View Analytics',      'Access analytics dashboards',                'platform', false, 70),
('analytics.export',      'Analytics',           'Export Reports',      'Download analytics reports',                 'platform', false, 71),

-- Integrations & API
('integrations.view',     'Integrations & API',  'View Integrations',   'View configured integrations',               'platform', false, 80),
('integrations.manage',   'Integrations & API',  'Manage Integrations', 'Connect or disconnect third-party services', 'platform', false, 81),
('apikeys.view',          'Integrations & API',  'View API Keys',       'View API keys and webhooks',                 'platform', false, 82),
('apikeys.manage',        'Integrations & API',  'Manage API Keys',     'Create or revoke API keys and webhooks',     'platform', true,  83),
('payments.gateways',     'Integrations & API',  'Payment Gateways',    'Configure payment gateways',                 'platform', false, 84),

-- AI & Agents
('ai.models.view',        'AI & Agents',         'View AI Models',      'View AI model configuration',                'platform', false, 90),
('ai.models.manage',      'AI & Agents',         'Manage AI Models',    'Configure AI model providers and keys',      'platform', false, 91),
('ai.guardrails',         'AI & Agents',         'Configure Guardrails','Edit AI guardrails and safety settings',     'platform', false, 92),
('ai.bot.categories',     'AI & Agents',         'Bot Categories',      'Manage bot categories',                      'platform', false, 93),

-- Marketplace
('marketplace.view',      'Marketplace',         'View Marketplace',    'View marketplace listings',                  'platform', false, 100),
('marketplace.manage',    'Marketplace',         'Manage Marketplace',  'Approve, edit, or remove marketplace items', 'platform', false, 101);

-- =========================================
-- 8. SEED GRANTS — system roles
-- =========================================

-- super_admin: all permissions (also enforced in code, but mirrored here for completeness)
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'super_admin', key FROM public.permissions;

-- admin: same as super_admin initially (per your choice)
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'admin', key FROM public.permissions;

-- tenant placeholder: view-only baseline (will be redefined in tenant phase)
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'tenant', key FROM public.permissions
WHERE key IN ('tenants.view', 'analytics.view', 'audit.view', 'users.view');