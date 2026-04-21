import { useState, useMemo, Fragment } from "react";
import {
  Check, Minus, Plus, CreditCard, Users, Zap, TrendingUp, Crown, Star,
  Shield, Brain, BarChart3, Eye, ChevronRight, Infinity, Search,
  Layers, Settings2, Palette, PlugZap, LineChart, Copy, Archive,
  MoreVertical, Sparkles, Pencil, Package as PackageIcon, Building2,
  ArrowUpRight, ArrowDownRight, Calendar, Clock, Wallet, DollarSign,
  ChevronDown, ChevronUp, RefreshCw, Ban, CheckCircle2, ExternalLink
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  mockPackages, mockSubscriptions, packageMrrTrend, featureCategories,
  Package, PackageFeatures, TenantSubscription
} from "@/data/packagesData";
import { SubscriptionDetailPanel } from "@/components/packages/SubscriptionDetailPanel";
import { toast } from "sonner";
import { usePackagesData, buildDefaultFeatures } from "@/hooks/usePackagesData";
import { usePackageMutations } from "@/hooks/usePackageMutations";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogManager } from "@/components/packages/CatalogManager";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, AreaChart, Area
} from "recharts";

// ─── Helpers ────────────────────────────────────────────────
function fmtLimit(v: number) {
  if (v === -1) return "Unlimited";
  return v.toLocaleString();
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const PLAN_COLORS = [
  "hsl(var(--muted-foreground))",
  "hsl(210, 90%, 55%)",
  "hsl(var(--primary))",
  "hsl(270, 60%, 55%)",
];

const SUB_STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  trial: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  expired: "bg-muted text-muted-foreground",
  suspended: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground line-through",
};

function renderFeatureValue(feat: PackageFeatures, key: string, type: string) {
  const val = (feat as any)[key];
  if (type === "boolean") {
    return val ? (
      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
        <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
      </div>
    ) : (
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mx-auto">
        <Minus className="h-3 w-3 text-muted-foreground/40" strokeWidth={1.5} />
      </div>
    );
  }
  if (type === "limit") {
    if (val === -1) return <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Infinity className="h-3.5 w-3.5" strokeWidth={1.5} /></span>;
    if (val === 0) return <span className="text-xs text-muted-foreground">—</span>;
    return <span className="text-xs font-semibold text-foreground">{val.toLocaleString()}</span>;
  }
  if (type === "retention") {
    if (val === -1) return <span className="text-xs font-semibold text-foreground">Forever</span>;
    return <span className="text-xs font-semibold text-foreground">{val}d</span>;
  }
  if (type === "text") {
    return <span className="text-xs font-semibold text-foreground capitalize">{val}</span>;
  }
  return null;
}

// ─── Drawer section config ──────────────────────────────
const drawerSections = [
  { id: "basic", label: "Package Details", icon: Settings2, description: "Name, pricing, and type" },
  { id: "limits", label: "Core Limits", icon: Layers, description: "Employees, admins, departments" },
  { id: "modules", label: "HR Modules", icon: Brain, description: "Core HR, Recruitment, Payroll, etc." },
  { id: "integrations", label: "Integrations", icon: PlugZap, description: "API, SSO, webhooks" },
  { id: "branding", label: "Branding", icon: Palette, description: "Custom branding and white label" },
  { id: "security", label: "Security & Compliance", icon: Shield, description: "RBAC, audit logs, encryption" },
  { id: "support", label: "Support", icon: LineChart, description: "Support tier, SLA, onboarding" },
];

