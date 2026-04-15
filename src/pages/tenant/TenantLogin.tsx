import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function TenantLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — tenant branding (will be dynamic per entity) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        {/* Tenant Logo (dynamic) */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Your Company</h1>
            <p className="text-xs text-white/60">Powered by AchievHR</p>
          </div>
        </div>

        <div className="relative space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-3">
              Welcome to Your<br />Talent Platform
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Access your HR tools, manage your career development, and stay connected with your organization.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Self-Service", "Career Growth", "AI-Powered", "Secure"].map(f => (
              <span key={f} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs rounded-full border border-white/10">
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          © 2026 AchievHR · Enterprise Talent Platform
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Your Company</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">Access your talent management portal</p>
          </div>

          {/* SSO */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google SSO
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0078d4"><path d="M11.4 24H0V12.6L11.4 24zM12.6 24H24V12.6L12.6 24zM0 11.4V0h11.4L0 11.4zM12.6 0H24v11.4L12.6 0z"/></svg>
              Microsoft SSO
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); navigate("/tenant/dashboard"); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Work email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50"
                  placeholder="you@yourcompany.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs text-emerald-600 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="tenant-remember" className="w-4 h-4 rounded border-border text-emerald-600" defaultChecked />
              <label htmlFor="tenant-remember" className="text-sm text-muted-foreground">Keep me signed in</label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Protected by MFA · Powered by <span className="font-medium text-foreground">AchievHR</span>
          </p>
        </div>
      </div>
    </div>
  );
}
