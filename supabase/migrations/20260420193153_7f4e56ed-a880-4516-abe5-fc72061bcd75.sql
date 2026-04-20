
-- ============================================================================
-- STAGE 0.1 — PERMISSION ENGINE
-- ============================================================================

-- 1. Add explicit deny support for multi-role merge override
CREATE TABLE IF NOT EXISTS public.role_permission_denies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_kind public.role_kind NOT NULL,
  role_ref text NOT NULL,
  permission_key text NOT NULL REFERENCES public.permissions(key) ON DELETE CASCADE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  UNIQUE (role_kind, role_ref, permission_key)
);

ALTER TABLE public.role_permission_denies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read role denies"
  ON public.role_permission_denies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admins can insert role denies"
  ON public.role_permission_denies FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete role denies"
  ON public.role_permission_denies FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- 2. has_permission(): server-side enforcement
CREATE OR REPLACE FUNCTION public.has_permission(
  _user_id uuid,
  _key text,
  _tenant_id uuid DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_granted boolean := false;
  v_denied  boolean := false;
BEGIN
  IF _user_id IS NULL OR _key IS NULL THEN
    RETURN false;
  END IF;

  -- super_admin (platform) is omnipotent
  IF public.has_role(_user_id, 'super_admin') THEN
    RETURN true;
  END IF;

  -- Granted via any system role the user holds (matching tenant scope)
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp
      ON rp.role_kind = 'system'
     AND rp.role_ref  = ur.role::text
    WHERE ur.user_id = _user_id
      AND rp.permission_key = _key
      AND (
        (_tenant_id IS NULL  AND ur.tenant_id IS NULL) OR
        (_tenant_id IS NOT NULL AND (ur.tenant_id = _tenant_id OR ur.tenant_id IS NULL))
      )
  ) INTO v_granted;

  IF NOT v_granted THEN
    RETURN false;
  END IF;

  -- Deny-override: any role the user holds explicitly denies this key
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permission_denies d
      ON d.role_kind = 'system'
     AND d.role_ref  = ur.role::text
    WHERE ur.user_id = _user_id
      AND d.permission_key = _key
  ) INTO v_denied;

  RETURN NOT v_denied;
END;
$$;

