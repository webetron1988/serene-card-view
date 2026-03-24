import { useState } from "react";
import { Save, UserPlus, Shield, Lock, Eye, EyeOff, Key, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function RegistrationSettings() {
  const [form, setForm] = useState({
    frontendRegistrationEnabled: true,
    registrationRequiresApproval: false,
    allowGmailLogin: true,
    allowLinkedinLogin: true,
    captchaEnabled: true,
    captchaProvider: "recaptcha",
    googleClientId: "",
    googleClientSecret: "",
    linkedinClientId: "",
    linkedinClientSecret: "",
    captchaSiteKey: "",
    captchaSecretKey: "",
  });

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const update = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleSecret = (key: string) => setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Registration & Authentication</h3>
        <p className="text-sm text-muted-foreground mt-1">Control user registration, social login providers, OAuth credentials, and CAPTCHA security.</p>
      </div>

      <Card className="border-primary/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/60 to-primary" />
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" strokeWidth={1.5} />
            Frontend Registration
          </CardTitle>
          <CardDescription className="text-xs">Control whether users can self-register from the login page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${form.frontendRegistrationEnabled ? "bg-primary/10" : "bg-muted"}`}>
                <UserPlus className={`h-5 w-5 transition-colors ${form.frontendRegistrationEnabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Allow Frontend Registration</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {form.frontendRegistrationEnabled ? "Users can self-register from the login page" : "Registration is disabled — admin-only invitations"}
                </p>
              </div>
            </div>
            <Switch checked={form.frontendRegistrationEnabled} onCheckedChange={(v) => update("frontendRegistrationEnabled", v)} />
          </div>
          {form.frontendRegistrationEnabled && (
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">Require Admin Approval</p>
                <p className="text-xs text-muted-foreground mt-0.5">New registrations must be approved before access is granted</p>
              </div>
              <Switch checked={form.registrationRequiresApproval} onCheckedChange={(v) => update("registrationRequiresApproval", v)} />
            </div>
          )}
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Registration settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={!form.frontendRegistrationEnabled ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              Social Login Providers
            </CardTitle>
            {!form.frontendRegistrationEnabled && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">Disabled — enable registration first</Badge>
            )}
          </div>
          <CardDescription className="text-xs">Configure OAuth credentials for each social login provider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 16.42 6.5L19.9 3A11.97 11.97 0 0 0 1.24 6.65l4.03 3.11Z"/>
                    <path fill="#34A853" d="M16.04 18.01A7.4 7.4 0 0 1 12 19.1a7.08 7.08 0 0 1-6.72-4.82l-4.04 3.06A11.96 11.96 0 0 0 12 24a11.4 11.4 0 0 0 7.84-3L16.04 18Z"/>
                    <path fill="#4A90D9" d="M19.84 21c2.15-2 3.49-5 3.49-9 0-.71-.1-1.47-.27-2.18H12v4.63h6.44A5.4 5.4 0 0 1 16.04 18l3.8 3Z"/>
                    <path fill="#FBBC05" d="M5.28 14.27a7.12 7.12 0 0 1 0-4.52L1.24 6.65a11.93 11.93 0 0 0 0 10.7l4.04-3.08Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Google (Gmail)</p>
                  <p className="text-[10px] text-muted-foreground">Sign in with Google OAuth 2.0</p>
                </div>
              </div>
              <Switch checked={form.allowGmailLogin} onCheckedChange={(v) => update("allowGmailLogin", v)} />
            </div>
            {form.allowGmailLogin && (
              <div className="space-y-3 ml-[46px]">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    Client ID
                    <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </Label>
                  <Input value={form.googleClientId} onChange={e => update("googleClientId", e.target.value)} placeholder="123456789-abc.apps.googleusercontent.com" className="text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Client Secret</Label>
                  <div className="relative">
                    <Input value={form.googleClientSecret} onChange={e => update("googleClientSecret", e.target.value)} placeholder="GOCSPX-••••••••" className="text-sm font-mono pr-10" type={showSecrets.google ? "text" : "password"} />
                    <button type="button" onClick={() => toggleSecret("google")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showSecrets.google ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-600/10 flex items-center justify-center">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#0A66C2" d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3ZM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75ZM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">LinkedIn</p>
                  <p className="text-[10px] text-muted-foreground">Sign in with LinkedIn OAuth 2.0</p>
                </div>
              </div>
              <Switch checked={form.allowLinkedinLogin} onCheckedChange={(v) => update("allowLinkedinLogin", v)} />
            </div>
            {form.allowLinkedinLogin && (
              <div className="space-y-3 ml-[46px]">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    Client ID
                    <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </Label>
                  <Input value={form.linkedinClientId} onChange={e => update("linkedinClientId", e.target.value)} placeholder="77abc123def456" className="text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Client Secret</Label>
                  <div className="relative">
                    <Input value={form.linkedinClientSecret} onChange={e => update("linkedinClientSecret", e.target.value)} placeholder="AbCdEf123456••••" className="text-sm font-mono pr-10" type={showSecrets.linkedin ? "text" : "password"} />
                    <button type="button" onClick={() => toggleSecret("linkedin")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showSecrets.linkedin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Social login settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save Credentials
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={!form.frontendRegistrationEnabled ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              CAPTCHA Protection
            </CardTitle>
            {!form.frontendRegistrationEnabled && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">Disabled — enable registration first</Badge>
            )}
          </div>
          <CardDescription className="text-xs">Protect login and registration forms from automated abuse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${form.captchaEnabled ? "bg-primary/10" : "bg-muted"}`}>
                <Shield className={`h-5 w-5 transition-colors ${form.captchaEnabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Enable CAPTCHA</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {form.captchaEnabled ? "CAPTCHA is active on login and registration" : "CAPTCHA verification is disabled"}
                </p>
              </div>
            </div>
            <Switch checked={form.captchaEnabled} onCheckedChange={(v) => update("captchaEnabled", v)} />
          </div>
          {form.captchaEnabled && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">CAPTCHA Provider</Label>
                <Select value={form.captchaProvider} onValueChange={v => update("captchaProvider", v)}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recaptcha">Google reCAPTCHA v3</SelectItem>
                    <SelectItem value="hcaptcha">hCaptcha</SelectItem>
                    <SelectItem value="turnstile">Cloudflare Turnstile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-medium">
                    {form.captchaProvider === "recaptcha" ? "Google reCAPTCHA" :
                     form.captchaProvider === "hcaptcha" ? "hCaptcha" : "Cloudflare Turnstile"} Credentials
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Site Key</Label>
                  <Input value={form.captchaSiteKey} onChange={e => update("captchaSiteKey", e.target.value)} placeholder="6LcXXXXXAAAAABBB..." className="text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Secret Key</Label>
                  <div className="relative">
                    <Input value={form.captchaSecretKey} onChange={e => update("captchaSecretKey", e.target.value)} placeholder="6LcXXXXXAAAAACCC..." className="text-sm font-mono pr-10" type={showSecrets.captcha ? "text" : "password"} />
                    <button type="button" onClick={() => toggleSecret("captcha")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showSecrets.captcha ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("CAPTCHA settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
