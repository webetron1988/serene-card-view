import { useState } from "react";
import {
  Key, Package, Users, CheckCircle2, AlertTriangle, Clock,
  RefreshCw, Download, ArrowUpRight, Shield, Zap, BarChart3,
  BookOpen, Globe, Lock, Unlock, ChevronRight, Copy, ExternalLink,
  Calendar, TrendingUp
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type ModuleStatus = "active" | "inactive" | "trial" | "expired";

type LicensedModule = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: ModuleStatus;
  seatsUsed: number;
  seatLimit: number;
  expiresAt: string;
  tier: "core" | "professional" | "enterprise" | "add-on";
  features: string[];
};

const MODULES: LicensedModule[] = [
  {
    id: "core-hr",
    name: "Core HR",
    description: "Employee records, org structure, positions, and locations management.",
    icon: <Users className="h-5 w-5" />,
    status: "active", seatsUsed: 1240, seatLimit: 1500,
    expiresAt: "2025-12-31", tier: "core",
    features: ["Employee Directory", "Org Chart", "Positions", "Locations", "Org Units"]
  },
  {
    id: "recruitment",
    name: "Recruitment",
    description: "End-to-end applicant tracking, job postings, and interview management.",
    icon: <Zap className="h-5 w-5" />,
    status: "active", seatsUsed: 45, seatLimit: 50,
    expiresAt: "2025-12-31", tier: "professional",
    features: ["Job Board Posting", "ATS Pipeline", "Interview Scheduling", "Offer Management", "AI Screening"]
  },
  {
    id: "performance",
    name: "Performance",
    description: "Goal management, 360° reviews, calibration, and performance cycles.",
    icon: <BarChart3 className="h-5 w-5" />,
    status: "active", seatsUsed: 980, seatLimit: 1500,
    expiresAt: "2025-12-31", tier: "professional",
    features: ["OKR Management", "360° Feedback", "Review Cycles", "Calibration Sessions", "Succession Planning"]
  },
  {
    id: "learning",
    name: "Learning & Development",
    description: "Course management, learning paths, and certification tracking.",
    icon: <BookOpen className="h-5 w-5" />,
    status: "trial", seatsUsed: 150, seatLimit: 200,
    expiresAt: "2024-03-15", tier: "professional",
    features: ["Course Library", "Learning Paths", "Certification Tracking", "SCORM Support", "Progress Analytics"]
  },
  {
    id: "analytics",
    name: "Workforce Analytics",
    description: "Advanced HR analytics, predictive insights, and executive dashboards.",
    icon: <TrendingUp className="h-5 w-5" />,
    status: "active", seatsUsed: 25, seatLimit: 30,
    expiresAt: "2025-12-31", tier: "enterprise",
    features: ["Predictive Attrition", "Headcount Forecasting", "Diversity Analytics", "Custom Reports", "BI Integrations"]
  },
  {
    id: "compliance",
    name: "Compliance & GDPR",
    description: "Data privacy, compliance workflows, and audit trail management.",
    icon: <Shield className="h-5 w-5" />,
    status: "active", seatsUsed: 5, seatLimit: 10,
    expiresAt: "2025-12-31", tier: "enterprise",
    features: ["GDPR DSR Handling", "Data Retention Policies", "Consent Management", "Audit Logs", "Compliance Reports"]
  },
  {
    id: "payroll",
    name: "Payroll Integration",
    description: "Payroll data sync, reconciliation, and multi-country payroll support.",
    icon: <Globe className="h-5 w-5" />,
    status: "inactive", seatsUsed: 0, seatLimit: 0,
    expiresAt: "—", tier: "add-on",
    features: ["Multi-currency Payroll", "Payroll Reconciliation", "GL Export", "Tax Compliance", "Bank Integration"]
  },
  {
    id: "marketplace",
    name: "Marketplace Access",
    description: "Access to partner integrations, libraries, and pre-built connectors.",
    icon: <Package className="h-5 w-5" />,
    status: "active", seatsUsed: 0, seatLimit: 0,
    expiresAt: "2025-12-31", tier: "core",
    features: ["50+ Integrations", "Library Browser", "One-click Install", "Partner Apps", "Custom Connectors"]
  },
];

const SYNC_HISTORY = [
  { id: 1, date: "2024-02-15 09:15", status: "success", changes: "12 modules synced, 0 errors", duration: "1.2s" },
  { id: 2, date: "2024-02-14 09:15", status: "success", changes: "12 modules synced, 0 errors", duration: "0.9s" },
  { id: 3, date: "2024-02-13 14:22", status: "warning", changes: "11 modules synced, 1 warning", duration: "2.1s" },
  { id: 4, date: "2024-02-12 09:15", status: "success", changes: "12 modules synced, 0 errors", duration: "1.0s" },
  { id: 5, date: "2024-02-11 09:15", status: "error", changes: "Sync failed: connection timeout", duration: "30s" },
];

