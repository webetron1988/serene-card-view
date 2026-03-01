import { useState } from "react";
import {
  Settings2, Building2, Globe, Shield, Bell, GitBranch,
  Plug, Database, Layers, Tag, ToggleLeft, Save, Upload,
  Eye, EyeOff, Copy, RefreshCw, Plus, Trash2, Edit2,
  AlertTriangle, CheckCircle2, X, ChevronRight, Lock,
  Palette, Clock, Mail, Smartphone, Webhook, Key, Moon, Sun
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type ApprovalStep = { id: string; role: string; minApprovers: number };
type ApprovalWorkflow = { id: string; name: string; trigger: string; steps: ApprovalStep[]; active: boolean };
type Integration = { id: string; name: string; type: string; status: "connected" | "disconnected" | "error"; lastSync: string; icon: string };
type CustomField = { id: string; entity: string; label: string; type: "text" | "number" | "date" | "select" | "boolean"; required: boolean; options?: string[] };
type FeatureFlag = { id: string; name: string; description: string; enabled: boolean; environment: "all" | "production" | "staging" };

// ─── Sample Data ──────────────────────────────────────────────────────────────

const INITIAL_WORKFLOWS: ApprovalWorkflow[] = [
  {
    id: "wf-001", name: "Time Off Request", trigger: "leave_request", active: true,
    steps: [{ id: "s1", role: "Direct Manager", minApprovers: 1 }, { id: "s2", role: "HR Manager", minApprovers: 1 }]
  },
  {
    id: "wf-002", name: "Expense Claim > $1000", trigger: "expense_claim", active: true,
    steps: [{ id: "s1", role: "Direct Manager", minApprovers: 1 }, { id: "s2", role: "Finance Manager", minApprovers: 1 }, { id: "s3", role: "CFO", minApprovers: 1 }]
  },
  {
    id: "wf-003", name: "New Position Request", trigger: "position_create", active: false,
    steps: [{ id: "s1", role: "Department Head", minApprovers: 1 }, { id: "s2", role: "HR Director", minApprovers: 1 }]
  },
];

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: "int-001", name: "Slack", type: "Communication", status: "connected", lastSync: "2024-02-15 09:00", icon: "💬" },
  { id: "int-002", name: "Google Workspace", type: "Identity & SSO", status: "connected", lastSync: "2024-02-15 08:45", icon: "🔵" },
  { id: "int-003", name: "Microsoft Teams", type: "Communication", status: "disconnected", lastSync: "Never", icon: "💜" },
  { id: "int-004", name: "Workday Payroll", type: "Payroll", status: "connected", lastSync: "2024-02-15 06:00", icon: "💰" },
  { id: "int-005", name: "LinkedIn", type: "Recruitment", status: "connected", lastSync: "2024-02-14 22:00", icon: "🔗" },
  { id: "int-006", name: "Greenhouse ATS", type: "Recruitment", status: "error", lastSync: "2024-02-10 12:00", icon: "🌿" },
  { id: "int-007", name: "DocuSign", type: "Documents", status: "disconnected", lastSync: "Never", icon: "✍️" },
  { id: "int-008", name: "Okta SSO", type: "Identity & SSO", status: "disconnected", lastSync: "Never", icon: "🔐" },
];

const INITIAL_CUSTOM_FIELDS: CustomField[] = [
  { id: "cf-001", entity: "Employee", label: "Emergency Contact", type: "text", required: false },
  { id: "cf-002", entity: "Employee", label: "T-Shirt Size", type: "select", required: false, options: ["XS", "S", "M", "L", "XL", "XXL"] },
  { id: "cf-003", entity: "Employee", label: "Background Check Date", type: "date", required: true },
  { id: "cf-004", entity: "Position", label: "Budget Code", type: "text", required: true },
  { id: "cf-005", entity: "OrgUnit", label: "Cost Center", type: "text", required: false },
];

