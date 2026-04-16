import { Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface RequireTenantAccessProps {
  children: React.ReactNode;
}

/**
 * Guards /tenant/:tenantCode/* routes. Verifies that:
 *  1. User is authenticated
 *  2. The tenantCode in the URL maps to a real tenant
 *  3. The user is a member of that tenant (or a platform super_admin)
 */
export function RequireTenantAccess({ children }: RequireTenantAccessProps) {
  const { tenantCode } = useParams<{ tenantCode: string }>();
  const { user, loading: authLoading, hasPlatformRole, isTenantMember } = useAuth();
  const location = useLocation();
  const [tenantId, setTenantId] = useState<string | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    let active = true;
    if (!tenantCode) {
      setTenantId(null);
      return;
    }
    supabase
      .from("tenants")
      .select("id")
      .eq("code", tenantCode)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setTenantId(data?.id ?? null);
      });
    return () => {
      active = false;
    };
  }, [tenantCode]);

  if (authLoading || tenantId === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/tenant/login" state={{ from: location }} replace />;
  }

  if (!tenantId) {
    return <Navigate to="/tenant/login" replace />;
  }

  const allowed = hasPlatformRole("super_admin") || isTenantMember(tenantId);
  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-bold text-foreground">No access to this tenant</h1>
          <p className="text-sm text-muted-foreground">
            Your account is not a member of <span className="font-medium text-foreground">{tenantCode}</span>. Contact your administrator.
          </p>
          <a href="/tenant/login" className="inline-block text-sm text-primary hover:underline">← Back to sign in</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