-- 3. Permissions catalog seed (~125 keys)
INSERT INTO public.permissions (key, category, label, description, is_destructive, tier_scope, sort_order) VALUES
-- Tenants
('tenants.tenant.view',        'Tenants', 'View tenants',        'View tenant list and details', false, 'platform', 10),
('tenants.tenant.create',      'Tenants', 'Create tenant',       'Create a new tenant',           false, 'platform', 11),
('tenants.tenant.update',      'Tenants', 'Update tenant',       'Edit tenant profile',           false, 'platform', 12),
('tenants.tenant.suspend',     'Tenants', 'Suspend tenant',      'Suspend tenant access',         true,  'platform', 13),
('tenants.tenant.reactivate',  'Tenants', 'Reactivate tenant',   'Restore a suspended tenant',    false, 'platform', 14),
('tenants.tenant.archive',     'Tenants', 'Archive tenant',      'Archive a tenant',              true,  'platform', 15),
('tenants.tenant.delete',      'Tenants', 'Delete tenant',       'Permanently delete a tenant',   true,  'platform', 16),
('tenants.tenant.impersonate', 'Tenants', 'Impersonate tenant',  'Login as a tenant admin',       true,  'platform', 17),
-- Users
('users.user.view',     'Users', 'View users',         'View user list and profiles',   false, 'both', 20),
('users.user.invite',   'Users', 'Invite user',        'Send platform invitations',     false, 'both', 21),
('users.user.update',   'Users', 'Update user',        'Edit user profile',             false, 'both', 22),
('users.user.suspend',  'Users', 'Suspend user',       'Disable user access',           true,  'both', 23),
('users.user.delete',   'Users', 'Delete user',        'Permanently delete user',       true,  'both', 24),
('users.user.assign_role','Users','Assign role',       'Grant or revoke user roles',    true,  'both', 25),
('users.user.reset_password','Users','Reset password', 'Force password reset',          false, 'both', 26),
-- Roles
('roles.role.view',   'Roles', 'View roles',     'View role definitions',     false, 'both', 30),
('roles.role.create', 'Roles', 'Create role',    'Create custom roles',       false, 'both', 31),
('roles.role.update', 'Roles', 'Update role',    'Edit role attributes',      false, 'both', 32),
('roles.role.delete', 'Roles', 'Delete role',    'Delete custom roles',       true,  'both', 33),
('roles.role.archive','Roles', 'Archive role',   'Archive a role',            false, 'both', 34),
-- Permissions
('permissions.matrix.view',   'Permissions', 'View permission matrix', 'See role-permission mapping', false, 'both', 40),
('permissions.matrix.update', 'Permissions', 'Edit permission matrix', 'Grant/revoke permissions',   true,  'both', 41),
-- Billing
('billing.subscription.view',   'Billing', 'View subscriptions',  'See plans and subscriptions',   false, 'both', 50),
('billing.subscription.create', 'Billing', 'Create subscription', 'Subscribe a tenant to a plan',  false, 'platform', 51),
('billing.subscription.update', 'Billing', 'Update subscription', 'Change plan or seats',          false, 'both', 52),
('billing.subscription.cancel', 'Billing', 'Cancel subscription', 'Cancel a subscription',         true,  'both', 53),
('billing.invoice.view',        'Billing', 'View invoices',       'See invoice history',           false, 'both', 54),
('billing.invoice.refund',      'Billing', 'Issue refund',        'Refund an invoice',             true,  'platform', 55),
('billing.payment_method.manage','Billing','Manage payment methods','Add/remove payment methods', false, 'both', 56),
('billing.gateway.view',        'Billing', 'View gateways',       'View payment gateway config',   false, 'platform', 57),
('billing.gateway.manage',      'Billing', 'Manage gateways',     'Add/edit/activate gateways',    true,  'platform', 58),
-- Plans
('plans.plan.view',   'Plans', 'View plans',   'View plan catalog', false, 'both', 60),
('plans.plan.create', 'Plans', 'Create plan',  'Create new plans',  false, 'platform', 61),
('plans.plan.update', 'Plans', 'Update plan',  'Edit plans',        false, 'platform', 62),
('plans.plan.delete', 'Plans', 'Delete plan',  'Delete plans',      true,  'platform', 63),
-- Audit
('audit.log.view',   'Audit', 'View audit log', 'Search audit entries', false, 'both', 70),
('audit.log.export', 'Audit', 'Export audit log','Export audit data',   false, 'both', 71),
-- Settings
('settings.general.view',   'Settings', 'View general settings',   '', false, 'both', 80),
('settings.general.update', 'Settings', 'Update general settings', '', false, 'both', 81),
('settings.branding.view',   'Settings', 'View branding',   '', false, 'both', 82),
('settings.branding.update', 'Settings', 'Update branding', '', false, 'both', 83),
('settings.security.view',   'Settings', 'View security settings',   '', false, 'both', 84),
('settings.security.update', 'Settings', 'Update security settings', '', true,  'both', 85),
('settings.email.view',   'Settings', 'View email/SMTP', '', false, 'platform', 86),
('settings.email.update', 'Settings', 'Update email/SMTP','',true,  'platform', 87),
('settings.notifications.view',   'Settings', 'View notifications',   '', false, 'both', 88),
('settings.notifications.update', 'Settings', 'Update notifications', '', false, 'both', 89),
('settings.integrations.view',   'Settings', 'View integrations',   '', false, 'both', 90),
('settings.integrations.update', 'Settings', 'Update integrations', '', true,  'both', 91),
('settings.api_keys.view',   'Settings', 'View API keys',   '', false, 'both', 92),
('settings.api_keys.manage', 'Settings', 'Manage API keys', 'Create/rotate/revoke API keys', true, 'both', 93),
('settings.policy.view',   'Settings', 'View policy & governance', '', false, 'both', 94),
('settings.policy.update', 'Settings', 'Update policy & governance','',true, 'both', 95),
('settings.document_vault.view',   'Settings', 'View document vault', '', false, 'both', 96),
('settings.document_vault.manage', 'Settings', 'Manage document vault','',true, 'both', 97),
-- AI
('ai.model.view',   'AI', 'View AI models',   'View AI model catalog',     false, 'platform', 100),
('ai.model.manage', 'AI', 'Manage AI models', 'Add/edit/route AI models',  true,  'platform', 101),
('ai.agent.view',   'AI', 'View AI agents',   '',                          false, 'both', 102),
('ai.agent.manage', 'AI', 'Manage AI agents', 'Configure agent behavior',  true,  'both', 103),
('ai.prompt.view',   'AI', 'View prompts',   '', false, 'both', 104),
('ai.prompt.manage', 'AI', 'Manage prompts', '', false, 'both', 105),
('ai.vault.view',   'AI', 'View AI key vault', '', false, 'platform', 106),
('ai.vault.manage', 'AI', 'Manage AI key vault','',true, 'platform', 107),
('ai.guardrail.view',   'AI', 'View guardrails',   '', false, 'both', 108),
('ai.guardrail.update', 'AI', 'Update guardrails', '', true,  'both', 109),
-- Workforce
('workforce.employee.view',  'Workforce', 'View employees',         '',                            false, 'tenant', 120),
('workforce.employee.create','Workforce', 'Create employee',         '',                            false, 'tenant', 121),
('workforce.employee.update','Workforce', 'Update employee',         '',                            false, 'tenant', 122),
('workforce.employee.delete','Workforce', 'Delete employee',         '',                            true,  'tenant', 123),
('workforce.employee.view_compensation','Workforce','View compensation','PII-sensitive',            false, 'tenant', 124),
('workforce.employee.update_compensation','Workforce','Update compensation','',                     true,  'tenant', 125),
('workforce.org_unit.view',   'Workforce', 'View org units',  '', false, 'tenant', 126),
('workforce.org_unit.manage', 'Workforce', 'Manage org units','', false, 'tenant', 127),
('workforce.position.view',   'Workforce', 'View positions',  '', false, 'tenant', 128),
('workforce.position.manage', 'Workforce', 'Manage positions','', false, 'tenant', 129),
('workforce.location.view',   'Workforce', 'View locations',  '', false, 'tenant', 130),
('workforce.location.manage', 'Workforce', 'Manage locations','', false, 'tenant', 131),
('workforce.department.view',   'Workforce', 'View departments',  '', false, 'tenant', 132),
('workforce.department.manage', 'Workforce', 'Manage departments','', false, 'tenant', 133),
-- Reports
('reports.report.view',   'Reports', 'View reports',   '', false, 'both', 140),
('reports.report.create', 'Reports', 'Create report',  '', false, 'both', 141),
('reports.report.export', 'Reports', 'Export report',  '', false, 'both', 142),
-- Marketplace
('marketplace.listing.view',   'Marketplace', 'View marketplace',   '', false, 'both', 150),
('marketplace.listing.publish','Marketplace', 'Publish to marketplace','',false,'tenant', 151),
('marketplace.listing.purchase','Marketplace','Purchase from marketplace','',false,'tenant',152),
-- License
('license.license.view',   'License', 'View licenses',   '', false, 'platform', 160),
('license.license.issue',  'License', 'Issue license',   '', false, 'platform', 161),
('license.license.revoke', 'License', 'Revoke license',  '', true,  'platform', 162),
('license.license.sync',   'License', 'Sync license',    '', false, 'both', 163)
ON CONFLICT (key) DO UPDATE
SET label = EXCLUDED.label,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_destructive = EXCLUDED.is_destructive,
    tier_scope = EXCLUDED.tier_scope,
    sort_order = EXCLUDED.sort_order;

