
-- ============================================================
-- Stage 0.4: Plans & Subscriptions
-- ============================================================

-- 1. Add trial_days to existing plans table
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS trial_days integer NOT NULL DEFAULT 14;

-- 2. Subscription status enum
DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM ('trial','active','past_due','canceled','expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_event_source AS ENUM ('admin','webhook','system','tenant');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.scheduled_change_status AS ENUM ('pending','applied','canceled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. plan_entitlements — numeric limits per plan
CREATE TABLE IF NOT EXISTS public.plan_entitlements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     uuid NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  key         text NOT NULL,
  limit_value bigint NOT NULL,                 -- -1 means unlimited
  unit        text NOT NULL DEFAULT 'count',
  is_hard_cap boolean NOT NULL DEFAULT true,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_id, key)
);
CREATE INDEX IF NOT EXISTS idx_plan_entitlements_plan ON public.plan_entitlements(plan_id);

ALTER TABLE public.plan_entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read entitlements"
  ON public.plan_entitlements FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admins manage entitlements"
  ON public.plan_entitlements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_plan_entitlements_updated
  BEFORE UPDATE ON public.plan_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. subscriptions — one per tenant
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_id                  uuid NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
  status                   public.subscription_status NOT NULL DEFAULT 'trial',
  trial_ends_at            timestamptz,
  current_period_start     timestamptz NOT NULL DEFAULT now(),
  current_period_end       timestamptz,
  cancel_at_period_end     boolean NOT NULL DEFAULT false,
  canceled_at              timestamptz,
  past_due_since           timestamptz,
  grace_days               integer NOT NULL DEFAULT 7,
  provider                 public.payment_provider,
  provider_subscription_id text,
  provider_customer_id     text,
  gateway_id               uuid REFERENCES public.payment_gateways(id) ON DELETE SET NULL,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON public.subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider_sub ON public.subscriptions(provider, provider_subscription_id);

-- Enforce: at most one active-ish subscription per tenant
CREATE UNIQUE INDEX IF NOT EXISTS uniq_one_active_sub_per_tenant
  ON public.subscriptions(tenant_id)
  WHERE status IN ('trial','active','past_due');

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins view all subscriptions"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE POLICY "Tenant members view their subscription"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (public.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Super admins insert subscriptions"
  ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE POLICY "Super admins update subscriptions"
  ON public.subscriptions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE POLICY "Super admins delete subscriptions"
  ON public.subscriptions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE TRIGGER trg_subscriptions_updated
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. subscription_events — append-only audit
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id    uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  tenant_id          uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type         text NOT NULL,
  from_status        public.subscription_status,
  to_status          public.subscription_status,
  from_plan_id       uuid REFERENCES public.plans(id),
  to_plan_id         uuid REFERENCES public.plans(id),
  actor_user_id      uuid,
  source             public.subscription_event_source NOT NULL DEFAULT 'system',
  provider           public.payment_provider,
  provider_event_id  text,
  metadata           jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_id)
);
CREATE INDEX IF NOT EXISTS idx_sub_events_sub ON public.subscription_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_events_tenant ON public.subscription_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sub_events_type ON public.subscription_events(event_type);

ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins view all sub events"
  ON public.subscription_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'));

CREATE POLICY "Tenant members view their sub events"
  ON public.subscription_events FOR SELECT TO authenticated
  USING (public.is_tenant_member(auth.uid(), tenant_id));

CREATE POLICY "Super admins insert sub events"
  ON public.subscription_events FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- 6. scheduled_plan_changes — queued downgrades
CREATE TABLE IF NOT EXISTS public.scheduled_plan_changes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  target_plan_id  uuid NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
  effective_at    timestamptz NOT NULL,
  status          public.scheduled_change_status NOT NULL DEFAULT 'pending',
  created_by      uuid,
  created_at      timestamptz NOT NULL DEFAULT now(),
  applied_at      timestamptz,
  canceled_at     timestamptz,
  notes           text
);
CREATE INDEX IF NOT EXISTS idx_sched_changes_sub ON public.scheduled_plan_changes(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sched_changes_pending ON public.scheduled_plan_changes(effective_at) WHERE status = 'pending';

ALTER TABLE public.scheduled_plan_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage scheduled changes"
  ON public.scheduled_plan_changes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

CREATE POLICY "Tenant members view their scheduled changes"
  ON public.scheduled_plan_changes FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.id = scheduled_plan_changes.subscription_id
      AND public.is_tenant_member(auth.uid(), s.tenant_id)
  ));

