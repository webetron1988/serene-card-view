// Shared helpers used by platform email edge functions.
// Resolves base URL, SMTP config, branding, and renders templates.

export interface SmtpConfig {
  enabled: boolean;
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
  from_name: string;
  from_email: string;
  reply_to?: string;
  verified_at?: string | null;
}

export interface PlatformGeneral {
  app_name: string;
  support_email: string;
  logo_url: string;
  company_name: string;
}

export async function getPlatformSetting<T = any>(
  supabaseAdmin: any,
  key: string,
): Promise<T | null> {
  const { data } = await supabaseAdmin
    .from("platform_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return (data?.value ?? null) as T | null;
}

export async function getBaseUrl(supabaseAdmin: any): Promise<string> {
  const raw = await getPlatformSetting<string>(supabaseAdmin, "platform_base_url");
  let baseUrl = "";
  if (raw && typeof raw === "string") {
    baseUrl = raw.trim();
  }
  if (!baseUrl) {
    baseUrl =
      Deno.env.get("SITE_URL") ||
      `https://${(Deno.env.get("SUPABASE_URL") || "").replace("https://", "").replace(".supabase.co", ".lovable.app")}`;
  }
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;
  return baseUrl.replace(/\/+$/, "");
}

export async function getSmtpConfig(supabaseAdmin: any): Promise<SmtpConfig | null> {
  const cfg = await getPlatformSetting<SmtpConfig>(supabaseAdmin, "email_smtp");
  if (!cfg || !cfg.enabled || !cfg.host || !cfg.user || !cfg.password) return null;
  return {
    ...cfg,
    port: cfg.port || 587,
    from_email: cfg.from_email || cfg.user,
    from_name: cfg.from_name || "Platform",
  };
}

export async function getGeneralSettings(supabaseAdmin: any): Promise<PlatformGeneral> {
  const general = await getPlatformSetting<PlatformGeneral>(
    supabaseAdmin,
    "platform_general",
  );
  return {
    app_name: general?.app_name || "Platform",
    support_email: general?.support_email || "",
    logo_url: general?.logo_url || "",
    company_name: general?.company_name || general?.app_name || "Platform",
  };
}

export async function getTemplate(
  supabaseAdmin: any,
  triggerType: string,
): Promise<{ subject: string; body_html: string; body_text?: string } | null> {
  const { data } = await supabaseAdmin
    .from("notification_templates")
    .select("subject, body_html, body_text")
    .eq("trigger_type", triggerType)
    .eq("scope", "platform")
    .eq("is_active", true)
    .maybeSingle();
  return data ?? null;
}

export function renderTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    const re = new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, "g");
    out = out.replace(re, v ?? "");
  }
  return out;
}

export function buildLogoHtml(logoUrl: string, alt: string): string {
  if (!logoUrl) return "";
  return `<img src="${logoUrl}" alt="${alt}" style="max-height:48px;margin:0 auto;display:block;" />`;
}

export const PRIMARY_COLOR = "#0f172a";
export const PRIMARY_COLOR_DARK = "#020617";
