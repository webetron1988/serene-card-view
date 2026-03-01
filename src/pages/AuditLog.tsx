import { useState } from "react";
import {
  Activity, Search, Download, Filter, X, Eye,
  User, Settings, Shield, Database, Users, Key,
  Edit2, Trash2, Plus, LogIn, LogOut, RefreshCw,
  ChevronLeft, ChevronRight, Calendar, Clock, Globe,
  CheckCircle2, AlertTriangle, Info, ExternalLink
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type AuditSeverity = "info" | "warning" | "critical";
type AuditCategory =
  | "authentication" | "user_management" | "org_structure" | "settings"
  | "data_access" | "permissions" | "integration" | "system";

type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string;
  category: AuditCategory;
  severity: AuditSeverity;
  ipAddress: string;
  userAgent: string;
  result: "success" | "failure" | "partial";
  changes?: { field: string; from: string; to: string }[];
  details: string;
};

const CATEGORY_CONFIG: Record<AuditCategory, { label: string; color: string; icon: React.ReactNode }> = {
  authentication: { label: "Authentication", color: "bg-blue-100 text-blue-700", icon: <Key className="h-3.5 w-3.5" /> },
  user_management: { label: "User Mgmt", color: "bg-violet-100 text-violet-700", icon: <User className="h-3.5 w-3.5" /> },
  org_structure: { label: "Org Structure", color: "bg-emerald-100 text-emerald-700", icon: <Users className="h-3.5 w-3.5" /> },
  settings: { label: "Settings", color: "bg-amber-100 text-amber-700", icon: <Settings className="h-3.5 w-3.5" /> },
  data_access: { label: "Data Access", color: "bg-sky-100 text-sky-700", icon: <Database className="h-3.5 w-3.5" /> },
  permissions: { label: "Permissions", color: "bg-red-100 text-red-700", icon: <Shield className="h-3.5 w-3.5" /> },
  integration: { label: "Integration", color: "bg-indigo-100 text-indigo-700", icon: <Globe className="h-3.5 w-3.5" /> },
  system: { label: "System", color: "bg-gray-100 text-gray-700", icon: <RefreshCw className="h-3.5 w-3.5" /> },
};

const SEVERITY_CONFIG: Record<AuditSeverity, { label: string; color: string; icon: React.ReactNode }> = {
  info: { label: "Info", color: "text-blue-600", icon: <Info className="h-3.5 w-3.5 text-blue-500" /> },
  warning: { label: "Warning", color: "text-amber-600", icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> },
  critical: { label: "Critical", color: "text-red-600", icon: <AlertTriangle className="h-3.5 w-3.5 text-red-500" /> },
};

const ACTION_ICONS: Record<string, React.ReactNode> = {
  login: <LogIn className="h-4 w-4" />,
  logout: <LogOut className="h-4 w-4" />,
  create: <Plus className="h-4 w-4" />,
  update: <Edit2 className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  export: <Download className="h-4 w-4" />,
  permission: <Shield className="h-4 w-4" />,
  sync: <RefreshCw className="h-4 w-4" />,
};

