// Central loader: tenant code → branding & users
// Add new tenants here when their folder is created.

import { acmeBranding } from "./acme/branding";
import { acmeUsers } from "./acme/auth";
import { globexBranding } from "./globex/branding";
import { globexUsers } from "./globex/auth";
import type { TenantBranding, TenantUser } from "./types";

const brandingMap: Record<string, TenantBranding> = {
  acme: acmeBranding,
  globex: globexBranding,
};

const usersMap: Record<string, TenantUser[]> = {
  acme: acmeUsers,
  globex: globexUsers,
};

export function getTenantBranding(code: string): TenantBranding | undefined {
  return brandingMap[code];
}

export function getTenantUsers(code: string): TenantUser[] {
  return usersMap[code] ?? [];
}

export function listAvailableTenantCodes(): string[] {
  return Object.keys(brandingMap);
}

export type { TenantBranding, TenantUser, TenantRole } from "./types";
