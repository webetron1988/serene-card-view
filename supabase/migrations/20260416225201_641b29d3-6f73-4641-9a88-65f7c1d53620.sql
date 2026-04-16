-- =========================================================================
-- 1. PLATFORM SETTINGS (single-row key/value store)
-- =========================================================================
CREATE TABLE public.platform_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform users can read platform settings"
  ON public.platform_settings FOR SELECT TO authenticated
  USING (public.get_user_tier(auth.uid()) = 'platform');

CREATE POLICY "Super admins can insert platform settings"
  ON public.platform_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update platform settings"
  ON public.platform_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete platform settings"
  ON public.platform_settings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER platform_settings_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

-- Seed default rows
INSERT INTO public.platform_settings (key, value, description) VALUES
  ('platform_base_url', '"https://serene-card-view.lovable.app"'::jsonb, 'Base URL used when generating invitation and password reset links.'),
  ('platform_general', jsonb_build_object(
      'app_name', 'AchievHR Platform',
      'support_email', 'support@achievhr.com',
      'logo_url', '',
      'company_name', 'AchievHR by inHRSight'
    ), 'General platform branding and contact information.'),
  ('email_smtp', jsonb_build_object(
      'enabled', false,
      'host', '',
      'port', 587,
      'user', '',
      'password', '',
      'secure', true,
      'from_name', 'AchievHR Platform',
      'from_email', '',
      'reply_to', '',
      'verified_at', null
    ), 'Platform default SMTP configuration used by all platform notifications.');

-- =========================================================================
-- 2. PLATFORM INVITATIONS
-- =========================================================================
CREATE TABLE public.platform_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  country_code TEXT,
  role_kind public.role_kind NOT NULL,
  role_ref TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  email_status TEXT NOT NULL DEFAULT 'pending',
  email_error TEXT,
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  invited_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_platform_invitations_email ON public.platform_invitations(lower(email));
CREATE INDEX idx_platform_invitations_status ON public.platform_invitations(status);

ALTER TABLE public.platform_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform users can view platform invitations"
  ON public.platform_invitations FOR SELECT TO authenticated
  USING (public.get_user_tier(auth.uid()) = 'platform');

CREATE POLICY "Super admins can insert platform invitations"
  ON public.platform_invitations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Super admins and admins can update platform invitations"
  ON public.platform_invitations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Super admins can delete platform invitations"
  ON public.platform_invitations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER platform_invitations_updated_at
  BEFORE UPDATE ON public.platform_invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER platform_invitations_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.platform_invitations
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

-- =========================================================================
-- 3. NOTIFICATION TEMPLATES
-- =========================================================================
CREATE TABLE public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_type TEXT NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  scope TEXT NOT NULL DEFAULT 'platform',
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trigger_type, scope)
);

ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform users can view notification templates"
  ON public.notification_templates FOR SELECT TO authenticated
  USING (public.get_user_tier(auth.uid()) = 'platform');

CREATE POLICY "Super admins can insert notification templates"
  ON public.notification_templates FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update notification templates"
  ON public.notification_templates FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete notification templates"
  ON public.notification_templates FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER notification_templates_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.notification_templates
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_change();

