import { useState } from "react";
import { Save, Shield, Fingerprint, Globe, Timer, Lock, Plus, Trash2, Database, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  // Auth
  const [authSettings, setAuthSettings] = useState({
    enforce2faAdmins: true,
    enforce2faTenantAdmins: false,
    enforce2faAllUsers: false,
    preferred2faMethod: "totp",
    ssoEnforced: false,
    magicLinkEnabled: false,
    magicLinkExpiry: "15",
    rememberDeviceDays: "30",
  });

  // Password
  const [passwordSettings, setPasswordSettings] = useState({
    minLength: "12",
    maxLength: "128",
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    preventReuse: "12",
    expiryDays: "90",
    expiryWarningDays: "14",
    checkBreachedPasswords: true,
    blockCommonPasswords: true,
    blockUserInfoInPassword: true,
  });

  // Session
  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: "480",
    idleTimeout: "30",
    maxConcurrentSessions: "3",
    singleSessionEnforced: false,
    rotateTokenOnRefresh: true,
    apiRequestsPerWindow: "1000",
    apiWindowSeconds: "60",
    loginAttempts: "5",
    lockoutMinutes: "30",
    lockoutEscalation: true,
    bruteForceProtection: true,
    corsOrigins: "",
    forceReauthSensitive: true,
  });

  // IP
  const [ipSettings, setIpSettings] = useState({
    enabled: false,
    adminIPs: ["192.168.1.0/24", "10.0.0.0/8"] as string[],
    geoBlocking: false,
    vpnDetection: false,
    torBlocking: false,
  });
  const [newIp, setNewIp] = useState("");

  // Data Protection
  const [dataSettings, setDataSettings] = useState({
    encryptionAtRest: true,
    encryptionInTransit: true,
    fieldLevelEncryption: false,
    piiFieldsEncrypted: "email, phone, aadhaar, pan",
    dataRetentionDays: "730",
    inactiveAccountDays: "365",
    autoDeleteInactive: false,
    backupEncryption: true,
    backupFrequency: "daily",
    gdprDataExport: true,
    gdprRightToErasure: true,
    gdprConsentTracking: true,
    anonymizeOnDeletion: true,
    dataResidency: "auto",
  });

  // Audit
  const [auditSettings, setAuditSettings] = useState({
    auditLoginEvents: true,
    auditDataAccess: false,
    auditDataModification: true,
    auditPrivilegeEscalation: true,
    auditExportEvents: true,
    auditAdminActions: true,
    auditFailedAuth: true,
    realTimeAlerts: false,
    alertEmail: "",
    alertOnSuspiciousLogin: true,
    alertOnPrivilegeChange: true,
    alertOnDataExport: false,
    securityHeaders: true,
    cspEnabled: true,
    hstsEnabled: true,
    xFrameOptions: "DENY",
  });

  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (section: string) => {
    setSaving(section);
    await new Promise(r => setTimeout(r, 600));
    toast.success(`${section} settings saved`);
    setSaving(null);
  };

  const addIp = () => {
    if (newIp && !ipSettings.adminIPs.includes(newIp)) {
      setIpSettings(s => ({ ...s, adminIPs: [...s.adminIPs, newIp] }));
      setNewIp("");
    }
  };

  const removeIp = (ip: string) => {
    setIpSettings(s => ({ ...s, adminIPs: s.adminIPs.filter(i => i !== ip) }));
  };

  const SaveBtn = ({ section }: { section: string }) => (
    <Button size="sm" disabled={saving === section} onClick={() => handleSave(section)} className="text-xs">
      {saving === section ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />}
      {saving === section ? "Saving…" : "Save Changes"}
    </Button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Security & Compliance</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Platform-wide security policies. These settings define the baseline that tenants inherit and can only make stricter.
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600">
          Platform Baseline
        </Badge>
      </div>

      {/* Compliance Score */}
      <Card className="border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Security Posture</p>
                <p className="text-xs text-muted-foreground">Based on current configuration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-emerald-500 rounded-full" />
              </div>
              <span className="text-sm font-bold text-emerald-600">78%</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {[
              { label: "2FA Enforced", ok: authSettings.enforce2faAdmins },
              { label: "Encryption", ok: dataSettings.encryptionAtRest },
              { label: "Audit Logging", ok: auditSettings.auditLoginEvents },
              { label: "Brute Force", ok: sessionSettings.bruteForceProtection },
              { label: "GDPR Export", ok: dataSettings.gdprDataExport },
            ].map(c => (
              <Badge key={c.label} variant="outline" className={`text-[10px] ${c.ok ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"}`}>
                {c.ok ? "✓" : "!"} {c.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 1. Authentication */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Authentication & MFA
          </CardTitle>
          <CardDescription className="text-xs">Multi-factor authentication and SSO enforcement.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "enforce2faAdmins", label: "Enforce 2FA for Platform Admins", desc: "All platform administrators must use two-factor authentication." },
            { key: "enforce2faTenantAdmins", label: "Enforce 2FA for Tenant Admins", desc: "Tenant administrators must enable 2FA." },
            { key: "enforce2faAllUsers", label: "Enforce 2FA for All Users", desc: "Every user on the platform must enable 2FA." },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch checked={(authSettings as any)[item.key]} onCheckedChange={(v) => setAuthSettings(s => ({ ...s, [item.key]: v }))} />
            </div>
          ))}
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Preferred 2FA Method</Label>
              <Select value={authSettings.preferred2faMethod} onValueChange={(v) => setAuthSettings(s => ({ ...s, preferred2faMethod: v }))}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="totp">Authenticator App (TOTP)</SelectItem>
                  <SelectItem value="sms">SMS Verification</SelectItem>
                  <SelectItem value="email">Email Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Remember Device (days)</Label>
              <Input type="number" value={authSettings.rememberDeviceDays} onChange={(e) => setAuthSettings(s => ({ ...s, rememberDeviceDays: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">SSO Enforcement</p>
              <p className="text-xs text-muted-foreground mt-0.5">Force all logins through SSO (disables email/password).</p>
            </div>
            <Switch checked={authSettings.ssoEnforced} onCheckedChange={(v) => setAuthSettings(s => ({ ...s, ssoEnforced: v }))} />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">Magic Link Login</p>
              <p className="text-xs text-muted-foreground mt-0.5">Allow passwordless login via email magic links.</p>
            </div>
            <Switch checked={authSettings.magicLinkEnabled} onCheckedChange={(v) => setAuthSettings(s => ({ ...s, magicLinkEnabled: v }))} />
          </div>
          <div className="flex justify-end">
            <SaveBtn section="Authentication" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Password Policy */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Password Policy
          </CardTitle>
          <CardDescription className="text-xs">Enterprise-grade password requirements for all users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Min Length</Label>
              <Input type="number" value={passwordSettings.minLength} onChange={(e) => setPasswordSettings(s => ({ ...s, minLength: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max Length</Label>
              <Input type="number" value={passwordSettings.maxLength} onChange={(e) => setPasswordSettings(s => ({ ...s, maxLength: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Prevent Reuse (last N)</Label>
              <Input type="number" value={passwordSettings.preventReuse} onChange={(e) => setPasswordSettings(s => ({ ...s, preventReuse: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Expiry (days)</Label>
              <Input type="number" value={passwordSettings.expiryDays} onChange={(e) => setPasswordSettings(s => ({ ...s, expiryDays: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Expiry Warning (days before)</Label>
              <Input type="number" value={passwordSettings.expiryWarningDays} onChange={(e) => setPasswordSettings(s => ({ ...s, expiryWarningDays: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "requireUppercase", label: "Require uppercase letters" },
              { key: "requireLowercase", label: "Require lowercase letters" },
              { key: "requireNumbers", label: "Require numbers" },
              { key: "requireSpecial", label: "Require special characters" },
              { key: "checkBreachedPasswords", label: "Check against breached password databases" },
              { key: "blockCommonPasswords", label: "Block common passwords (top 10k list)" },
              { key: "blockUserInfoInPassword", label: "Block user info in passwords (name, email)" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <p className="text-sm">{item.label}</p>
                <Switch checked={(passwordSettings as any)[item.key]} onCheckedChange={(v) => setPasswordSettings(s => ({ ...s, [item.key]: v }))} />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <SaveBtn section="Password" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Session & Rate Limiting */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Timer className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Session & Rate Limiting
          </CardTitle>
          <CardDescription className="text-xs">Control session durations, concurrent sessions, and API rate limits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Session Timeout (min)</Label>
              <Input type="number" value={sessionSettings.sessionTimeout} onChange={(e) => setSessionSettings(s => ({ ...s, sessionTimeout: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Idle Timeout (min)</Label>
              <Input type="number" value={sessionSettings.idleTimeout} onChange={(e) => setSessionSettings(s => ({ ...s, idleTimeout: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max Concurrent Sessions</Label>
              <Input type="number" value={sessionSettings.maxConcurrentSessions} onChange={(e) => setSessionSettings(s => ({ ...s, maxConcurrentSessions: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "singleSessionEnforced", label: "Single Session Enforcement", desc: "Only one active session per user." },
              { key: "rotateTokenOnRefresh", label: "Rotate Token on Refresh", desc: "Issue new refresh token on each refresh." },
              { key: "forceReauthSensitive", label: "Force Re-auth for Sensitive Actions", desc: "Require password confirmation for critical operations." },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Switch checked={(sessionSettings as any)[item.key]} onCheckedChange={(v) => setSessionSettings(s => ({ ...s, [item.key]: v }))} />
              </div>
            ))}
          </div>
          <Separator />
          <p className="text-xs font-medium text-foreground">Rate Limiting & Brute Force</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">API Requests per Window</Label>
              <Input type="number" value={sessionSettings.apiRequestsPerWindow} onChange={(e) => setSessionSettings(s => ({ ...s, apiRequestsPerWindow: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Window (seconds)</Label>
              <Input type="number" value={sessionSettings.apiWindowSeconds} onChange={(e) => setSessionSettings(s => ({ ...s, apiWindowSeconds: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max Login Attempts</Label>
              <Input type="number" value={sessionSettings.loginAttempts} onChange={(e) => setSessionSettings(s => ({ ...s, loginAttempts: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Lockout Duration (min)</Label>
              <Input type="number" value={sessionSettings.lockoutMinutes} onChange={(e) => setSessionSettings(s => ({ ...s, lockoutMinutes: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">Lockout Escalation</p>
              <p className="text-xs text-muted-foreground mt-0.5">Progressively increase lockout time on repeated failures.</p>
            </div>
            <Switch checked={sessionSettings.lockoutEscalation} onCheckedChange={(v) => setSessionSettings(s => ({ ...s, lockoutEscalation: v }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">CORS Allowed Origins</Label>
            <Input value={sessionSettings.corsOrigins} onChange={(e) => setSessionSettings(s => ({ ...s, corsOrigins: e.target.value }))} className="text-sm" placeholder="https://app.achievhr.com, https://admin.achievhr.com" />
          </div>
          <div className="flex justify-end">
            <SaveBtn section="Session" />
          </div>
        </CardContent>
      </Card>

      {/* 4. IP Allowlist */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            IP Allowlist & Geo-Blocking
          </CardTitle>
          <CardDescription className="text-xs">Restrict admin access to specific IPs. Block suspicious traffic sources.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">Enable IP Allowlist</p>
              <p className="text-xs text-muted-foreground mt-0.5">Only allow admin access from listed IPs.</p>
            </div>
            <Switch checked={ipSettings.enabled} onCheckedChange={(v) => setIpSettings(s => ({ ...s, enabled: v }))} />
          </div>
          {ipSettings.enabled && (
            <>
              <div className="flex gap-2">
                <Input placeholder="e.g. 203.0.113.0/24" value={newIp} onChange={(e) => setNewIp(e.target.value)} className="text-sm flex-1" onKeyDown={(e) => e.key === "Enter" && addIp()} />
                <Button size="sm" variant="outline" onClick={addIp} className="text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />Add
                </Button>
              </div>
              {ipSettings.adminIPs.length > 0 && (
                <div className="space-y-2">
                  {ipSettings.adminIPs.map((ip) => (
                    <div key={ip} className="flex items-center justify-between px-3 py-2 bg-muted/40 rounded-lg">
                      <code className="text-xs font-mono text-foreground">{ip}</code>
                      <button onClick={() => removeIp(ip)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <Separator />
          {[
            { key: "geoBlocking", label: "Geo-Blocking", desc: "Block access from specific countries." },
            { key: "vpnDetection", label: "VPN Detection", desc: "Detect and flag VPN/proxy connections." },
            { key: "torBlocking", label: "Tor Exit Node Blocking", desc: "Block requests from Tor exit nodes." },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch checked={(ipSettings as any)[item.key]} onCheckedChange={(v) => setIpSettings(s => ({ ...s, [item.key]: v }))} />
            </div>
          ))}
          <div className="flex justify-end">
            <SaveBtn section="IP" />
          </div>
        </CardContent>
      </Card>

      {/* 5. Data Protection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Data Protection & Privacy
          </CardTitle>
          <CardDescription className="text-xs">Encryption, PII handling, data retention, and GDPR compliance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-medium text-foreground">Encryption</p>
          {[
            { key: "encryptionAtRest", label: "Encryption at Rest", desc: "AES-256 encryption for stored data." },
            { key: "encryptionInTransit", label: "Encryption in Transit", desc: "TLS 1.3 for all data transmission." },
            { key: "fieldLevelEncryption", label: "Field-Level Encryption", desc: "Encrypt individual PII fields separately." },
            { key: "backupEncryption", label: "Backup Encryption", desc: "Encrypt all database backups." },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch checked={(dataSettings as any)[item.key]} onCheckedChange={(v) => setDataSettings(s => ({ ...s, [item.key]: v }))} />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label className="text-xs">PII Fields to Encrypt</Label>
            <Input value={dataSettings.piiFieldsEncrypted} onChange={(e) => setDataSettings(s => ({ ...s, piiFieldsEncrypted: e.target.value }))} className="text-sm" placeholder="email, phone, aadhaar, pan" />
            <p className="text-[10px] text-muted-foreground">Comma-separated field names for field-level encryption.</p>
          </div>
          <Separator />
          <p className="text-xs font-medium text-foreground">Data Retention</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Data Retention (days)</Label>
              <Input type="number" value={dataSettings.dataRetentionDays} onChange={(e) => setDataSettings(s => ({ ...s, dataRetentionDays: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Inactive Account Threshold (days)</Label>
              <Input type="number" value={dataSettings.inactiveAccountDays} onChange={(e) => setDataSettings(s => ({ ...s, inactiveAccountDays: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">Auto-Delete Inactive Accounts</p>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically purge accounts past the inactive threshold.</p>
            </div>
            <Switch checked={dataSettings.autoDeleteInactive} onCheckedChange={(v) => setDataSettings(s => ({ ...s, autoDeleteInactive: v }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Backup Frequency</Label>
            <Select value={dataSettings.backupFrequency} onValueChange={(v) => setDataSettings(s => ({ ...s, backupFrequency: v }))}>
              <SelectTrigger className="text-sm w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <p className="text-xs font-medium text-foreground">GDPR / Compliance</p>
          {[
            { key: "gdprDataExport", label: "Right to Data Export", desc: "Allow users to export their personal data." },
            { key: "gdprRightToErasure", label: "Right to Erasure", desc: "Allow users to request account deletion." },
            { key: "gdprConsentTracking", label: "Consent Tracking", desc: "Track and manage user consent records." },
            { key: "anonymizeOnDeletion", label: "Anonymize on Deletion", desc: "Replace PII with anonymized data instead of hard delete." },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch checked={(dataSettings as any)[item.key]} onCheckedChange={(v) => setDataSettings(s => ({ ...s, [item.key]: v }))} />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label className="text-xs">Data Residency</Label>
            <Select value={dataSettings.dataResidency} onValueChange={(v) => setDataSettings(s => ({ ...s, dataResidency: v }))}>
              <SelectTrigger className="text-sm w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (Nearest Region)</SelectItem>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="eu">European Union</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="me">Middle East</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <SaveBtn section="Data Protection" />
          </div>
        </CardContent>
      </Card>

      {/* 6. Audit & Compliance */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Audit & Compliance
          </CardTitle>
          <CardDescription className="text-xs">Audit logging, real-time alerts, and security headers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-medium text-foreground">Audit Events</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              { key: "auditLoginEvents", label: "Login Events" },
              { key: "auditDataAccess", label: "Data Access" },
              { key: "auditDataModification", label: "Data Modification" },
              { key: "auditPrivilegeEscalation", label: "Privilege Escalation" },
              { key: "auditExportEvents", label: "Data Exports" },
              { key: "auditAdminActions", label: "Admin Actions" },
              { key: "auditFailedAuth", label: "Failed Auth Attempts" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <p className="text-sm">{item.label}</p>
                <Switch checked={(auditSettings as any)[item.key]} onCheckedChange={(v) => setAuditSettings(s => ({ ...s, [item.key]: v }))} />
              </div>
            ))}
          </div>
          <Separator />
          <p className="text-xs font-medium text-foreground">Real-Time Alerts</p>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">Enable Real-Time Alerts</p>
              <p className="text-xs text-muted-foreground mt-0.5">Send immediate notifications for critical security events.</p>
            </div>
            <Switch checked={auditSettings.realTimeAlerts} onCheckedChange={(v) => setAuditSettings(s => ({ ...s, realTimeAlerts: v }))} />
          </div>
          {auditSettings.realTimeAlerts && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Alert Email</Label>
                <Input value={auditSettings.alertEmail} onChange={(e) => setAuditSettings(s => ({ ...s, alertEmail: e.target.value }))} className="text-sm" placeholder="security@achievhr.com" />
              </div>
              <div className="space-y-3">
                {[
                  { key: "alertOnSuspiciousLogin", label: "Suspicious login (new device/location)" },
                  { key: "alertOnPrivilegeChange", label: "Privilege/role changes" },
                  { key: "alertOnDataExport", label: "Bulk data exports" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <p className="text-sm">{item.label}</p>
                    <Switch checked={(auditSettings as any)[item.key]} onCheckedChange={(v) => setAuditSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                ))}
              </div>
            </>
          )}
          <Separator />
          <p className="text-xs font-medium text-foreground">Security Headers</p>
          <div className="space-y-3">
            {[
              { key: "securityHeaders", label: "Enable Security Headers" },
              { key: "cspEnabled", label: "Content Security Policy (CSP)" },
              { key: "hstsEnabled", label: "HSTS (Strict Transport Security)" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <p className="text-sm">{item.label}</p>
                <Switch checked={(auditSettings as any)[item.key]} onCheckedChange={(v) => setAuditSettings(s => ({ ...s, [item.key]: v }))} />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">X-Frame-Options</Label>
            <Select value={auditSettings.xFrameOptions} onValueChange={(v) => setAuditSettings(s => ({ ...s, xFrameOptions: v }))}>
              <SelectTrigger className="text-sm w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DENY">DENY</SelectItem>
                <SelectItem value="SAMEORIGIN">SAMEORIGIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <SaveBtn section="Audit" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