// ─── Component ──────────────────────────────────────────────
export default function Packages() {
  const { packages, subscriptions, catalog, loading, refresh } = usePackagesData();
  const { upsertPackage, archivePackage, duplicatePackage, saving } = usePackageMutations(catalog);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Package | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [openSections, setOpenSections] = useState<string[]>(["basic"]);
  const [billingToggle, setBillingToggle] = useState<"monthly" | "yearly">("monthly");
  const [subSearch, setSubSearch] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState("all");
  const [subPkgFilter, setSubPkgFilter] = useState("all");
  const [selectedSub, setSelectedSub] = useState<TenantSubscription | null>(null);
  const [subDetailOpen, setSubDetailOpen] = useState(false);

  // Analytics
  const totalMRR = packages.reduce((s, p) => s + p.mrr, 0);
  const totalSubscribers = packages.reduce((s, p) => s + p.subscriberCount, 0);
  const avgRevPerUser = totalSubscribers > 0 ? totalMRR / totalSubscribers : 0;
  const activeCount = subscriptions.filter(s => s.status === "active").length;
  const trialCount = subscriptions.filter(s => s.status === "trial").length;

  const pieData = packages.filter(p => p.subscriberCount > 0).map((p, i) => ({
    name: p.name, value: p.subscriberCount, color: PLAN_COLORS[i] || PLAN_COLORS[0],
  }));
  const revPieData = packages.filter(p => p.mrr > 0).map((p, i) => ({
    name: p.name, value: p.mrr, color: PLAN_COLORS[i] || PLAN_COLORS[0],
  }));

  // Filtered subscriptions
  const filteredSubs = useMemo(() => {
    return subscriptions.filter(s => {
      const q = subSearch.toLowerCase();
      const matchSearch = !subSearch || s.tenantName.toLowerCase().includes(q) || s.tenantEmail.toLowerCase().includes(q);
      const matchStatus = subStatusFilter === "all" || s.status === subStatusFilter;
      const matchPkg = subPkgFilter === "all" || s.packageId === subPkgFilter;
      return matchSearch && matchStatus && matchPkg;
    });
  }, [subscriptions, subSearch, subStatusFilter, subPkgFilter]);

  function toggleSection(id: string) {
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  const hasFreePlan = packages.some(p => p.type === "free" && p.status === "active");

  function openCreate() {
    setIsCreating(true);
    const defaults = buildDefaultFeatures(catalog);
    // Sensible starting limits for common keys (only if present in catalog)
    if ("employees" in defaults) (defaults as any).employees = 50;
    if ("adminUsers" in defaults) (defaults as any).adminUsers = 3;
    if ("departments" in defaults) (defaults as any).departments = 5;
    if ("locations" in defaults) (defaults as any).locations = 2;
    if ("storage" in defaults) (defaults as any).storage = "2 GB";
    if ("coreHR" in defaults) (defaults as any).coreHR = true;
    if ("attendance" in defaults) (defaults as any).attendance = true;
    if ("dataEncryption" in defaults) (defaults as any).dataEncryption = true;
    if ("dataRetentionDays" in defaults) (defaults as any).dataRetentionDays = 30;
    if ("supportLevel" in defaults) (defaults as any).supportLevel = "Email";
    if ("slaGuarantee" in defaults) (defaults as any).slaGuarantee = "None";
    if ("onboarding" in defaults) (defaults as any).onboarding = "Self-serve docs";
    setEditPlan({
      id: "new", name: "", type: "paid", price: 0, yearlyPrice: 0,
      interval: "monthly", description: "", subscriberCount: 0, mrr: 0,
      color: "hsl(var(--primary))", status: "active",
      features: defaults,
    });
    setOpenSections(["basic", "limits"]);
    setDrawerOpen(true);
  }

  function openEdit(plan: Package) {
    setIsCreating(false);
    setEditPlan({ ...plan, features: { ...plan.features } });
    setOpenSections(["basic"]);
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!editPlan || !editPlan.name.trim()) { toast.error("Package name is required"); return; }
    if (isCreating && editPlan.type === "free" && hasFreePlan) {
      toast.error("Only one Free/Trial package is allowed"); return;
    }
    try {
      await upsertPackage(editPlan, isCreating);
      toast.success(isCreating ? `Package "${editPlan.name}" created` : `Package "${editPlan.name}" updated`);
      setDrawerOpen(false);
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save package");
    }
  }

  function updateFeature(key: string, value: any) {
    if (!editPlan) return;
    setEditPlan({ ...editPlan, features: { ...editPlan.features, [key]: value } });
  }

  async function duplicatePlan(plan: Package) {
    try {
      await duplicatePackage(plan);
      toast.success(`Package "${plan.name}" duplicated`);
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to duplicate");
    }
  }

  async function archivePlan(plan: Package) {
    try {
      await archivePackage(plan.id);
      toast.success(`Package "${plan.name}" archived`);
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to archive");
    }
  }

  const tooltipStyle = {
    contentStyle: {
      background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
      borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
  };

  const activePackages = packages.filter(p => p.status === "active");

  // Group catalog into categories (preserves DB sort_order)
  const catalogByCategory = useMemo(() => {
    const map = new Map<string, typeof catalog>();
    for (const f of catalog) {
      if (!map.has(f.category)) map.set(f.category, []);
      map.get(f.category)!.push(f);
    }
    return Array.from(map.entries()).map(([name, features]) => ({ name, features }));
  }, [catalog]);

  return (
    <AppShell>
      <div className="space-y-6 page-enter">
        <PageHeader
          title="Packages"
          subtitle="Configure subscription packages, features, and monitor tenant subscriptions"
          actions={
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" strokeWidth={1.5} /> New Package
            </Button>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/60 border border-border/50 p-1 h-auto rounded-xl">
            {[
              { value: "overview", icon: BarChart3, label: "Overview" },
              { value: "plans", icon: CreditCard, label: "Packages" },
              { value: "matrix", icon: Layers, label: "Feature Matrix" },
              { value: "subscriptions", icon: Building2, label: "Subscriptions" },
              { value: "preview", icon: Eye, label: "Pricing Preview" },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs px-5 py-2 rounded-lg gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
              >
                <tab.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ═══ OVERVIEW TAB ═══ */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total MRR", value: formatCurrency(totalMRR), icon: DollarSign, sub: `${activeCount} active`, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Total Subscribers", value: totalSubscribers, icon: Users, sub: `${trialCount} on trial`, color: "bg-primary/10 text-primary" },
                { label: "Avg Revenue/Tenant", value: formatCurrency(avgRevPerUser), icon: TrendingUp, sub: `across ${activePackages.length} packages`, color: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Active Packages", value: activePackages.length, icon: PackageIcon, sub: `${packages.length} total`, color: "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" },
              ].map(kpi => (
                <div key={kpi.label} className="bg-card border border-border/60 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</p>
                    <div className={`w-8 h-8 rounded-lg ${kpi.color} flex items-center justify-center`}>
                      <kpi.icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground tracking-tight">{kpi.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* MRR Trend */}
              <div className="lg:col-span-2 bg-card border border-border/60 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">MRR Trend by Package</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={packageMrrTrend}>
                    <defs>
                      {activePackages.map((p, i) => (
                        <linearGradient key={p.id} id={`grad-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={PLAN_COLORS[i]} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={PLAN_COLORS[i]} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                    {activePackages.map((p, i) => (
                      <Area key={p.id} type="monotone" dataKey={p.name.split(" ")[0]} stroke={PLAN_COLORS[i]} fill={`url(#grad-${p.id})`} strokeWidth={2} />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Distribution Pies */}
              <div className="bg-card border border-border/60 rounded-xl p-5 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Subscriber Distribution</h3>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
                        {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip {...tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {pieData.map(d => (
                      <span key={d.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span className="w-2 h-2 rounded-full" style={{ background: d.color }} /> {d.name}
                      </span>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Revenue Distribution</h3>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={revPieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
                        {revPieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ═══ PACKAGES TAB ═══ */}
          <TabsContent value="plans" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {activePackages.map((plan, i) => (
                <div
                  key={plan.id}
                  className={`relative bg-card border rounded-xl p-5 transition-all hover:shadow-lg ${
                    plan.isPopular ? "border-primary ring-1 ring-primary/20" : "border-border/60"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3" /> POPULAR
                      </span>
                    </div>
                  )}
                  {plan.isTrial && (
                    <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]">FREE</Badge>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: PLAN_COLORS[i] }} />
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(plan)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicatePlan(plan)}>
                          <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => archivePlan(plan)}>
                          <Archive className="h-3.5 w-3.5 mr-2" /> Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{plan.description}</p>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">${billingToggle === "monthly" ? plan.price : plan.yearlyPrice}</span>
                    <span className="text-xs text-muted-foreground">/{billingToggle === "monthly" ? "mo" : "yr"}</span>
                  </div>

                  <Separator className="my-3" />

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subscribers</span><span className="font-semibold">{plan.subscriberCount}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">MRR</span><span className="font-semibold text-emerald-600">{formatCurrency(plan.mrr)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Employees</span><span className="font-semibold">{fmtLimit(plan.features.employees)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Modules</span>
                      <span className="font-semibold">
                        {["coreHR","recruitment","performance","payroll","attendance","learning","analytics","scheduling","compliance","benefits"]
                          .filter(k => (plan.features as any)[k]).length}/10
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-4 text-xs" onClick={() => openEdit(plan)}>
                    Configure
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ═══ FEATURE MATRIX TAB ═══ */}
          <TabsContent value="matrix">
            <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left p-3 font-medium text-muted-foreground min-w-[200px]">Feature</th>
                      {activePackages.map((p, i) => (
                        <th key={p.id} className="text-center p-3 min-w-[140px]">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: PLAN_COLORS[i] }} />
                            <span className="text-xs font-semibold text-foreground">{p.name}</span>
                            <span className="text-[10px] text-muted-foreground">${p.price}/mo</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {catalogByCategory.map(cat => (
                      <Fragment key={cat.name}>
                        <tr className="bg-muted/20">
                          <td colSpan={activePackages.length + 1} className="p-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cat.name}</td>
                        </tr>
                        {cat.features.map(feat => (
                          <tr key={feat.key} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                            <td className="p-3 text-xs text-foreground">{feat.label}</td>
                            {activePackages.map(p => (
                              <td key={p.id} className="p-3 text-center">
                                {renderFeatureValue(p.features, feat.key, feat.value_type)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ═══ SUBSCRIPTIONS TAB (360° View) ═══ */}
          <TabsContent value="subscriptions" className="space-y-4">
            {/* Sub Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Active Subscriptions", value: activeCount, icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10" },
                { label: "Trial", value: trialCount, icon: Clock, color: "bg-amber-100 text-amber-600 dark:bg-amber-500/10" },
                { label: "Suspended", value: subscriptions.filter(s => s.status === "suspended").length, icon: Ban, color: "bg-destructive/10 text-destructive" },
                { label: "Cancelled", value: subscriptions.filter(s => s.status === "cancelled").length, icon: RefreshCw, color: "bg-muted text-muted-foreground" },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border/60 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
                    <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center`}>
                      <s.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tenants..." value={subSearch} onChange={e => setSubSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={subPkgFilter} onValueChange={setSubPkgFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Package" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  {activePackages.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={subStatusFilter} onValueChange={setSubStatusFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subscription Table */}
            <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left p-3 font-medium text-muted-foreground">Tenant</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Package</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">MRR</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Seats</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Next Billing</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Health</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.length === 0 ? (
                    <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" /><p>No subscriptions found</p>
                    </td></tr>
                  ) : filteredSubs.map(sub => {
                    const seatPct = sub.seats > 0 ? Math.round((sub.usedSeats / sub.seats) * 100) : 0;
                    return (
                      <tr key={sub.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => { setSelectedSub(sub); setSubDetailOpen(true); }}>
                        <td className="p-3">
                          <p className="font-medium text-sm">{sub.tenantName}</p>
                          <p className="text-xs text-muted-foreground">{sub.tenantEmail}</p>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-[11px] font-medium">{sub.packageName}</Badge>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${SUB_STATUS_COLORS[sub.status]}`}>
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </span>
                          {sub.trialEndsAt && (
                            <p className="text-[10px] text-amber-600 mt-0.5">Ends {sub.trialEndsAt}</p>
                          )}
                        </td>
                        <td className="p-3">
                          {sub.mrr > 0 ? (
                            <span className="font-semibold text-emerald-600 text-sm">{formatCurrency(sub.mrr)}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <p className="text-xs font-medium">{sub.usedSeats} / {sub.seats}</p>
                            <Progress value={seatPct} className="h-1 w-16" />
                          </div>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{sub.nextBillingDate}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${sub.healthScore >= 80 ? "bg-emerald-500" : sub.healthScore >= 50 ? "bg-amber-500" : "bg-destructive"}`} />
                            <span className="text-xs font-semibold">{sub.healthScore}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedSub(sub); setSubDetailOpen(true); }}>
                                <ExternalLink className="h-3.5 w-3.5 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info("Upgrade dialog coming soon")}>
                                <ArrowUpRight className="h-3.5 w-3.5 mr-2" /> Upgrade Package
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => toast.success("Subscription suspended")} className="text-destructive">
                                <Ban className="h-3.5 w-3.5 mr-2" /> Suspend
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-3 border-t bg-muted/20">
                <p className="text-xs text-muted-foreground">{filteredSubs.length} of {subscriptions.length} subscriptions</p>
              </div>
            </div>
          </TabsContent>

          {/* ═══ PRICING PREVIEW TAB ═══ */}
          <TabsContent value="preview" className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className={`text-sm font-medium ${billingToggle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
              <Switch checked={billingToggle === "yearly"} onCheckedChange={v => setBillingToggle(v ? "yearly" : "monthly")} />
              <span className={`text-sm font-medium ${billingToggle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly <Badge variant="secondary" className="ml-1 text-[10px]">Save ~17%</Badge>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {activePackages.map((plan, i) => (
                <div
                  key={plan.id}
                  className={`relative bg-card border rounded-2xl p-6 transition-all ${
                    plan.isPopular ? "border-primary ring-2 ring-primary/20 shadow-xl scale-[1.02]" : "border-border/60 hover:shadow-lg"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Crown className="h-3 w-3" /> MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-extrabold text-foreground">${billingToggle === "monthly" ? plan.price : plan.yearlyPrice}</span>
                    <span className="text-sm text-muted-foreground">/{billingToggle === "monthly" ? "mo" : "yr"}</span>
                  </div>
                  <Button className={`w-full mb-5 ${plan.isPopular ? "" : "variant-outline"}`} variant={plan.isPopular ? "default" : "outline"}>
                    {plan.isTrial ? "Start Free" : "Get Started"}
                  </Button>
                  <Separator className="mb-4" />
                  <ul className="space-y-2.5">
                    <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> Up to {fmtLimit(plan.features.employees)} employees</li>
                    <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> {fmtLimit(plan.features.adminUsers)} admin users</li>
                    <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> {plan.features.storage} storage</li>
                    {plan.features.recruitment && <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> Recruitment</li>}
                    {plan.features.payroll && <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> Payroll</li>}
                    {plan.features.performance && <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> Performance Management</li>}
                    {plan.features.analytics && <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> Advanced Analytics</li>}
                    {plan.features.ssoSaml && <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> SSO / SAML</li>}
                    {plan.features.whiteLabel && <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> White Label</li>}
                    <li className="flex items-center gap-2 text-xs"><Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> {plan.features.supportLevel} support</li>
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* ═══ EDIT/CREATE DRAWER ═══ */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="sm:max-w-lg p-0 flex flex-col">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle>{isCreating ? "Create Package" : `Edit "${editPlan?.name}"`}</SheetTitle>
              <SheetDescription>
                {isCreating ? "Configure a new subscription package" : "Modify package settings and features"}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-2">
                {drawerSections.map(section => (
                  <Collapsible key={section.id} open={openSections.includes(section.id)} onOpenChange={() => toggleSection(section.id)}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <section.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{section.label}</p>
                          <p className="text-[11px] text-muted-foreground">{section.description}</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${openSections.includes(section.id) ? "rotate-90" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3">
                      <div className="pl-11 space-y-3 pt-2">
                        {section.id === "basic" && editPlan && (
                          <>
                            <div>
                              <Label className="text-xs">Package Name</Label>
                              <Input value={editPlan.name} onChange={e => setEditPlan({ ...editPlan, name: e.target.value })} className="mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs">Description</Label>
                              <Input value={editPlan.description} onChange={e => setEditPlan({ ...editPlan, description: e.target.value })} className="mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Type</Label>
                                <Select value={editPlan.type} onValueChange={v => setEditPlan({ ...editPlan, type: v as "free" | "paid" })}>
                                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="free">Free / Trial</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Status</Label>
                                <Select value={editPlan.status} onValueChange={v => setEditPlan({ ...editPlan, status: v as any })}>
                                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Monthly Price ($)</Label>
                                <Input type="number" value={editPlan.price} onChange={e => setEditPlan({ ...editPlan, price: +e.target.value })} className="mt-1" />
                              </div>
                              <div>
                                <Label className="text-xs">Yearly Price ($)</Label>
                                <Input type="number" value={editPlan.yearlyPrice} onChange={e => setEditPlan({ ...editPlan, yearlyPrice: +e.target.value })} className="mt-1" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">Mark as Popular</Label>
                              <Switch checked={editPlan.isPopular || false} onCheckedChange={v => setEditPlan({ ...editPlan, isPopular: v })} />
                            </div>
                          </>
                        )}

                        {section.id === "limits" && editPlan && (
                          <>
                            {[
                              { key: "employees", label: "Max Employees (-1 = unlimited)" },
                              { key: "adminUsers", label: "Max Admin Users" },
                              { key: "departments", label: "Max Departments (-1 = unlimited)" },
                              { key: "locations", label: "Max Locations (-1 = unlimited)" },
                            ].map(f => (
                              <div key={f.key}>
                                <Label className="text-xs">{f.label}</Label>
                                <Input type="number" value={(editPlan.features as any)[f.key]} onChange={e => updateFeature(f.key, +e.target.value)} className="mt-1" />
                              </div>
                            ))}
                            <div>
                              <Label className="text-xs">Storage</Label>
                              <Input value={editPlan.features.storage} onChange={e => updateFeature("storage", e.target.value)} className="mt-1" />
                            </div>
                          </>
                        )}

                        {section.id === "modules" && editPlan && (
                          <>
                            {[
                              { key: "coreHR", label: "Core HR" },
                              { key: "recruitment", label: "Recruitment" },
                              { key: "performance", label: "Performance Management" },
                              { key: "payroll", label: "Payroll" },
                              { key: "attendance", label: "Attendance & Leave" },
                              { key: "learning", label: "Learning & Development" },
                              { key: "analytics", label: "Advanced Analytics" },
                              { key: "scheduling", label: "Scheduling" },
                              { key: "compliance", label: "Compliance" },
                              { key: "benefits", label: "Benefits Admin" },
                            ].map(f => (
                              <div key={f.key} className="flex items-center justify-between">
                                <Label className="text-xs">{f.label}</Label>
                                <Switch checked={(editPlan.features as any)[f.key]} onCheckedChange={v => updateFeature(f.key, v)} />
                              </div>
                            ))}
                          </>
                        )}

                        {section.id === "integrations" && editPlan && (
                          <>
                            {[
                              { key: "apiAccess", label: "API Access" },
                              { key: "ssoSaml", label: "SSO / SAML" },
                              { key: "customWebhooks", label: "Custom Webhooks" },
                              { key: "thirdPartyIntegrations", label: "3rd Party Integrations" },
                            ].map(f => (
                              <div key={f.key} className="flex items-center justify-between">
                                <Label className="text-xs">{f.label}</Label>
                                <Switch checked={(editPlan.features as any)[f.key]} onCheckedChange={v => updateFeature(f.key, v)} />
                              </div>
                            ))}
                          </>
                        )}

                        {section.id === "branding" && editPlan && (
                          <>
                            {[
                              { key: "customBranding", label: "Custom Branding" },
                              { key: "whiteLabel", label: "White Label" },
                              { key: "customDomain", label: "Custom Domain" },
                            ].map(f => (
                              <div key={f.key} className="flex items-center justify-between">
                                <Label className="text-xs">{f.label}</Label>
                                <Switch checked={(editPlan.features as any)[f.key]} onCheckedChange={v => updateFeature(f.key, v)} />
                              </div>
                            ))}
                          </>
                        )}

                        {section.id === "security" && editPlan && (
                          <>
                            {[
                              { key: "rbac", label: "Role-based Access" },
                              { key: "auditLogs", label: "Audit Logs" },
                              { key: "ipWhitelisting", label: "IP Whitelisting" },
                              { key: "dataEncryption", label: "Data Encryption" },
                              { key: "mfaEnforcement", label: "MFA Enforcement" },
                            ].map(f => (
                              <div key={f.key} className="flex items-center justify-between">
                                <Label className="text-xs">{f.label}</Label>
                                <Switch checked={(editPlan.features as any)[f.key]} onCheckedChange={v => updateFeature(f.key, v)} />
                              </div>
                            ))}
                            <div>
                              <Label className="text-xs">Data Retention (days, -1 = unlimited)</Label>
                              <Input type="number" value={editPlan.features.dataRetentionDays} onChange={e => updateFeature("dataRetentionDays", +e.target.value)} className="mt-1" />
                            </div>
                          </>
                        )}

                        {section.id === "support" && editPlan && (
                          <>
                            <div>
                              <Label className="text-xs">Support Level</Label>
                              <Input value={editPlan.features.supportLevel} onChange={e => updateFeature("supportLevel", e.target.value)} className="mt-1" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">Dedicated CSM</Label>
                              <Switch checked={editPlan.features.dedicatedCSM} onCheckedChange={v => updateFeature("dedicatedCSM", v)} />
                            </div>
                            <div>
                              <Label className="text-xs">SLA Guarantee</Label>
                              <Input value={editPlan.features.slaGuarantee} onChange={e => updateFeature("slaGuarantee", e.target.value)} className="mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs">Onboarding</Label>
                              <Input value={editPlan.features.onboarding} onChange={e => updateFeature("onboarding", e.target.value)} className="mt-1" />
                            </div>
                          </>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-card flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : (isCreating ? "Create Package" : "Save Changes")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* ═══ SUBSCRIPTION DETAIL PANEL ═══ */}
        <SubscriptionDetailPanel
          subscription={selectedSub}
          open={subDetailOpen}
          onOpenChange={setSubDetailOpen}
        />
      </div>
    </AppShell>
  );
}
