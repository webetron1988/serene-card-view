import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RequirePermission, PermissionGate } from "@/components/auth/RequirePermission";
import { countryCodes } from "@/data/countryCodes";
import { toast } from "sonner";
import {
  Plus, Save, Trash2, ShieldCheck, ShieldAlert, ShieldQuestion,
  Loader2, X, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  Globe, MapPin, Eye, EyeOff, RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

type Provider = "stripe" | "razorpay";
type Environment = "test" | "live";
type CountryScope = "all" | "selected";
type VerifyStatus = "unverified" | "ok" | "failed";

interface Gateway {
  id: string;
  display_name: string;
  provider: Provider;
  environment: Environment;
  country_scope: CountryScope;
  publishable_key: string | null;
  is_active: boolean;
  last_verified_at: string | null;
  verify_status: VerifyStatus;
  verify_error: string | null;
  notes: string | null;
  countries?: string[];
}

const PROVIDER_META: Record<Provider, { label: string; secretLabel: string; pubLabel: string; emoji: string }> = {
  stripe: { label: "Stripe", secretLabel: "Secret Key (sk_…)", pubLabel: "Publishable Key (pk_…)", emoji: "💳" },
  razorpay: { label: "Razorpay", secretLabel: "Key Secret", pubLabel: "Key ID (rzp_…)", emoji: "🇮🇳" },
};

export default function PaymentGatewaysPage() {
  return (
    <RequirePermission permission="payment_gateways.view">
      <PaymentGatewaysContent />
    </RequirePermission>
  );
}

function PaymentGatewaysContent() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [conflictModal, setConflictModal] = useState<{ open: boolean; gatewayName: string; conflicts: string[] }>({
    open: false, gatewayName: "", conflicts: [],
  });

  const load = async () => {
    setLoading(true);
    const { data: gws, error } = await supabase
      .from("payment_gateways")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load gateways", { description: error.message });
      setLoading(false);
      return;
    }
    const ids = (gws ?? []).map((g) => g.id);
    let countriesByGw: Record<string, string[]> = {};
    if (ids.length > 0) {
      const { data: cc } = await supabase
        .from("payment_gateway_countries")
        .select("gateway_id, country_code")
        .in("gateway_id", ids);
      (cc ?? []).forEach((row: any) => {
        countriesByGw[row.gateway_id] = countriesByGw[row.gateway_id] ?? [];
        countriesByGw[row.gateway_id].push(row.country_code);
      });
    }
    setGateways((gws ?? []).map((g) => ({ ...(g as Gateway), countries: countriesByGw[g.id] ?? [] })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Payment Gateways</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Self-service configuration for Stripe and Razorpay. Only one gateway can be active per country.
          </p>
        </div>
        <PermissionGate permission="payment_gateways.manage">
          <Button size="sm" onClick={() => setCreating(true)} className="gap-2">
            <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Gateway
          </Button>
        </PermissionGate>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : gateways.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <Globe className="w-8 h-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">
              No gateways configured yet. Add Stripe or Razorpay to start accepting payments.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {gateways.map((gw) => (
            <GatewayRow
              key={gw.id}
              gateway={gw}
              isExpanded={editingId === gw.id}
              onToggle={() => setEditingId(editingId === gw.id ? null : gw.id)}
              onChanged={load}
              onConflict={(conflicts) => setConflictModal({ open: true, gatewayName: gw.display_name, conflicts })}
            />
          ))}
        </div>
      )}

      <CreateGatewayDialog open={creating} onOpenChange={setCreating} onCreated={load} />

      <ConflictDialog
        open={conflictModal.open}
        onOpenChange={(o) => setConflictModal((s) => ({ ...s, open: o }))}
        gatewayName={conflictModal.gatewayName}
        conflicts={conflictModal.conflicts}
      />
    </div>
  );
}

/* ───────── Gateway row + edit panel ───────── */