const SAMPLE_EVENTS: AuditEvent[] = [
  {
    id: "evt-001", timestamp: "2024-02-15 14:32:10", actor: "James Wilson", actorEmail: "james.wilson@acme.com",
    actorRole: "Super Admin", action: "delete", resource: "Employee", resourceId: "emp-192",
    category: "user_management", severity: "critical", ipAddress: "192.168.1.45", userAgent: "Chrome 120 / macOS",
    result: "success", details: "Deleted employee record for Maria Santos (emp-192)",
    changes: [{ field: "status", from: "active", to: "deleted" }]
  },
  {
    id: "evt-002", timestamp: "2024-02-15 14:18:45", actor: "Sarah Ahmed", actorEmail: "sarah.ahmed@acme.com",
    actorRole: "HR Manager", action: "update", resource: "Employee", resourceId: "emp-087",
    category: "user_management", severity: "info", ipAddress: "10.0.2.12", userAgent: "Firefox 121 / Windows",
    result: "success", details: "Updated employment details for Tom Bradley",
    changes: [{ field: "salary", from: "$85,000", to: "$92,000" }, { field: "title", from: "Engineer", to: "Senior Engineer" }]
  },
  {
    id: "evt-003", timestamp: "2024-02-15 13:55:20", actor: "System", actorEmail: "system@talentcorp.com",
    actorRole: "System", action: "sync", resource: "License", resourceId: "lic-001",
    category: "system", severity: "info", ipAddress: "internal", userAgent: "TalentHub Scheduler v2",
    result: "success", details: "Scheduled license sync completed successfully. 12 modules verified."
  },
  {
    id: "evt-004", timestamp: "2024-02-15 13:10:05", actor: "Kevin Lim", actorEmail: "kevin.lim@acme.com",
    actorRole: "Admin", action: "permission", resource: "Role", resourceId: "role-finance",
    category: "permissions", severity: "warning", ipAddress: "172.16.0.22", userAgent: "Safari 17 / macOS",
    result: "success", details: "Modified Finance Manager role permissions — added access to Payroll module",
    changes: [{ field: "permissions.payroll", from: "none", to: "read" }]
  },
  {
    id: "evt-005", timestamp: "2024-02-15 12:44:33", actor: "Emma Davies", actorEmail: "emma.davies@acme.com",
    actorRole: "HR Manager", action: "export", resource: "Employee", resourceId: "bulk",
    category: "data_access", severity: "warning", ipAddress: "10.0.1.5", userAgent: "Chrome 120 / Windows",
    result: "success", details: "Exported employee data for 680 records (CSV format)"
  },
  {
    id: "evt-006", timestamp: "2024-02-15 11:30:00", actor: "Priya Nair", actorEmail: "priya.nair@acme.com",
    actorRole: "Super Admin", action: "create", resource: "OrgUnit", resourceId: "ou-new-45",
    category: "org_structure", severity: "info", ipAddress: "203.0.113.56", userAgent: "Chrome 120 / macOS",
    result: "success", details: "Created new org unit: AI Research Lab under Engineering division"
  },
  {
    id: "evt-007", timestamp: "2024-02-15 10:15:22", actor: "Unknown", actorEmail: "attacker@unknown.com",
    actorRole: "—", action: "login", resource: "Session", resourceId: "—",
    category: "authentication", severity: "critical", ipAddress: "45.33.32.156", userAgent: "curl/7.88",
    result: "failure", details: "Failed login attempt for admin@acme.com from suspicious IP (5 consecutive failures). Account temporarily locked."
  },
  {
    id: "evt-008", timestamp: "2024-02-15 09:45:10", actor: "James Wilson", actorEmail: "james.wilson@acme.com",
    actorRole: "Super Admin", action: "login", resource: "Session", resourceId: "sess-2891",
    category: "authentication", severity: "info", ipAddress: "192.168.1.45", userAgent: "Chrome 120 / macOS",
    result: "success", details: "Successful login with MFA verification"
  },
  {
    id: "evt-009", timestamp: "2024-02-15 09:30:55", actor: "Sarah Ahmed", actorEmail: "sarah.ahmed@acme.com",
    actorRole: "HR Manager", action: "update", resource: "Settings", resourceId: "settings-general",
    category: "settings", severity: "info", ipAddress: "10.0.2.12", userAgent: "Firefox 121 / Windows",
    result: "success", details: "Updated general settings: company timezone changed",
    changes: [{ field: "timezone", from: "UTC+00:00", to: "UTC+05:30" }]
  },
  {
    id: "evt-010", timestamp: "2024-02-15 09:00:00", actor: "System", actorEmail: "system@talentcorp.com",
    actorRole: "System", action: "sync", resource: "Integration", resourceId: "slack-001",
    category: "integration", severity: "warning", ipAddress: "internal", userAgent: "TalentHub Integrations v3",
    result: "partial", details: "Slack integration sync: 980 employees synced, 12 failed due to missing email addresses."
  },
  {
    id: "evt-011", timestamp: "2024-02-14 17:20:33", actor: "Tom Bradley", actorEmail: "tom.bradley@acme.com",
    actorRole: "Employee", action: "view", resource: "Employee", resourceId: "emp-301",
    category: "data_access", severity: "info", ipAddress: "172.16.0.88", userAgent: "Chrome 120 / macOS",
    result: "success", details: "Accessed employee profile of Lisa Chen (permitted via team manager role)"
  },
  {
    id: "evt-012", timestamp: "2024-02-14 16:10:12", actor: "James Wilson", actorEmail: "james.wilson@acme.com",
    actorRole: "Super Admin", action: "create", resource: "User", resourceId: "usr-new-78",
    category: "user_management", severity: "info", ipAddress: "192.168.1.45", userAgent: "Chrome 120 / macOS",
    result: "success", details: "Created new platform user: Diana Ross (diana.ross@acme.com) with HR Manager role"
  },
];