const INITIAL_FEATURE_FLAGS: FeatureFlag[] = [
  { id: "ff-001", name: "AI Job Description Generator", description: "Use AI to auto-generate job descriptions from position templates", enabled: true, environment: "all" },
  { id: "ff-002", name: "Predictive Attrition Alerts", description: "Show risk indicators on employee profiles using ML model", enabled: true, environment: "all" },
  { id: "ff-003", name: "New Compensation Module (Beta)", description: "Early access to the revamped compensation planning module", enabled: false, environment: "staging" },
  { id: "ff-004", name: "Bulk Employee Import v2", description: "New CSV import engine with better validation and mapping", enabled: false, environment: "staging" },
  { id: "ff-005", name: "Advanced Org Chart v3", description: "Next-gen interactive org chart with swimlanes and filters", enabled: false, environment: "production" },
  { id: "ff-006", name: "Employee Self-Service Portal", description: "Allow employees to update their own profile information", enabled: true, environment: "all" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  // General Settings
  const [general, setGeneral] = useState({
    companyName: "TalentCorp International",
    companyWebsite: "https://talentcorp.com",
    supportEmail: "hr@talentcorp.com",
    defaultLanguage: "en",
    dateFormat: "DD/MM/YYYY",
    currency: "USD",
    fiscalYearStart: "January",
    workWeekStart: "Monday",
    defaultTimezone: "UTC+05:30 (Mumbai/Kolkata)",
  });

  // Branding
  const [branding, setBranding] = useState({
    primaryColor: "#6366f1",
    accentColor: "#f59e0b",
    logoUrl: "",
    faviconUrl: "",
    loginBackground: "gradient",
    emailFooter: "TalentCorp International · HR Platform",
  });

  // Security
  const [security, setSecurity] = useState({
    mfaRequired: true,
    sessionTimeout: "8",
    passwordMinLength: "12",
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    allowedIpRanges: "0.0.0.0/0",
    ssoEnabled: true,
    ssoProvider: "google",
    apiKeyVisible: false,
  });
  const apiKey = "sk-thub-prod-a8f3d2c1b4e7f9a0b2c3d4e5f6a7b8c9";

  // Notifications
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    slackEnabled: true,
    teamsEnabled: false,
    smsEnabled: false,
    notifyOnNewEmployee: true,
    notifyOnLeaveRequest: true,
    notifyOnExpiringSoon: true,
    notifyOnSecurityAlert: true,
    digestFrequency: "daily",
  });

  // Workflows
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(INITIAL_WORKFLOWS);
  const [workflowEditOpen, setWorkflowEditOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);

  // Integrations
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  // Custom Fields
  const [customFields, setCustomFields] = useState<CustomField[]>(INITIAL_CUSTOM_FIELDS);
  const [fieldCreateOpen, setFieldCreateOpen] = useState(false);
  const [newField, setNewField] = useState<Omit<CustomField, "id">>({ entity: "Employee", label: "", type: "text", required: false });
  const [deleteFieldOpen, setDeleteFieldOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<CustomField | null>(null);

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(INITIAL_FEATURE_FLAGS);

  function saveSection(section: string) {
    toast.success(`${section} settings saved`);
  }

  function handleToggleWorkflow(id: string) {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
    toast.success("Workflow updated");
  }

  function handleConnectIntegration(integration: Integration) {
    if (integration.status === "connected") {
      setSelectedIntegration(integration);
      setDisconnectOpen(true);
    } else {
      toast.info(`Connecting to ${integration.name}...`);
      setTimeout(() => {
        setIntegrations(prev => prev.map(i => i.id === integration.id ? { ...i, status: "connected", lastSync: "Just now" } : i));
        toast.success(`${integration.name} connected`);
      }, 1500);
    }
  }

  function handleDisconnect() {
    if (!selectedIntegration) return;
    setIntegrations(prev => prev.map(i => i.id === selectedIntegration.id ? { ...i, status: "disconnected", lastSync: "Never" } : i));
    setDisconnectOpen(false);
    toast.success(`${selectedIntegration.name} disconnected`);
  }

  function handleCreateField() {
    const field: CustomField = { ...newField, id: `cf-${Date.now()}` };
    setCustomFields(prev => [...prev, field]);
    setFieldCreateOpen(false);
    toast.success(`Custom field "${newField.label}" created`);
    setNewField({ entity: "Employee", label: "", type: "text", required: false });
  }

  function handleDeleteField() {
    if (!selectedField) return;
    setCustomFields(prev => prev.filter(f => f.id !== selectedField.id));
    setDeleteFieldOpen(false);
    toast.success(`Field "${selectedField.label}" deleted`);
  }

  function handleToggleFlag(id: string) {
    setFeatureFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  }

  const intStatusColor = (s: Integration["status"]) => {
    if (s === "connected") return "bg-emerald-100 text-emerald-700";
    if (s === "error") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  const TABS = [
    { key: "general", label: "General", icon: <Settings2 className="h-4 w-4" /> },
    { key: "branding", label: "Branding", icon: <Palette className="h-4 w-4" /> },
    { key: "locale", label: "Locale", icon: <Globe className="h-4 w-4" /> },
    { key: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
    { key: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { key: "workflows", label: "Workflows", icon: <GitBranch className="h-4 w-4" /> },
    { key: "integrations", label: "Integrations", icon: <Plug className="h-4 w-4" /> },
    { key: "custom_fields", label: "Custom Fields", icon: <Tag className="h-4 w-4" /> },
    { key: "feature_flags", label: "Feature Flags", icon: <ToggleLeft className="h-4 w-4" /> },
  ];

  return (
    <AppShell title="Settings" subtitle="Platform configuration and preferences">
      <PageHeader title="Settings" subtitle="Configure your TalentHub platform" />

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <nav className="w-52 shrink-0 space-y-0.5">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === tab.key ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* ── General ────────────────────────────────────────── */}
          {activeTab === "general" && (
            <SettingsSection title="General" subtitle="Basic company information and platform preferences">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Company Name</Label>
                  <Input value={general.companyName} onChange={e => setGeneral(p => ({ ...p, companyName: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label>Company Website</Label>
                  <Input value={general.companyWebsite} onChange={e => setGeneral(p => ({ ...p, companyWebsite: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label>HR Support Email</Label>
                  <Input type="email" value={general.supportEmail} onChange={e => setGeneral(p => ({ ...p, supportEmail: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label>Default Language</Label>
                  <Select value={general.defaultLanguage} onValueChange={v => setGeneral(p => ({ ...p, defaultLanguage: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fiscal Year Start</Label>
                  <Select value={general.fiscalYearStart} onValueChange={v => setGeneral(p => ({ ...p, fiscalYearStart: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["January", "April", "July", "October"].map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Work Week Start</Label>
                  <Select value={general.workWeekStart} onValueChange={v => setGeneral(p => ({ ...p, workWeekStart: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Monday", "Sunday", "Saturday"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Default Currency</Label>
                  <Select value={general.currency} onValueChange={v => setGeneral(p => ({ ...p, currency: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["USD", "EUR", "GBP", "SGD", "INR", "AED"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SaveButton onClick={() => saveSection("General")} />
            </SettingsSection>
          )}

          {/* ── Branding ─────────────────────────────────────── */}
          {activeTab === "branding" && (
            <SettingsSection title="Branding" subtitle="Customize colors, logos, and visual identity">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input type="color" value={branding.primaryColor} onChange={e => setBranding(p => ({ ...p, primaryColor: e.target.value }))} className="h-9 w-12 rounded border cursor-pointer" />
                    <Input value={branding.primaryColor} onChange={e => setBranding(p => ({ ...p, primaryColor: e.target.value }))} className="font-mono" />
                  </div>
                </div>
                <div>
                  <Label>Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input type="color" value={branding.accentColor} onChange={e => setBranding(p => ({ ...p, accentColor: e.target.value }))} className="h-9 w-12 rounded border cursor-pointer" />
                    <Input value={branding.accentColor} onChange={e => setBranding(p => ({ ...p, accentColor: e.target.value }))} className="font-mono" />
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Company Logo</Label>
                  <div className="mt-1 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => toast.info("File upload coming soon")}>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload logo (PNG, SVG recommended)</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Login Page Background</Label>
                  <Select value={branding.loginBackground} onValueChange={v => setBranding(p => ({ ...p, loginBackground: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient">Default Gradient</SelectItem>
                      <SelectItem value="image">Custom Image</SelectItem>
                      <SelectItem value="solid">Solid Color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Email Footer Text</Label>
                  <Input value={branding.emailFooter} onChange={e => setBranding(p => ({ ...p, emailFooter: e.target.value }))} className="mt-1" />
                </div>
              </div>
              <SaveButton onClick={() => saveSection("Branding")} />
            </SettingsSection>
          )}

          {/* ── Locale ───────────────────────────────────────── */}
          {activeTab === "locale" && (
            <SettingsSection title="Locale & Time" subtitle="Date formats, timezones, and regional preferences">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date Format</Label>
                  <Select value={general.dateFormat} onValueChange={v => setGeneral(p => ({ ...p, dateFormat: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Default Timezone</Label>
                  <Select value={general.defaultTimezone} onValueChange={v => setGeneral(p => ({ ...p, defaultTimezone: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-48">
                      {["UTC+00:00 (London/UTC)", "UTC-05:00 (Eastern)", "UTC-08:00 (Pacific)", "UTC+01:00 (Central Europe)", "UTC+05:30 (Mumbai/Kolkata)", "UTC+08:00 (Singapore/Beijing)", "UTC+09:00 (Tokyo/Seoul)"].map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SaveButton onClick={() => saveSection("Locale")} />
            </SettingsSection>
          )}

          {/* ── Security ─────────────────────────────────────── */}
          {activeTab === "security" && (
            <SettingsSection title="Security" subtitle="Authentication, session, and access control settings">
              <div className="space-y-5">
                {/* MFA & Session */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Authentication</p>
                  <ToggleRow
                    label="Require MFA for all users"
                    description="All users must set up multi-factor authentication"
                    value={security.mfaRequired}
                    onChange={v => setSecurity(p => ({ ...p, mfaRequired: v }))}
                  />
                  <ToggleRow
                    label="Enable SSO"
                    description="Allow login via your identity provider"
                    value={security.ssoEnabled}
                    onChange={v => setSecurity(p => ({ ...p, ssoEnabled: v }))}
                  />
                  {security.ssoEnabled && (
                    <div className="ml-12">
                      <Label className="text-xs">SSO Provider</Label>
                      <Select value={security.ssoProvider} onValueChange={v => setSecurity(p => ({ ...p, ssoProvider: v }))}>
                        <SelectTrigger className="mt-1 w-48 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google Workspace</SelectItem>
                          <SelectItem value="okta">Okta</SelectItem>
                          <SelectItem value="azure">Azure AD</SelectItem>
                          <SelectItem value="saml">Custom SAML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Password Policy */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Password Policy</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Minimum Length</Label>
                      <Input type="number" value={security.passwordMinLength} onChange={e => setSecurity(p => ({ ...p, passwordMinLength: e.target.value }))} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Session Timeout (hours)</Label>
                      <Input type="number" value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))} className="mt-1" />
                    </div>
                  </div>
                  <ToggleRow
                    label="Require special characters"
                    description="Passwords must contain !@#$%"
                    value={security.passwordRequireSpecial}
                    onChange={v => setSecurity(p => ({ ...p, passwordRequireSpecial: v }))}
                  />
                  <ToggleRow
                    label="Require numbers"
                    description="Passwords must contain at least one number"
                    value={security.passwordRequireNumbers}
                    onChange={v => setSecurity(p => ({ ...p, passwordRequireNumbers: v }))}
                  />
                </div>

                <Separator />

                {/* API Key */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">API Key</p>
                  <div className="flex gap-2">
                    <Input
                      value={security.apiKeyVisible ? apiKey : apiKey.replace(/[^-]/g, "•")}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button variant="outline" size="icon" onClick={() => setSecurity(p => ({ ...p, apiKeyVisible: !p.apiKeyVisible }))}>
                      {security.apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => toast.success("API key copied")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => toast.success("New API key generated")}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <SaveButton onClick={() => saveSection("Security")} />
            </SettingsSection>
          )}

          {/* ── Notifications ────────────────────────────────── */}
          {activeTab === "notifications" && (
            <SettingsSection title="Notifications" subtitle="Configure how and when notifications are sent">
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-sm font-medium">Channels</p>
                  <ToggleRow label="Email Notifications" description="Send notifications via email" value={notifications.emailEnabled} onChange={v => setNotifications(p => ({ ...p, emailEnabled: v }))} icon={<Mail className="h-4 w-4" />} />
                  <ToggleRow label="Slack Notifications" description="Send notifications to Slack" value={notifications.slackEnabled} onChange={v => setNotifications(p => ({ ...p, slackEnabled: v }))} icon={<span className="text-sm">💬</span>} />
                  <ToggleRow label="Microsoft Teams" description="Send notifications to Teams" value={notifications.teamsEnabled} onChange={v => setNotifications(p => ({ ...p, teamsEnabled: v }))} icon={<span className="text-sm">💜</span>} />
                  <ToggleRow label="SMS Alerts" description="Send critical alerts via SMS" value={notifications.smsEnabled} onChange={v => setNotifications(p => ({ ...p, smsEnabled: v }))} icon={<Smartphone className="h-4 w-4" />} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium">Notification Events</p>
                  <ToggleRow label="New Employee Onboarded" description="Notify HR team when an employee is added" value={notifications.notifyOnNewEmployee} onChange={v => setNotifications(p => ({ ...p, notifyOnNewEmployee: v }))} />
                  <ToggleRow label="Leave Request Submitted" description="Notify managers on new leave requests" value={notifications.notifyOnLeaveRequest} onChange={v => setNotifications(p => ({ ...p, notifyOnLeaveRequest: v }))} />
                  <ToggleRow label="Contract/License Expiring Soon" description="Warn 30 days before expiry" value={notifications.notifyOnExpiringSoon} onChange={v => setNotifications(p => ({ ...p, notifyOnExpiringSoon: v }))} />
                  <ToggleRow label="Security Alerts" description="Immediately notify on failed logins, suspicious activity" value={notifications.notifyOnSecurityAlert} onChange={v => setNotifications(p => ({ ...p, notifyOnSecurityAlert: v }))} />
                </div>

                <Separator />

                <div>
                  <Label>Digest Frequency</Label>
                  <Select value={notifications.digestFrequency} onValueChange={v => setNotifications(p => ({ ...p, digestFrequency: v }))}>
                    <SelectTrigger className="mt-1 w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SaveButton onClick={() => saveSection("Notifications")} />
            </SettingsSection>
          )}

          {/* ── Workflows ─────────────────────────────────────── */}
          {activeTab === "workflows" && (
            <SettingsSection title="Approval Workflows" subtitle="Configure multi-step approval chains for HR processes">
              <div className="space-y-3">
                {workflows.map(wf => (
                  <div key={wf.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{wf.name}</p>
                          <Badge variant="outline" className="text-xs">{wf.trigger.replace(/_/g, " ")}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{wf.steps.length} approval {wf.steps.length === 1 ? "step" : "steps"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={wf.active} onCheckedChange={() => handleToggleWorkflow(wf.id)} />
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedWorkflow(wf); setWorkflowEditOpen(true); }}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {wf.steps.map((step, i) => (
                        <div key={step.id} className="flex items-center gap-1">
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">{step.role}</span>
                          {i < wf.steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => toast.info("Workflow builder coming soon")}>
                  <Plus className="h-4 w-4 mr-2" /> Create New Workflow
                </Button>
              </div>
            </SettingsSection>
          )}

          {/* ── Integrations ─────────────────────────────────── */}
          {activeTab === "integrations" && (
            <SettingsSection title="Integrations" subtitle="Connect TalentHub to your existing tools and services">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {integrations.map(int => (
                  <div key={int.id} className="rounded-lg border p-4 flex items-center gap-3">
                    <div className="text-2xl">{int.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{int.name}</p>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${intStatusColor(int.status)}`}>
                          {int.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{int.type}</p>
                      {int.status === "connected" && (
                        <p className="text-xs text-muted-foreground">Last sync: {int.lastSync}</p>
                      )}
                    </div>
                    <Button
                      variant={int.status === "connected" ? "outline" : "default"}
                      size="sm"
                      className={`text-xs shrink-0 ${int.status === "connected" ? "" : ""}`}
                      onClick={() => handleConnectIntegration(int)}
                    >
                      {int.status === "connected" ? "Disconnect" : int.status === "error" ? "Reconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-dashed p-4 text-center">
                <Webhook className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Custom Webhook</p>
                <p className="text-xs text-muted-foreground mb-3">Receive TalentHub events via HTTP webhook</p>
                <Button variant="outline" size="sm" onClick={() => toast.info("Webhook configuration coming soon")}>
                  Configure Webhook
                </Button>
              </div>
            </SettingsSection>
          )}

          {/* ── Custom Fields ─────────────────────────────────── */}
          {activeTab === "custom_fields" && (
            <SettingsSection title="Custom Fields" subtitle="Add custom data fields to employees, positions, and org units">
              <div className="flex justify-end mb-3">
                <Button size="sm" onClick={() => setFieldCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Field
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left p-3 font-medium text-muted-foreground">Entity</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Label</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Required</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {customFields.map(field => (
                      <tr key={field.id} className="border-b last:border-0">
                        <td className="p-3"><Badge variant="outline" className="text-xs">{field.entity}</Badge></td>
                        <td className="p-3 font-medium">{field.label}</td>
                        <td className="p-3 text-muted-foreground capitalize">{field.type}</td>
                        <td className="p-3">
                          {field.required
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            : <X className="h-4 w-4 text-muted-foreground" />
                          }
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setSelectedField(field); setDeleteFieldOpen(true); }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SettingsSection>
          )}

          {/* ── Feature Flags ─────────────────────────────────── */}
          {activeTab === "feature_flags" && (
            <SettingsSection title="Feature Flags" subtitle="Enable or disable platform features for your organization">
              <div className="space-y-3">
                {featureFlags.map(flag => (
                  <div key={flag.id} className="flex items-start justify-between p-4 rounded-lg border">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{flag.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {flag.environment === "all" ? "All envs" : flag.environment}
                        </Badge>
                        {flag.enabled && <Badge className="text-xs bg-emerald-100 text-emerald-700 border-0">On</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{flag.description}</p>
                    </div>
                    <Switch checked={flag.enabled} onCheckedChange={() => handleToggleFlag(flag.id)} />
                  </div>
                ))}
              </div>
            </SettingsSection>
          )}

        </div>
      </div>

      {/* Workflow Edit Sheet */}
      <Sheet open={workflowEditOpen} onOpenChange={setWorkflowEditOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Workflow: {selectedWorkflow?.name}</SheetTitle>
          </SheetHeader>
          {selectedWorkflow && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Approval Steps</p>
                {selectedWorkflow.steps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <Input value={step.role} readOnly className="flex-1" />
                    <Input type="number" value={step.minApprovers} readOnly className="w-16" />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("Step editor coming soon")}>
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
              </div>
              <Button className="w-full" onClick={() => { setWorkflowEditOpen(false); toast.success("Workflow saved"); }}>
                Save Workflow
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Field Sheet */}
      <Sheet open={fieldCreateOpen} onOpenChange={setFieldCreateOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader><SheetTitle>Add Custom Field</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Entity</Label>
              <Select value={newField.entity} onValueChange={v => setNewField(p => ({ ...p, entity: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="Position">Position</SelectItem>
                  <SelectItem value="OrgUnit">Org Unit</SelectItem>
                  <SelectItem value="Location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Field Label *</Label>
              <Input value={newField.label} onChange={e => setNewField(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Blood Type" className="mt-1" />
            </div>
            <div>
              <Label>Field Type</Label>
              <Select value={newField.type} onValueChange={v => setNewField(p => ({ ...p, type: v as any }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="select">Dropdown Select</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={newField.required} onCheckedChange={v => setNewField(p => ({ ...p, required: v }))} />
              <Label>Required field</Label>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button className="flex-1" onClick={handleCreateField} disabled={!newField.label}>Create Field</Button>
            <Button variant="outline" onClick={() => setFieldCreateOpen(false)}>Cancel</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Disconnect Integration Dialog */}
      <Dialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect {selectedIntegration?.name}?</DialogTitle>
            <DialogDescription>
              Disconnecting will stop all data syncs and notifications from {selectedIntegration?.name}. You can reconnect at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisconnectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDisconnect}>Disconnect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Field Dialog */}
      <Dialog open={deleteFieldOpen} onOpenChange={setDeleteFieldOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Delete Custom Field
            </DialogTitle>
            <DialogDescription>
              Delete field "<strong>{selectedField?.label}</strong>"? Existing data for this field will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFieldOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteField}>Delete Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

// ─── Reusable sub-components ──────────────────────────────────────────────────

function SettingsSection({ title, subtitle, children }: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Separator />
      {children}
    </div>
  );
}

function ToggleRow({ label, description, value, onChange, icon }: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-end pt-2">
      <Button onClick={onClick}>
        <Save className="h-4 w-4 mr-1" /> Save Changes
      </Button>
    </div>
  );
}
