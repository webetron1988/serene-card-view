import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// PUBLIC endpoint — no auth header required.
// Two modes:
//   action: "lookup"  -> returns invitation details (email, name, role label)
//   action: "accept"  -> creates auth user with given password, assigns role,
//                        marks invitation accepted, returns email + temp ok.

interface Body {
  action: "lookup" | "accept";
  token: string;
  password?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { action, token, password } = (await req.json()) as Body;
    if (!action || !token) return json({ error: "Missing parameters" }, 400);

    const { data: invitation } = await supabaseAdmin
      .from("platform_invitations")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (!invitation) return json({ error: "This invitation link is invalid." }, 404);

    if (invitation.status === "accepted") {
      return json({ error: "This invitation has already been accepted. Please sign in." }, 410);
    }
    if (invitation.status === "revoked") {
      return json({ error: "This invitation has been revoked." }, 410);
    }
    if (new Date(invitation.expires_at) < new Date()) {
      await supabaseAdmin
        .from("platform_invitations")
        .update({ status: "expired" })
        .eq("id", invitation.id);
      return json({ error: "This invitation has expired." }, 410);
    }

    // Resolve role label for display
    let roleLabel = invitation.role_ref;
    if (invitation.role_kind === "system") {
      roleLabel =
        invitation.role_ref === "super_admin"
          ? "Super Administrator"
          : invitation.role_ref === "admin"
            ? "Administrator"
            : invitation.role_ref;
    } else if (invitation.role_kind === "platform_custom") {
      const { data: r } = await supabaseAdmin
        .from("platform_custom_roles")
        .select("name")
        .eq("id", invitation.role_ref)
        .maybeSingle();
      if (r) roleLabel = r.name;
    }

    if (action === "lookup") {
      return json({
        email: invitation.email,
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        role_label: roleLabel,
        expires_at: invitation.expires_at,
      });
    }

    // ACCEPT
    if (!password || password.length < 8) {
      return json({ error: "Password must be at least 8 characters." }, 400);
    }

    // Check if auth user already exists (rare — covers re-invite cases)
    const { data: existingByEmail } =
      await supabaseAdmin.auth.admin.listUsers();
    const existing = existingByEmail?.users?.find(
      (u: any) => u.email?.toLowerCase() === invitation.email.toLowerCase(),
    );

    let userId: string;
    if (existing) {
      // Update password + ensure profile + role
      const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(
        existing.id,
        { password, email_confirm: true },
      );
      if (updErr) return json({ error: "Failed to set password: " + updErr.message }, 500);
      userId = existing.id;
    } else {
      const displayName = `${invitation.first_name || ""} ${invitation.last_name || ""}`.trim();
      const { data: created, error: createErr } =
        await supabaseAdmin.auth.admin.createUser({
          email: invitation.email,
          password,
          email_confirm: true,
          user_metadata: {
            display_name: displayName,
            first_name: invitation.first_name,
            last_name: invitation.last_name,
            phone: invitation.phone,
            country_code: invitation.country_code,
          },
        });
      if (createErr || !created.user) {
        return json({ error: "Failed to create account: " + (createErr?.message || "unknown") }, 500);
      }
      userId = created.user.id;
    }

    // Ensure profile is platform-tier (handle_new_user trigger sets default tenant; we override)
    const displayName = `${invitation.first_name || ""} ${invitation.last_name || ""}`.trim();
    await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          email: invitation.email,
          display_name: displayName || null,
          phone: invitation.phone || null,
          user_tier: "platform",
        },
        { onConflict: "user_id" },
      );

    // Assign role (platform-scoped → tenant_id null)
    if (invitation.role_kind === "system") {
      // app_role enum
      await supabaseAdmin
        .from("user_roles")
        .upsert(
          {
            user_id: userId,
            role: invitation.role_ref,
            tenant_id: null,
            granted_by: invitation.invited_by,
          },
          { onConflict: "user_id,role,tenant_id" },
        );
    }
    // For platform_custom roles, mapping lives in role_permissions; we still
    // record an audit entry. (No user_roles enum value for custom.)

    // Mark accepted
    await supabaseAdmin
      .from("platform_invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invitation.id);

    return json({ success: true, email: invitation.email });
  } catch (e: any) {
    console.error("accept-platform-invitation error", e);
    return json({ error: e.message || "Unexpected error" }, 500);
  }
});

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
