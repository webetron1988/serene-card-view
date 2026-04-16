// Branding & locale configuration for tenant "acme"

import type { TenantBranding } from "../types";

export const acmeBranding: TenantBranding = {
  tenantCode: "acme",
  displayName: "Acme Corporation",
  tagline: "Where talent meets opportunity",
  logoText: "AC", // initials shown in logo tile
  // Theme colors as HSL triplets — injected as CSS vars at runtime
  theme: {
    primary: "221 83% 53%", // blue
    primaryForeground: "0 0% 100%",
    accent: "262 83% 58%",
    gradientFrom: "221 83% 33%",
    gradientVia: "221 83% 23%",
    gradientTo: "262 83% 28%",
  },
  font: "Inter",
  direction: "ltr",
  locale: "en-US",
  timezone: "America/New_York",
  loginHeadline: "Welcome to Acme",
  loginSubheadline: "Your career, powered by Acme HR",
  features: ["Self-Service", "Career Growth", "AI-Powered", "Secure"],
  ssoProviders: ["google", "microsoft"],
};