function GatewayRow({
  gateway, isExpanded, onToggle, onChanged, onConflict,
}: {
  gateway: Gateway;
  isExpanded: boolean;
  onToggle: () => void;
  onChanged: () => void;
  onConflict: (conflicts: string[]) => void;
}) {
  const [activating, setActivating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const meta = PROVIDER_META[gateway.provider];
  const verifyPill = (() => {
    if (gateway.verify_status === "ok")
      return { Icon: ShieldCheck, label: "Verified", cls: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (gateway.verify_status === "failed")
      return { Icon: ShieldAlert, label: "Verification failed", cls: "text-red-600 bg-red-50 border-red-200" };
    return { Icon: ShieldQuestion, label: "Unverified", cls: "text-amber-600 bg-amber-50 border-amber-200" };
  })();

  const handleToggleActive = async (next: boolean) => {
    setActivating(true);
    const { error } = await supabase
      .from("payment_gateways")
      .update({ is_active: next })
      .eq("id", gateway.id);
    setActivating(false);

    if (error) {
      const msg = error.message ?? "";
      const conflictMatch = msg.match(/PAYMENT_GATEWAY_CONFLICT:\s*\d+\s*already active in overlapping countries:\s*(.+)/);
      if (conflictMatch) {
        const list = conflictMatch[1].split(";").map((s) => s.trim()).filter(Boolean);
        onConflict(list);
        return;
      }
      toast.error(next ? "Could not activate gateway" : "Could not deactivate", { description: msg });
      return;
    }
    toast.success(next ? `${gateway.display_name} activated` : `${gateway.display_name} deactivated`);
    onChanged();
  };

  const handleVerify = async () => {
    setVerifying(true);
    const { data, error } = await supabase.functions.invoke("verify-payment-gateway", {
      body: { gateway_id: gateway.id },
    });
    setVerifying(false);
    if (error) {
      toast.error("Verification failed", { description: error.message });
    } else if (data?.ok) {
      toast.success("Credentials verified");
    } else {
      toast.error("Verification failed", { description: data?.error ?? "Unknown error" });
    }
    onChanged();
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={onToggle} className="flex items-center gap-3 text-left flex-1">
          <span className="text-2xl">{meta.emoji}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-medium text-foreground">{gateway.display_name}</h4>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{meta.label}</Badge>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${gateway.environment === "live" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"}`}>
                {gateway.environment === "live" ? "Live" : "Test"}
              </Badge>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${verifyPill.cls}`}>
                <verifyPill.Icon className="w-3 h-3 mr-1" strokeWidth={1.5} />{verifyPill.label}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                {gateway.country_scope === "all" ? <><Globe className="w-3 h-3" strokeWidth={1.5} />All countries</> : <><MapPin className="w-3 h-3" strokeWidth={1.5} />{gateway.countries?.length ?? 0} countries</>}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {gateway.last_verified_at ? `Last verified ${new Date(gateway.last_verified_at).toLocaleString()}` : "Never verified"}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <PermissionGate permission="payment_gateways.verify">
            <Button size="sm" variant="outline" disabled={verifying} onClick={handleVerify} className="text-xs">
              {verifying ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />}
              Verify
            </Button>
          </PermissionGate>
          <PermissionGate permission="payment_gateways.activate">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">{gateway.is_active ? "Active" : "Inactive"}</Label>
              <Switch checked={gateway.is_active} disabled={activating} onCheckedChange={handleToggleActive} />
            </div>
          </PermissionGate>
          <button onClick={onToggle} className="p-1 rounded hover:bg-muted/60">
            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="border-t pt-5">
          <GatewayEditor gateway={gateway} onSaved={onChanged} />
        </CardContent>
      )}
    </Card>
  );
}

/* ───────── Editor (credentials + countries + notes) ───────── */

