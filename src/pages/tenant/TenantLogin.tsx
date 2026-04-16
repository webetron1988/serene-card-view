import { useState } from "react";
import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2 } from "lucide-react";
import { TenantProvider, useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { getTenantUsers } from "@/data/tenants";

function TenantLoginInner() {
  const { tenantCode } = useParams<{ tenantCode: string }>();
  const { branding } = useTenant();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (!branding || !tenantCode) {
    return <Navigate to="/tenant" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getTenantUsers(tenantCode);
    const match = users.find((u) => u.email === email && u.password === password);
    if (!match && (email || password)) {
      // Accept any non-empty for demo, but show hint
      toast.message("Mock login", { description: "Any email/password works in demo mode." });
    }
    navigate(`/tenant/${tenantCode}/dashboard`);
  };

  const gradientStyle = {
    background: `linear-gradient(135deg, hsl(var(--tenant-gradient-from)), hsl(var(--tenant-gradient-via)), hsl(var(--tenant-gradient-to)))`,
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — tenant branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12" style={gradientStyle}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          style={{ background: `hsl(var(--tenant-primary) / 0.25)` }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"
          style={{ background: `hsl(var(--tenant-accent) / 0.2)` }} />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-sm font-bold">
            {branding.logoText}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{branding.displayName}</h1>
            <p className="text-xs text-white/60">Powered by AchievHR</p>
          </div>
        </div>

        <div className="relative space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-3">
              {branding.loginHeadline}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              {branding.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {branding.features.map((f) => (
              <span key={f} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs rounded-full border border-white/10">
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          {branding.locale} · {branding.timezone}
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ background: `hsl(var(--tenant-primary))` }}>
              {branding.logoText}
            </div>
            <h1 className="text-lg font-bold text-foreground">{branding.displayName}</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">{branding.loginSubheadline}</p>
          </div>

          {/* SSO */}
          {branding.ssoProviders.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {branding.ssoProviders.includes("google") && (
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google SSO
                  </button>
                )}
                {branding.ssoProviders.includes("microsoft") && (
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0078d4"><path d="M11.4 24H0V12.6L11.4 24zM12.6 24H24V12.6L12.6 24zM0 11.4V0h11.4L0 11.4zM12.6 0H24v11.4L12.6 0z"/></svg>
                    Microsoft SSO
                  </button>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">or continue with email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Work email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs hover:underline" style={{ color: `hsl(var(--tenant-primary))` }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 shadow-sm"
              style={{ background: `hsl(var(--tenant-primary))` }}
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Protected by MFA · Powered by <span className="font-medium text-foreground">AchievHR</span>
            </p>
            <Link to="/tenant" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
              <Building2 className="w-3 h-3" />
              Switch tenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TenantLogin() {
  return (
    <TenantProvider>
      <TenantLoginInner />
    </TenantProvider>
  );
}
