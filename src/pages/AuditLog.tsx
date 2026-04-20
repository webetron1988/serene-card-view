import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Activity, Search, Download, Filter, X, Eye,
  Shield, RefreshCw, Calendar, AlertTriangle, Info,
  CheckCircle2, ChevronLeft, ChevronRight, Radio, Loader2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Severity = "info" | "warning" | "critical";

interface AuditRow {
  id: string;
  created_at: string;
  event_type: string;
  resource_type: string | null;
  resource_id: string | null;
  actor_user_id: string | null;
  actor_email: string | null;
  tenant_id: string | null;
  severity: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
}

interface TenantOpt { id: string; name: string; code: string; }

const PAGE_SIZE = 25;
const NONE = "__all__";

const SEV_BADGE: Record<Severity, string> = {
  info: "bg-blue-100 text-blue-700 border-blue-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

function formatTs(iso: string) {
  const d = new Date(iso);
  return {
    date: format(d, "yyyy-MM-dd"),
    time: format(d, "HH:mm:ss"),
    full: format(d, "PPpp"),
  };
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function AuditLog() {
  // Filters
  const [search, setSearch] = useState("");
  const [tenantFilter, setTenantFilter] = useState<string>(NONE);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>(NONE);
  const [severityFilter, setSeverityFilter] = useState<string>(NONE);
  const [actorFilter, setActorFilter] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Live tail
  const [liveTail, setLiveTail] = useState(false);
  const [newEventCount, setNewEventCount] = useState(0);

  // Data
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<TenantOpt[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  const [selected, setSelected] = useState<AuditRow | null>(null);
  const [exporting, setExporting] = useState(false);

  const reqIdRef = useRef(0);

  // Load tenants & distinct event types once
  useEffect(() => {
    (async () => {
      const [{ data: t }, { data: et }] = await Promise.all([
        supabase.from("tenants").select("id, name, code").order("name"),
        supabase.from("audit_log").select("event_type").limit(1000),
      ]);
      setTenants((t ?? []) as TenantOpt[]);
      const unique = Array.from(new Set((et ?? []).map((r: any) => r.event_type as string))).sort();
      setEventTypes(unique);
    })();
  }, []);

  const buildQuery = useCallback(
    (countOnly = false) => {
      let q = supabase
        .from("audit_log")
        .select("*", { count: "exact", head: countOnly });

      if (tenantFilter !== NONE) {
        if (tenantFilter === "__platform__") q = q.is("tenant_id", null);
        else q = q.eq("tenant_id", tenantFilter);
      }
      if (eventTypeFilter !== NONE) q = q.eq("event_type", eventTypeFilter);
      if (severityFilter !== NONE) q = q.eq("severity", severityFilter);
      if (actorFilter.trim()) q = q.ilike("actor_email", `%${actorFilter.trim()}%`);
      if (search.trim()) {
        const s = search.trim();
        q = q.or(
          `event_type.ilike.%${s}%,resource_type.ilike.%${s}%,resource_id.ilike.%${s}%,actor_email.ilike.%${s}%`
        );
      }
      if (dateFrom) q = q.gte("created_at", dateFrom.toISOString());
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        q = q.lte("created_at", end.toISOString());
      }
      return q;
    },
    [tenantFilter, eventTypeFilter, severityFilter, actorFilter, search, dateFrom, dateTo]
  );

  const fetchPage = useCallback(async () => {
    const myReq = ++reqIdRef.current;
    setLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const q = buildQuery().order("created_at", { ascending: false }).range(from, to);
      const { data, count, error } = await q;
      if (myReq !== reqIdRef.current) return;
      if (error) {
        toast.error(`Failed to load audit log: ${error.message}`);
        setRows([]);
        setTotal(0);
      } else {
        setRows((data ?? []) as AuditRow[]);
        setTotal(count ?? 0);
      }
    } finally {
      if (myReq === reqIdRef.current) setLoading(false);
    }
  }, [page, buildQuery]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [tenantFilter, eventTypeFilter, severityFilter, actorFilter, search, dateFrom, dateTo]);

  // Live tail subscription
  useEffect(() => {
    if (!liveTail) return;
    setNewEventCount(0);
    const channel = supabase
      .channel("audit_log_tail")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "audit_log" },
        (payload) => {
          const newRow = payload.new as AuditRow;
          // Optimistically prepend if on page 1 and matches no strict filters (best-effort)
          setRows((prev) => {
            if (page !== 1) return prev;
            if (prev.some((r) => r.id === newRow.id)) return prev;
            return [newRow, ...prev].slice(0, PAGE_SIZE);
          });
          setNewEventCount((n) => n + 1);
          setTotal((t) => t + 1);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [liveTail, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleExport = async () => {
    setExporting(true);
    try {
      const q = buildQuery().order("created_at", { ascending: false }).limit(10000);
      const { data, error } = await q;
      if (error) throw error;
      const all = (data ?? []) as AuditRow[];
      const headers = [
        "id", "created_at", "event_type", "severity", "tenant_id",
        "actor_email", "actor_user_id", "resource_type", "resource_id",
        "ip_address", "user_agent", "metadata",
      ];
      const lines = [headers.join(",")];
      for (const r of all) {
        lines.push(headers.map((h) => csvEscape((r as any)[h])).join(","));
      }
      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${all.length} events`);
    } catch (e: any) {
      toast.error(`Export failed: ${e.message ?? e}`);
    } finally {
      setExporting(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setTenantFilter(NONE);
    setEventTypeFilter(NONE);
    setSeverityFilter(NONE);
    setActorFilter("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasFilters =
    !!search || tenantFilter !== NONE || eventTypeFilter !== NONE ||
    severityFilter !== NONE || !!actorFilter || !!dateFrom || !!dateTo;

  // Stats are derived from the current page (light-weight; full aggregates would need RPC)
  const stats = useMemo(() => {
    const critical = rows.filter((r) => r.severity === "critical").length;
    const warnings = rows.filter((r) => r.severity === "warning").length;
    return { total, critical, warnings, shown: rows.length };
  }, [rows, total]);

  const tenantNameById = useMemo(() => {
    const m = new Map<string, string>();
    tenants.forEach((t) => m.set(t.id, t.name));
    return m;
  }, [tenants]);

  return (
    <AppShell title="Audit Log" subtitle="Platform security and activity audit trail">
      <PageHeader
        title="Audit Log"
        subtitle="Track every administrative action, security event, and data change"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-card">
              <Radio className={cn("h-3.5 w-3.5", liveTail ? "text-emerald-500 animate-pulse" : "text-muted-foreground")} />
              <Label htmlFor="live-tail" className="text-xs font-medium cursor-pointer">Live tail</Label>
              <Switch id="live-tail" checked={liveTail} onCheckedChange={setLiveTail} />
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
              {exporting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Events" value={total.toLocaleString()} icon={<Activity className="h-5 w-5" />} />
        <StatsCard title="Showing on Page" value={`${stats.shown} / ${PAGE_SIZE}`} icon={<Calendar className="h-5 w-5" />} />
        <StatsCard title="Critical (page)" value={stats.critical} icon={<AlertTriangle className="h-5 w-5" />} />
        <StatsCard title="Warnings (page)" value={stats.warnings} icon={<Shield className="h-5 w-5" />} />
      </div>

      {liveTail && newEventCount > 0 && (
        <div className="mb-3 flex items-center gap-2 text-xs text-emerald-700">
          <Radio className="h-3 w-3 animate-pulse" />
          {newEventCount} new event{newEventCount === 1 ? "" : "s"} streamed
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search event, resource, actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <Input
          placeholder="Actor email"
          value={actorFilter}
          onChange={(e) => setActorFilter(e.target.value)}
          className="w-[180px]"
        />

        <Select value={tenantFilter} onValueChange={setTenantFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Tenant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>All Tenants</SelectItem>
            <SelectItem value="__platform__">Platform (no tenant)</SelectItem>
            {tenants.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Event Type" /></SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value={NONE}>All Event Types</SelectItem>
            {eventTypes.map((et) => (
              <SelectItem key={et} value={et}>{et}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>All Severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className={cn("h-10", !dateFrom && "text-muted-foreground")}>
              <Calendar className="h-4 w-4 mr-1" />
              {dateFrom ? format(dateFrom, "MMM d") : "From"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarPicker mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className={cn("h-10", !dateTo && "text-muted-foreground")}>
              <Calendar className="h-4 w-4 mr-1" />
              {dateTo ? format(dateTo, "MMM d") : "To"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarPicker mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}

        <Button variant="ghost" size="sm" onClick={fetchPage} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
      </div>

      {/* Events Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left p-3 font-medium text-muted-foreground w-[140px]">Timestamp</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Event</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actor</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Tenant</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Resource</th>
              <th className="text-left p-3 font-medium text-muted-foreground w-[110px]">Severity</th>
              <th className="p-3 w-[40px]" />
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 mx-auto animate-spin opacity-50" />
              </td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>No events match your filters</p>
                {hasFilters && (
                  <button className="text-primary text-sm mt-1 hover:underline" onClick={resetFilters}>Clear filters</button>
                )}
              </td></tr>
            ) : (
              rows.map((r) => {
                const ts = formatTs(r.created_at);
                const sev = (r.severity as Severity) || "info";
                const tenantName = r.tenant_id ? (tenantNameById.get(r.tenant_id) ?? r.tenant_id.slice(0, 8)) : "—";
                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors",
                      sev === "critical" && "bg-red-50/40",
                      sev === "warning" && "bg-amber-50/20"
                    )}
                    onClick={() => setSelected(r)}
                  >
                    <td className="p-3">
                      <p className="font-mono text-xs">{ts.date}</p>
                      <p className="font-mono text-xs text-muted-foreground">{ts.time}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-sm font-mono">{r.event_type}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm">{r.actor_email ?? "—"}</p>
                      {r.actor_user_id && (
                        <p className="text-xs text-muted-foreground font-mono">{r.actor_user_id.slice(0, 8)}…</p>
                      )}
                    </td>
                    <td className="p-3">
                      <p className="text-sm">{tenantName}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm">{r.resource_type ?? "—"}</p>
                      {r.resource_id && (
                        <p className="text-xs text-muted-foreground font-mono">{r.resource_id.slice(0, 16)}{r.resource_id.length > 16 ? "…" : ""}</p>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className={cn("text-xs capitalize", SEV_BADGE[sev])}>
                        {sev === "info" && <Info className="h-3 w-3 mr-1" />}
                        {sev === "warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {sev === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {sev}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(page - 1) * PAGE_SIZE + 1}</span>–
              <span className="font-medium text-foreground">{Math.min(page * PAGE_SIZE, total)}</span> of{" "}
              <span className="font-medium text-foreground">{total.toLocaleString()}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {selected?.event_type}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Timestamp" value={formatTs(selected.created_at).full} />
                <Field label="Severity" value={selected.severity} />
                <Field label="Actor" value={selected.actor_email ?? "—"} />
                <Field label="Actor ID" value={selected.actor_user_id ?? "—"} mono />
                <Field label="Tenant" value={selected.tenant_id ? (tenantNameById.get(selected.tenant_id) ?? selected.tenant_id) : "Platform"} />
                <Field label="Resource" value={`${selected.resource_type ?? "—"}${selected.resource_id ? " · " + selected.resource_id : ""}`} mono />
                <Field label="IP Address" value={selected.ip_address ?? "—"} mono />
                <Field label="User Agent" value={selected.user_agent ?? "—"} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Metadata</p>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-64 font-mono">
                  {JSON.stringify(selected.metadata, null, 2)}
                </pre>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Event ID: <span className="font-mono">{selected.id}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
      <p className={cn("text-sm break-all", mono && "font-mono text-xs")}>{value}</p>
    </div>
  );
}
