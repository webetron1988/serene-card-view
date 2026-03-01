import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, DollarSign, CalendarDays, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainingForm } from "../forms/TrainingForm";

const metrics = [
  { label: "Total Training Hours", value: "156", icon: Clock, accent: "from-primary/20 to-primary/10", iconColor: "text-primary" },
  { label: "Courses Completed", value: "24", icon: CheckCircle2, accent: "from-status-completed/20 to-status-completed/10", iconColor: "text-status-completed" },
  { label: "Training Investment", value: "$8,500", icon: DollarSign, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-500" },
  { label: "Hours This Year", value: "40", icon: CalendarDays, accent: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-500" },
];

const trainings = [
  { name: "Advanced Machine Learning with TensorFlow", type: "Technical", provider: "Coursera", date: "Nov 2024", hours: 40, totalHours: 40, status: "Completed" },
  { name: "Leadership Essentials", type: "Leadership", provider: "Internal", date: "Sep 2024", hours: 16, totalHours: 16, status: "Completed" },
  { name: "AWS Solutions Architect Prep", type: "Certification", provider: "AWS", date: "Feb 2023", hours: 60, totalHours: 60, status: "Completed" },
  { name: "GenAI for Enterprise", type: "Technical", provider: "Internal", date: "Dec 2024", hours: 8, totalHours: 12, status: "In Progress" },
];

const typeIcons: Record<string, typeof BookOpen> = {
  Technical: BookOpen,
  Leadership: Building2,
  Certification: CheckCircle2,
};

type FilterStatus = "All" | "Completed" | "In Progress";

export const TrainingHistoryPanel = () => {
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [formOpen, setFormOpen] = useState(false);
  const filtered = filter === "All" ? trainings : trainings.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <PanelHeader title="Training History" subtitle="Completed and ongoing training programs" icon={BookOpen} pastel="teal" onAdd={() => setFormOpen(true)} addLabel="Add Training" />

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${m.accent} p-5`}>
            <m.icon className={`h-5 w-5 ${m.iconColor} mb-3`} />
            <span className="text-3xl font-black text-foreground tracking-tight">{m.value}</span>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="All" className="text-xs">All ({trainings.length})</TabsTrigger>
          <TabsTrigger value="Completed" className="text-xs"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed ({trainings.filter(t => t.status === "Completed").length})</TabsTrigger>
          <TabsTrigger value="In Progress" className="text-xs"><Loader2 className="h-3 w-3 mr-1" /> In Progress ({trainings.filter(t => t.status === "In Progress").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Cards - 3 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t, i) => {
          const progress = Math.round((t.hours / t.totalHours) * 100);
          const TypeIcon = typeIcons[t.type] || BookOpen;
          return (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
              <Card className="p-5 border-border/50 hover:shadow-md transition-shadow h-full flex flex-col">
                {/* Row 1: Category + Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <TypeIcon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="uppercase tracking-wider font-semibold text-[10px]">{t.type}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-medium gap-1 ${
                    t.status === "Completed" ? "text-status-completed border-status-completed/30" : "text-amber-600 border-amber-500/30"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${t.status === "Completed" ? "bg-status-completed" : "bg-amber-500"}`} />
                    {t.status}
                  </Badge>
                </div>

                {/* Row 2: Title */}
                <h4 className="text-sm font-bold text-foreground leading-snug mb-4 flex-1">{t.name}</h4>

                {/* Row 3: Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold text-foreground">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                      className={`h-full rounded-full ${progress === 100 ? "bg-primary" : "bg-primary"}`}
                    />
                  </div>
                </div>

                {/* Row 4: Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{t.provider}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{t.date}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <TrainingForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
