import { Building2, Users, Briefcase, BarChart3, BookOpen, Target, ArrowRight, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const modules = [
  { name: "Employee Directory", icon: Users, status: "available", description: "View and manage your team" },
  { name: "Jobs & JD Studio", icon: Briefcase, status: "available", description: "Job architecture and AI-powered JD creation" },
  { name: "Competency Framework", icon: Target, status: "available", description: "Skills and competency management" },
  { name: "Career Path", icon: ArrowRight, status: "coming_soon", description: "Career development and IDP" },
  { name: "Strategy Studio", icon: BarChart3, status: "locked", description: "OKR/BSC and strategy execution" },
  { name: "Learning Path", icon: BookOpen, status: "locked", description: "Learning management integration" },
];

export default function TenantDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Tenant Header (placeholder — will be TenantShell) */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">Your Company</h1>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">Talent Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500/60 text-white flex items-center justify-center text-xs font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Welcome back, John</h2>
          <p className="text-sm text-muted-foreground mt-1">Here's your talent platform overview</p>
        </div>

        {/* Onboarding Progress (stub) */}
        <Card className="mb-8 border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Setup Progress</p>
                <p className="text-xs text-muted-foreground mt-0.5">Complete your organization setup to unlock all features</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                  <div className="w-[35%] h-full bg-emerald-500 rounded-full" />
                </div>
                <span className="text-sm font-semibold text-emerald-600">35%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <h3 className="text-base font-semibold text-foreground mb-4">Available Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <Card
              key={mod.name}
              className={`cursor-pointer transition-all hover:shadow-md ${
                mod.status === "locked" ? "opacity-60" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    mod.status === "available" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" :
                    mod.status === "coming_soon" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    <mod.icon className="w-5 h-5" />
                  </div>
                  {mod.status === "locked" && <Lock className="w-4 h-4 text-muted-foreground" />}
                  {mod.status === "coming_soon" && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                      Coming Soon
                    </span>
                  )}
                </div>
                <CardTitle className="text-sm mt-2">{mod.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{mod.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placeholder info */}
        <div className="mt-12 text-center py-8 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground">
            This is the <span className="font-semibold text-foreground">Tenant Dashboard</span> stub.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Role-based widgets, function-scoped views, and module access will be built in upcoming phases.
          </p>
        </div>
      </main>
    </div>
  );
}
