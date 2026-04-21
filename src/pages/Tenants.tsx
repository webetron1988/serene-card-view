import { useEffect, useState } from "react";
import {
  Building2, Plus, Search, MoreHorizontal, Edit2, Trash2,
  Users, Globe, AlertTriangle, Download, X, CheckCircle2,
  Ban, Settings2, Key, BarChart3, Clock, ExternalLink, Shield,
  Package, CalendarDays, Activity, Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type TenantPlan = "starter" | "professional" | "enterprise" | "custom";
type TenantStatus = "active" | "suspended" | "trial" | "churned";

type Tenant = {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  status: TenantStatus;
  industry: string;
  country: string;
  employees: number;
  seats: number;
  adminEmail: string;
  adminName: string;
  modules: string[];
  createdAt: string;
  trialEndsAt?: string;
  mrr: number;
  dataRegion: string;
  ssoEnabled: boolean;
  mfaRequired: boolean;
};

const PLAN_CONFIG: Record<TenantPlan, { label: string; color: string }> = {
  starter: { label: "Starter", color: "bg-gray-100 text-gray-700" },
  professional: { label: "Professional", color: "bg-blue-100 text-blue-700" },
  enterprise: { label: "Enterprise", color: "bg-violet-100 text-violet-700" },
  custom: { label: "Custom", color: "bg-amber-100 text-amber-700" },
};

const SAMPLE_TENANTS: Tenant[] = [
  {
    id: "t-001", name: "Acme Corporation", slug: "acme-corp", plan: "enterprise", status: "active",
    industry: "Technology", country: "United States", employees: 1240, seats: 1500,
    adminEmail: "admin@acme.com", adminName: "James Wilson",
    modules: ["Core HR", "Recruitment", "Performance", "Analytics", "Payroll"],
    createdAt: "2022-03-15", mrr: 4500, dataRegion: "US-East",
    ssoEnabled: true, mfaRequired: true
  },
  {
    id: "t-002", name: "GlobalTech Solutions", slug: "globaltech", plan: "professional", status: "active",
    industry: "Consulting", country: "United Kingdom", employees: 380, seats: 500,
    adminEmail: "hr-admin@globaltech.io", adminName: "Sarah Ahmed",
    modules: ["Core HR", "Recruitment", "Performance"],
    createdAt: "2022-09-01", mrr: 1200, dataRegion: "EU-West",
    ssoEnabled: true, mfaRequired: false
  },
  {
    id: "t-003", name: "StartupXYZ", slug: "startupxyz", plan: "starter", status: "trial",
    industry: "SaaS", country: "Singapore", employees: 45, seats: 100,
    adminEmail: "ops@startupxyz.co", adminName: "Kevin Lim",
    modules: ["Core HR"],
    createdAt: "2024-02-01", trialEndsAt: "2024-03-01", mrr: 0, dataRegion: "APAC",
    ssoEnabled: false, mfaRequired: false
  },
  {
    id: "t-004", name: "MegaFinance Group", slug: "megafinance", plan: "enterprise", status: "active",
    industry: "Financial Services", country: "United Arab Emirates", employees: 2100, seats: 2500,
    adminEmail: "it-admin@megafinance.ae", adminName: "Mohammed Al Rashid",
    modules: ["Core HR", "Recruitment", "Performance", "Payroll", "Compliance", "Analytics"],
    createdAt: "2021-07-20", mrr: 8900, dataRegion: "ME-South",
    ssoEnabled: true, mfaRequired: true
  },
  {
    id: "t-005", name: "RetailPro Inc.", slug: "retailpro", plan: "professional", status: "active",
    industry: "Retail", country: "Australia", employees: 680, seats: 800,
    adminEmail: "people@retailpro.com.au", adminName: "Emma Davies",
    modules: ["Core HR", "Recruitment", "Attendance"],
    createdAt: "2023-01-10", mrr: 1800, dataRegion: "APAC",
    ssoEnabled: false, mfaRequired: false
  },
  {
    id: "t-006", name: "HealthFirst Systems", slug: "healthfirst", plan: "custom", status: "active",
    industry: "Healthcare", country: "India", employees: 3400, seats: 4000,
    adminEmail: "cto@healthfirst.in", adminName: "Priya Nair",
    modules: ["Core HR", "Recruitment", "Performance", "Compliance", "Analytics", "Payroll", "Scheduling"],
    createdAt: "2020-11-05", mrr: 14200, dataRegion: "APAC",
    ssoEnabled: true, mfaRequired: true
  },
  {
    id: "t-007", name: "EduLearn Academy", slug: "edulearn", plan: "starter", status: "active",
    industry: "Education", country: "Canada", employees: 120, seats: 200,
    adminEmail: "admin@edulearn.ca", adminName: "Tom Bradley",
    modules: ["Core HR", "Learning"],
    createdAt: "2023-06-15", mrr: 320, dataRegion: "US-East",
    ssoEnabled: false, mfaRequired: false
  },
  {
    id: "t-008", name: "OldMfg Ltd.", slug: "oldmfg", plan: "professional", status: "churned",
    industry: "Manufacturing", country: "Germany", employees: 0, seats: 300,
    adminEmail: "it@oldmfg.de", adminName: "Hans Müller",
    modules: ["Core HR"],
    createdAt: "2022-01-01", mrr: 0, dataRegion: "EU-West",
    ssoEnabled: false, mfaRequired: false
  },
  {
    id: "t-009", name: "FastGrow Startup", slug: "fastgrow", plan: "starter", status: "suspended",
    industry: "E-Commerce", country: "Brazil", employees: 55, seats: 100,
    adminEmail: "finance@fastgrow.io", adminName: "Carlos Silva",
    modules: ["Core HR"],
    createdAt: "2023-09-20", mrr: 0, dataRegion: "US-East",
    ssoEnabled: false, mfaRequired: false
  },
];

const emptyTenant: Omit<Tenant, "id" | "createdAt" | "mrr"> = {
  name: "", slug: "", plan: "professional", status: "trial",
  industry: "", country: "", employees: 0, seats: 100,
  adminEmail: "", adminName: "", modules: ["Core HR"],
  dataRegion: "US-East", ssoEnabled: false, mfaRequired: false,
};

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>(SAMPLE_TENANTS);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewTab, setViewTab] = useState("overview");
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [form, setForm] = useState<Omit<Tenant, "id" | "createdAt" | "mrr">>(emptyTenant);

  const filtered = tenants.filter(t => {
    const matchSearch = !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      t.adminEmail.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || t.plan === planFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === "active").length,
    mrr: tenants.reduce((s, t) => s + t.mrr, 0),
    employees: tenants.reduce((s, t) => s + t.employees, 0),
  };

  function openView(tenant: Tenant) {
    setSelected(tenant);
    setViewTab("overview");
    setViewOpen(true);
  }

  function openSuspend(tenant: Tenant) {
    setSelected(tenant);
    setSuspendOpen(true);
  }

  function openDelete(tenant: Tenant) {
    setSelected(tenant);
    setDeleteOpen(true);
  }

  function handleCreate() {
    const newTenant: Tenant = {
      ...form,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      mrr: form.plan === "starter" ? 320 : form.plan === "professional" ? 1200 : 4500,
    };
    setTenants(prev => [newTenant, ...prev]);
    setCreateOpen(false);
    toast.success(`Tenant "${form.name}" created`);
  }

  function handleSuspend() {
    if (!selected) return;
    const newStatus: TenantStatus = selected.status === "suspended" ? "active" : "suspended";
    setTenants(prev => prev.map(t => t.id === selected.id ? { ...t, status: newStatus } : t));
    setSuspendOpen(false);
    toast.success(`Tenant "${selected.name}" ${newStatus === "suspended" ? "suspended" : "reactivated"}`);
  }

  function handleDelete() {
    if (!selected) return;
    setTenants(prev => prev.filter(t => t.id !== selected.id));
    setDeleteOpen(false);
    setViewOpen(false);
    toast.success(`Tenant "${selected.name}" deleted`);
  }

  const statusColor = (s: TenantStatus) => {
    if (s === "active") return "active";
    if (s === "trial") return "pending";
    return "inactive";
  };

  return (
    <AppShell title="Tenants" subtitle="Platform tenant management">
      <PageHeader
        title="Tenants"
        subtitle="Manage organizations using the TalentHub platform"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Export started")}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" onClick={() => { setForm(emptyTenant); setCreateOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> New Tenant
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Tenants" value={stats.total} icon={<Building2 className="h-5 w-5" />} />
        <StatsCard title="Active Tenants" value={stats.active} icon={<CheckCircle2 className="h-5 w-5" />} trend={{ value: 3, positive: true }} />
        <StatsCard title="Monthly Revenue" value={`$${(stats.mrr / 1000).toFixed(1)}k`} icon={<BarChart3 className="h-5 w-5" />} trend={{ value: 12, positive: true }} />
        <StatsCard title="Total Employees" value={stats.employees.toLocaleString()} icon={<Users className="h-5 w-5" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>}
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Plan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left p-3 font-medium text-muted-foreground">Tenant</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Plan</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Industry</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Employees</th>
              <th className="text-left p-3 font-medium text-muted-foreground">MRR</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" /><p>No tenants found</p>
              </td></tr>
            ) : filtered.map(t => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => openView(t)}>
                <td className="p-3" onClick={e => e.stopPropagation()}>
                  <button className="text-left" onClick={() => openView(t)}>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{t.slug}</p>
                    <p className="text-xs text-muted-foreground">{t.adminEmail}</p>
                  </button>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PLAN_CONFIG[t.plan].color}`}>
                    {PLAN_CONFIG[t.plan].label}
                  </span>
                </td>
                <td className="p-3">
                  <p className="text-sm">{t.industry}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" />{t.country}
                  </p>
                </td>
                <td className="p-3">
                  <p className="font-medium">{t.employees.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">of {t.seats.toLocaleString()} seats</p>
                </td>
                <td className="p-3">
                  {t.mrr > 0
                    ? <p className="font-medium text-emerald-600">${t.mrr.toLocaleString()}</p>
                    : <p className="text-muted-foreground text-xs">{t.status === "trial" ? "Trial" : "—"}</p>
                  }
                </td>
                <td className="p-3">
                  <StatusBadge
                    status={statusColor(t.status)}
                    label={t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  />
                  {t.trialEndsAt && (
                    <p className="text-xs text-amber-600 mt-0.5">Ends {t.trialEndsAt}</p>
                  )}
                </td>
                <td className="p-3" onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openView(t)}>
                        <ExternalLink className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info("Impersonate coming soon")}>
                        <Shield className="h-4 w-4 mr-2" /> Impersonate Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info("Opening tenant settings")}>
                        <Settings2 className="h-4 w-4 mr-2" /> Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openSuspend(t)}>
                        {t.status === "suspended"
                          ? <><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" /> Reactivate</>
                          : <><Ban className="h-4 w-4 mr-2 text-amber-600" /> Suspend</>
                        }
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => openDelete(t)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Tenant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{filtered.length} of {tenants.length} tenants</p>

      {/* View Tenant Sheet */}
      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle>{selected.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground font-mono">{selected.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PLAN_CONFIG[selected.plan].color}`}>
                      {PLAN_CONFIG[selected.plan].label}
                    </span>
                    <StatusBadge
                      status={statusColor(selected.status)}
                      label={selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                    />
                  </div>
                </div>
              </SheetHeader>

              <Tabs value={viewTab} onValueChange={setViewTab} className="mt-4">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="modules" className="flex-1">Modules</TabsTrigger>
                  <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                  <TabsTrigger value="billing" className="flex-1">Billing</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Employees</p>
                      <p className="text-lg font-bold">{selected.employees.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">of {selected.seats.toLocaleString()} seats</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                      <p className="text-lg font-bold text-emerald-600">${selected.mrr.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 space-y-2">
                    <h4 className="font-medium text-sm">Details</h4>
                    {[
                      ["Industry", selected.industry],
                      ["Country", selected.country],
                      ["Data Region", selected.dataRegion],
                      ["Admin", selected.adminName],
                      ["Admin Email", selected.adminEmail],
                      ["Member Since", selected.createdAt],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="modules" className="mt-4">
                  <div className="space-y-2">
                    {["Core HR", "Recruitment", "Performance", "Analytics", "Payroll", "Compliance", "Learning", "Scheduling", "Attendance"].map(mod => {
                      const enabled = selected.modules.includes(mod);
                      return (
                        <div key={mod} className={`flex items-center justify-between p-3 rounded-lg border ${enabled ? "bg-emerald-50 border-emerald-200" : "bg-muted/30"}`}>
                          <div className="flex items-center gap-2">
                            <Package className={`h-4 w-4 ${enabled ? "text-emerald-600" : "text-muted-foreground"}`} />
                            <span className={`text-sm font-medium ${enabled ? "text-emerald-800" : "text-muted-foreground"}`}>{mod}</span>
                          </div>
                          {enabled
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            : <Lock className="h-4 w-4 text-muted-foreground" />
                          }
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-4 space-y-3">
                  {[
                    { label: "SSO Enabled", value: selected.ssoEnabled, icon: <Key className="h-4 w-4" /> },
                    { label: "MFA Required", value: selected.mfaRequired, icon: <Shield className="h-4 w-4" /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      <Badge variant="secondary" className={value ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}>
                        {value ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm font-medium mb-1">Data Region</p>
                    <p className="text-sm text-muted-foreground">{selected.dataRegion}</p>
                  </div>
                </TabsContent>

                <TabsContent value="billing" className="mt-4 space-y-3">
                  <div className="rounded-lg border p-4 space-y-2">
                    <h4 className="font-medium text-sm">Current Plan</h4>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${PLAN_CONFIG[selected.plan].color}`}>
                        {PLAN_CONFIG[selected.plan].label}
                      </span>
                      <span className="font-bold text-lg">${selected.mrr.toLocaleString()}<span className="text-xs text-muted-foreground">/mo</span></span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => toast.info("Opening billing portal")}>
                    <ExternalLink className="h-4 w-4 mr-2" /> Open Billing Portal
                  </Button>
                </TabsContent>
              </Tabs>

              <Separator className="my-4" />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => openSuspend(selected)}>
                  {selected.status === "suspended" ? "Reactivate" : <><Ban className="h-4 w-4 mr-1" /> Suspend</>}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => openDelete(selected)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle>New Tenant</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Company Name *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Acme Corp" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} placeholder="acme-corp" className="mt-1 font-mono" />
                <p className="text-xs text-muted-foreground mt-1">Used in tenant URL: app.talentcorp.io/{form.slug || "..."}</p>
              </div>
              <div>
                <Label>Plan</Label>
                <Select value={form.plan} onValueChange={v => setForm(p => ({ ...p, plan: v as TenantPlan }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Seats</Label>
                <Input type="number" value={form.seats} onChange={e => setForm(p => ({ ...p, seats: +e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Industry</Label>
                <Input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="Technology" className="mt-1" />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="United States" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Admin Name *</Label>
                <Input value={form.adminName} onChange={e => setForm(p => ({ ...p, adminName: e.target.value }))} placeholder="John Smith" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Admin Email *</Label>
                <Input type="email" value={form.adminEmail} onChange={e => setForm(p => ({ ...p, adminEmail: e.target.value }))} placeholder="admin@company.com" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Data Region</Label>
                <Select value={form.dataRegion} onValueChange={v => setForm(p => ({ ...p, dataRegion: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US-East">US East</SelectItem>
                    <SelectItem value="US-West">US West</SelectItem>
                    <SelectItem value="EU-West">EU West</SelectItem>
                    <SelectItem value="APAC">APAC</SelectItem>
                    <SelectItem value="ME-South">Middle East</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button className="flex-1" onClick={handleCreate} disabled={!form.name || !form.slug || !form.adminEmail}>
              Create Tenant
            </Button>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Suspend Dialog */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selected?.status === "suspended"
                ? <><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Reactivate Tenant</>
                : <><Ban className="h-5 w-5 text-amber-600" /> Suspend Tenant</>
              }
            </DialogTitle>
            <DialogDescription>
              {selected?.status === "suspended"
                ? `Reactivating "${selected?.name}" will restore full access to all users and modules.`
                : `Suspending "${selected?.name}" will immediately block all users from accessing the platform.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>Cancel</Button>
            <Button
              variant={selected?.status === "suspended" ? "default" : "outline"}
              className={selected?.status !== "suspended" ? "text-amber-700 border-amber-300 hover:bg-amber-50" : ""}
              onClick={handleSuspend}
            >
              {selected?.status === "suspended" ? "Reactivate" : "Suspend Tenant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Delete Tenant
            </DialogTitle>
            <DialogDescription>
              Permanently delete <strong>{selected?.name}</strong>? This will delete all tenant data, users, and configurations. This action is <strong>irreversible</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            Deleting this tenant will affect {selected?.employees.toLocaleString()} employees and all associated data.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
