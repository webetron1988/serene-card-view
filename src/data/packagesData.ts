// ─── Package / Plan types for HR Platform ─────────────────

export interface PackageFeatures {
  // Core Limits
  employees: number;       // -1 = unlimited
  adminUsers: number;
  departments: number;
  locations: number;
  storage: string;
  // HR Modules
  coreHR: boolean;
  recruitment: boolean;
  performance: boolean;
  payroll: boolean;
  attendance: boolean;
  learning: boolean;
  analytics: boolean;
  scheduling: boolean;
  compliance: boolean;
  benefits: boolean;
  // Integrations
  apiAccess: boolean;
  ssoSaml: boolean;
  customWebhooks: boolean;
  thirdPartyIntegrations: boolean;
  // Branding
  customBranding: boolean;
  whiteLabel: boolean;
  customDomain: boolean;
  // Security
  rbac: boolean;
  auditLogs: boolean;
  ipWhitelisting: boolean;
  dataEncryption: boolean;
  mfaEnforcement: boolean;
  dataRetentionDays: number; // -1 = unlimited
  // Support
  supportLevel: string;
  dedicatedCSM: boolean;
  slaGuarantee: string;
  onboarding: string;
}

export interface Package {
  id: string;
  name: string;
  type: "free" | "paid";
  price: number;
  yearlyPrice: number;
  interval: "monthly" | "yearly";
  description: string;
  features: PackageFeatures;
  isPopular?: boolean;
  isTrial?: boolean;
  subscriberCount: number;
  mrr: number;
  color: string;
  status: "active" | "archived" | "draft";
}

export type SubscriptionStatus = "active" | "trial" | "expired" | "suspended" | "cancelled";

export interface TenantSubscription {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  packageId: string;
  packageName: string;
  status: SubscriptionStatus;
  startDate: string;
  nextBillingDate: string;
  trialEndsAt?: string;
  mrr: number;
  billingCycle: "monthly" | "yearly";
  seats: number;
  usedSeats: number;
  paymentMethod: "card" | "bank_transfer" | "invoice";
  lastPaymentDate?: string;
  totalRevenue: number;
  healthScore: number;
}

// ─── Feature categories for matrix ──────────────────────

export const featureCategories = [
  {
    name: "Core Limits",
    features: [
      { key: "employees", label: "Employees", type: "limit" as const },
      { key: "adminUsers", label: "Admin Users", type: "limit" as const },
      { key: "departments", label: "Departments", type: "limit" as const },
      { key: "locations", label: "Locations", type: "limit" as const },
      { key: "storage", label: "Storage", type: "text" as const },
    ],
  },
  {
    name: "HR Modules",
    features: [
      { key: "coreHR", label: "Core HR", type: "boolean" as const },
      { key: "recruitment", label: "Recruitment", type: "boolean" as const },
      { key: "performance", label: "Performance Mgmt", type: "boolean" as const },
      { key: "payroll", label: "Payroll", type: "boolean" as const },
      { key: "attendance", label: "Attendance & Leave", type: "boolean" as const },
      { key: "learning", label: "Learning & Development", type: "boolean" as const },
      { key: "analytics", label: "Advanced Analytics", type: "boolean" as const },
      { key: "scheduling", label: "Scheduling", type: "boolean" as const },
      { key: "compliance", label: "Compliance", type: "boolean" as const },
      { key: "benefits", label: "Benefits Admin", type: "boolean" as const },
    ],
  },
  {
    name: "Integrations",
    features: [
      { key: "apiAccess", label: "API Access", type: "boolean" as const },
      { key: "ssoSaml", label: "SSO / SAML", type: "boolean" as const },
      { key: "customWebhooks", label: "Custom Webhooks", type: "boolean" as const },
      { key: "thirdPartyIntegrations", label: "3rd Party Integrations", type: "boolean" as const },
    ],
  },
  {
    name: "Branding",
    features: [
      { key: "customBranding", label: "Custom Branding", type: "boolean" as const },
      { key: "whiteLabel", label: "White Label", type: "boolean" as const },
      { key: "customDomain", label: "Custom Domain", type: "boolean" as const },
    ],
  },
  {
    name: "Security & Compliance",
    features: [
      { key: "rbac", label: "Role-based Access", type: "boolean" as const },
      { key: "auditLogs", label: "Audit Logs", type: "boolean" as const },
      { key: "ipWhitelisting", label: "IP Whitelisting", type: "boolean" as const },
      { key: "dataEncryption", label: "Data Encryption", type: "boolean" as const },
      { key: "mfaEnforcement", label: "MFA Enforcement", type: "boolean" as const },
      { key: "dataRetentionDays", label: "Data Retention", type: "retention" as const },
    ],
  },
  {
    name: "Support",
    features: [
      { key: "supportLevel", label: "Support Level", type: "text" as const },
      { key: "dedicatedCSM", label: "Dedicated CSM", type: "boolean" as const },
      { key: "slaGuarantee", label: "SLA Guarantee", type: "text" as const },
      { key: "onboarding", label: "Onboarding", type: "text" as const },
    ],
  },
];

