import { useState } from "react";
import { Save, Shield, Fingerprint, Globe, Timer, Lock, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  const [twoFaEnforced, setTwoFaEnforced] = useState(true);
  const [twoFaMethod, setTwoFaMethod] = useState("totp");
  const [ipAllowlist, setIpAllowlist] = useState(["192.168.1.0/24", "10.0.0.0/8"]);
  const [newIp, setNewIp] = useState("");
  const [rateLimit, setRateLimit] = useState({ requests: "1000", window: "60", loginAttempts: "5", lockoutMinutes: "30" });
  const [sessionTimeout, setSessionTimeout] = useState("480");
  const [passwordPolicy, setPasswordPolicy] = useState({ minLength: "12", requireUppercase: true, requireNumbers: true, requireSpecial: true, preventReuse: "5" });
  const [corsOrigins, setCorsOrigins] = useState("https://app.talenthub.com, https://admin.talenthub.com");

  const addIp = () => {
    if (newIp && !ipAllowlist.includes(newIp)) {
      setIpAllowlist([...ipAllowlist, newIp]);
      setNewIp("");
      toast.success("IP added to allowlist");
    }
  };

  const removeIp = (ip: string) => {
    setIpAllowlist(ipAllowlist.filter(i => i !== ip));
    toast.success("IP removed from allowlist");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Security</h3>
        <p className="text-sm text-muted-foreground mt-1">Configure authentication, access control, and security policies.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-xs">Require 2FA for admin and tenant users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enforce 2FA for Admins</p>
              <p className="text-xs text-muted-foreground mt-0.5">All platform administrators must use two-factor authentication.</p>
            </div>
            <Switch checked={twoFaEnforced} onCheckedChange={setTwoFaEnforced} />
          </div>
          <Separator />
          <div className="space-y-1.5">
            <Label className="text-xs">Preferred 2FA Method</Label>
            <Select value={twoFaMethod} onValueChange={setTwoFaMethod}>
              <SelectTrigger className="text-sm w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="totp">Authenticator App (TOTP)</SelectItem>
                <SelectItem value="sms">SMS Verification</SelectItem>
                <SelectItem value="email">Email Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("2FA settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Password Policy
          </CardTitle>
          <CardDescription className="text-xs">Set password requirements for all platform users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Minimum Length</Label>
              <Input type="number" value={passwordPolicy.minLength} onChange={(e) => setPasswordPolicy(p => ({ ...p, minLength: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Prevent Reuse (last N passwords)</Label>
              <Input type="number" value={passwordPolicy.preventReuse} onChange={(e) => setPasswordPolicy(p => ({ ...p, preventReuse: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "requireUppercase", label: "Require uppercase letters" },
              { key: "requireNumbers", label: "Require numbers" },
              { key: "requireSpecial", label: "Require special characters" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <p className="text-sm">{item.label}</p>
                <Switch
                  checked={passwordPolicy[item.key as keyof typeof passwordPolicy] as boolean}
                  onCheckedChange={(v) => setPasswordPolicy(p => ({ ...p, [item.key]: v }))}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Password policy saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            IP Allowlist
          </CardTitle>
          <CardDescription className="text-xs">Restrict admin access to specific IP addresses or CIDR ranges.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="e.g. 203.0.113.0/24" value={newIp} onChange={(e) => setNewIp(e.target.value)} className="text-sm flex-1" onKeyDown={(e) => e.key === "Enter" && addIp()} />
            <Button size="sm" variant="outline" onClick={addIp} className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />Add
            </Button>
          </div>
          {ipAllowlist.length > 0 && (
            <div className="space-y-2">
              {ipAllowlist.map((ip) => (
                <div key={ip} className="flex items-center justify-between px-3 py-2 bg-muted/40 rounded-lg">
                  <code className="text-xs font-mono text-foreground">{ip}</code>
                  <button onClick={() => removeIp(ip)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Timer className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Rate Limiting & Sessions
          </CardTitle>
          <CardDescription className="text-xs">Control API request rates and session durations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">API Requests per Window</Label>
              <Input type="number" value={rateLimit.requests} onChange={(e) => setRateLimit(r => ({ ...r, requests: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Window Duration (seconds)</Label>
              <Input type="number" value={rateLimit.window} onChange={(e) => setRateLimit(r => ({ ...r, window: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max Login Attempts</Label>
              <Input type="number" value={rateLimit.loginAttempts} onChange={(e) => setRateLimit(r => ({ ...r, loginAttempts: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Lockout Duration (minutes)</Label>
              <Input type="number" value={rateLimit.lockoutMinutes} onChange={(e) => setRateLimit(r => ({ ...r, lockoutMinutes: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Session Timeout (minutes)</Label>
              <Input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">CORS Allowed Origins</Label>
              <Input value={corsOrigins} onChange={(e) => setCorsOrigins(e.target.value)} className="text-sm" placeholder="Comma-separated URLs" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Rate limiting & session settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
