// Branding & locale configuration for tenant "globex"

import type { TenantBranding } from "../types";

export const globexBranding: TenantBranding = {
  tenantCode: "globex",
  displayName: "Globex Industries",
  tagline: "Engineering tomorrow, today",
  logoText: "GX",
  theme: {
    primary: "160 84% 39%", // emerald
    primaryForeground: "0 0% 100%",
    accent: "173 80% 40%",
    gradientFrom: "160 84% 19%",
    gradientVia: "160 84% 14%",
    gradientTo: "173 80% 20%",
  },
  font: "Inter",
  direction: "ltr",
  locale: "en-GB",
  timezone: "Europe/London",
  loginHeadline: "Sign in to Globex",
  loginSubheadline: "Access your talent management portal",
  features: ["Multi-Entity", "RTL Support", "Enterprise SSO", "GDPR"],
  ssoProviders: ["google", "microsoft"],
};
