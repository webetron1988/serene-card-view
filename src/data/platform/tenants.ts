// Registry of all tenants known to the platform.
// Each entry's `code` matches a folder under src/data/tenants/<code>/

export interface TenantRegistryEntry {
  code: string; // URL slug — must match folder name
  name: string;
  plan: "starter" | "growth" | "enterprise";
  status: "active" | "suspended" | "trial";
  createdAt: string;
}

export const tenantRegistry: TenantRegistryEntry[] = [
  { code: "acme", name: "Acme Corporation", plan: "enterprise", status: "active", createdAt: "2025-08-12" },
  { code: "globex", name: "Globex Industries", plan: "growth", status: "active", createdAt: "2025-11-03" },
];

export function getTenantByCode(code: string): TenantRegistryEntry | undefined {
  return tenantRegistry.find((t) => t.code === code);
}
