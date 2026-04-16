import { useState } from "react";
import { Save, Fingerprint, Globe, Timer, Lock, Plus, Trash2, Eye, ShieldCheck, FileSearch, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

// Compliance Dashboard
function ComplianceDashboard() {
  const checks = [
    { label: "2FA Enforced (Admins)", status: true },
    { label: "Password Policy ≥ 12 chars", status: true },
    { label: "Session Timeout ≤ 8hrs", status: true },
    { label: "IP Allowlist Active", status: false },
    { label: "GDPR Data Export Enabled", status: true },
    { label: "Audit Logging Active", status: true },
    { label: "HSTS Enabled", status: true },
    { label: "CSP Headers Active", status: true },
  ];
  const passCount = checks.filter(c => c.status).length;
  const score = Math.round((passCount / checks.length) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Security Posture
          </CardTitle>
          <Badge variant="outline" className={`text-[10px] px-2 py-0 ${score >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : score >= 60 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200"}`}>
            {score}% Compliant
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {checks.map((check) => (
            <div key={check.label} className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] ${check.status ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {check.status ? <ShieldCheck className="w-3 h-3 shrink-0" strokeWidth={2} /> : <AlertTriangle className="w-3 h-3 shrink-0" strokeWidth={2} />}
              <span className="truncate">{check.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SecuritySettingsPage() {
  // Authentication & MFA
  const [authSettings, setAuthSettings] = useState({
    enforce2faAdmins: true,
    enforce2faTenantAdmins: false,
    enforce2faAllUsers: false,
    preferred2faMethod: "totp",
    allowedMethods: ["totp", "email"],
    ssoEnforced: false,
    allowedSsoProviders: ["Google"],
    magicLinkEnabled: false,
    magicLinkExpiry: "15",
    rememberDeviceDays: "30",
  });

  // Password Policy
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
    minStrength: "strong",
    blockCommonPasswords: true,
    blockUserInfoInPassword: true,
  });

  // Session & Rate Limiting
  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: "480",
    idleTimeout: "30",
    maxConcurrentSessions: "3",
    singleSessionEnforced: false,
    sessionBindToIP: false,
    rotateTokenOnRefresh: true,
    apiRequestsPerWindow: "1000",
    apiWindowSeconds: "60",
    loginAttempts: "5",
    lockoutMinutes: "30",
    lockoutEscalation: true,
    captchaAfterFailedAttempts: "3",
    bruteForceProtection: true,
    corsOrigins: "",
    trustedProxies: "",
    forceReauthSensitive: true,
  });

  // IP Allowlist & Geo-blocking
  const [ipSettings, setIpSettings] = useState({
    enabled: false,
    adminIPs: ["192.168.1.0/24", "10.0.0.0/8"] as string[],
    tenantIPs: [] as string[],
    geoBlocking: false,
    blockedCountries: [] as string[],
    vpnDetection: false,
    torBlocking: false,
  });
  const [newAdminIp, setNewAdminIp] = useState("");

  // Data Protection
  const [dataSettings, setDataSettings] = useState({
    encryptionAtRest: true,
    encryptionInTransit: true,
    fieldLevelEncryption: false,
    piiFieldsEncrypted: ["email", "phone"] as string[],
    dataRetentionDays: "730",
    inactiveAccountDays: "365",
    autoDeleteInactive: false,
    auditLogRetentionDays: "730",
    backupEncryption: true,
    backupFrequency: "daily",
    gdprDataExport: true,
    gdprRightToErasure: true,
    gdprConsentTracking: true,
    gdprCookieConsent: true,
    gdprDpiaRequired: false,
    gdprDataProcessingAgreement: true,
    gdprBreachNotificationHours: "72",
    gdprDpoEmail: "",
    anonymizeOnDeletion: true,
    dataResidency: "auto",
    crossBorderTransfer: false,
  });

  // Audit & Compliance
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
    alertOnMultipleFailedLogins: true,
    securityHeaders: true,
    cspEnabled: true,
    cspReportOnly: true,
    hstsEnabled: true,
    hstsMaxAge: "31536000",
    xFrameOptions: "DENY",
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: true,
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    auth: true, password: false, session: false, ip: false, data: false, audit: false,
  });

  const toggleSection = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const addAdminIp = () => {
    if (newAdminIp && !ipSettings.adminIPs.includes(newAdminIp)) {
      setIpSettings(s => ({ ...s, adminIPs: [...s.adminIPs, newAdminIp] }));
      setNewAdminIp("");
    }
  };

  const removeAdminIp = (ip: string) => {
    setIpSettings(s => ({ ...s, adminIPs: s.adminIPs.filter(i => i !== ip) }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Security & Compliance</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Platform-wide security policies. These define the baseline that tenants inherit and can only make stricter.
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600">
          6 Policy Domains
        </Badge>
      </div>

      <ComplianceDashboard />

      {/* 1. Authentication & MFA */}
      <Collapsible open={openSections.auth} onOpenChange={() => toggleSection("auth")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Authentication & MFA
                <Badge variant="outline" className="text-[10px] ml-auto">{openSections.auth ? "▲" : "▼"}</Badge>
              </CardTitle>
              <CardDescription className="text-xs">Two-factor authentication, SSO, and login methods.</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-5 pt-0">
              {[
                { key: "enforce2faAdmins", label: "Enforce 2FA for Platform Admins", desc: "All platform administrators must use two-factor authentication." },
                { key: "enforce2faTenantAdmins", label: "Enforce 2FA for Tenant Admins", desc: "Require 2FA for all tenant administrator accounts." },
                { key: "enforce2faAllUsers", label: "Enforce 2FA for All Users", desc: "Require 2FA for every user across all tenants." },
              ].map((item, i) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch checked={authSettings[item.key as keyof typeof authSettings] as boolean} onCheckedChange={(v) => setAuthSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                  {i < 2 && <Separator className="mt-4" />}
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">SSO Enforcement</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Force all users to authenticate through SSO providers only.</p>
                </div>
                <Switch checked={authSettings.ssoEnforced} onCheckedChange={(v) => setAuthSettings(s => ({ ...s, ssoEnforced: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Magic Link Login</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Allow passwordless login via email magic links.</p>
                </div>
                <Switch checked={authSettings.magicLinkEnabled} onCheckedChange={(v) => setAuthSettings(s => ({ ...s, magicLinkEnabled: v }))} />
              </div>
              {authSettings.magicLinkEnabled && (
                <div className="space-y-1.5 w-48">
                  <Label className="text-xs">Magic Link Expiry (min)</Label>
                  <Input type="number" value={authSettings.magicLinkExpiry} onChange={(e) => setAuthSettings(s => ({ ...s, magicLinkExpiry: e.target.value }))} className="text-sm" />
                </div>
              )}
              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("Authentication settings saved")} className="text-xs">
                  <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 2. Password Policy */}
      <Collapsible open={openSections.password} onOpenChange={() => toggleSection("password")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Password Policy
                <Badge variant="outline" className="text-[10px] ml-auto">{openSections.password ? "▲" : "▼"}</Badge>
              </CardTitle>
              <CardDescription className="text-xs">Password complexity, expiry, breach detection, and reuse prevention.</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Minimum Length</Label>
                  <Input type="number" value={passwordSettings.minLength} onChange={(e) => setPasswordSettings(s => ({ ...s, minLength: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Maximum Length</Label>
                  <Input type="number" value={passwordSettings.maxLength} onChange={(e) => setPasswordSettings(s => ({ ...s, maxLength: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Prevent Reuse (last N)</Label>
                  <Input type="number" value={passwordSettings.preventReuse} onChange={(e) => setPasswordSettings(s => ({ ...s, preventReuse: e.target.value }))} className="text-sm" />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { key: "requireUppercase", label: "Require uppercase letters" },
                  { key: "requireLowercase", label: "Require lowercase letters" },
                  { key: "requireNumbers", label: "Require numbers" },
                  { key: "requireSpecial", label: "Require special characters" },
                  { key: "checkBreachedPasswords", label: "Check against breached password databases" },
                  { key: "blockCommonPasswords", label: "Block common passwords (top 10,000)" },
                  { key: "blockUserInfoInPassword", label: "Block username/email in password" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <p className="text-sm">{item.label}</p>
                    <Switch checked={passwordSettings[item.key as keyof typeof passwordSettings] as boolean} onCheckedChange={(v) => setPasswordSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Password Expiry (days)</Label>
                  <Input type="number" value={passwordSettings.expiryDays} onChange={(e) => setPasswordSettings(s => ({ ...s, expiryDays: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Expiry Warning (days before)</Label>
                  <Input type="number" value={passwordSettings.expiryWarningDays} onChange={(e) => setPasswordSettings(s => ({ ...s, expiryWarningDays: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Minimum Strength</Label>
                  <Select value={passwordSettings.minStrength} onValueChange={(v) => setPasswordSettings(s => ({ ...s, minStrength: v }))}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">Weak</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                      <SelectItem value="very-strong">Very Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("Password policy saved")} className="text-xs">
                  <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 3. Session & Rate Limiting */}
      <Collapsible open={openSections.session} onOpenChange={() => toggleSection("session")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Timer className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Session & Rate Limiting
                <Badge variant="outline" className="text-[10px] ml-auto">{openSections.session ? "▲" : "▼"}</Badge>
              </CardTitle>
              <CardDescription className="text-xs">Session timeouts, concurrent sessions, API rate limits, and brute force protection.</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
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
                  { key: "singleSessionEnforced", label: "Single Session Enforcement", desc: "Terminate previous sessions when a new login occurs." },
                  { key: "sessionBindToIP", label: "Bind Session to IP", desc: "Invalidate session if the user's IP address changes." },
                  { key: "rotateTokenOnRefresh", label: "Rotate Token on Refresh", desc: "Issue a new refresh token on every token refresh." },
                  { key: "forceReauthSensitive", label: "Re-authenticate for Sensitive Actions", desc: "Require password re-entry for role changes, data exports, etc." },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch checked={sessionSettings[item.key as keyof typeof sessionSettings] as boolean} onCheckedChange={(v) => setSessionSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <Separator />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rate Limiting & Brute Force</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">API Requests per Window</Label>
                  <Input type="number" value={sessionSettings.apiRequestsPerWindow} onChange={(e) => setSessionSettings(s => ({ ...s, apiRequestsPerWindow: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Window Duration (seconds)</Label>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">CAPTCHA After Failed Attempts</Label>
                  <Input type="number" value={sessionSettings.captchaAfterFailedAttempts} onChange={(e) => setSessionSettings(s => ({ ...s, captchaAfterFailedAttempts: e.target.value }))} className="text-sm" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-medium">Lockout Escalation</p>
                    <p className="text-xs text-muted-foreground">Double lockout time on repeated violations.</p>
                  </div>
                  <Switch checked={sessionSettings.lockoutEscalation} onCheckedChange={(v) => setSessionSettings(s => ({ ...s, lockoutEscalation: v }))} />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">CORS Allowed Origins</Label>
                  <Input value={sessionSettings.corsOrigins} onChange={(e) => setSessionSettings(s => ({ ...s, corsOrigins: e.target.value }))} className="text-sm" placeholder="Comma-separated URLs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Trusted Proxies</Label>
                  <Input value={sessionSettings.trustedProxies} onChange={(e) => setSessionSettings(s => ({ ...s, trustedProxies: e.target.value }))} className="text-sm" placeholder="Comma-separated IPs" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("Session & rate limiting saved")} className="text-xs">
                  <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 4. IP Allowlist & Geo-blocking */}
      <Collapsible open={openSections.ip} onOpenChange={() => toggleSection("ip")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                IP Allowlist & Geo-blocking
                <Badge variant="outline" className="text-[10px] ml-auto">{openSections.ip ? "▲" : "▼"}</Badge>
              </CardTitle>
              <CardDescription className="text-xs">IP restrictions, geographic access controls, VPN and Tor detection.</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Enable IP Allowlist</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Restrict admin access to specific IP ranges.</p>
                </div>
                <Switch checked={ipSettings.enabled} onCheckedChange={(v) => setIpSettings(s => ({ ...s, enabled: v }))} />
              </div>
              {ipSettings.enabled && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs">Admin IP Allowlist</Label>
                    <div className="flex gap-2">
                      <Input placeholder="e.g. 203.0.113.0/24" value={newAdminIp} onChange={(e) => setNewAdminIp(e.target.value)} className="text-sm flex-1" onKeyDown={(e) => e.key === "Enter" && addAdminIp()} />
                      <Button size="sm" variant="outline" onClick={addAdminIp} className="text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />Add
                      </Button>
                    </div>
                    {ipSettings.adminIPs.length > 0 && (
                      <div className="space-y-1.5">
                        {ipSettings.adminIPs.map((ip) => (
                          <div key={ip} className="flex items-center justify-between px-3 py-2 bg-muted/40 rounded-lg">
                            <code className="text-xs font-mono text-foreground">{ip}</code>
                            <button onClick={() => removeAdminIp(ip)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              <Separator />
              <div className="space-y-3">
                {[
                  { key: "geoBlocking", label: "Geo-blocking", desc: "Block access from specific countries." },
                  { key: "vpnDetection", label: "VPN Detection", desc: "Detect and optionally block VPN connections." },
                  { key: "torBlocking", label: "Tor Blocking", desc: "Block access from Tor exit nodes." },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch checked={ipSettings[item.key as keyof typeof ipSettings] as boolean} onCheckedChange={(v) => setIpSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("IP & geo-blocking settings saved")} className="text-xs">
                  <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 5. Data Protection & GDPR */}
      <Collapsible open={openSections.data} onOpenChange={() => toggleSection("data")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Data Protection & GDPR
                <Badge variant="outline" className="text-[10px] ml-auto">{openSections.data ? "▲" : "▼"}</Badge>
              </CardTitle>
              <CardDescription className="text-xs">Encryption, data retention, GDPR compliance, and privacy controls.</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Encryption</p>
              <div className="space-y-3">
                {[
                  { key: "encryptionAtRest", label: "Encryption at Rest", desc: "Encrypt all stored data using AES-256." },
                  { key: "encryptionInTransit", label: "Encryption in Transit", desc: "Enforce TLS 1.3 for all data transmission." },
                  { key: "fieldLevelEncryption", label: "Field-Level Encryption", desc: "Encrypt sensitive PII fields individually." },
                  { key: "backupEncryption", label: "Backup Encryption", desc: "Encrypt all database backups." },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch checked={dataSettings[item.key as keyof typeof dataSettings] as boolean} onCheckedChange={(v) => setDataSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <Separator />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Retention</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Data Retention (days)</Label>
                  <Input type="number" value={dataSettings.dataRetentionDays} onChange={(e) => setDataSettings(s => ({ ...s, dataRetentionDays: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Inactive Account (days)</Label>
                  <Input type="number" value={dataSettings.inactiveAccountDays} onChange={(e) => setDataSettings(s => ({ ...s, inactiveAccountDays: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Audit Log Retention (days)</Label>
                  <Input type="number" value={dataSettings.auditLogRetentionDays} onChange={(e) => setDataSettings(s => ({ ...s, auditLogRetentionDays: e.target.value }))} className="text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Backup Frequency</Label>
                  <Select value={dataSettings.backupFrequency} onValueChange={(v) => setDataSettings(s => ({ ...s, backupFrequency: v }))}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Data Residency</Label>
                  <Select value={dataSettings.dataResidency} onValueChange={(v) => setDataSettings(s => ({ ...s, dataResidency: v }))}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (nearest region)</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="ap">Asia Pacific</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">GDPR Compliance</p>
              <div className="space-y-3">
                {[
                  { key: "gdprDataExport", label: "Data Export (Right to Portability)" },
                  { key: "gdprRightToErasure", label: "Right to Erasure" },
                  { key: "gdprConsentTracking", label: "Consent Tracking" },
                  { key: "gdprCookieConsent", label: "Cookie Consent Banner" },
                  { key: "gdprDataProcessingAgreement", label: "Data Processing Agreement" },
                  { key: "anonymizeOnDeletion", label: "Anonymize Data on Deletion" },
                  { key: "crossBorderTransfer", label: "Allow Cross-Border Data Transfer" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <p className="text-sm">{item.label}</p>
                    <Switch checked={dataSettings[item.key as keyof typeof dataSettings] as boolean} onCheckedChange={(v) => setDataSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Breach Notification (hours)</Label>
                  <Input type="number" value={dataSettings.gdprBreachNotificationHours} onChange={(e) => setDataSettings(s => ({ ...s, gdprBreachNotificationHours: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">DPO Email</Label>
                  <Input value={dataSettings.gdprDpoEmail} onChange={(e) => setDataSettings(s => ({ ...s, gdprDpoEmail: e.target.value }))} className="text-sm" placeholder="dpo@company.com" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("Data protection settings saved")} className="text-xs">
                  <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 6. Audit & Compliance */}
      <Collapsible open={openSections.audit} onOpenChange={() => toggleSection("audit")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Audit & Compliance
                <Badge variant="outline" className="text-[10px] ml-auto">{openSections.audit ? "▲" : "▼"}</Badge>
              </CardTitle>
              <CardDescription className="text-xs">Audit logging, real-time alerts, and security headers (CSP, HSTS, X-Frame).</CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Audit Events</p>
              <div className="space-y-3">
                {[
                  { key: "auditLoginEvents", label: "Login Events" },
                  { key: "auditDataAccess", label: "Data Access (read)" },
                  { key: "auditDataModification", label: "Data Modifications (write/delete)" },
                  { key: "auditPrivilegeEscalation", label: "Privilege Escalation" },
                  { key: "auditExportEvents", label: "Data Exports" },
                  { key: "auditAdminActions", label: "Admin Actions" },
                  { key: "auditFailedAuth", label: "Failed Authentication" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <p className="text-sm">{item.label}</p>
                    <Switch checked={auditSettings[item.key as keyof typeof auditSettings] as boolean} onCheckedChange={(v) => setAuditSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <Separator />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Real-Time Alerts</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Enable Real-Time Alerts</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Send immediate notifications for security events.</p>
                  </div>
                  <Switch checked={auditSettings.realTimeAlerts} onCheckedChange={(v) => setAuditSettings(s => ({ ...s, realTimeAlerts: v }))} />
                </div>
                {auditSettings.realTimeAlerts && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Alert Email</Label>
                    <Input value={auditSettings.alertEmail} onChange={(e) => setAuditSettings(s => ({ ...s, alertEmail: e.target.value }))} className="text-sm" placeholder="security@company.com" />
                  </div>
                )}
                {[
                  { key: "alertOnSuspiciousLogin", label: "Alert on Suspicious Login" },
                  { key: "alertOnPrivilegeChange", label: "Alert on Privilege Changes" },
                  { key: "alertOnDataExport", label: "Alert on Data Exports" },
                  { key: "alertOnMultipleFailedLogins", label: "Alert on Multiple Failed Logins" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <p className="text-sm">{item.label}</p>
                    <Switch checked={auditSettings[item.key as keyof typeof auditSettings] as boolean} onCheckedChange={(v) => setAuditSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <Separator />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Security Headers</p>
              <div className="space-y-3">
                {[
                  { key: "securityHeaders", label: "Enable Security Headers" },
                  { key: "cspEnabled", label: "Content Security Policy (CSP)" },
                  { key: "cspReportOnly", label: "CSP Report-Only Mode" },
                  { key: "hstsEnabled", label: "HTTP Strict Transport Security (HSTS)" },
                  { key: "permissionsPolicy", label: "Permissions Policy" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <p className="text-sm">{item.label}</p>
                    <Switch checked={auditSettings[item.key as keyof typeof auditSettings] as boolean} onCheckedChange={(v) => setAuditSettings(s => ({ ...s, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">HSTS Max-Age (sec)</Label>
                  <Input value={auditSettings.hstsMaxAge} onChange={(e) => setAuditSettings(s => ({ ...s, hstsMaxAge: e.target.value }))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">X-Frame-Options</Label>
                  <Select value={auditSettings.xFrameOptions} onValueChange={(v) => setAuditSettings(s => ({ ...s, xFrameOptions: v }))}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DENY">DENY</SelectItem>
                      <SelectItem value="SAMEORIGIN">SAMEORIGIN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Referrer Policy</Label>
                  <Select value={auditSettings.referrerPolicy} onValueChange={(v) => setAuditSettings(s => ({ ...s, referrerPolicy: v }))}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-referrer">no-referrer</SelectItem>
                      <SelectItem value="strict-origin">strict-origin</SelectItem>
                      <SelectItem value="strict-origin-when-cross-origin">strict-origin-when-cross-origin</SelectItem>
                      <SelectItem value="same-origin">same-origin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success("Audit & compliance settings saved")} className="text-xs">
                  <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}