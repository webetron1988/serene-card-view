// Mock users for tenant "acme"
import type { TenantUser } from "../types";

export const acmeUsers: TenantUser[] = [
  {
    id: "acme_u_001",
    tenantCode: "acme",
    email: "sarah.chen@acme.com",
    password: "password",
    name: "Sarah Chen",
    roles: ["hr_admin", "employee"],
    avatarInitials: "SC",
  },
  {
    id: "acme_u_002",
    tenantCode: "acme",
    email: "john.doe@acme.com",
    password: "password",
    name: "John Doe",
    roles: ["employee"],
    avatarInitials: "JD",
  },
];