function GatewayEditor({ gateway, onSaved }: { gateway: Gateway; onSaved: () => void }) {
  const [displayName, setDisplayName] = useState(gateway.display_name);
  const [environment, setEnvironment] = useState<Environment>(gateway.environment);
  const [publishable, setPublishable] = useState(gateway.publishable_key ?? "");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [scope, setScope] = useState<CountryScope>(gateway.country_scope);
  const [countries, setCountries] = useState<string[]>(gateway.countries ?? []);
  const [notes, setNotes] = useState(gateway.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const meta = PROVIDER_META[gateway.provider];

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1) Update gateway row (skip is_active — managed via Activate switch)
      const { error: upErr } = await supabase
        .from("payment_gateways")
        .update({
          display_name: displayName.trim(),
          environment,
          country_scope: scope,
          publishable_key: publishable.trim() || null,
          notes: notes.trim() || null,
        })
        .eq("id", gateway.id);
      if (upErr) throw upErr;

      // 2) Sync countries (only when scope = selected)
      if (scope === "selected") {
        await supabase.from("payment_gateway_countries").delete().eq("gateway_id", gateway.id);
        if (countries.length > 0) {
          const rows = countries.map((c) => ({ gateway_id: gateway.id, country_code: c }));
          const { error: cErr } = await supabase.from("payment_gateway_countries").insert(rows);
          if (cErr) throw cErr;
        }
      } else {
        await supabase.from("payment_gateway_countries").delete().eq("gateway_id", gateway.id);
      }

      // 3) Save secret via RPC (only if user typed a new one)
      if (secret.trim()) {
        const { error: sErr } = await supabase.rpc("set_payment_gateway_secret", {
          _gateway_id: gateway.id,
          _secret_name: "secret_key",
          _value: secret.trim(),
        });
        if (sErr) throw sErr;
      }

      toast.success("Gateway saved");
      setSecret("");
      onSaved();
    } catch (e: any) {
      toast.error("Save failed", { description: e.message ?? String(e) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from("payment_gateways").delete().eq("id", gateway.id);
    setDeleting(false);
    if (error) { toast.error("Delete failed", { description: error.message }); return; }
    toast.success("Gateway deleted");
    setConfirmDelete(false);
    onSaved();
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Display Name</Label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Environment</Label>
          <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
            <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="test">Test</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">{meta.pubLabel}</Label>
          <Input value={publishable} onChange={(e) => setPublishable(e.target.value)} className="text-sm font-mono" placeholder="Public — safe to display" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{meta.secretLabel}</Label>
          <div className="relative">
            <Input
              type={showSecret ? "text" : "password"}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Leave blank to keep existing"
              className="text-sm font-mono pr-9"
            />
            <button type="button" onClick={() => setShowSecret((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
              {showSecret ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">Stored encrypted in Vault. Never visible after save.</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-xs">Country Coverage</Label>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant={scope === "all" ? "default" : "outline"} onClick={() => setScope("all")} className="text-xs gap-1.5">
            <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />All countries
          </Button>
          <Button type="button" size="sm" variant={scope === "selected" ? "default" : "outline"} onClick={() => setScope("selected")} className="text-xs gap-1.5">
            <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />Selected countries
          </Button>
        </div>
        {scope === "selected" && (
          <CountryPicker selected={countries} onChange={setCountries} />
        )}
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label className="text-xs">Notes (internal)</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="text-sm" placeholder="Optional internal notes…" />
      </div>

      <div className="flex justify-between pt-2">
        <PermissionGate permission="payment_gateways.delete">
          <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)} className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5">
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />Delete
          </Button>
        </PermissionGate>
        <PermissionGate permission="payment_gateways.manage">
          <Button size="sm" onClick={handleSave} disabled={saving} className="text-xs gap-1.5">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" strokeWidth={1.5} />}
            Save Changes
          </Button>
        </PermissionGate>
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {gateway.display_name}?</DialogTitle>
            <DialogDescription>
              This permanently removes the gateway and its encrypted credentials. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───────── Create dialog ───────── */

function CreateGatewayDialog({
  open, onOpenChange, onCreated,
}: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const [provider, setProvider] = useState<Provider>("stripe");
  const [displayName, setDisplayName] = useState("");
  const [environment, setEnvironment] = useState<Environment>("test");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setProvider("stripe");
      setDisplayName("");
      setEnvironment("test");
    }
  }, [open]);

  const handleCreate = async () => {
    if (!displayName.trim()) {
      toast.error("Display name is required");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("payment_gateways").insert({
      provider, display_name: displayName.trim(), environment,
      country_scope: "all", is_active: false,
    });
    setSubmitting(false);
    if (error) { toast.error("Could not create gateway", { description: error.message }); return; }
    toast.success("Gateway created — configure credentials next");
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment Gateway</DialogTitle>
          <DialogDescription>Pick a provider. You can add credentials and country coverage right after.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Provider</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["stripe", "razorpay"] as Provider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    provider === p ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="text-xl">{PROVIDER_META[p].emoji}</span>
                  <div>
                    <div className="text-sm font-medium">{PROVIDER_META[p].label}</div>
                    <div className="text-[11px] text-muted-foreground">{p === "stripe" ? "Cards, wallets — global" : "UPI, cards — India-first"}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Display Name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Stripe – Live (US/EU)" className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Environment</Label>
            <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Test</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────── Country picker (chips + searchable popover) ───────── */

function CountryPicker({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const byCode = useMemo(() => {
    const m = new Map<string, { name: string; flag: string }>();
    countryCodes.forEach((c) => m.set(c.code, { name: c.name, flag: c.flag }));
    return m;
  }, []);

  const toggle = (code: string) => {
    if (selected.includes(code)) onChange(selected.filter((c) => c !== code));
    else onChange([...selected, code].sort());
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-md border border-input bg-background">
        {selected.length === 0 && <span className="text-xs text-muted-foreground">No countries selected</span>}
        {selected.map((code) => {
          const info = byCode.get(code);
          return (
            <Badge key={code} variant="secondary" className="text-[11px] gap-1 pr-1">
              <span>{info?.flag ?? ""}</span><span>{code}</span>
              <button onClick={() => toggle(code)} className="ml-0.5 rounded hover:bg-background/80 p-0.5">
                <X className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </Badge>
          );
        })}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />Add country
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-72" align="start">
          <Command>
            <CommandInput placeholder="Search country…" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryCodes.map((c) => {
                  const checked = selected.includes(c.code);
                  return (
                    <CommandItem key={c.code} onSelect={() => toggle(c.code)} className="text-sm gap-2">
                      <span className="w-4 flex items-center justify-center">
                        {checked && <CheckCircle2 className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />}
                      </span>
                      <span>{c.flag}</span><span className="flex-1">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground">{c.code}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ───────── Conflict modal ───────── */

function ConflictDialog({
  open, onOpenChange, gatewayName, conflicts,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  gatewayName: string; conflicts: string[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
            </div>
            <DialogTitle>Activation blocked</DialogTitle>
          </div>
          <DialogDescription>
            <strong>{gatewayName}</strong> overlaps with one or more active gateways. Deactivate the conflicts first, then try again.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Conflicting gateways</p>
          <ul className="space-y-1.5">
            {conflicts.map((c, i) => (
              <li key={i} className="text-sm flex items-start gap-2 p-2 rounded-md bg-muted/40">
                <span className="text-amber-600 mt-0.5">•</span>
                <span className="font-mono text-xs">{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
