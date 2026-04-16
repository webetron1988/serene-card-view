// Shared types for tenant-scoped mock data

export type TenantRole =
  | "super_admin"
  | "admin"
  | "hr_admin"
  | "employee"
  | "auditor";

export interface TenantBrandingTheme {
  primary: string;            // HSL triplet "H S% L%"
  primaryForeground: string;
  accent: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export interface TenantBranding {
  tenantCode: string;
  displayName: string;
  tagline: string;
  logoText: string;           // 2–3 char initials shown in logo tile
  theme: TenantBrandingTheme;
  font: string;
  direction: "ltr" | "rtl";
  locale: string;
  timezone: string;
  loginHeadline: string;
  loginSubheadline: string;
  features: string[];
  ssoProviders: Array<"google" | "microsoft" | "apple" | "saml">;
}

export interface TenantUser {
  id: string;
  tenantCode: string;
  email: string;
  password: string;           // mock only
  name: string;
  roles: TenantRole[];
  avatarInitials: string;
}
