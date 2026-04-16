// Mock users for tenant "globex"
import type { TenantUser } from "../types";

export const globexUsers: TenantUser[] = [
  {
    id: "globex_u_001",
    tenantCode: "globex",
    email: "olivia.bennett@globex.co.uk",
    password: "password",
    name: "Olivia Bennett",
    roles: ["super_admin"],
    avatarInitials: "OB",
  },
];
