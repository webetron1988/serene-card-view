import { Link } from "react-router-dom";
import { Building2, ArrowRight, Briefcase } from "lucide-react";
import { tenantRegistry } from "@/data/platform/tenants";
import { getTenantBranding } from "@/data/tenants";

export default function TenantPicker() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AchievHR</h1>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Select your tenant</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Choose your organization to continue. In production, your tenant is identified by your custom domain or invite link.
          </p>
        </div>

        <div className="grid gap-3">
          {tenantRegistry.map((t) => {
            const branding = getTenantBranding(t.code);
            return (
              <Link
                key={t.code}
                to={`/tenant/${t.code}/login`}
                className="group flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: branding ? `hsl(${branding.theme.primary})` : "hsl(var(--primary))" }}
                >
                  {branding?.logoText ?? t.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{t.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                      {t.plan}
                    </span>
                    {t.status === "active" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    /tenant/{t.code} · {branding?.locale ?? "—"}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>

        <div className="border-t border-border/50 pt-6 text-center space-y-2">
          <p className="text-xs text-muted-foreground">Are you a platform administrator?</p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Building2 className="w-4 h-4" />
            Go to platform admin login
          </Link>
        </div>
      </div>
    </div>
  );
}
