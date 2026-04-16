import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";
import {
  buildLogoHtml,
  getBaseUrl,
  getGeneralSettings,
  getSmtpConfig,
  getTemplate,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  renderTemplate,
} from "../_shared/email-helpers.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteBody {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  country_code?: string;
  role_kind: "system" | "platform_custom";
  role_ref: string; // 'super_admin' | 'admin' | uuid
}

const SYSTEM_ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Administrator",
  admin: "Administrator",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Unauthorized" }, 401);
    }
    const supabaseClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims } = await supabaseClient.auth.getClaims(token);
    const inviterId = claims?.claims?.sub;
    if (!inviterId) return json({ error: "Unauthorized" }, 401);

    // Inviter must be platform tier with super_admin or admin
    const { data: inviterRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", inviterId)
      .is("tenant_id", null);

    const isSuper = (inviterRoles || []).some((r) => r.role === "super_admin");
    const isAdmin = (inviterRoles || []).some((r) => r.role === "admin");
    if (!isSuper && !isAdmin) return json({ error: "Forbidden" }, 403);

    const body = (await req.json()) as InviteBody;
    const {
      email,
      first_name,
      last_name,
      phone,
      country_code,
      role_kind,
      role_ref,
    } = body;

    if (!email || !first_name || !last_name || !role_kind || !role_ref) {
      return json(
        { error: "email, first_name, last_name, role_kind, role_ref required" },
        400,
      );
    }

    // Permission rules:
    // - super_admin can invite anything
    // - admin can invite admin & lower (NOT super_admin), and any platform_custom role
    if (!isSuper) {
      if (role_kind === "system" && role_ref === "super_admin") {
        return json({ error: "Admins cannot invite Super Admins" }, 403);
      }
    }

    // Block if email already has a platform user
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("user_id, user_tier")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (existingProfile && existingProfile.user_tier === "platform") {
      return json({ error: "A platform user with this email already exists" }, 409);
    }

    // Build token + invite row
    const inviteToken = crypto.randomUUID() + "-" + crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Cancel any prior pending invite for the same email
    await supabaseAdmin
      .from("platform_invitations")
      .update({ status: "revoked" })
      .eq("email", email.toLowerCase())
      .in("status", ["pending"]);

    const { error: insertErr } = await supabaseAdmin
      .from("platform_invitations")
      .insert({
        email: email.toLowerCase(),
        first_name,
        last_name,
        phone: phone || null,
        country_code: country_code || null,
        role_kind,
        role_ref,
        token: inviteToken,
        expires_at: expiresAt,
        status: "pending",
        email_status: "sending",
        invited_by: inviterId,
      });

    if (insertErr) {
      console.error("invite insert err", insertErr);
      return json({ error: "Failed to create invitation" }, 500);
    }

    // SMTP
    const smtp = await getSmtpConfig(supabaseAdmin);
    if (!smtp) {
      await supabaseAdmin
        .from("platform_invitations")
        .update({ email_status: "failed", email_error: "SMTP not configured" })
        .eq("token", inviteToken);
      return json(
        { error: "Platform SMTP is not configured. Set it up in Settings → Email & SMTP." },
        400,
      );
    }

    const baseUrl = await getBaseUrl(supabaseAdmin);
    const general = await getGeneralSettings(supabaseAdmin);

    const invitationLink = `${baseUrl}/admin/accept-invite?token=${encodeURIComponent(
      inviteToken,
    )}`;

    // Resolve role label
    let roleLabel = SYSTEM_ROLE_LABEL[role_ref] || role_ref;
    if (role_kind === "platform_custom") {
      const { data: customRole } = await supabaseAdmin
        .from("platform_custom_roles")
        .select("name")
        .eq("id", role_ref)
        .maybeSingle();
      if (customRole) roleLabel = customRole.name;
    }

    // Inviter display name
    const { data: inviterProfile } = await supabaseAdmin
      .from("profiles")
      .select("display_name, email")
      .eq("user_id", inviterId)
      .maybeSingle();
    const inviterName =
      inviterProfile?.display_name || inviterProfile?.email || "Your administrator";

    // Template
    const tmpl = await getTemplate(supabaseAdmin, "platform_invitation");
    const vars: Record<string, string> = {
      first_name,
      last_name,
      inviter_name: inviterName,
      app_name: general.app_name,
      role_label: roleLabel,
      invitation_link: invitationLink,
      support_email: general.support_email,
      logo_html: buildLogoHtml(general.logo_url, general.app_name),
      primary_color: PRIMARY_COLOR,
      primary_color_dark: PRIMARY_COLOR_DARK,
      company_name: general.company_name,
      current_year: String(new Date().getFullYear()),
    };

    const subject = renderTemplate(
      tmpl?.subject || `You're invited to join ${general.app_name}`,
      vars,
    );
    const html = renderTemplate(
      tmpl?.body_html ||
        `<p>Hi ${first_name}, accept your invite: <a href="${invitationLink}">${invitationLink}</a></p>`,
      vars,
    );
    const text = renderTemplate(
      tmpl?.body_text || `Accept your invite: ${invitationLink}`,
      vars,
    );

    // Send
    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        auth: { user: smtp.user, pass: smtp.password },
        tls: { rejectUnauthorized: false },
      });
      const fromAddress = `${smtp.from_name} <${smtp.from_email}>`;
      await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject,
        text,
        html,
        replyTo: smtp.reply_to || undefined,
      });

      await supabaseAdmin
        .from("platform_invitations")
        .update({ email_status: "sent", sent_at: new Date().toISOString() })
        .eq("token", inviteToken);

      return json({
        success: true,
        message: `Invitation sent to ${email}`,
        invitation_link: invitationLink,
      });
    } catch (smtpErr: any) {
      console.error("smtp send err", smtpErr);
      await supabaseAdmin
        .from("platform_invitations")
        .update({
          email_status: "failed",
          email_error: String(smtpErr.message || smtpErr).substring(0, 500),
        })
        .eq("token", inviteToken);
      return json(
        {
          success: false,
          error: `Email failed to send: ${smtpErr.message || "unknown"}. Invitation created — you can resend it.`,
          invitation_link: invitationLink,
        },
        500,
      );
    }
  } catch (e: any) {
    console.error("send-platform-invitation error", e);
    return json({ error: e.message || "unexpected" }, 500);
  }
});

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
