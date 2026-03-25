import {
  Building2, CreditCard, Calendar, Clock, Users, TrendingUp, DollarSign,
  ArrowUpRight, CheckCircle2, AlertCircle, XCircle, FileText, Receipt,
  Activity, Shield, Mail, Globe, ChevronRight, Wallet, BarChart3
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TenantSubscription } from "@/data/packagesData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

// Mock invoice data
const mockInvoices = [
  { id: "INV-2026-03", date: "2026-03-15", amount: 1999, status: "paid" as const },
  { id: "INV-2026-02", date: "2026-02-15", amount: 1999, status: "paid" as const },
  { id: "INV-2026-01", date: "2026-01-15", amount: 1999, status: "paid" as const },
  { id: "INV-2025-12", date: "2025-12-15", amount: 1999, status: "paid" as const },
  { id: "INV-2025-11", date: "2025-11-15", amount: 1999, status: "paid" as const },
  { id: "INV-2025-10", date: "2025-10-15", amount: 799, status: "paid" as const },
  { id: "INV-2025-09", date: "2025-09-15", amount: 799, status: "paid" as const },
];

// Mock usage trend
const mockUsageTrend = [
  { month: "Oct", seats: 920, storage: 45, apiCalls: 12400 },
  { month: "Nov", seats: 980, storage: 52, apiCalls: 14200 },
  { month: "Dec", seats: 1050, storage: 58, apiCalls: 15800 },
  { month: "Jan", seats: 1120, storage: 63, apiCalls: 17300 },
  { month: "Feb", seats: 1180, storage: 68, apiCalls: 19100 },
  { month: "Mar", seats: 1240, storage: 72, apiCalls: 21500 },
];

// Mock activity timeline
const mockTimeline = [
  { date: "2026-03-15", event: "Invoice paid", type: "payment" as const, detail: "$1,999.00" },
  { date: "2026-03-10", event: "50 new seats activated", type: "usage" as const, detail: "1,190 → 1,240 seats" },
  { date: "2026-02-20", event: "Package upgraded", type: "upgrade" as const, detail: "Professional → Enterprise" },
  { date: "2026-02-15", event: "Invoice paid", type: "payment" as const, detail: "$1,999.00" },
  { date: "2026-01-28", event: "API access enabled", type: "config" as const, detail: "Integration activated" },
  { date: "2026-01-15", event: "Invoice paid", type: "payment" as const, detail: "$1,999.00" },
  { date: "2025-12-15", event: "Invoice paid", type: "payment" as const, detail: "$1,999.00" },
  { date: "2025-11-15", event: "Invoice paid", type: "payment" as const, detail: "$1,999.00" },
];

const TIMELINE_ICONS = {
  payment: CheckCircle2,
  usage: Users,
  upgrade: ArrowUpRight,
  config: Shield,
};
const TIMELINE_COLORS = {
  payment: "text-emerald-500 bg-emerald-500/10",
  usage: "text-primary bg-primary/10",
  upgrade: "text-amber-500 bg-amber-500/10",
  config: "text-violet-500 bg-violet-500/10",
};

const INVOICE_STATUS_STYLE = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  overdue: "bg-destructive/10 text-destructive",
};

const SUB_STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  trial: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  expired: "bg-muted text-muted-foreground",
  suspended: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

