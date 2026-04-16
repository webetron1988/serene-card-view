import { useState } from "react";
import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2, Loader2 } from "lucide-react";
import { TenantProvider, useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

function TenantLoginInner() {
  const { tenantCode } = useParams<{ tenantCode: string }>();
  const { branding } = useTenant();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signInWithPassword, signUpWithPassword } = useAuth();

  if (!branding || !tenantCode) {
    return <Navigate to="/tenant" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    setSubmitting(true);
    try {
      const { error } =
        mode === "signin"
          ? await signInWithPassword(email, password)
          : await signUpWithPassword(email, password);
      if (error) {
        toast.error(error.message.includes("Invalid") ? "Invalid email or password" : error.message);
        return;
      }

      // Verify tenant membership before redirecting
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Could not verify session");
        return;
      }
      const { data: tenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("code", tenantCode)
        .maybeSingle();
      if (!tenant) {
        toast.error("Tenant not found");
        return;
      }
      const { data: membership } = await supabase
        .from("tenant_members")
        .select("id")
        .eq("tenant_id", tenant.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!membership) {
        toast.error(`You are not a member of ${branding.displayName}. Contact your administrator.`);
        return;
      }

      toast.success(`Welcome to ${branding.displayName}`);
      navigate(`/tenant/${tenantCode}/dashboard`, { replace: true });
    } finally {
      setSubmitting(false);
    }
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
            <h2 className="text-2xl font-bold text-foreground">
              {mode === "signin" ? "Sign in" : "Create account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{branding.loginSubheadline}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Work email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                {mode === "signin" && (
                  <button type="button" className="text-xs hover:underline" style={{ color: `hsl(var(--tenant-primary))` }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 shadow-sm disabled:opacity-60"
              style={{ background: `hsl(var(--tenant-primary))` }}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  {mode === "signin" ? "Sign in" : "Create account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
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