// ─── Mock packages ──────────────────────────────────────

export const mockPackages: Package[] = [
  {
    id: "pkg-free",
    name: "Free / Trial",
    type: "free",
    price: 0,
    yearlyPrice: 0,
    interval: "monthly",
    description: "Get started with essential HR tools. Limited to one free/trial package.",
    isTrial: true,
    subscriberCount: 18,
    mrr: 0,
    color: "hsl(var(--muted-foreground))",
    status: "active",
    features: {
      employees: 25, adminUsers: 2, departments: 3, locations: 1, storage: "500 MB",
      coreHR: true, recruitment: false, performance: false, payroll: false, attendance: true,
      learning: false, analytics: false, scheduling: false, compliance: false, benefits: false,
      apiAccess: false, ssoSaml: false, customWebhooks: false, thirdPartyIntegrations: false,
      customBranding: false, whiteLabel: false, customDomain: false,
      rbac: false, auditLogs: false, ipWhitelisting: false, dataEncryption: true, mfaEnforcement: false,
      dataRetentionDays: 30,
      supportLevel: "Community", dedicatedCSM: false, slaGuarantee: "None", onboarding: "Self-serve docs",
    },
  },
  {
    id: "pkg-starter",
    name: "Starter",
    type: "paid",
    price: 299,
    yearlyPrice: 2990,
    interval: "monthly",
    description: "For growing teams that need core HR functionality.",
    subscriberCount: 42,
    mrr: 12558,
    color: "hsl(210 90% 55%)",
    status: "active",
    features: {
      employees: 100, adminUsers: 5, departments: 10, locations: 3, storage: "5 GB",
      coreHR: true, recruitment: true, performance: false, payroll: false, attendance: true,
      learning: false, analytics: false, scheduling: true, compliance: false, benefits: false,
      apiAccess: false, ssoSaml: false, customWebhooks: false, thirdPartyIntegrations: true,
      customBranding: false, whiteLabel: false, customDomain: false,
      rbac: true, auditLogs: false, ipWhitelisting: false, dataEncryption: true, mfaEnforcement: false,
      dataRetentionDays: 90,
      supportLevel: "Email", dedicatedCSM: false, slaGuarantee: "48h response", onboarding: "Self-serve docs",
    },
  },
  {
    id: "pkg-professional",
    name: "Professional",
    type: "paid",
    price: 799,
    yearlyPrice: 7990,
    interval: "monthly",
    description: "Full-featured HR suite for mid-size organizations.",
    isPopular: true,
    subscriberCount: 67,
    mrr: 53533,
    color: "hsl(var(--primary))",
    status: "active",
    features: {
      employees: 500, adminUsers: 15, departments: -1, locations: 10, storage: "25 GB",
      coreHR: true, recruitment: true, performance: true, payroll: true, attendance: true,
      learning: true, analytics: true, scheduling: true, compliance: true, benefits: false,
      apiAccess: true, ssoSaml: true, customWebhooks: true, thirdPartyIntegrations: true,
      customBranding: true, whiteLabel: false, customDomain: true,
      rbac: true, auditLogs: true, ipWhitelisting: false, dataEncryption: true, mfaEnforcement: true,
      dataRetentionDays: 365,
      supportLevel: "Priority", dedicatedCSM: false, slaGuarantee: "12h response", onboarding: "Guided setup",
    },
  },
  {
    id: "pkg-enterprise",
    name: "Enterprise",
    type: "paid",
    price: 1999,
    yearlyPrice: 19990,
    interval: "monthly",
    description: "Enterprise-grade HR platform with unlimited scale and dedicated support.",
    subscriberCount: 12,
    mrr: 23988,
    color: "hsl(270 60% 55%)",
    status: "active",
    features: {
      employees: -1, adminUsers: -1, departments: -1, locations: -1, storage: "Unlimited",
      coreHR: true, recruitment: true, performance: true, payroll: true, attendance: true,
      learning: true, analytics: true, scheduling: true, compliance: true, benefits: true,
      apiAccess: true, ssoSaml: true, customWebhooks: true, thirdPartyIntegrations: true,
      customBranding: true, whiteLabel: true, customDomain: true,
      rbac: true, auditLogs: true, ipWhitelisting: true, dataEncryption: true, mfaEnforcement: true,
      dataRetentionDays: -1,
      supportLevel: "24/7 Dedicated", dedicatedCSM: true, slaGuarantee: "1h response", onboarding: "White-glove",
    },
  },
];

// ─── Mock tenant subscriptions ──────────────────────────

