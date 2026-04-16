import { useState } from "react";
import { Save, Send, Server, CheckCircle2, XCircle, ShieldCheck, ShieldX, TestTube } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function EmailSettings() {
  const [smtpEnabled, setSmtpEnabled] = useState(true);
  const [smtpVerified, setSmtpVerified] = useState(true);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testEmail, setTestEmail] = useState("");
  const [smtp, setSmtp] = useState({
    host: "smtp.sendgrid.net",
    port: "587",
    user: "apikey",
    password: "SG.••••••••••••",
    secure: true,
    fromName: "AchievHR Platform",
    fromEmail: "noreply@achievhr.com",
    replyTo: "support@achievhr.com",
  });

  const handleFieldChange = (field: string, value: string | boolean) => {
    setSmtp(s => ({ ...s, [field]: value }));
    if (["host", "port", "user", "password"].includes(field)) setSmtpVerified(false);
  };

  const handleTestEmail = () => {
    if (!testEmail) { toast.error("Please enter a test email address"); return; }
    if (!smtp.host || !smtp.user || !smtp.password) { toast.error("Please fill in SMTP credentials first"); return; }
    setTestStatus("testing");
    setTimeout(() => {
      setTestStatus("success");
      setSmtpVerified(true);
      toast.success("Test email sent! SMTP verified.");
      setTimeout(() => setTestStatus("idle"), 5000);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Email & SMTP</h3>
        <p className="text-sm text-muted-foreground mt-1">Configure the platform's default email delivery server. Notification templates are managed under Notifications.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Platform SMTP Configuration
              </CardTitle>
              <CardDescription className="text-xs mt-1">Configure the default email delivery service for all tenants.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {smtpEnabled && (
                smtpVerified ? (
                  <Badge className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1">
                    <ShieldCheck className="w-3 h-3" strokeWidth={2} />Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-red-600 bg-red-50 border-red-200 gap-1">
                    <ShieldX className="w-3 h-3" strokeWidth={2} />Unverified
                  </Badge>
                )
              )}
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Enable SMTP</Label>
                <Switch checked={smtpEnabled} onCheckedChange={setSmtpEnabled} />
              </div>
            </div>
          </div>
        </CardHeader>

        {!smtpEnabled && (
          <CardContent>
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
              <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
              <p className="text-xs text-muted-foreground">Platform SMTP is disabled. No emails will be sent until SMTP is configured and verified.</p>
            </div>
          </CardContent>
        )}

        {smtpEnabled && (
          <CardContent className="space-y-4">
            {smtpVerified ? (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-emerald-700">SMTP verified and active. This relay is used as the default for all tenants without custom SMTP.</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-red-700">SMTP not verified. Configure credentials and send a test email to activate.</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs">SMTP Host</Label>
                <Input value={smtp.host} onChange={(e) => handleFieldChange("host", e.target.value)} className="text-sm" placeholder="smtp.sendgrid.net" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Port</Label>
                <Input value={smtp.port} onChange={(e) => handleFieldChange("port", e.target.value)} className="text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Username</Label>
                <Input value={smtp.user} onChange={(e) => handleFieldChange("user", e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Password / API Key</Label>
                <Input type="password" value={smtp.password} onChange={(e) => handleFieldChange("password", e.target.value)} className="text-sm" />
              </div>
            </div>
            <div className="space-y-1.5 w-48">
              <Label className="text-xs">Encryption</Label>
              <Select
                value={smtp.secure ? (smtp.port === "465" ? "ssl" : "tls") : "none"}
                onValueChange={(v) => {
                  handleFieldChange("secure", v !== "none");
                  if (v === "ssl") handleFieldChange("port", "465");
                  else if (v === "tls") handleFieldChange("port", "587");
                }}
              >
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tls">TLS/STARTTLS (Port 587)</SelectItem>
                  <SelectItem value="ssl">SSL (Port 465)</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">From Name</Label>
                <Input value={smtp.fromName} onChange={(e) => handleFieldChange("fromName", e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">From Email</Label>
                <Input value={smtp.fromEmail} onChange={(e) => handleFieldChange("fromEmail", e.target.value)} className="text-sm" placeholder="noreply@yourplatform.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Reply-To</Label>
                <Input value={smtp.replyTo} onChange={(e) => handleFieldChange("replyTo", e.target.value)} className="text-sm" placeholder="support@yourplatform.com" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label className="text-xs font-medium">Test SMTP Connection</Label>
              <div className="flex gap-2">
                <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="Enter email to receive test" className="text-sm flex-1" type="email" />
                <Button size="sm" variant="outline" onClick={handleTestEmail} disabled={testStatus === "testing"} className="text-xs min-w-[140px]">
                  {testStatus === "testing" ? <><TestTube className="w-3.5 h-3.5 mr-1.5 animate-pulse" strokeWidth={1.5} />Sending...</> :
                   testStatus === "success" ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" strokeWidth={1.5} />Sent!</> :
                   testStatus === "error" ? <><XCircle className="w-3.5 h-3.5 mr-1.5 text-destructive" strokeWidth={1.5} />Failed</> :
                   <><Send className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Send Test Email</>}
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => toast.success("Platform SMTP configuration saved")} className="text-xs">
                <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}