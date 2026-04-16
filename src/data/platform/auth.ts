// Platform-admin mock auth data
// Used by /admin/login until Lovable Cloud auth is wired in Phase 2.

export interface PlatformUser {
  id: string;
  email: string;
  password: string; // mock only — never store passwords in real code
  name: string;
  role: "super_admin" | "admin" | "consultant";
  avatarInitials: string;
}

export const platformUsers: PlatformUser[] = [
  {
    id: "pu_001",
    email: "admin@achievhr.com",
    password: "password",
    name: "Admin User",
    role: "super_admin",
    avatarInitials: "A",
  },
  {
    id: "pu_002",
    email: "ops@achievhr.com",
    password: "password",
    name: "Platform Ops",
    role: "admin",
    avatarInitials: "PO",
  },
];