export const mockSubscriptions: TenantSubscription[] = [
  {
    id: "sub-001", tenantId: "t-001", tenantName: "Acme Corporation", tenantEmail: "admin@acme.com",
    packageId: "pkg-enterprise", packageName: "Enterprise", status: "active",
    startDate: "2022-03-15", nextBillingDate: "2026-04-15", mrr: 1999, billingCycle: "monthly",
    seats: 1500, usedSeats: 1240, paymentMethod: "invoice", lastPaymentDate: "2026-03-15",
    totalRevenue: 95952, healthScore: 92,
  },
  {
    id: "sub-002", tenantId: "t-002", tenantName: "GlobalTech Solutions", tenantEmail: "hr-admin@globaltech.io",
    packageId: "pkg-professional", packageName: "Professional", status: "active",
    startDate: "2022-09-01", nextBillingDate: "2026-04-01", mrr: 799, billingCycle: "monthly",
    seats: 500, usedSeats: 380, paymentMethod: "card", lastPaymentDate: "2026-03-01",
    totalRevenue: 28764, healthScore: 85,
  },
  {
    id: "sub-003", tenantId: "t-003", tenantName: "StartupXYZ", tenantEmail: "ops@startupxyz.co",
    packageId: "pkg-free", packageName: "Free / Trial", status: "trial",
    startDate: "2026-02-01", nextBillingDate: "2026-04-01", trialEndsAt: "2026-04-01",
    mrr: 0, billingCycle: "monthly", seats: 25, usedSeats: 18, paymentMethod: "card",
    totalRevenue: 0, healthScore: 65,
  },
  {
    id: "sub-004", tenantId: "t-004", tenantName: "MegaFinance Group", tenantEmail: "it-admin@megafinance.ae",
    packageId: "pkg-enterprise", packageName: "Enterprise", status: "active",
    startDate: "2021-07-20", nextBillingDate: "2026-04-20", mrr: 1999, billingCycle: "monthly",
    seats: 2500, usedSeats: 2100, paymentMethod: "invoice", lastPaymentDate: "2026-03-20",
    totalRevenue: 112744, healthScore: 95,
  },
  {
    id: "sub-005", tenantId: "t-005", tenantName: "RetailPro Inc.", tenantEmail: "people@retailpro.com.au",
    packageId: "pkg-professional", packageName: "Professional", status: "active",
    startDate: "2023-01-10", nextBillingDate: "2026-04-10", mrr: 799, billingCycle: "monthly",
    seats: 800, usedSeats: 680, paymentMethod: "card", lastPaymentDate: "2026-03-10",
    totalRevenue: 30362, healthScore: 78,
  },
  {
    id: "sub-006", tenantId: "t-006", tenantName: "HealthFirst Systems", tenantEmail: "cto@healthfirst.in",
    packageId: "pkg-enterprise", packageName: "Enterprise", status: "active",
    startDate: "2020-11-05", nextBillingDate: "2026-04-05", mrr: 1999, billingCycle: "yearly",
    seats: 4000, usedSeats: 3400, paymentMethod: "invoice", lastPaymentDate: "2025-11-05",
    totalRevenue: 127936, healthScore: 98,
  },
  {
    id: "sub-007", tenantId: "t-007", tenantName: "EduLearn Academy", tenantEmail: "admin@edulearn.ca",
    packageId: "pkg-starter", packageName: "Starter", status: "active",
    startDate: "2023-06-15", nextBillingDate: "2026-04-15", mrr: 299, billingCycle: "monthly",
    seats: 200, usedSeats: 120, paymentMethod: "card", lastPaymentDate: "2026-03-15",
    totalRevenue: 9867, healthScore: 72,
  },
  {
    id: "sub-008", tenantId: "t-008", tenantName: "OldMfg Ltd.", tenantEmail: "it@oldmfg.de",
    packageId: "pkg-professional", packageName: "Professional", status: "cancelled",
    startDate: "2022-01-01", nextBillingDate: "2025-12-01", mrr: 0, billingCycle: "monthly",
    seats: 300, usedSeats: 0, paymentMethod: "bank_transfer", lastPaymentDate: "2025-11-01",
    totalRevenue: 37152, healthScore: 0,
  },
  {
    id: "sub-009", tenantId: "t-009", tenantName: "FastGrow Startup", tenantEmail: "finance@fastgrow.io",
    packageId: "pkg-starter", packageName: "Starter", status: "suspended",
    startDate: "2023-09-20", nextBillingDate: "2026-03-20", mrr: 0, billingCycle: "monthly",
    seats: 100, usedSeats: 55, paymentMethod: "card",
    totalRevenue: 7176, healthScore: 15,
  },
];

// ─── MRR trend for charts ───────────────────────────────

export const packageMrrTrend = [
  { month: "Oct", Free: 0, Starter: 8970, Professional: 42800, Enterprise: 19990 },
  { month: "Nov", Free: 0, Starter: 9568, Professional: 45590, Enterprise: 21989 },
  { month: "Dec", Free: 0, Starter: 10465, Professional: 48380, Enterprise: 21989 },
  { month: "Jan", Free: 0, Starter: 11063, Professional: 49579, Enterprise: 23988 },
  { month: "Feb", Free: 0, Starter: 11960, Professional: 51570, Enterprise: 23988 },
  { month: "Mar", Free: 0, Starter: 12558, Professional: 53533, Enterprise: 23988 },
];
