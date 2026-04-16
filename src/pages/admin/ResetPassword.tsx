import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Briefcase, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const tokenHash = params.get("token_hash") || "";
  const type = params.get("type") || "recovery";
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tokenHash) { setVerifying(false); return; }
    (async () => {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any });
      if (error) toast.error("Invalid or expired reset link"); else setVerified(true);
      setVerifying(false);
    })();
  }, [tokenHash, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    navigate("/app/admin/login");
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
        {verifying ? (
          <div className="py-12 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></div>
        ) : !verified ? (
          <div className="text-center py-6">
            <p className="text-destructive font-medium">This reset link is invalid or expired.</p>
            <button onClick={() => navigate("/app/admin/login")} className="mt-4 text-sm text-primary hover:underline">Back to login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">Set a new password</h2>
            <div>
              <label className="text-sm font-medium">New password</label>
              <div className="relative mt-1.5">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  className="w-full px-3 py-2.5 pr-10 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Confirm password</label>
              <input type={showPw ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className="w-full mt-1.5 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