-- Seed: platform invitation template
INSERT INTO public.notification_templates (trigger_type, name, subject, body_html, body_text, variables, description) VALUES
('platform_invitation', 'Platform User Invitation',
'You''re invited to join {{app_name}}',
'<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
    <div style="padding:40px 40px 24px 40px;text-align:center;background:linear-gradient(135deg,{{primary_color}} 0%,{{primary_color_dark}} 100%);">
      {{logo_html}}
      <h1 style="color:#ffffff;margin:16px 0 0 0;font-size:26px;font-weight:600;letter-spacing:-0.5px;">You''re invited 🎉</h1>
    </div>
    <div style="padding:40px;">
      <p style="color:#1a1a1a;font-size:16px;line-height:1.6;margin:0 0 20px;">Hi {{first_name}},</p>
      <p style="color:#4a4a4a;font-size:15px;line-height:1.7;margin:0 0 20px;">
        <strong>{{inviter_name}}</strong> has invited you to join <strong>{{app_name}}</strong> as a <strong>{{role_label}}</strong>.
      </p>
      <p style="color:#4a4a4a;font-size:15px;line-height:1.7;margin:0 0 32px;">
        Click the button below to accept your invitation, set up your password, and access the platform:
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="{{invitation_link}}" style="display:inline-block;background:{{primary_color}};color:#ffffff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          Accept Invitation
        </a>
      </div>
      <p style="color:#8a8a8a;font-size:13px;line-height:1.6;margin:24px 0 8px;text-align:center;">
        This invitation expires in 7 days.
      </p>
      <p style="color:{{primary_color}};font-size:12px;word-break:break-all;text-align:center;margin:0 0 24px;">{{invitation_link}}</p>
      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />
      <p style="color:#9a9a9a;font-size:12px;line-height:1.6;text-align:center;margin:0;">
        If you weren''t expecting this invitation, you can safely ignore this email.<br/>
        Need help? Contact <a href="mailto:{{support_email}}" style="color:{{primary_color}};text-decoration:none;">{{support_email}}</a>
      </p>
    </div>
    <div style="background:#fafbfc;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9a9a9a;font-size:11px;margin:0;">© {{current_year}} {{company_name}}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>',
'Hi {{first_name}}, {{inviter_name}} invited you to join {{app_name}} as {{role_label}}. Accept here: {{invitation_link}} (expires in 7 days).',
'["first_name","inviter_name","app_name","role_label","invitation_link","support_email","logo_html","primary_color","primary_color_dark","company_name","current_year"]'::jsonb,
'Sent when a platform admin invites a new platform user.');

-- Seed: password reset template
INSERT INTO public.notification_templates (trigger_type, name, subject, body_html, body_text, variables, description) VALUES
('password_reset', 'Password Reset',
'Reset your {{app_name}} password',
'<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
    <div style="padding:40px 40px 24px 40px;text-align:center;background:linear-gradient(135deg,{{primary_color}} 0%,{{primary_color_dark}} 100%);">
      {{logo_html}}
      <h1 style="color:#ffffff;margin:16px 0 0 0;font-size:26px;font-weight:600;letter-spacing:-0.5px;">Password reset requested</h1>
    </div>
    <div style="padding:40px;">
      <p style="color:#1a1a1a;font-size:16px;line-height:1.6;margin:0 0 20px;">Hi,</p>
      <p style="color:#4a4a4a;font-size:15px;line-height:1.7;margin:0 0 20px;">
        We received a request to reset the password for your <strong>{{app_name}}</strong> account ({{user_email}}).
      </p>
      <p style="color:#4a4a4a;font-size:15px;line-height:1.7;margin:0 0 32px;">Click the button below to set a new password:</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="{{reset_link}}" style="display:inline-block;background:{{primary_color}};color:#ffffff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          Reset Password
        </a>
      </div>
      <p style="color:#8a8a8a;font-size:13px;line-height:1.6;margin:24px 0 8px;text-align:center;">This link will expire in 1 hour.</p>
      <p style="color:{{primary_color}};font-size:12px;word-break:break-all;text-align:center;margin:0 0 24px;">{{reset_link}}</p>
      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />
      <p style="color:#9a9a9a;font-size:12px;line-height:1.6;text-align:center;margin:0;">
        If you didn''t request this reset, you can safely ignore this email — your password will remain unchanged.<br/>
        Need help? Contact <a href="mailto:{{support_email}}" style="color:{{primary_color}};text-decoration:none;">{{support_email}}</a>
      </p>
    </div>
    <div style="background:#fafbfc;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9a9a9a;font-size:11px;margin:0;">© {{current_year}} {{company_name}}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>',
'Reset your {{app_name}} password by visiting: {{reset_link}} (expires in 1 hour).',
'["user_email","app_name","reset_link","support_email","logo_html","primary_color","primary_color_dark","company_name","current_year"]'::jsonb,
'Sent when a user requests a password reset.');

-- =========================================================================
-- 4. NEW PERMISSION: users.invite
-- =========================================================================
INSERT INTO public.permissions (key, label, category, description, tier_scope, is_destructive, sort_order)
VALUES ('users.invite', 'Invite users', 'Users', 'Invite new platform users via email and assign their initial role.', 'platform', false, 110)
ON CONFLICT (key) DO NOTHING;

-- Grant to super_admin and admin system roles by default
INSERT INTO public.role_permissions (role_kind, role_ref, permission_key)
VALUES
  ('system', 'super_admin', 'users.invite'),
  ('system', 'admin', 'users.invite')
ON CONFLICT DO NOTHING;