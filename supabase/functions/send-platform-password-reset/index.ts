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

// PUBLIC endpoint (no auth required) — but always returns success to prevent
// email enumeration. Internally only sends if SMTP is configured AND the
// email maps to a platform-tier user.

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  // Always-success response for enumeration safety
  const okResp = () =>
    new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { email } = (await req.json()) as { email?: string };
    if (!email) return okResp();

    // Confirm user is a platform-tier user; if not, silently succeed.
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("user_id, user_tier")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (!profile || profile.user_tier !== "platform") return okResp();

    const smtp = await getSmtpConfig(supabaseAdmin);
    if (!smtp) {
      console.error("Password reset: SMTP not configured");
      return okResp();
    }

    const baseUrl = await getBaseUrl(supabaseAdmin);
    const general = await getGeneralSettings(supabaseAdmin);

    // Generate hashed_token via admin API
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({ type: "recovery", email });
    if (linkError || !linkData?.properties?.hashed_token) {
      console.error("generateLink err", linkError);
      return okResp();
    }
    const hashedToken = linkData.properties.hashed_token;

    // Build OUR reset URL (NO Supabase URL involved)
    const resetLink = `${baseUrl}/admin/reset-password?token_hash=${encodeURIComponent(
      hashedToken,
    )}&type=recovery`;

    const tmpl = await getTemplate(supabaseAdmin, "password_reset");
    const vars: Record<string, string> = {
      user_email: email,
      app_name: general.app_name,
      reset_link: resetLink,
      support_email: general.support_email,
      logo_html: buildLogoHtml(general.logo_url, general.app_name),
      primary_color: PRIMARY_COLOR,
      primary_color_dark: PRIMARY_COLOR_DARK,
      company_name: general.company_name,
      current_year: String(new Date().getFullYear()),
    };
    const subject = renderTemplate(
      tmpl?.subject || `Reset your ${general.app_name} password`,
      vars,
    );
    const html = renderTemplate(
      tmpl?.body_html || `<p>Reset: <a href="${resetLink}">${resetLink}</a></p>`,
      vars,
    );
    const text = renderTemplate(
      tmpl?.body_text || `Reset your password: ${resetLink}`,
      vars,
    );

    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        auth: { user: smtp.user, pass: smtp.password },
        tls: { rejectUnauthorized: false },
      });
      await transporter.sendMail({
        from: `${smtp.from_name} <${smtp.from_email}>`,
        to: email,
        subject,
        text,
        html,
        replyTo: smtp.reply_to || undefined,
      });
    } catch (e) {
      console.error("smtp send err", e);
    }

    return okResp();
  } catch (e) {
    console.error("send-platform-password-reset error", e);
    return okResp();
  }
});
