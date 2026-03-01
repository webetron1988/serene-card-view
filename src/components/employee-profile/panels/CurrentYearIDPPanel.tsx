import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Clock, DollarSign, Target, CalendarDays } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { DataRow } from "./DataRow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IDPGoalForm } from "../forms/IDPGoalForm";

const idpMeta = [
  { label: "IDP Status", value: "Active", badge: "Active", badgeVariant: "success" as const },
  { label: "IDP Period", value: "Jan 2024 - Dec 2024" },
  { label: "Development Focus", value: "Leadership & Strategic Thinking" },
  { label: "Manager Approved", value: "Yes (Jan 15, 2024)", badge: "Approved", badgeVariant: "success" as const },
];

const goals = [
  { goal: "Complete Leadership Development Program", category: "Leadership", actions: "12 workshops, 6 coaching sessions", target: "Dec 2024", progress: 80, status: "In Progress" },
  { goal: "Present at industry conference", category: "Visibility", actions: "Submit abstract, prepare presentation", target: "Oct 2024", progress: 100, status: "Completed" },
  { goal: "Lead cross-functional initiative", category: "Experience", actions: "Lead product analytics project", target: "Jun 2024", progress: 100, status: "Completed" },
  { goal: "Executive coaching sessions", category: "Coaching", actions: "8 sessions with external coach", target: "Dec 2024", progress: 75, status: "In Progress" },
];

const summaryMetrics = [
  { label: "2024 IDP Progress", value: "75%", icon: Target, accent: "from-primary/20 to-primary/10", iconColor: "text-primary" },
  { label: "Goals Completed", value: "2 / 4", icon: CheckCircle2, accent: "from-status-completed/20 to-status-completed/10", iconColor: "text-status-completed" },
  { label: "Budget Allocated", value: "$8,000", icon: DollarSign, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-500" },
  { label: "Budget Used", value: "$6,500", icon: DollarSign, accent: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-500" },
];

const categoryIcons: Record<string, typeof Target> = {
  Leadership: Target,
  Visibility: Target,
  Experience: Target,
  Coaching: Target,
};

type FilterStatus = "All" | "Completed" | "In Progress";

export const CurrentYearIDPPanel = () => {
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [formOpen, setFormOpen] = useState(false);
  const filtered = filter === "All" ? goals : goals.filter(g => g.status === filter);

  return (
    <div className="space-y-6">
      <PanelHeader title="IDP for Current Year (2024)" subtitle="Individual development plan goals and progress" icon={ClipboardList} pastel="green" onAdd={() => setFormOpen(true)} addLabel="Add Goal" />

      {/* Analytics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${m.accent} p-5`}>
            <m.icon className={`h-5 w-5 ${m.iconColor} mb-3`} />
            <span className="text-3xl font-black text-foreground tracking-tight">{m.value}</span>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* IDP Details */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border-border/50">
          {idpMeta.map((item, i) => (
            <DataRow key={item.label} label={item.label} value={item.value} index={i} isLast={i === idpMeta.length - 1} badge={item.badge} badgeVariant={item.badgeVariant} />
          ))}
        </Card>
      </motion.div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="All" className="text-xs">All Goals ({goals.length})</TabsTrigger>
          <TabsTrigger value="Completed" className="text-xs"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed ({goals.filter(g => g.status === "Completed").length})</TabsTrigger>
          <TabsTrigger value="In Progress" className="text-xs"><Clock className="h-3 w-3 mr-1" /> In Progress ({goals.filter(g => g.status === "In Progress").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Goal Cards - 3 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g, i) => {
          const GoalIcon = categoryIcons[g.category] || Target;
          return (
            <motion.div key={g.goal} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
              <Card className="p-5 border-border/50 hover:shadow-md transition-shadow h-full flex flex-col">
                {/* Row 1: Category + Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <GoalIcon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="uppercase tracking-wider font-semibold text-[10px]">{g.category}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-medium gap-1 ${
                    g.status === "Completed" ? "text-status-completed border-status-completed/30" : "text-amber-600 border-amber-500/30"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${g.status === "Completed" ? "bg-status-completed" : "bg-amber-500"}`} />
                    {g.status}
                  </Badge>
                </div>

                {/* Row 2: Title */}
                <h4 className="text-sm font-bold text-foreground leading-snug mb-3 flex-1">{g.goal}</h4>

                {/* Row 3: Actions description */}
                <p className="text-xs text-muted-foreground mb-4">{g.actions}</p>

                {/* Row 4: Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold text-foreground">{g.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${g.progress}%` }}
                      transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>

                {/* Row 5: Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                  <span>Target: {g.target}</span>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{g.target}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <IDPGoalForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
