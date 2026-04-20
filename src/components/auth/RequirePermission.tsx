import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Loader2, Lock } from "lucide-react";

interface RequirePermissionProps {
  /** Single permission key. User must have it. */
  permission?: string;
  /** User must have ANY of these. */
  anyOf?: string[];
  /** User must have ALL of these. */
  allOf?: string[];
  /** What to render when permitted. */
  children: ReactNode;
  /** Optional custom fallback when blocked. Defaults to a 403 panel. */
  fallback?: ReactNode;
  /** Render nothing instead of the 403 panel when blocked. */
  silent?: boolean;
}

export function RequirePermission({
  permission,
  anyOf,
  allOf,
  children,
  fallback,
  silent,
}: RequirePermissionProps) {
  const { loading, can, canAny, canAll } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  let allowed = true;
  if (permission) allowed = allowed && can(permission);
  if (anyOf && anyOf.length > 0) allowed = allowed && canAny(anyOf);
  if (allOf && allOf.length > 0) allowed = allowed && canAll(allOf);

  if (!allowed) {
    if (silent) return null;
    if (fallback !== undefined) return <>{fallback}</>;
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="text-base font-semibold text-foreground">Access restricted</h2>
          <p className="text-sm text-muted-foreground">
            You do not have permission to view this area. Contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/** Inline gate — renders children only when permitted, nothing otherwise. */
export function PermissionGate({
  permission,
  anyOf,
  allOf,
  children,
  fallback = null,
}: Omit<RequirePermissionProps, "silent">) {
  const { can, canAny, canAll, loading } = usePermissions();
  if (loading) return null;

  let allowed = true;
  if (permission) allowed = allowed && can(permission);
  if (anyOf && anyOf.length > 0) allowed = allowed && canAny(anyOf);
  if (allOf && allOf.length > 0) allowed = allowed && canAll(allOf);

  return <>{allowed ? children : fallback}</>;
}