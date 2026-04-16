import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type AppRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: React.ReactNode;
  /** Redirect target if not authenticated */
  redirectTo?: string;
  /** Required platform-level role(s). User needs ANY of these. */
  requirePlatformRole?: AppRole[];
}

export function RequireAuth({ children, redirectTo = "/admin/login", requirePlatformRole }: RequireAuthProps) {
  const { user, loading, hasPlatformRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requirePlatformRole && requirePlatformRole.length > 0) {
    const ok = requirePlatformRole.some((r) => hasPlatformRole(r));
    if (!ok) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md text-center space-y-3">
            <h1 className="text-2xl font-bold text-foreground">Access denied</h1>
            <p className="text-sm text-muted-foreground">
              Your account does not have permission to view this area. Contact your administrator if you believe this is an error.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