const TIER_CONFIG: Record<LicensedModule["tier"], { label: string; color: string }> = {
  core: { label: "Core", color: "bg-gray-100 text-gray-700" },
  professional: { label: "Pro", color: "bg-blue-100 text-blue-700" },
  enterprise: { label: "Enterprise", color: "bg-violet-100 text-violet-700" },
  "add-on": { label: "Add-on", color: "bg-amber-100 text-amber-700" },
};

const STATUS_CONFIG: Record<ModuleStatus, { label: string; color: string; dot: string }> = {
  active: { label: "Active", color: "text-emerald-700", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", color: "text-gray-500", dot: "bg-gray-400" },
  trial: { label: "Trial", color: "text-amber-700", dot: "bg-amber-400" },
  expired: { label: "Expired", color: "text-red-700", dot: "bg-red-500" },
};

const LICENSE_KEY = "THUB-ENT-2024-XXXX-YYYY-ZZZZ-1234";

export default function License() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LicensedModule | null>(null);
  const [activateOpen, setActivateOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);

  const activeModules = MODULES.filter(m => m.status === "active" || m.status === "trial");
  const totalSeats = MODULES.reduce((s, m) => s + m.seatLimit, 0);
  const usedSeats = MODULES.find(m => m.id === "core-hr")?.seatsUsed ?? 0;
  const seatLimit = MODULES.find(m => m.id === "core-hr")?.seatLimit ?? 1;

  function handleSync() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success("License synchronized successfully");
    }, 2000);
  }

  function copyLicenseKey() {
    setKeyCopied(true);
    toast.success("License key copied to clipboard");
    setTimeout(() => setKeyCopied(false), 2000);
  }

  function openUpgrade(mod: LicensedModule) {
    setSelectedModule(mod);
    setUpgradeOpen(true);
  }

  function openActivate(mod: LicensedModule) {
    setSelectedModule(mod);
    setActivateOpen(true);
  }

  function handleUpgrade() {
    setUpgradeOpen(false);
    toast.success(`Upgrade request for "${selectedModule?.name}" submitted. Your account team will contact you.`);
  }

  function handleActivate() {
    setActivateOpen(false);
    toast.success(`"${selectedModule?.name}" trial activated. Enjoy 30 days free!`);
  }

  const seatPct = Math.round((usedSeats / seatLimit) * 100);

  return (
    <AppShell title="License" subtitle="Platform license and module management">
      <PageHeader
        title="License & Modules"
        subtitle="Manage your TalentHub license, modules, and seat usage"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
              <RefreshCw className={`h-4 w-4 mr-1 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync License"}
            </Button>
            <Button size="sm" onClick={() => toast.info("Contacting account team...")}>
              <ArrowUpRight className="h-4 w-4 mr-1" /> Upgrade Plan
            </Button>
          </div>
        }
      />

      {/* License Key Banner */}
      <div className="rounded-xl border bg-gradient-to-r from-primary/5 to-transparent p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">License Key</p>
            <p className="font-mono text-sm font-medium tracking-wider">{LICENSE_KEY}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Valid
          </Badge>
          <Button variant="outline" size="sm" onClick={copyLicenseKey}>
            <Copy className="h-4 w-4 mr-1" />
            {keyCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Active Modules" value={activeModules.length} icon={<Package className="h-5 w-5" />} />
        <StatsCard title="Seats Used" value={`${usedSeats.toLocaleString()} / ${seatLimit.toLocaleString()}`} icon={<Users className="h-5 w-5" />} />
        <StatsCard title="License Valid Until" value="Dec 31, 2025" icon={<Calendar className="h-5 w-5" />} />
        <StatsCard title="Plan" value="Enterprise" icon={<Shield className="h-5 w-5" />} />
      </div>

      {/* Seat Usage */}
      <div className="rounded-xl border p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Seat Utilization</h3>
            <p className="text-sm text-muted-foreground">{usedSeats.toLocaleString()} of {seatLimit.toLocaleString()} employee seats in use</p>
          </div>
          <span className={`text-lg font-bold ${seatPct > 90 ? "text-red-600" : seatPct > 75 ? "text-amber-600" : "text-emerald-600"}`}>
            {seatPct}%
          </span>
        </div>
        <Progress value={seatPct} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{seatLimit - usedSeats} seats remaining</span>
          {seatPct > 85 && (
            <button className="text-primary hover:underline flex items-center gap-1" onClick={() => toast.info("Contacting account team...")}>
              Need more seats? <ArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules"><Package className="h-4 w-4 mr-1" /> Modules</TabsTrigger>
          <TabsTrigger value="history"><Clock className="h-4 w-4 mr-1" /> Sync History</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODULES.map(mod => {
              const statusConf = STATUS_CONFIG[mod.status];
              const tierConf = TIER_CONFIG[mod.tier];
              const usage = mod.seatLimit > 0 ? Math.round((mod.seatsUsed / mod.seatLimit) * 100) : null;

              return (
                <div key={mod.id} className={`rounded-xl border p-4 flex flex-col gap-3 ${mod.status === "inactive" ? "opacity-60" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${mod.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {mod.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm">{mod.name}</p>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${tierConf.color}`}>{tierConf.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusConf.dot}`} />
                          <span className={`text-xs font-medium ${statusConf.color}`}>{statusConf.label}</span>
                          {mod.status === "trial" && (
                            <span className="text-xs text-amber-600">· Expires {mod.expiresAt}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">{mod.description}</p>

                  {usage !== null && mod.status !== "inactive" && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Seats</span>
                        <span>{mod.seatsUsed} / {mod.seatLimit}</span>
                      </div>
                      <Progress value={usage} className={`h-1.5 ${usage > 90 ? "[&>div]:bg-red-500" : usage > 75 ? "[&>div]:bg-amber-500" : ""}`} />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {mod.features.slice(0, 3).map(f => (
                      <span key={f} className="text-xs bg-muted px-1.5 py-0.5 rounded">{f}</span>
                    ))}
                    {mod.features.length > 3 && (
                      <span className="text-xs text-muted-foreground px-1.5 py-0.5">+{mod.features.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    {mod.status === "inactive" ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => openActivate(mod)}>
                          Start Free Trial
                        </Button>
                        <Button size="sm" className="flex-1 text-xs" onClick={() => openUpgrade(mod)}>
                          <ArrowUpRight className="h-3 w-3 mr-1" /> Activate
                        </Button>
                      </>
                    ) : mod.status === "trial" ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 text-xs text-amber-700 border-amber-300 hover:bg-amber-50">
                          <Clock className="h-3 w-3 mr-1" /> Trial Mode
                        </Button>
                        <Button size="sm" className="flex-1 text-xs" onClick={() => openUpgrade(mod)}>
                          Upgrade to Full
                        </Button>
                      </>
                    ) : (
                      <>
                        {usage !== null && usage > 85 && (
                          <Button size="sm" className="flex-1 text-xs" onClick={() => openUpgrade(mod)}>
                            <ArrowUpRight className="h-3 w-3 mr-1" /> Add Seats
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className={usage !== null && usage > 85 ? "text-xs" : "flex-1 text-xs"} onClick={() => toast.info(`Viewing ${mod.name} settings`)}>
                          <ChevronRight className="h-3 w-3 mr-1" /> Details
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="border rounded-lg overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left p-3 font-medium text-muted-foreground">Date & Time</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Details</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Duration</th>
                </tr>
              </thead>
              <tbody>
                {SYNC_HISTORY.map(sync => (
                  <tr key={sync.id} className="border-b last:border-0">
                    <td className="p-3">
                      <p className="font-mono text-xs">{sync.date}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {sync.status === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        {sync.status === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        {sync.status === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <span className={`text-xs font-medium capitalize ${sync.status === "success" ? "text-emerald-700" : sync.status === "warning" ? "text-amber-700" : "text-red-700"}`}>
                          {sync.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{sync.changes}</td>
                    <td className="p-3 text-xs text-muted-foreground font-mono">{sync.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade {selectedModule?.name}</DialogTitle>
            <DialogDescription>
              Contact your account team to upgrade this module or add more seats.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border p-4 space-y-2">
            <p className="text-sm font-medium">{selectedModule?.name}</p>
            <p className="text-sm text-muted-foreground">{selectedModule?.description}</p>
            {selectedModule && selectedModule.seatLimit > 0 && (
              <p className="text-xs text-muted-foreground">
                Current: {selectedModule.seatsUsed} / {selectedModule.seatLimit} seats
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>Cancel</Button>
            <Button onClick={handleUpgrade}>
              <ExternalLink className="h-4 w-4 mr-1" /> Contact Account Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Trial Dialog */}
      <Dialog open={activateOpen} onOpenChange={setActivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Trial: {selectedModule?.name}</DialogTitle>
            <DialogDescription>
              Start a free 30-day trial of this module. No credit card required.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm">30-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm">Full feature access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm">No automatic billing</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivateOpen(false)}>Cancel</Button>
            <Button onClick={handleActivate}>Start Free Trial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