-- 7. Helper functions
CREATE OR REPLACE FUNCTION public.tenant_active_subscription(_tenant_id uuid)
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.subscriptions
   WHERE tenant_id = _tenant_id
     AND status IN ('trial','active','past_due')
   LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.tenant_entitlement(_tenant_id uuid, _key text)
RETURNS bigint
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_limit bigint;
BEGIN
  SELECT pe.limit_value INTO v_limit
    FROM public.subscriptions s
    JOIN public.plan_entitlements pe ON pe.plan_id = s.plan_id
   WHERE s.tenant_id = _tenant_id
     AND s.status IN ('trial','active','past_due')
     AND pe.key = _key
   LIMIT 1;
  RETURN COALESCE(v_limit, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.tenant_has_feature(_tenant_id uuid, _flag text)
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_flags jsonb;
BEGIN
  SELECT p.feature_flags INTO v_flags
    FROM public.subscriptions s
    JOIN public.plans p ON p.id = s.plan_id
   WHERE s.tenant_id = _tenant_id
     AND s.status IN ('trial','active','past_due')
   LIMIT 1;
  RETURN COALESCE((v_flags ->> _flag)::boolean, false);
END;
$$;

-- 8. Audit trigger on subscriptions → subscription_events
CREATE OR REPLACE FUNCTION public.audit_subscription_change()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_event text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.subscription_events
      (subscription_id, tenant_id, event_type, to_status, to_plan_id, actor_user_id, source, metadata)
    VALUES
      (NEW.id, NEW.tenant_id, 'subscription.created', NEW.status, NEW.plan_id, auth.uid(), 'system',
       jsonb_build_object('new', to_jsonb(NEW)));
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.status <> OLD.status THEN
      INSERT INTO public.subscription_events
        (subscription_id, tenant_id, event_type, from_status, to_status, actor_user_id, source, metadata)
      VALUES
        (NEW.id, NEW.tenant_id, 'subscription.status_changed', OLD.status, NEW.status, auth.uid(), 'system',
         jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
    END IF;
    IF NEW.plan_id <> OLD.plan_id THEN
      INSERT INTO public.subscription_events
        (subscription_id, tenant_id, event_type, from_plan_id, to_plan_id, actor_user_id, source, metadata)
      VALUES
        (NEW.id, NEW.tenant_id, 'subscription.plan_changed', OLD.plan_id, NEW.plan_id, auth.uid(), 'system',
         jsonb_build_object('old_plan', OLD.plan_id, 'new_plan', NEW.plan_id));
    END IF;
    RETURN NEW;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_audit_subscription_change
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.audit_subscription_change();

-- 9. Lifecycle housekeeping functions
CREATE OR REPLACE FUNCTION public.expire_trials_and_past_due()
RETURNS TABLE(action text, subscription_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Trials whose trial_ends_at has passed → expired
  RETURN QUERY
  UPDATE public.subscriptions
     SET status = 'expired', updated_at = now()
   WHERE status = 'trial'
     AND trial_ends_at IS NOT NULL
     AND trial_ends_at <= now()
  RETURNING 'trial_expired'::text, id;

  -- past_due beyond grace window → canceled
  RETURN QUERY
  UPDATE public.subscriptions
     SET status = 'canceled', canceled_at = now(), updated_at = now()
   WHERE status = 'past_due'
     AND past_due_since IS NOT NULL
     AND past_due_since + (grace_days || ' days')::interval <= now()
  RETURNING 'past_due_canceled'::text, id;
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_scheduled_plan_changes()
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE r record; v_count int := 0;
BEGIN
  FOR r IN
    SELECT spc.id, spc.subscription_id, spc.target_plan_id
      FROM public.scheduled_plan_changes spc
     WHERE spc.status = 'pending'
       AND spc.effective_at <= now()
  LOOP
    UPDATE public.subscriptions
       SET plan_id = r.target_plan_id, updated_at = now()
     WHERE id = r.subscription_id;
    UPDATE public.scheduled_plan_changes
       SET status = 'applied', applied_at = now()
     WHERE id = r.id;
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- 10. Seed permissions for plan/subscription management
INSERT INTO public.permissions (key, label, category, tier_scope, is_destructive, sort_order, description) VALUES
  ('plans.view',                  'View plans',                  'Plans',         'platform', false, 100, 'View available plans'),
  ('plans.manage',                'Manage plans',                'Plans',         'platform', false, 101, 'Create, update, archive plans'),
  ('plans.feature_flags.edit',    'Edit plan feature flags',     'Plans',         'platform', false, 102, 'Toggle boolean feature flags on plans'),
  ('plans.entitlements.edit',     'Edit plan entitlements',      'Plans',         'platform', false, 103, 'Edit numeric limits on plans'),
  ('subscriptions.view',          'View subscriptions',          'Subscriptions', 'both',     false, 110, 'View tenant subscriptions'),
  ('subscriptions.assign',        'Assign subscription',         'Subscriptions', 'platform', false, 111, 'Assign a plan to a tenant'),
  ('subscriptions.change_plan',   'Change subscription plan',    'Subscriptions', 'platform', false, 112, 'Upgrade or downgrade a tenant plan'),
  ('subscriptions.cancel',        'Cancel subscription',         'Subscriptions', 'platform', true,  113, 'Cancel an active subscription')
ON CONFLICT (key) DO NOTHING;

-- Grant new perms to admin role
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
SELECT 'system', 'admin', k FROM (VALUES
  ('plans.view'),('plans.manage'),('plans.feature_flags.edit'),('plans.entitlements.edit'),
  ('subscriptions.view'),('subscriptions.assign'),('subscriptions.change_plan'),('subscriptions.cancel')
) AS t(k)
ON CONFLICT DO NOTHING;

-- 11. Seed default entitlements for the 3 existing plans
-- Starter: small team
INSERT INTO public.plan_entitlements (plan_id, key, limit_value, unit, description)
SELECT id, k, v, u, d FROM public.plans CROSS JOIN (VALUES
  ('max_users',                  10::bigint, 'users',     'Maximum active users'),
  ('max_organizations',          1::bigint,  'orgs',      'Maximum sub-organizations'),
  ('max_storage_gb',             5::bigint,  'gigabytes', 'Storage quota'),
  ('max_ai_calls_per_month',     1000::bigint,'calls',    'Monthly AI call quota'),
  ('max_api_calls_per_month',    10000::bigint,'calls',   'Monthly API call quota')
) AS e(k,v,u,d)
WHERE plans.code = 'starter'
ON CONFLICT (plan_id, key) DO NOTHING;

-- Growth: mid-market
INSERT INTO public.plan_entitlements (plan_id, key, limit_value, unit, description)
SELECT id, k, v, u, d FROM public.plans CROSS JOIN (VALUES
  ('max_users',                  100::bigint,  'users',     'Maximum active users'),
  ('max_organizations',          5::bigint,    'orgs',      'Maximum sub-organizations'),
  ('max_storage_gb',             50::bigint,   'gigabytes', 'Storage quota'),
  ('max_ai_calls_per_month',     25000::bigint,'calls',     'Monthly AI call quota'),
  ('max_api_calls_per_month',    250000::bigint,'calls',    'Monthly API call quota')
) AS e(k,v,u,d)
WHERE plans.code = 'growth'
ON CONFLICT (plan_id, key) DO NOTHING;

-- Enterprise: unlimited (-1 sentinel)
INSERT INTO public.plan_entitlements (plan_id, key, limit_value, unit, description)
SELECT id, k, v, u, d FROM public.plans CROSS JOIN (VALUES
  ('max_users',                  -1::bigint, 'users',     'Unlimited users'),
  ('max_organizations',          -1::bigint, 'orgs',      'Unlimited orgs'),
  ('max_storage_gb',             -1::bigint, 'gigabytes', 'Unlimited storage'),
  ('max_ai_calls_per_month',     -1::bigint, 'calls',     'Unlimited AI calls'),
  ('max_api_calls_per_month',    -1::bigint, 'calls',     'Unlimited API calls')
) AS e(k,v,u,d)
WHERE plans.code = 'enterprise'
ON CONFLICT (plan_id, key) DO NOTHING;
