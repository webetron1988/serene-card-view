import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type PermissionRow = Database["public"]["Tables"]["permissions"]["Row"];
export type PlatformCustomRole = Database["public"]["Tables"]["platform_custom_roles"]["Row"];
export type RoleKind = Database["public"]["Enums"]["role_kind"];

export interface RolePermissionGrant {
  role_kind: RoleKind;
  role_ref: string;
  permission_key: string;
}

export interface RolesData {
  permissions: PermissionRow[];
  platformCustomRoles: PlatformCustomRole[];
  grants: RolePermissionGrant[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRolesData(): RolesData {
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [platformCustomRoles, setPlatformCustomRoles] = useState<PlatformCustomRole[]>([]);
  const [grants, setGrants] = useState<RolePermissionGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [permsRes, rolesRes, grantsRes] = await Promise.all([
        supabase.from("permissions").select("*").order("sort_order", { ascending: true }),
        supabase.from("platform_custom_roles").select("*").order("created_at", { ascending: true }),
        supabase.from("role_permissions").select("role_kind, role_ref, permission_key"),
      ]);
      if (permsRes.error) throw permsRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (grantsRes.error) throw grantsRes.error;
      setPermissions(permsRes.data ?? []);
      setPlatformCustomRoles(rolesRes.data ?? []);
      setGrants(grantsRes.data ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load roles data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { permissions, platformCustomRoles, grants, loading, error, refresh };
}

/** Compute grant key */
export const grantKey = (kind: RoleKind, ref: string, permKey: string) =>
  `${kind}::${ref}::${permKey}`;
