import { useMemo, useState } from "react";
import {
  Building2, Plus, Search, MoreHorizontal, Trash2,
  Users, AlertTriangle, Download, X, CheckCircle2,
  Ban, Settings2, BarChart3, ExternalLink, Shield,
  Activity, Loader2
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTenantsData, type TenantRow } from "@/hooks/useTenantsData";
import { SubscriptionDetailPanel } from "@/components/packages/SubscriptionDetailPanel";
import type { TenantSubscription } from "@/data/packagesData";

const TENANT_STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  trial: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  suspended: "bg-destructive/10 text-destructive",
  archived: "bg-muted text-muted-foreground",
};
const SUB_STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  trial: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  past_due: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  canceled: "bg-muted text-muted-foreground",
  expired: "bg-muted text-muted-foreground",
  none: "bg-muted text-muted-foreground",
};

function rowToSubscription(t: TenantRow): TenantSubscription {
  const statusMap: Record<string, TenantSubscription["status"]> = {
    active: "active",
    trial: "trial",
    past_due: "suspended",
    canceled: "cancelled",
    expired: "expired",
  };
  return {
    id: t.subscriptionId ?? `no-sub-${t.id}`,
    tenantId: t.id,
    tenantName: t.name,
    tenantEmail: t.contactEmail ?? "",
    packageId: t.planId ?? "",
    packageName: t.planName ?? "—",
    status: t.subStatus ? statusMap[t.subStatus] ?? "expired" : "expired",
    startDate: t.createdAt,
    nextBillingDate: t.currentPeriodEnd ?? "—",
    trialEndsAt: t.trialEndsAt ?? undefined,
    mrr: t.mrr,
    billingCycle: (t.billingCycle ?? "monthly") as "monthly" | "yearly",
    seats: t.seats,
    usedSeats: t.usedSeats,
    paymentMethod: "card",
    totalRevenue: 0,
    healthScore: t.healthScore,
  };
}