-- 4. Seed role_permissions for the 6 system roles
-- super_admin: everything
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'super_admin', key FROM public.permissions
ON CONFLICT DO NOTHING;

-- admin: all non-destructive platform/both ops + most destructive except tenant.delete/impersonate
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'admin', key FROM public.permissions
WHERE key NOT IN (
  'tenants.tenant.delete','tenants.tenant.impersonate',
  'billing.invoice.refund','plans.plan.delete',
  'license.license.revoke'
)
ON CONFLICT DO NOTHING;

-- consultant: tenant-scoped read + workforce manage
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'consultant', key FROM public.permissions
WHERE key IN (
  'users.user.view','roles.role.view','permissions.matrix.view',
  'audit.log.view','settings.general.view','settings.branding.view',
  'workforce.employee.view','workforce.employee.create','workforce.employee.update',
  'workforce.org_unit.view','workforce.org_unit.manage',
  'workforce.position.view','workforce.position.manage',
  'workforce.location.view','workforce.department.view',
  'reports.report.view','reports.report.create','reports.report.export',
  'ai.agent.view','ai.prompt.view'
)
ON CONFLICT DO NOTHING;

-- hr_admin: full workforce + compensation + reports
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'hr_admin', key FROM public.permissions
WHERE key IN (
  'users.user.view','users.user.invite','users.user.update','users.user.assign_role',
  'roles.role.view','permissions.matrix.view','audit.log.view',
  'settings.general.view','settings.branding.view','settings.notifications.view','settings.notifications.update',
  'workforce.employee.view','workforce.employee.create','workforce.employee.update','workforce.employee.delete',
  'workforce.employee.view_compensation','workforce.employee.update_compensation',
  'workforce.org_unit.view','workforce.org_unit.manage',
  'workforce.position.view','workforce.position.manage',
  'workforce.location.view','workforce.location.manage',
  'workforce.department.view','workforce.department.manage',
  'reports.report.view','reports.report.create','reports.report.export',
  'ai.agent.view','ai.prompt.view','ai.guardrail.view'
)
ON CONFLICT DO NOTHING;

-- employee: minimal self-service
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'employee', key FROM public.permissions
WHERE key IN (
  'workforce.employee.view',
  'workforce.org_unit.view','workforce.position.view','workforce.location.view','workforce.department.view',
  'reports.report.view','marketplace.listing.view','ai.agent.view'
)
ON CONFLICT DO NOTHING;

-- auditor: read everything + audit export
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'auditor', key FROM public.permissions
WHERE key LIKE '%.view' OR key IN ('audit.log.export','reports.report.export')
ON CONFLICT DO NOTHING;

-- 5. Helpful index for has_permission() lookups
CREATE INDEX IF NOT EXISTS idx_role_permissions_lookup
  ON public.role_permissions (role_kind, role_ref, permission_key);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_tenant
  ON public.user_roles (user_id, tenant_id);
