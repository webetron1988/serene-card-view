import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { getTenantBranding, type TenantBranding } from "@/data/tenants";

interface TenantContextValue {
  tenantCode: string;
  branding: TenantBranding | undefined;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { tenantCode = "" } = useParams<{ tenantCode: string }>();
  const branding = getTenantBranding(tenantCode);

  // Inject tenant theme as CSS variables scoped to <html data-tenant>
  useEffect(() => {
    if (!branding) return;
    const root = document.documentElement;
    const t = branding.theme;
    root.style.setProperty("--tenant-primary", t.primary);
    root.style.setProperty("--tenant-primary-foreground", t.primaryForeground);
    root.style.setProperty("--tenant-accent", t.accent);
    root.style.setProperty("--tenant-gradient-from", t.gradientFrom);
    root.style.setProperty("--tenant-gradient-via", t.gradientVia);
    root.style.setProperty("--tenant-gradient-to", t.gradientTo);
    root.setAttribute("dir", branding.direction);
    root.setAttribute("data-tenant", branding.tenantCode);

    return () => {
      root.style.removeProperty("--tenant-primary");
      root.style.removeProperty("--tenant-primary-foreground");
      root.style.removeProperty("--tenant-accent");
      root.style.removeProperty("--tenant-gradient-from");
      root.style.removeProperty("--tenant-gradient-via");
      root.style.removeProperty("--tenant-gradient-to");
      root.removeAttribute("dir");
      root.removeAttribute("data-tenant");
    };
  }, [branding]);

  const value = useMemo(() => ({ tenantCode, branding }), [tenantCode, branding]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
