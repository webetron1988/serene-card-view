import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Permission engine — client-side cache of:
 *  - permissions catalog (key → { category, label, is_destructive, ... })
 *  - effective grants for the current user (union of all role_permissions)
 *  - explicit denies (override grants for destructive keys)
 *
 * super_admin (platform) always returns true.
 */

export interface PermissionDef {
  key: string;
  category: string;
  label: string;
  description: string | null;
  is_destructive: boolean;
  tier_scope: "platform" | "tenant" | "both";
  sort_order: number;
}

interface PermissionsState {
  loading: boolean;
  catalog: PermissionDef[];
  grantedKeys: Set<string>;
  deniedKeys: Set<string>;
}

let cache: PermissionsState | null = null;
let cacheUserId: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function loadPermissions(userId: string, roles: { role: string }[]) {
  const roleRefs = Array.from(new Set(roles.map((r) => r.role)));

  const [{ data: catalog }, { data: grants }, { data: denies }] = await Promise.all([
    supabase
      .from("permissions")
      .select("key, category, label, description, is_destructive, tier_scope, sort_order")
      .order("sort_order"),
    roleRefs.length === 0
      ? Promise.resolve({ data: [] as { permission_key: string }[] })
      : supabase
          .from("role_permissions")
          .select("permission_key")
          .eq("role_kind", "system")
          .in("role_ref", roleRefs),
    roleRefs.length === 0
      ? Promise.resolve({ data: [] as { permission_key: string }[] })
      : supabase
          .from("role_permission_denies")
          .select("permission_key")
          .eq("role_kind", "system")
          .in("role_ref", roleRefs),
  ]);

  cache = {
    loading: false,
    catalog: (catalog ?? []) as PermissionDef[],
    grantedKeys: new Set((grants ?? []).map((g: any) => g.permission_key)),
    deniedKeys: new Set((denies ?? []).map((d: any) => d.permission_key)),
  };
  cacheUserId = userId;
  notify();
}

export function usePermissions() {
  const { user, roles, loading: authLoading } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      cache = { loading: false, catalog: [], grantedKeys: new Set(), deniedKeys: new Set() };
      cacheUserId = null;
      notify();
      return;
    }
    if (cacheUserId !== user.id) {
      cache = { loading: true, catalog: [], grantedKeys: new Set(), deniedKeys: new Set() };
      notify();
      loadPermissions(user.id, roles);
    }
  }, [user, roles, authLoading]);

  const isSuperAdmin = useMemo(
    () => roles.some((r) => r.role === "super_admin" && r.tenant_id === null),
    [roles]
  );

  const can = useCallback(
    (key: string): boolean => {
      if (!user) return false;
      if (isSuperAdmin) return true;
      const c = cache;
      if (!c || c.loading) return false;
      if (c.deniedKeys.has(key)) return false;
      return c.grantedKeys.has(key);
    },
    [user, isSuperAdmin]
  );

  const canAny = useCallback((keys: string[]) => keys.some(can), [can]);
  const canAll = useCallback((keys: string[]) => keys.every(can), [can]);

  const refresh = useCallback(async () => {
    if (user) await loadPermissions(user.id, roles);
  }, [user, roles]);

  return {
    loading: authLoading || (cache?.loading ?? true),
    catalog: cache?.catalog ?? [],
    can,
    canAny,
    canAll,
    isSuperAdmin,
    refresh,
  };
}

/** Convenience hook for a single key. */
export function usePermission(key: string): boolean {
  const { can } = usePermissions();
  return can(key);
}