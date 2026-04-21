import { useEffect, useMemo, useState } from "react";
import {
  Plus, Pencil, Trash2, Search, Layers, DollarSign, Loader2,
  ToggleLeft, ToggleRight, Save, X, Infinity as InfinityIcon, AlertCircle
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { RequirePermission } from "@/components/auth/RequirePermission";
import { toast } from "sonner";

type Plan = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price_monthly: number | null;
  price_yearly: number | null;
  currency: string;
  trial_days: number;
  feature_flags: Record<string, boolean>;
  is_active: boolean;
  sort_order: number;
};

type Entitlement = {
  id?: string;
  plan_id: string;
  key: string;
  limit_value: number;
  unit: string;
  is_hard_cap: boolean;
  description: string | null;
  _new?: boolean;
  _deleted?: boolean;
};

const EMPTY_PLAN: Omit<Plan, "id"> = {
  code: "", name: "", description: "", price_monthly: 0, price_yearly: 0,
  currency: "USD", trial_days: 14, feature_flags: {}, is_active: true, sort_order: 0,
};

function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [entitlementsByPlan, setEntitlementsByPlan] = useState<Record<string, Entitlement[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [editingEnt, setEditingEnt] = useState<Entitlement[]>([]);
  const [flagsJson, setFlagsJson] = useState("{}");
  const [flagsErr, setFlagsErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [{ data: p, error: pe }, { data: e, error: ee }] = await Promise.all([
      supabase.from("plans").select("*").order("sort_order"),
      supabase.from("plan_entitlements").select("*"),
    ]);
    if (pe || ee) {
      toast.error(pe?.message ?? ee?.message ?? "Failed to load plans");
      setLoading(false);
      return;
    }
    setPlans((p ?? []) as any);
    const grouped: Record<string, Entitlement[]> = {};
    for (const row of (e ?? []) as any[]) {
      (grouped[row.plan_id] ||= []).push(row);
    }
    setEntitlementsByPlan(grouped);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => plans.filter(p => !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())),
    [plans, search]
  );

  function openCreate() {
    setEditing({ id: "", ...EMPTY_PLAN });
    setEditingEnt([]);
    setFlagsJson("{}");
    setFlagsErr(null);
    setDrawerOpen(true);
  }

  function openEdit(plan: Plan) {
    setEditing({ ...plan, feature_flags: plan.feature_flags ?? {} });
    setEditingEnt(
      (entitlementsByPlan[plan.id] ?? []).map(e => ({ ...e }))
    );
    setFlagsJson(JSON.stringify(plan.feature_flags ?? {}, null, 2));
    setFlagsErr(null);
    setDrawerOpen(true);
  }

  function updateField<K extends keyof Plan>(k: K, v: Plan[K]) {
    if (!editing) return;
    setEditing({ ...editing, [k]: v });
  }

  function addEntitlementRow() {
    setEditingEnt(prev => [
      ...prev,
      { plan_id: editing?.id ?? "", key: "", limit_value: 0, unit: "count", is_hard_cap: true, description: null, _new: true },
    ]);
  }

  function updateEntRow(i: number, patch: Partial<Entitlement>) {
    setEditingEnt(prev => prev.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  }

  function removeEntRow(i: number) {
    setEditingEnt(prev => {
      const row = prev[i];
      if (row._new) return prev.filter((_, idx) => idx !== i);
      return prev.map((e, idx) => idx === i ? { ...e, _deleted: true } : e);
    });
  }

  async function save() {
    if (!editing) return;
    if (!editing.code.trim() || !editing.name.trim()) {
      toast.error("Code and name are required");
      return;
    }
    let parsedFlags: Record<string, boolean> = {};
    try {
      parsedFlags = JSON.parse(flagsJson || "{}");
      if (typeof parsedFlags !== "object" || Array.isArray(parsedFlags)) throw new Error("Must be a JSON object");
    } catch (err: any) {
      setFlagsErr(err.message ?? "Invalid JSON");
      toast.error("Feature flags JSON is invalid");
      return;
    }

    setSaving(true);
    let planId = editing.id;

    const planPayload = {
      code: editing.code,
      name: editing.name,
      description: editing.description,
      price_monthly: editing.price_monthly,
      price_yearly: editing.price_yearly,
      currency: editing.currency,
      trial_days: editing.trial_days,
      feature_flags: parsedFlags,
      is_active: editing.is_active,
      sort_order: editing.sort_order,
    };

    if (!planId) {
      const { data, error } = await supabase.from("plans").insert(planPayload).select("id").single();
      if (error) { setSaving(false); toast.error(error.message); return; }
      planId = data.id;
    } else {
      const { error } = await supabase.from("plans").update(planPayload).eq("id", planId);
      if (error) { setSaving(false); toast.error(error.message); return; }
    }

    // Entitlements: insert new, update existing, delete removed
    for (const e of editingEnt) {
      if (e._deleted && e.id) {
        const { error } = await supabase.from("plan_entitlements").delete().eq("id", e.id);
        if (error) { toast.error(`Entitlement delete failed: ${error.message}`); }
      } else if (e._new) {
        if (!e.key.trim()) continue;
        const { error } = await supabase.from("plan_entitlements").insert({
          plan_id: planId, key: e.key, limit_value: e.limit_value,
          unit: e.unit, is_hard_cap: e.is_hard_cap, description: e.description,
        });
        if (error) { toast.error(`Entitlement create failed: ${error.message}`); }
      } else if (e.id) {
        const { error } = await supabase.from("plan_entitlements").update({
          key: e.key, limit_value: e.limit_value, unit: e.unit,
          is_hard_cap: e.is_hard_cap, description: e.description,
        }).eq("id", e.id);
        if (error) { toast.error(`Entitlement update failed: ${error.message}`); }
      }
    }

    toast.success(`Plan "${editing.name}" saved`);
    setSaving(false);
    setDrawerOpen(false);
    await load();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const { error } = await supabase.from("plans").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); return; }
    toast.success("Plan deleted");
    setDeleteId(null);
    await load();
  }

  return (
    <AppShell>
      <div className="space-y-6 page-enter">
        <PageHeader
          title="Plans"
          subtitle="Manage subscription plans, feature flags, and entitlements"
          actions={
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> New Plan
            </Button>
          }
        />

        <div className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search plans..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center">
            <Layers className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No plans found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(plan => {
              const ents = entitlementsByPlan[plan.id] ?? [];
              const flagCount = Object.values(plan.feature_flags ?? {}).filter(Boolean).length;
              return (
                <div key={plan.id} className="bg-card border border-border/60 rounded-xl p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground truncate">{plan.name}</h3>
                        {!plan.is_active && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{plan.code}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(plan)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(plan.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{plan.description}</p>
                  )}

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-foreground">
                      {plan.price_monthly != null
                        ? new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency, maximumFractionDigits: 0 }).format(Number(plan.price_monthly))
                        : "—"}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-border/40">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Trial</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{plan.trial_days}d</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Flags</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{flagCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Limits</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{ents.length}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="sm:max-w-2xl p-0 flex flex-col">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle>{editing?.id ? "Edit Plan" : "New Plan"}</SheetTitle>
              <SheetDescription>{editing?.name || "Define plan basics, feature flags, and numeric limits."}</SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1">
              <div className="p-6">
                <Tabs defaultValue="basics">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="flags">Feature Flags</TabsTrigger>
                    <TabsTrigger value="entitlements">Entitlements</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basics" className="space-y-4 mt-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Code *</Label>
                        <Input value={editing?.code ?? ""} onChange={e => updateField("code", e.target.value)} placeholder="e.g. growth" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Name *</Label>
                        <Input value={editing?.name ?? ""} onChange={e => updateField("name", e.target.value)} placeholder="Growth" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Description</Label>
                      <Textarea rows={2} value={editing?.description ?? ""} onChange={e => updateField("description", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Monthly price</Label>
                        <Input type="number" value={editing?.price_monthly ?? 0} onChange={e => updateField("price_monthly", Number(e.target.value))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Yearly price</Label>
                        <Input type="number" value={editing?.price_yearly ?? 0} onChange={e => updateField("price_yearly", Number(e.target.value))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Currency</Label>
                        <Input value={editing?.currency ?? "USD"} onChange={e => updateField("currency", e.target.value.toUpperCase())} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Trial days</Label>
                        <Input type="number" value={editing?.trial_days ?? 14} onChange={e => updateField("trial_days", Number(e.target.value))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Sort order</Label>
                        <Input type="number" value={editing?.sort_order ?? 0} onChange={e => updateField("sort_order", Number(e.target.value))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Active</Label>
                        <div className="flex items-center h-10">
                          <Switch checked={editing?.is_active ?? true} onCheckedChange={v => updateField("is_active", v)} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="flags" className="space-y-3 mt-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <Label className="text-xs">Feature flags JSON</Label>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Boolean toggles consumed by <code className="bg-muted px-1 rounded">tenant_has_feature(tenant, flag)</code>
                        </p>
                      </div>
                    </div>
                    <Textarea
                      rows={12}
                      className="font-mono text-xs"
                      value={flagsJson}
                      onChange={e => { setFlagsJson(e.target.value); setFlagsErr(null); }}
                      placeholder='{ "ai_enabled": true, "sso": false }'
                    />
                    {flagsErr && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {flagsErr}
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="entitlements" className="space-y-3 mt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs">Numeric limits</Label>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Use <code className="bg-muted px-1 rounded">-1</code> for unlimited. Read via <code className="bg-muted px-1 rounded">tenant_entitlement(tenant, key)</code>.
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={addEntitlementRow}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add limit
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {editingEnt.filter(e => !e._deleted).length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-6">No entitlements defined</p>
                      ) : editingEnt.map((e, i) => e._deleted ? null : (
                        <div key={i} className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg border border-border/50 bg-muted/20">
                          <Input
                            className="col-span-4 h-8 text-xs"
                            placeholder="key (e.g. max_users)"
                            value={e.key}
                            onChange={ev => updateEntRow(i, { key: ev.target.value })}
                          />
                          <div className="col-span-3 flex items-center gap-1">
                            <Input
                              className="h-8 text-xs"
                              type="number"
                              value={e.limit_value}
                              onChange={ev => updateEntRow(i, { limit_value: Number(ev.target.value) })}
                            />
                            {e.limit_value === -1 && <InfinityIcon className="h-3.5 w-3.5 text-primary" />}
                          </div>
                          <Input
                            className="col-span-3 h-8 text-xs"
                            placeholder="unit"
                            value={e.unit}
                            onChange={ev => updateEntRow(i, { unit: ev.target.value })}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="col-span-2 h-8 w-8 ml-auto text-destructive hover:text-destructive"
                            onClick={() => removeEntRow(i)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>

            <div className="border-t p-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDrawerOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                Save plan
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Delete dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this plan?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes the plan and all its entitlements. Tenants currently subscribed to it will keep their subscription until you reassign them.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}

export default function PlansPageWrapper() {
  return (
    <RequirePermission permission="plans.plan.view">
      <PlansPage />
    </RequirePermission>
  );
}