export default function Tenants() {
  const { tenants, loading, error, refresh } = useTenantsData();

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", contactEmail: "" });

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<TenantRow | null>(null);

  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [acting, setActing] = useState(false);

  const planOptions = useMemo(() => {
    const map = new Map<string, string>();
    tenants.forEach(t => { if (t.planName) map.set(t.planName, t.planName); });
    return Array.from(map.values()).sort();
  }, [tenants]);

  const filtered = tenants.filter(t => {
    const matchSearch = !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      (t.contactEmail ?? "").toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || t.planName === planFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === "active").length,
    mrr: tenants.reduce((s, t) => s + t.mrr, 0),
    usedSeats: tenants.reduce((s, t) => s + t.usedSeats, 0),
  };

  function openDetail(t: TenantRow) {
    setSelected(t);
    setDetailOpen(true);
  }

  async function handleCreate() {
    if (!form.name || !form.code) return;
    setCreating(true);
    try {
      const { error } = await supabase.from("tenants").insert({
        name: form.name.trim(),
        code: form.code.trim().toLowerCase(),
        contact_email: form.contactEmail.trim() || null,
        status: "trial",
      });
      if (error) throw error;
      toast.success(`Tenant "${form.name}" created`);
      setCreateOpen(false);
      setForm({ name: "", code: "", contactEmail: "" });
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create tenant");
    } finally {
      setCreating(false);
    }
  }

  async function handleSuspend() {
    if (!selected) return;
    setActing(true);
    try {
      const newStatus = selected.status === "suspended" ? "active" : "suspended";
      const { error } = await supabase.from("tenants").update({ status: newStatus }).eq("id", selected.id);
      if (error) throw error;
      toast.success(`Tenant "${selected.name}" ${newStatus === "suspended" ? "suspended" : "reactivated"}`);
      setSuspendOpen(false);
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Action failed");
    } finally {
      setActing(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setActing(true);
    try {
      const { error } = await supabase.from("tenants").delete().eq("id", selected.id);
      if (error) throw error;
      toast.success(`Tenant "${selected.name}" deleted`);
      setDeleteOpen(false);
      setDetailOpen(false);
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Delete failed");
    } finally {
      setActing(false);
    }
  }

  return (
    <AppShell title="Tenants" subtitle="Platform tenant management">
      <PageHeader
        title="Tenants"
        subtitle="Live view of all organizations on the platform"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Export coming soon")}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Tenant
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Tenants" value={stats.total} icon={<Building2 className="h-5 w-5" />} />
        <StatsCard title="Active" value={stats.active} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatsCard title="MRR" value={`$${(stats.mrr / 1000).toFixed(1)}k`} icon={<BarChart3 className="h-5 w-5" />} />
        <StatsCard title="Active Seats" value={stats.usedSeats.toLocaleString()} icon={<Users className="h-5 w-5" />} />
      </div>

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
            {planOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          Failed to load tenants: {error}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left p-3 font-medium text-muted-foreground">Tenant</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Plan</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Sub Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Renews</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Seats</th>
              <th className="text-left p-3 font-medium text-muted-foreground">MRR</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Health</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Tenant Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="p-12 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin opacity-50" />
                <p>Loading tenants…</p>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="p-12 text-center text-muted-foreground">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" /><p>No tenants found</p>
              </td></tr>
            ) : filtered.map(t => {
              const seatPct = t.seats > 0 ? Math.round((t.usedSeats / t.seats) * 100) : 0;
              const healthColor = t.healthScore >= 80 ? "text-emerald-600" : t.healthScore >= 50 ? "text-amber-600" : "text-destructive";
              return (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => openDetail(t)}>
                  <td className="p-3">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{t.code}</p>
                    {t.contactEmail && <p className="text-xs text-muted-foreground">{t.contactEmail}</p>}
                  </td>
                  <td className="p-3">
                    {t.planName
                      ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{t.planName}</span>
                      : <span className="text-xs text-muted-foreground">No plan</span>
                    }
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${SUB_STATUS_STYLE[t.subStatus ?? "none"]}`}>
                      {t.subStatus ? t.subStatus.replace("_", " ") : "none"}
                    </span>
                  </td>
                  <td className="p-3 text-xs">
                    {t.currentPeriodEnd
                      ? <span className="text-foreground">{t.currentPeriodEnd}</span>
                      : <span className="text-muted-foreground">—</span>
                    }
                    {t.trialEndsAt && t.subStatus === "trial" && (
                      <p className="text-[10px] text-amber-600 mt-0.5">Trial ends {t.trialEndsAt}</p>
                    )}
                  </td>
                  <td className="p-3">
                    {t.seats > 0 ? (
                      <>
                        <p className="font-medium">{t.usedSeats.toLocaleString()} / {t.seats.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{seatPct}% used</p>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {t.mrr > 0
                      ? <p className="font-medium text-emerald-600">${t.mrr.toLocaleString()}</p>
                      : <p className="text-muted-foreground text-xs">—</p>
                    }
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Activity className={`h-3.5 w-3.5 ${healthColor}`} />
                      <span className={`text-sm font-semibold ${healthColor}`}>{t.healthScore}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${TENANT_STATUS_STYLE[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetail(t)}>
                          <ExternalLink className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Impersonate coming soon")}>
                          <Shield className="h-4 w-4 mr-2" /> Impersonate Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Settings coming soon")}>
                          <Settings2 className="h-4 w-4 mr-2" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setSelected(t); setSuspendOpen(true); }}>
                          {t.status === "suspended"
                            ? <><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" /> Reactivate</>
                            : <><Ban className="h-4 w-4 mr-2 text-amber-600" /> Suspend</>
                          }
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setSelected(t); setDeleteOpen(true); }}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Tenant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{filtered.length} of {tenants.length} tenants</p>

      {/* Subscription detail (live) */}
      <SubscriptionDetailPanel
        subscription={selected ? rowToSubscription(selected) : null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Create */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle>New Tenant</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Tenant Name *</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Acme Corp" className="mt-1" />
            </div>
            <div>
              <Label>Code (slug) *</Label>
              <Input
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))}
                placeholder="acme"
                className="mt-1 font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">Used in tenant URL: /tenant/{form.code || "..."}</p>
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input type="email" value={form.contactEmail} onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))} placeholder="admin@company.com" className="mt-1" />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button className="flex-1" onClick={handleCreate} disabled={!form.name || !form.code || creating}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Tenant"}
            </Button>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={creating}>Cancel</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Suspend */}
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
            <Button variant="outline" onClick={() => setSuspendOpen(false)} disabled={acting}>Cancel</Button>
            <Button onClick={handleSuspend} disabled={acting}>
              {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : (selected?.status === "suspended" ? "Reactivate" : "Suspend")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Delete Tenant
            </DialogTitle>
            <DialogDescription>
              Permanently delete <strong>{selected?.name}</strong>? This will delete all tenant data, subscriptions, and configurations. This action is <strong>irreversible</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={acting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={acting}>
              {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
