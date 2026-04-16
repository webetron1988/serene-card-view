import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Briefcase, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{ email: string; first_name: string; last_name: string; role_label: string } | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (!token) { setError("Missing invitation token"); setLoading(false); return; }
    (async () => {
      const { data, error } = await supabase.functions.invoke("accept-platform-invitation", {
        body: { action: "lookup", token },
      });
      if (error || (data as any)?.error) {
        setError((data as any)?.error || error?.message || "Invalid invitation");
      } else {
        setInfo(data as any);
      }
      setLoading(false);
    })();
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("accept-platform-invitation", {
      body: { action: "accept", token, password },
    });
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Failed to accept invitation");
      setSubmitting(false); return;
    }
    // Sign in and go to dashboard
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: (data as any).email, password,
    });
    if (signInErr) { toast.error("Account created. Please sign in."); navigate("/app/admin/login"); return; }
    toast.success("Welcome aboard!");
    navigate("/app/admin/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold">AchievHR</h1>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-destructive font-medium">{error}</p>
            <button onClick={() => navigate("/app/admin/login")} className="mt-4 text-sm text-primary hover:underline">Go to login</button>
          </div>
        ) : info ? (
          <form onSubmit={handleAccept} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Welcome, {info.first_name}!</h2>
              <p className="text-sm text-muted-foreground mt-1">You're invited as <strong>{info.role_label}</strong>. Set a password to activate your account.</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
              Email: <strong className="text-foreground">{info.email}</strong>
            </div>
            <div>
              <label className="text-sm font-medium">New password</label>
              <div className="relative mt-1.5">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  className="w-full px-3 py-2.5 pr-10 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="At least 8 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Confirm password</label>
              <input type={showPw ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className="w-full mt-1.5 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Re-enter password" />
            </div>
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Activate account</>}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
