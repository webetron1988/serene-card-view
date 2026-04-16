import { useEffect, useState } from "react";
import { Save, Send, Server, CheckCircle2, XCircle, ShieldCheck, ShieldX, TestTube, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { usePlatformSetting, type SmtpSettings } from "@/hooks/usePlatformSettings";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_SMTP: SmtpSettings = {
  enabled: false,
  host: "",
  port: 587,
  user: "",
  password: "",
  secure: true,
  from_name: "",
  from_email: "",
  reply_to: "",
  verified_at: null,
};

export default function EmailSettings() {
  const { value, loading, save, reload } = usePlatformSetting<SmtpSettings>("email_smtp");
  const [smtp, setSmtp] = useState<SmtpSettings>(DEFAULT_SMTP);
  const [testEmail, setTestEmail] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (value) setSmtp({ ...DEFAULT_SMTP, ...value });
  }, [value]);

  const set = <K extends keyof SmtpSettings>(field: K, v: SmtpSettings[K]) => {
    setSmtp(s => {
      const next = { ...s, [field]: v };
      // Invalidate verification when credentials change
      if (["host", "port", "user", "password", "secure"].includes(field as string)) {
        next.verified_at = null;
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await save(smtp);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("SMTP configuration saved");
  };

  const handleTest = async () => {
    if (!testEmail) { toast.error("Enter an email address to receive the test"); return; }
    if (!smtp.host || !smtp.user || !smtp.password) { toast.error("Fill SMTP host, user and password first"); return; }
    setTestStatus("testing");
    // Save current config first so the edge function reads it from DB
    const { error: saveErr } = await save(smtp);
    if (saveErr) { setTestStatus("error"); toast.error(saveErr.message); return; }
    const { data, error } = await supabase.functions.invoke("test-platform-smtp", {
      body: { recipient_email: testEmail, smtp_config: smtp, save: true },
    });
    const payload = (data as any) || {};
    if (error || payload.error) {
      setTestStatus("error");
      toast.error(payload.error || error?.message || "SMTP test failed");
      setTimeout(() => setTestStatus("idle"), 4000);
      return;
    }
    setTestStatus("success");
    toast.success("Test email sent. SMTP verified.");
    await reload();
    setTimeout(() => setTestStatus("idle"), 4000);
  };

  const verified = !!smtp.verified_at;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Email & SMTP</h3>
        <p className="text-sm text-muted-foreground mt-1">Configure the SMTP server used to deliver platform emails (invitations, password resets, notifications).</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
      ) : (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Server className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  Platform SMTP Configuration
                </CardTitle>
                <CardDescription className="text-xs mt-1">Used for all outbound platform emails sent via Nodemailer.</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {smtp.enabled && (
                  verified ? (
                    <Badge className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1">
                      <ShieldCheck className="w-3 h-3" strokeWidth={2} />Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-red-600 bg-red-50 border-red-200 gap-1">
                      <ShieldX className="w-3 h-3" strokeWidth={2} />Unverified
                    </Badge>
                  )
                )}
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Enable SMTP</Label>
                  <Switch checked={smtp.enabled} onCheckedChange={(v) => set("enabled", v)} />
                </div>
              </div>
            </div>
          </CardHeader>

          {!smtp.enabled ? (
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground">SMTP is disabled. No platform emails will be delivered until enabled and verified.</p>
              </div>
              <div className="flex justify-end mt-4">
                <Button size="sm" onClick={handleSave} disabled={saving} className="text-xs">
                  {saving ? <Loader2 className="w-3.5 h-3.5 me-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />}Save
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="space-y-4">
              {verified ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-xs text-emerald-700">
                    Verified on {new Date(smtp.verified_at!).toLocaleString()}. Platform emails are active.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-xs text-amber-700">SMTP not verified. Send a test email below to verify.</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs">SMTP Host</Label>
                  <Input value={smtp.host} onChange={(e) => set("host", e.target.value)} className="text-sm" placeholder="smtp.sendgrid.net" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Port</Label>
                  <Input type="number" value={smtp.port} onChange={(e) => set("port", Number(e.target.value) || 587)} className="text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Username</Label>
                  <Input value={smtp.user} onChange={(e) => set("user", e.target.value)} className="text-sm" placeholder="apikey or user@..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Password / API Key</Label>
                  <Input type="password" value={smtp.password} onChange={(e) => set("password", e.target.value)} className="text-sm" placeholder="••••••••" />
                </div>
              </div>
              <div className="space-y-1.5 w-48">
                <Label className="text-xs">Encryption</Label>
                <Select
                  value={smtp.secure ? (smtp.port === 465 ? "ssl" : "tls") : "none"}
                  onValueChange={(v) => {
                    if (v === "ssl") { set("secure", true); set("port", 465); }
                    else if (v === "tls") { set("secure", true); set("port", 587); }
                    else { set("secure", false); }
                  }}
                >
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tls">TLS / STARTTLS (Port 587)</SelectItem>
                    <SelectItem value="ssl">SSL (Port 465)</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">From Name</Label>
                  <Input value={smtp.from_name} onChange={(e) => set("from_name", e.target.value)} className="text-sm" placeholder="AchievHR" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">From Email</Label>
                  <Input value={smtp.from_email} onChange={(e) => set("from_email", e.target.value)} className="text-sm" placeholder="noreply@yourdomain.com" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Reply-To</Label>
                  <Input value={smtp.reply_to} onChange={(e) => set("reply_to", e.target.value)} className="text-sm" placeholder="support@yourdomain.com" />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="text-xs font-medium">Test SMTP Connection</Label>
                <div className="flex gap-2">
                  <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="Enter email to receive test" className="text-sm flex-1" type="email" />
                  <Button size="sm" variant="outline" onClick={handleTest} disabled={testStatus === "testing"} className="text-xs min-w-[150px]">
                    {testStatus === "testing" ? <><TestTube className="w-3.5 h-3.5 mr-1.5 animate-pulse" strokeWidth={1.5} />Sending...</> :
                     testStatus === "success" ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" strokeWidth={1.5} />Sent!</> :
                     testStatus === "error" ? <><XCircle className="w-3.5 h-3.5 mr-1.5 text-destructive" strokeWidth={1.5} />Failed</> :
                     <><Send className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Send Test Email</>}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">Test sends save your config first, then attempt a real SMTP delivery. On success, the configuration is marked verified.</p>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSave} disabled={saving} className="text-xs">
                  {saving ? <Loader2 className="w-3.5 h-3.5 me-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
