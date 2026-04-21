-- ─── 1) feature_catalog: DB-driven feature matrix ─────────────────
CREATE TYPE public.feature_value_type AS ENUM ('boolean', 'limit', 'retention', 'text');

CREATE TABLE public.feature_catalog (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  label       text NOT NULL,
  category    text NOT NULL,
  value_type  public.feature_value_type NOT NULL,
  description text,
  sort_order  integer NOT NULL DEFAULT 0,
  category_sort integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_feature_catalog_category ON public.feature_catalog(category, sort_order);

ALTER TABLE public.feature_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read feature catalog"
  ON public.feature_catalog FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admins manage feature catalog"
  ON public.feature_catalog FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_feature_catalog_updated
  BEFORE UPDATE ON public.feature_catalog
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── 2) plans: display columns ────────────────────────────────────
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS color       text NOT NULL DEFAULT 'hsl(var(--primary))',
  ADD COLUMN IF NOT EXISTS is_popular  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS badge       text,
  ADD COLUMN IF NOT EXISTS is_trial    boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS plan_kind   text NOT NULL DEFAULT 'paid' CHECK (plan_kind IN ('free','paid'));

-- Only one active free/trial plan
CREATE UNIQUE INDEX IF NOT EXISTS uniq_one_active_free_plan
  ON public.plans ((1)) WHERE is_active = true AND plan_kind = 'free';

-- ─── 3) subscriptions: seats + override (for live stats) ──────────
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS seats        integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS used_seats   integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','yearly')),
  ADD COLUMN IF NOT EXISTS mrr_override numeric;

-- ─── 4) Seed feature_catalog from current featureCategories ───────
INSERT INTO public.feature_catalog (key, label, category, value_type, sort_order, category_sort) VALUES
  -- Core Limits
  ('employees',           'Employees',           'Core Limits',           'limit',   1, 1),
  ('adminUsers',          'Admin Users',         'Core Limits',           'limit',   2, 1),
  ('departments',         'Departments',         'Core Limits',           'limit',   3, 1),
  ('locations',           'Locations',           'Core Limits',           'limit',   4, 1),
  ('storage',             'Storage',             'Core Limits',           'text',    5, 1),
  -- HR Modules
  ('coreHR',              'Core HR',             'HR Modules',            'boolean', 1, 2),
  ('recruitment',         'Recruitment',         'HR Modules',            'boolean', 2, 2),
  ('performance',         'Performance Mgmt',    'HR Modules',            'boolean', 3, 2),
  ('payroll',             'Payroll',             'HR Modules',            'boolean', 4, 2),
  ('attendance',          'Attendance & Leave',  'HR Modules',            'boolean', 5, 2),
  ('learning',            'Learning & Development','HR Modules',          'boolean', 6, 2),
  ('analytics',           'Advanced Analytics',  'HR Modules',            'boolean', 7, 2),
  ('scheduling',          'Scheduling',          'HR Modules',            'boolean', 8, 2),
  ('compliance',          'Compliance',          'HR Modules',            'boolean', 9, 2),
  ('benefits',            'Benefits Admin',      'HR Modules',            'boolean', 10,2),
  -- Integrations
  ('apiAccess',           'API Access',          'Integrations',          'boolean', 1, 3),
  ('ssoSaml',             'SSO / SAML',          'Integrations',          'boolean', 2, 3),
  ('customWebhooks',      'Custom Webhooks',     'Integrations',          'boolean', 3, 3),
  ('thirdPartyIntegrations','3rd Party Integrations','Integrations',      'boolean', 4, 3),
  -- Branding
  ('customBranding',      'Custom Branding',     'Branding',              'boolean', 1, 4),
  ('whiteLabel',          'White Label',         'Branding',              'boolean', 2, 4),
  ('customDomain',        'Custom Domain',       'Branding',              'boolean', 3, 4),
  -- Security & Compliance
  ('rbac',                'Role-based Access',   'Security & Compliance', 'boolean', 1, 5),
  ('auditLogs',           'Audit Logs',          'Security & Compliance', 'boolean', 2, 5),
  ('ipWhitelisting',      'IP Whitelisting',     'Security & Compliance', 'boolean', 3, 5),
  ('dataEncryption',      'Data Encryption',     'Security & Compliance', 'boolean', 4, 5),
  ('mfaEnforcement',      'MFA Enforcement',     'Security & Compliance', 'boolean', 5, 5),
  ('dataRetentionDays',   'Data Retention',      'Security & Compliance', 'retention',6, 5),
  -- Support
  ('supportLevel',        'Support Level',       'Support',               'text',    1, 6),
  ('dedicatedCSM',        'Dedicated CSM',       'Support',               'boolean', 2, 6),
  ('slaGuarantee',        'SLA Guarantee',       'Support',               'text',    3, 6),
  ('onboarding',          'Onboarding',          'Support',               'text',    4, 6)
ON CONFLICT (key) DO NOTHING;