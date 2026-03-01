import { motion } from "framer-motion";
import { BarChart3, TrendingUp, CheckCircle2, Clock, Target } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const idpYears = [
  { year: "2024", focus: "Leadership & Strategic Thinking", goals: 4, achieved: 3, completion: 75, status: "In Progress", manager: "Dr. Patricia Johnson" },
  { year: "2023", focus: "Technical Excellence & Visibility", goals: 5, achieved: 5, completion: 100, status: "Completed", manager: "Dr. Patricia Johnson" },
  { year: "2022", focus: "Advanced ML & Team Leadership", goals: 4, achieved: 4, completion: 100, status: "Completed", manager: "Dr. Patricia Johnson" },
];

const progressTrends = [
  { skill: "Technical Leadership", from: 70, to: 85 },
  { skill: "Strategic Thinking", from: 50, to: 65 },
  { skill: "Executive Presence", from: 55, to: 70 },
  { skill: "Stakeholder Management", from: 60, to: 75 },
];

export const ConsolidatedIDPPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Consolidated IDP (Multi-Year View)"
        subtitle="3-year individual development plan summary"
        icon={BarChart3}
        pastel="purple"
      />

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-gradient-to-br from-primary/20 to-primary/10 p-5">
          <Target className="h-5 w-5 text-primary mb-3" />
          <span className="text-3xl font-black text-foreground tracking-tight">92%</span>
          <p className="text-xs text-muted-foreground mt-1">3-Year Goal Completion</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl border border-border bg-gradient-to-br from-status-completed/20 to-status-completed/10 p-5">
          <Clock className="h-5 w-5 text-status-completed mb-3" />
          <span className="text-3xl font-black text-foreground tracking-tight">320</span>
          <p className="text-xs text-muted-foreground mt-1">Total Development Hours</p>
        </motion.div>
      </div>

      {/* Year Cards */}
      <div className="space-y-4">
        {idpYears.map((row, i) => (
          <motion.div
            key={row.year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <Card className="p-5 border-border/50 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-black text-primary">{row.year.slice(2)}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{row.focus}</h4>
                    <p className="text-xs text-muted-foreground">Manager: {row.manager}</p>
                  </div>
                </div>
                <Badge className={`border-0 text-[10px] ${
                  row.status === "Completed"
                    ? "bg-status-completed/10 text-status-completed"
                    : "bg-amber-500/10 text-amber-600"
                }`}>
                  {row.status === "Completed" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                  {row.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Goals: {row.achieved}/{row.goals} achieved</span>
                  <span className="font-semibold text-foreground">{row.completion}%</span>
                </div>
                <Progress value={row.completion} className="h-2" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Development Progress Over Time */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-5 border-border/50">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-pastel-blue">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">📊 Development Progress Over Time</h3>
          </div>
          <div className="space-y-5">
            {progressTrends.map((trend, i) => (
              <motion.div
                key={trend.skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground">{trend.skill}</span>
                  <span className="text-[10px] text-muted-foreground">2022: {trend.from}% → 2024: {trend.to}%</span>
                </div>
                <div className="h-2.5 bg-secondary rounded-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 bg-muted-foreground/20 rounded-full" style={{ width: `${trend.from}%` }} />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trend.to}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-primary relative z-10"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
