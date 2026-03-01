import { motion } from "framer-motion";
import { BarChart3, Award, Brain, Lightbulb, ShieldCheck, Calendar } from "lucide-react";
import { PanelHeader } from "./PanelHeader";

const jeBreakdown = [
  { label: "Know-How", value: 200, max: 300, icon: Brain, color: "bg-primary" },
  { label: "Problem Solving", value: 175, max: 300, icon: Lightbulb, color: "bg-category-talent" },
  { label: "Accountability", value: 110, max: 200, icon: ShieldCheck, color: "bg-category-planning" },
];

export const JobGradePanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Job Grade & JE Score"
        subtitle="Grading classification and job evaluation breakdown"
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 space-y-5"
        >
          <h3 className="text-sm font-semibold text-foreground">Grade Classification</h3>
          <div className="space-y-4">
            {[
              { label: "Job Grade", value: "Level 7" },
              { label: "Grade Band", value: "Senior Professional" },
              { label: "JE Methodology", value: "Hay Points" },
              { label: "Last JE Review", value: "Jan 2024" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* JE Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">JE Score Breakdown</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">485 Points</span>
            </div>
          </div>

          <div className="space-y-5">
            {jeBreakdown.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / item.max) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
