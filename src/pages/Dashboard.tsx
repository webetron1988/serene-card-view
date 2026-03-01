import { useNavigate } from "react-router-dom";
import {
  Users, Building2, Briefcase, Shield, CheckCircle2, Clock,
  ArrowRight, Sparkles, Activity, UserPlus, BarChart3,
  Calendar, FileText, ShoppingBag
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

const stats = [
  { label: "Total Employees", value: "1,284", icon: Users, trend: "+12 this month", trendUp: true, colorClass: "bg-primary/10 text-primary" },
  { label: "Active Positions", value: "47", icon: Briefcase, trend: "+5 new", trendUp: true, colorClass: "bg-purple-100 text-purple-600" },
  { label: "Org Units", value: "38", icon: Building2, trend: "3 regions", trendUp: true, colorClass: "bg-sky-100 text-sky-600" },
  { label: "Open Tasks", value: "23", icon: Clock, trend: "-4 resolved", trendUp: false, colorClass: "bg-amber-100 text-amber-600" },
];

const recentActivity = [
  { user: "Sarah Chen", action: "Updated employee profile", module: "Workforce", time: "2m ago", avatar: "SC" },
  { user: "Mark Johnson", action: "Added new org unit", module: "Organisation", time: "15m ago", avatar: "MJ" },
  { user: "Priya Patel", action: "Cloned marketplace library", module: "Marketplace", time: "1h ago", avatar: "PP" },
  { user: "Tom Williams", action: "Completed onboarding checklist", module: "Onboarding", time: "2h ago", avatar: "TW" },
  { user: "Admin", action: "Invited 3 new users", module: "Users", time: "3h ago", avatar: "A" },
];

const quickActions = [
  { label: "Add Employee", icon: UserPlus, path: "/workforce/employees", color: "bg-primary/10 text-primary" },
  { label: "Org Chart", icon: Building2, path: "/org/chart", color: "bg-purple-100 text-purple-600" },
  { label: "Marketplace", icon: ShoppingBag, path: "/marketplace", color: "bg-emerald-100 text-emerald-600" },
  { label: "Analytics", icon: BarChart3, path: "/analytics", color: "bg-sky-100 text-sky-600" },
  { label: "Schedule", icon: Calendar, path: "/calendar", color: "bg-amber-100 text-amber-600" },
  { label: "Reports", icon: FileText, path: "/reports", color: "bg-rose-100 text-rose-600" },
];

const licenseModules = [
  { name: "Core HR", status: "active", seats: { used: 1284, total: 1500 } },
  { name: "Talent Suite", status: "active", seats: { used: 430, total: 500 } },
  { name: "Strategy Suite", status: "active", seats: { used: 28, total: 50 } },
  { name: "AI Suite", status: "trial", seats: { used: 5, total: 10 } },
  { name: "Compliance Suite", status: "inactive", seats: { used: 0, total: 0 } },
];

const avatarColors = [
  "from-primary to-primary/60",
  "from-purple-500 to-purple-400",
  "from-emerald-500 to-emerald-400",
  "from-amber-500 to-amber-400",
  "from-rose-500 to-rose-400",
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <AppShell title="Dashboard" subtitle="Welcome back, Admin">
      <div className="space-y-6">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-7 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.1),transparent_60%)]" />
          <div className="relative flex items-center justify-between gap-6">
            <div className="flex-1">
              <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Welcome to</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">TalentHub Platform</h2>
              <div className="mt-3 flex items-center gap-2.5">
                <span className="text-lg">👋</span>
                <span className="text-white/90 font-medium text-sm">Good Morning, Admin!</span>
                <span className="text-white/30 mx-0.5">·</span>
                <span className="text-sm text-white/60">
                  You have <span className="text-blue-400 font-semibold">5 pending</span> approvals
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-3.5 rounded-xl">
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Plan</p>
                <p className="text-base font-bold text-white mt-0.5">Enterprise</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {stats.map(s => (
            <StatsCard key={s.label} {...s} onClick={() => navigate("/workforce/employees")} />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-card border border-border/60 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
              </div>
              <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-border/40">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{a.user}</span>
                      <span className="text-muted-foreground"> {a.action}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-primary font-medium">{a.module}</span>
                      <span className="text-[11px] text-muted-foreground/60">{a.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border/60">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Quick Actions
                </h3>
              </div>
              <div className="p-3 grid grid-cols-3 gap-1.5">
                {quickActions.map(a => (
                  <button
                    key={a.label}
                    onClick={() => navigate(a.path)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-all group"
                  >
                    <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <a.icon className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* License Overview */}
            <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  License
                </h3>
                <button
                  onClick={() => navigate("/license")}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Manage
                </button>
              </div>
              <div className="p-4 space-y-2.5">
                {licenseModules.map(m => (
                  <div key={m.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${m.status === "active" ? "text-emerald-500" : m.status === "trial" ? "text-amber-500" : "text-muted-foreground/40"}`} />
                      <span className="text-xs text-foreground truncate">{m.name}</span>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant teaser */}
        <div className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 border border-primary/15 rounded-xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Generate job descriptions, competency frameworks, and more</p>
              </div>
            </div>
            <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              Open AI Chat
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
