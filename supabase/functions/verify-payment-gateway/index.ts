// supabase/functions/verify-payment-gateway/index.ts
// Lightweight live ping for Stripe / Razorpay payment gateways.
// Deployed automatically by Lovable. Default verify_jwt=false; we validate JWT in code.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface VerifyPayload {
  gateway_id: string;
}

async function pingStripe(secretKey: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("https://api.stripe.com/v1/balance", {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const text = await res.text();
    if (!res.ok) {
      return { ok: false, error: `Stripe ${res.status}: ${text.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: `Stripe network error: ${(e as Error).message}` };
  }
}

async function pingRazorpay(keyId: string, keySecret: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const auth = btoa(`${keyId}:${keySecret}`);
    const res = await fetch("https://api.razorpay.com/v1/payments?count=1", {
      headers: { Authorization: `Basic ${auth}` },
    });
    const text = await res.text();
    if (!res.ok) {
      return { ok: false, error: `Razorpay ${res.status}: ${text.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: `Razorpay network error: ${(e as Error).message}` };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // --- Authn: require a valid JWT belonging to a super_admin ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
  if (claimsErr || !claims?.claims?.sub) return json({ error: "Unauthorized" }, 401);
  const userId = claims.claims.sub as string;

  // Super-admin check via SECURITY DEFINER function
  const { data: isAdmin, error: roleErr } = await userClient.rpc("has_role", {
    _user_id: userId,
    _role: "super_admin",
  });
  if (roleErr || !isAdmin) return json({ error: "Forbidden" }, 403);

  // --- Validate payload ---
  let payload: VerifyPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  if (!payload?.gateway_id || typeof payload.gateway_id !== "string") {
    return json({ error: "gateway_id is required" }, 400);
  }

  // --- Use service-role client to read gateway + secrets ---
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: gateway, error: gErr } = await admin
    .from("payment_gateways")
    .select("id, provider, environment, display_name")
    .eq("id", payload.gateway_id)
    .maybeSingle();

  if (gErr) return json({ error: `Lookup failed: ${gErr.message}` }, 500);
  if (!gateway) return json({ error: "Gateway not found" }, 404);

  let result: { ok: boolean; error?: string };

  if (gateway.provider === "stripe") {
    const { data: sk, error: skErr } = await admin.rpc("get_payment_gateway_secret", {
      _gateway_id: gateway.id,
      _secret_name: "secret_key",
    });
    if (skErr || !sk) {
      result = { ok: false, error: "Missing secret_key. Save the Stripe secret key first." };
    } else {
      result = await pingStripe(sk as string);
    }
  } else if (gateway.provider === "razorpay") {
    const [{ data: keyId }, { data: keySecret }] = await Promise.all([
      admin.rpc("get_payment_gateway_secret", { _gateway_id: gateway.id, _secret_name: "key_id" }),
      admin.rpc("get_payment_gateway_secret", { _gateway_id: gateway.id, _secret_name: "key_secret" }),
    ]);
    if (!keyId || !keySecret) {
      result = { ok: false, error: "Missing key_id or key_secret. Save both Razorpay credentials first." };
    } else {
      result = await pingRazorpay(keyId as string, keySecret as string);
    }
  } else {
    result = { ok: false, error: `Unsupported provider: ${gateway.provider}` };
  }

  // --- Persist verification outcome ---
  const { error: upErr } = await admin
    .from("payment_gateways")
    .update({
      verify_status: result.ok ? "ok" : "failed",
      verify_error: result.ok ? null : (result.error ?? "Unknown error").slice(0, 500),
      last_verified_at: new Date().toISOString(),
    })
    .eq("id", gateway.id);

  if (upErr) {
    return json({ ok: result.ok, error: result.error, persist_error: upErr.message }, 500);
  }

  return json({
    ok: result.ok,
    error: result.error ?? null,
    gateway_id: gateway.id,
    provider: gateway.provider,
    environment: gateway.environment,
    verified_at: new Date().toISOString(),
  });
});