const PAGE_SIZE = 8;

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = SAMPLE_EVENTS.filter(e => {
    const matchSearch = !search ||
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.resource.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase()) ||
      e.ipAddress.includes(search);
    const matchCat = categoryFilter === "all" || e.category === categoryFilter;
    const matchSev = severityFilter === "all" || e.severity === severityFilter;
    const matchResult = resultFilter === "all" || e.result === resultFilter;
    return matchSearch && matchCat && matchSev && matchResult;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: SAMPLE_EVENTS.length,
    critical: SAMPLE_EVENTS.filter(e => e.severity === "critical").length,
    failures: SAMPLE_EVENTS.filter(e => e.result === "failure").length,
    today: SAMPLE_EVENTS.filter(e => e.timestamp.startsWith("2024-02-15")).length,
  };

  function openDetail(event: AuditEvent) {
    setSelected(event);
    setDetailOpen(true);
  }

  function resetFilters() {
    setSearch("");
    setCategoryFilter("all");
    setSeverityFilter("all");
    setResultFilter("all");
    setPage(1);
  }

  const hasFilters = search || categoryFilter !== "all" || severityFilter !== "all" || resultFilter !== "all";

  return (
    <AppShell title="Audit Log" subtitle="Platform security and activity audit trail">
      <PageHeader
        title="Audit Log"
        subtitle="Track all platform actions, security events, and data changes"
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.info("Exporting audit log...")}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Events" value={stats.total} icon={<Activity className="h-5 w-5" />} />
        <StatsCard title="Today's Events" value={stats.today} icon={<Calendar className="h-5 w-5" />} trend={{ value: 5, positive: true }} />
        <StatsCard title="Critical Events" value={stats.critical} icon={<AlertTriangle className="h-5 w-5" />} />
        <StatsCard title="Failed Attempts" value={stats.failures} icon={<Shield className="h-5 w-5" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, users, IPs..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={v => { setSeverityFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select value={resultFilter} onValueChange={v => { setResultFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Result" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Results</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failure">Failure</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Events Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left p-3 font-medium text-muted-foreground">Timestamp</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actor</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Resource</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Result</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>No events match your filters</p>
                  {hasFilters && <button className="text-primary text-sm mt-1 hover:underline" onClick={resetFilters}>Clear filters</button>}
                </td>
              </tr>
            ) : (
              paged.map(event => {
                const catConf = CATEGORY_CONFIG[event.category];
                const sevConf = SEVERITY_CONFIG[event.severity];
                const actionIcon = ACTION_ICONS[event.action] ?? <Activity className="h-4 w-4" />;

                return (
                  <tr
                    key={event.id}
                    className={`border-b last:border-0 hover:bg-muted/30 cursor-pointer ${event.severity === "critical" ? "bg-red-50/40" : event.severity === "warning" ? "bg-amber-50/20" : ""}`}
                    onClick={() => openDetail(event)}
                  >
                    <td className="p-3">
                      <p className="font-mono text-xs">{event.timestamp.split(" ")[0]}</p>
                      <p className="font-mono text-xs text-muted-foreground">{event.timestamp.split(" ")[1]}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-sm">{event.actor}</p>
                      <p className="text-xs text-muted-foreground">{event.actorRole}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {actionIcon}
                        <span className="capitalize text-sm font-medium text-foreground">{event.action}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-sm">{event.resource}</p>
                      <p className="text-xs text-muted-foreground font-mono">{event.resourceId}</p>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${catConf.color}`}>
                        {catConf.icon}
                        {catConf.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {event.result === "success" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                        {event.result === "failure" && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                        {event.result === "partial" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        <span className={`text-xs font-medium capitalize ${event.result === "success" ? "text-emerald-700" : event.result === "failure" ? "text-red-700" : "text-amber-700"}`}>
                          {event.result}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {sevConf.icon}
                        <span className={`text-xs ${sevConf.color}`}>{sevConf.label}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); openDetail(event); }}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-muted-foreground">
          {filtered.length > 0
            ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} events`
            : "No events"
          }
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              className="h-7 w-7 text-xs"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Event Detail
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              {/* Header badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_CONFIG[selected.category].color}`}>
                  {CATEGORY_CONFIG[selected.category].label}
                </span>
                <Badge variant="outline" className={`text-xs ${selected.severity === "critical" ? "border-red-300 text-red-700" : selected.severity === "warning" ? "border-amber-300 text-amber-700" : "border-blue-300 text-blue-700"}`}>
                  {selected.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className={`text-xs ${selected.result === "success" ? "border-emerald-300 text-emerald-700" : selected.result === "failure" ? "border-red-300 text-red-700" : "border-amber-300 text-amber-700"}`}>
                  {selected.result.toUpperCase()}
                </Badge>
              </div>

              {/* Details description */}
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm">{selected.details}</p>
              </div>

              {/* Event metadata */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["Event ID", selected.id],
                  ["Timestamp", selected.timestamp],
                  ["Actor", selected.actor],
                  ["Role", selected.actorRole],
                  ["Email", selected.actorEmail],
                  ["Resource", `${selected.resource} (${selected.resourceId})`],
                  ["IP Address", selected.ipAddress],
                  ["User Agent", selected.userAgent],
                ].map(([label, value]) => (
                  <div key={label} className={label === "User Agent" || label === "Email" ? "col-span-2" : ""}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium text-xs mt-0.5 break-all">{value}</p>
                  </div>
                ))}
              </div>

              {/* Changes */}
              {selected.changes && selected.changes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Field Changes</p>
                    <div className="space-y-2">
                      {selected.changes.map(change => (
                        <div key={change.field} className="flex items-center gap-2 text-xs">
                          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">{change.field}</code>
                          <span className="text-red-600 line-through">{change.from}</span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-emerald-600 font-medium">{change.to}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
