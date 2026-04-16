import { Outlet, useParams, Navigate } from "react-router-dom";
import { TenantProvider, useTenant } from "@/contexts/TenantContext";
import { TenantSidebar } from "./TenantSidebar";
import { Header } from "./Header";

function TenantShellInner() {
  const { branding } = useTenant();
  if (!branding) {
    // Unknown tenant code → bounce to picker
    return <Navigate to="/tenant" replace />;
  }
  return (
    <div className="flex min-h-screen bg-background">
      <TenantSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto page-enter">
            <Outlet />
          </div>
        </main>
        <footer className="px-6 py-3 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground/60 text-center tracking-wide">
            {branding.displayName} · Powered by AchievHR
          </p>
        </footer>
      </div>
    </div>
  );
}

export function TenantShell() {
  return (
    <TenantProvider>
      <TenantShellInner />
    </TenantProvider>
  );
}