interface Props {
  subscription: TenantSubscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionDetailPanel({ subscription, open, onOpenChange }: Props) {
  if (!subscription) return null;

  const sub = subscription;
  const seatPct = sub.seats > 0 ? Math.round((sub.usedSeats / sub.seats) * 100) : 0;
  const healthColor = sub.healthScore >= 80 ? "text-emerald-500" : sub.healthScore >= 50 ? "text-amber-500" : "text-destructive";
  const healthBg = sub.healthScore >= 80 ? "bg-emerald-500/10" : sub.healthScore >= 50 ? "bg-amber-500/10" : "bg-destructive/10";

  const tooltipStyle = {
    contentStyle: {
      background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
      borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b space-y-3">
          {/* Tenant Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg">{sub.tenantName}</SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3 w-3" /> {sub.tenantEmail}
              </SheetDescription>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${SUB_STATUS_COLORS[sub.status]}`}>
              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
            </span>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-lg p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">MRR</p>
              <p className="text-sm font-bold text-foreground">{sub.mrr > 0 ? formatCurrency(sub.mrr) : "—"}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Total Revenue</p>
              <p className="text-sm font-bold text-foreground">{formatCurrency(sub.totalRevenue)}</p>
            </div>
            <div className={`${healthBg} rounded-lg p-2.5 text-center`}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Health</p>
              <p className={`text-sm font-bold ${healthColor}`}>{sub.healthScore}%</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-muted/60 border border-border/50 p-0.5 h-auto rounded-lg w-full">
                {[
                  { value: "overview", label: "Overview" },
                  { value: "invoices", label: "Invoices" },
                  { value: "usage", label: "Usage" },
                  { value: "timeline", label: "Activity" },
                ].map(t => (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className="flex-1 text-[11px] px-3 py-1.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ── Overview ── */}
              <TabsContent value="overview" className="space-y-5 mt-4">
                {/* Subscription Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subscription Details</h4>
                  <div className="bg-muted/30 rounded-xl border border-border/40 divide-y divide-border/40">
                    {[
                      { icon: CreditCard, label: "Package", value: sub.packageName },
                      { icon: Calendar, label: "Start Date", value: sub.startDate },
                      { icon: Clock, label: "Next Billing", value: sub.nextBillingDate },
                      { icon: Wallet, label: "Billing Cycle", value: sub.billingCycle.charAt(0).toUpperCase() + sub.billingCycle.slice(1) },
                      { icon: CreditCard, label: "Payment Method", value: sub.paymentMethod === "card" ? "Credit Card" : sub.paymentMethod === "bank_transfer" ? "Bank Transfer" : "Invoice" },
                      ...(sub.lastPaymentDate ? [{ icon: CheckCircle2, label: "Last Payment", value: sub.lastPaymentDate }] : []),
                      ...(sub.trialEndsAt ? [{ icon: AlertCircle, label: "Trial Ends", value: sub.trialEndsAt }] : []),
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                        <row.icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-xs text-muted-foreground flex-1">{row.label}</span>
                        <span className="text-xs font-medium text-foreground">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seat Utilization */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seat Utilization</h4>
                  <div className="bg-muted/30 rounded-xl border border-border/40 p-4">
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <span className="text-2xl font-bold text-foreground">{sub.usedSeats.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground"> / {sub.seats.toLocaleString()}</span>
                      </div>
                      <span className={`text-sm font-semibold ${seatPct >= 90 ? "text-destructive" : seatPct >= 70 ? "text-amber-500" : "text-emerald-500"}`}>{seatPct}%</span>
                    </div>
                    <Progress value={seatPct} className="h-2" />
                    <p className="text-[11px] text-muted-foreground mt-2">
                      {sub.seats - sub.usedSeats} seats remaining
                      {seatPct >= 90 && " · Consider upgrading"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 text-xs">
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Upgrade Package
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Mail className="h-3.5 w-3.5 mr-1" /> Contact Tenant
                  </Button>
                </div>
              </TabsContent>

              {/* ── Invoices ── */}
              <TabsContent value="invoices" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Invoice History</h4>
                  <Badge variant="secondary" className="text-[10px]">{mockInvoices.length} invoices</Badge>
                </div>
                <div className="space-y-2">
                  {mockInvoices.map(inv => (
                    <div key={inv.id} className="flex items-center gap-3 bg-muted/30 rounded-lg border border-border/40 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Receipt className="h-4 w-4 text-primary" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{inv.id}</p>
                        <p className="text-[11px] text-muted-foreground">{inv.date}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{formatCurrency(inv.amount)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${INVOICE_STATUS_STYLE[inv.status]}`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
                <div className="bg-muted/30 rounded-lg border border-border/40 p-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Billed</span>
                    <span className="font-bold text-foreground">{formatCurrency(sub.totalRevenue)}</span>
                  </div>
                </div>
              </TabsContent>

              {/* ── Usage ── */}
              <TabsContent value="usage" className="space-y-4 mt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seat Growth (6 months)</h4>
                <div className="bg-muted/30 rounded-xl border border-border/40 p-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={mockUsageTrend}>
                      <defs>
                        <linearGradient id="seatGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip {...tooltipStyle} />
                      <Area type="monotone" dataKey="seats" stroke="hsl(var(--primary))" fill="url(#seatGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usage Metrics</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Active Seats", value: sub.usedSeats.toLocaleString(), icon: Users, pct: seatPct },
                    { label: "Storage Used", value: "72 GB", icon: FileText, pct: 58 },
                    { label: "API Calls/mo", value: "21.5K", icon: Activity, pct: 43 },
                  ].map(m => (
                    <div key={m.label} className="bg-muted/30 rounded-lg border border-border/40 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <m.icon className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                        <span className="text-[10px] text-muted-foreground">{m.label}</span>
                      </div>
                      <p className="text-sm font-bold text-foreground mb-1.5">{m.value}</p>
                      <Progress value={m.pct} className="h-1" />
                      <p className="text-[10px] text-muted-foreground mt-1">{m.pct}% utilized</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ── Timeline ── */}
              <TabsContent value="timeline" className="space-y-4 mt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activity Timeline</h4>
                <div className="relative space-y-0">
                  {/* Vertical line */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border/60" />
                  {mockTimeline.map((item, i) => {
                    const Icon = TIMELINE_ICONS[item.type];
                    const colors = TIMELINE_COLORS[item.type];
                    return (
                      <div key={i} className="relative flex gap-3 py-2.5">
                        <div className={`w-[30px] h-[30px] rounded-full ${colors} flex items-center justify-center flex-shrink-0 z-10`}>
                          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-xs font-medium text-foreground">{item.event}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-muted-foreground">{item.date}</span>
                            <span className="text-[11px] text-muted-foreground/60">·</span>
                            <span className="text-[11px] text-muted-foreground">{item.detail}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
