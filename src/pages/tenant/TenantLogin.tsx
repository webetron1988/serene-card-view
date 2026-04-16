import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, Briefcase, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Generic platform tenant login.
 *
 * Flow:
 *  1. User enters email + password
 *  2. We sign them in via Supabase Auth
 *  3. We resolve their tenant via tenant_members (one tenant per user — enforced by DB)
 *  4. We redirect to /tenant/<tenant-code>/dashboard
 *
 * TODO (Phase: Custom Domains):
 *   When a tenant has a verified custom_domain, visitors hitting that domain should
 *   see the tenant's branded login instead of this generic page. Detection will be
 *   `getTenantByDomain(window.location.hostname)` at app boot.
 */
export default function TenantLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signInWithPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await signInWithPassword(email, password);
      if (error) {
        toast.error(error.message.includes("Invalid") ? "Invalid email or password" : error.message);
        return;
      }

      // Resolve tenant for this user (one tenant per user, enforced by unique constraint)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Could not establish session");
        return;
      }

      const { data: membership, error: memberErr } = await supabase
        .from("tenant_members")
        .select("tenant_id, tenants!inner(code, name)")
        .eq("user_id", user.id)
        .maybeSingle();

      if (memberErr) {
        toast.error("Failed to resolve tenant");
        return;
      }

      if (!membership) {
        await supabase.auth.signOut();
        toast.error("Your account is not assigned to any tenant. Contact your administrator.");
        return;
      }

      const tenantCode = (membership.tenants as { code: string }).code;
      const tenantName = (membership.tenants as { name: string }).name;
      toast.success(`Welcome to ${tenantName}`);
      navigate(`/tenant/${tenantCode}/dashboard`, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — generic AchievHR branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/90 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AchievHR</h1>
            <p className="text-xs text-white/60">Tenant Workspace</p>
          </div>
        </div>

        <div className="relative space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-3">
              Sign in to your<br />organization
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Access your company's HR workspace. We'll route you to the right place based on your account.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Employee Self-Service", "Org Hierarchy", "AI-Assisted", "Secure"].map((f) => (
              <span key={f} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs rounded-full border border-white/10">
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          Powered by AchievHR · Enterprise Talent Platform
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">AchievHR</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your work email to access your tenant workspace
            </p>
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
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Protected by MFA · Powered by <span className="font-medium text-foreground">AchievHR</span>
            </p>
            <Link to="/app/admin/login" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
              <Briefcase className="w-3 h-3" />
              Platform admin? Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
