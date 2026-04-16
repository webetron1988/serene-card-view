import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Loader2, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    await supabase.functions.invoke("send-platform-password-reset", { body: { email } });
    setSubmitting(false);
    setSent(true);
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
        {sent ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold">Check your inbox</h2>
            <p className="text-sm text-muted-foreground">If an account exists for <strong>{email}</strong>, we've sent a password reset link.</p>
            <button onClick={() => navigate("/app/admin/login")} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Forgot password?</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter your email and we'll send you a reset link.</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full mt-1.5 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="you@company.com" />
            </div>
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
            </button>
            <button type="button" onClick={() => navigate("/app/admin/login")} className="w-full text-sm text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
