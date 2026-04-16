import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claims } = await supabaseClient.auth.getClaims(token);
    const userId = claims?.claims?.sub;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only super_admin can test/save platform SMTP
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "super_admin")
      .is("tenant_id", null)
      .maybeSingle();

    if (!roleRow) {
      return new Response(
        JSON.stringify({ error: "Forbidden: super admin only" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = await req.json();
    const { recipient_email, smtp_config, save = true } = body;

    if (!recipient_email) {
      return new Response(
        JSON.stringify({ error: "recipient_email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    if (!smtp_config?.host || !smtp_config?.user || !smtp_config?.password) {
      return new Response(
        JSON.stringify({ error: "SMTP host, user, and password are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const port = parseInt(String(smtp_config.port || 587), 10);
    const fromEmail = smtp_config.from_email || smtp_config.user;
    const fromName = smtp_config.from_name || "Platform";

    try {
      const transporter = nodemailer.createTransport({
        host: smtp_config.host,
        port,
        secure: port === 465,
        auth: { user: smtp_config.user, pass: smtp_config.password },
        tls: { rejectUnauthorized: false },
      });

      const fromAddress = `${fromName} <${fromEmail}>`;

      await transporter.sendMail({
        from: fromAddress,
        to: recipient_email,
        subject: `SMTP Test — ${fromName}`,
        text: `SMTP test from ${fromName}. Your platform SMTP is working.`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:32px auto;padding:32px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;">
            <h2 style="margin:0 0 12px;color:#111;">✅ SMTP test successful</h2>
            <p style="color:#555;line-height:1.6;">This is a test email from <strong>${fromName}</strong>. Your platform SMTP configuration is working correctly.</p>
            <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />
            <p style="color:#888;font-size:12px;margin:0;">Server: ${smtp_config.host}:${port}<br/>From: ${fromEmail}<br/>Sent: ${new Date().toISOString()}</p>
          </div>
        `,
      });

      // Save and mark verified
      if (save) {
        const newValue = {
          enabled: smtp_config.enabled !== false,
          host: smtp_config.host,
          port,
          user: smtp_config.user,
          password: smtp_config.password,
          secure: port === 465 ? true : !!smtp_config.secure,
          from_name: smtp_config.from_name || "",
          from_email: smtp_config.from_email || smtp_config.user,
          reply_to: smtp_config.reply_to || "",
          verified_at: new Date().toISOString(),
        };

        await supabaseAdmin
          .from("platform_settings")
          .update({ value: newValue, updated_by: userId })
          .eq("key", "email_smtp");
      }

      return new Response(
        JSON.stringify({ success: true, message: `Test email sent to ${recipient_email}`, verified: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (smtpError: any) {
      console.error("SMTP error:", smtpError);
      // Mark not verified
      const { data: existing } = await supabaseAdmin
        .from("platform_settings")
        .select("value")
        .eq("key", "email_smtp")
        .single();
      if (existing?.value) {
        const updated = { ...(existing.value as any), verified_at: null };
        await supabaseAdmin
          .from("platform_settings")
          .update({ value: updated })
          .eq("key", "email_smtp");
      }
      return new Response(
        JSON.stringify({ error: `SMTP test failed: ${smtpError.message || "Connection failed"}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (error: any) {
    console.error("test-platform-smtp error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
