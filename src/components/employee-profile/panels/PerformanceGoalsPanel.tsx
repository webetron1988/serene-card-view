import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ChevronDown, TrendingUp, Award, CheckCircle2, ArrowUpRight } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { PerformanceGoalForm } from "../forms/PerformanceGoalForm";

const yearData: Record<string, { goals: Goal[]; overall: number; exceeded: number; met: number; total: number }> = {
  "2024": {
    overall: 115,
    exceeded: 4,
    met: 2,
    total: 6,
    goals: [
      { name: "Implement ML fraud detection model", category: "Technical", weight: 30, target: "Q2 Launch", actual: "Q1 Launch", achievement: 125, status: "exceeded" },
      { name: "Reduce model inference time by 40%", category: "Technical", weight: 25, target: "40%", actual: "52%", achievement: 130, status: "exceeded" },
      { name: "Mentor 2 junior data scientists", category: "Leadership", weight: 15, target: "2 mentees", actual: "3 mentees", achievement: 150, status: "exceeded" },
      { name: "Complete AWS certification", category: "Development", weight: 10, target: "1 cert", actual: "1 cert", achievement: 100, status: "met" },
      { name: "Present at 2 industry conferences", category: "Visibility", weight: 10, target: "2 talks", actual: "2 talks", achievement: 100, status: "met" },
      { name: "Cross-functional collaboration", category: "Teamwork", weight: 10, target: "3 projects", actual: "4 projects", achievement: 133, status: "exceeded" },
    ],
  },
  "2023": {
    overall: 112,
    exceeded: 3,
    met: 3,
    total: 6,
    goals: [
      { name: "Lead data platform migration", category: "Technical", weight: 35, target: "Q3 Complete", actual: "Q2 Complete", achievement: 120, status: "exceeded" },
      { name: "Build real-time analytics pipeline", category: "Technical", weight: 25, target: "3 dashboards", actual: "4 dashboards", achievement: 133, status: "exceeded" },
      { name: "Publish internal ML best practices", category: "Knowledge", weight: 15, target: "1 guide", actual: "1 guide", achievement: 100, status: "met" },
      { name: "Improve model accuracy by 15%", category: "Technical", weight: 10, target: "15%", actual: "18%", achievement: 120, status: "exceeded" },
      { name: "Stakeholder satisfaction score", category: "Collaboration", weight: 10, target: "4.0+", actual: "4.2", achievement: 100, status: "met" },
      { name: "Complete leadership training", category: "Development", weight: 5, target: "1 program", actual: "1 program", achievement: 100, status: "met" },
    ],
  },
};

interface Goal {
  name: string;
  category: string;
  weight: number;
  target: string;
  actual: string;
  achievement: number;
  status: "exceeded" | "met" | "missed";
}

const categoryColors: Record<string, string> = {
  Technical: "bg-primary/10 text-primary",
  Leadership: "bg-violet-500/10 text-violet-600",
  Development: "bg-emerald-500/10 text-emerald-600",
  Visibility: "bg-amber-500/10 text-amber-600",
  Teamwork: "bg-sky-500/10 text-sky-600",
  Knowledge: "bg-rose-500/10 text-rose-600",
  Collaboration: "bg-teal-500/10 text-teal-600",
};

export const PerformanceGoalsPanel = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const data = yearData[selectedYear];
  const [goalFormOpen, setGoalFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Performance Goals & Objectives"
        subtitle="Year-wise goal tracking with weighted achievements"
        icon={Target}
        onAdd={() => setGoalFormOpen(true)}
        addLabel="Add Goal"
      />

      {/* Year Selector */}
      <div className="flex items-center gap-2">
        {Object.keys(yearData).map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedYear === year
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Achievement Summary */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-5"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{data.overall}%</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Overall Achievement</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-black text-foreground">{data.exceeded} / {data.total}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Goals Exceeded</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 mb-2">
                <CheckCircle2 className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{data.met} / {data.total}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Goals Met</p>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-3">
            {data.goals.map((goal, index) => (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${categoryColors[goal.category] || "bg-secondary text-muted-foreground"}`}>
                          {goal.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">Weight: {goal.weight}%</span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">{goal.name}</h4>
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      goal.status === "exceeded" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                    }`}>
                      <ArrowUpRight className="h-3 w-3" />
                      {goal.achievement}%
                    </div>
                  </div>

                  {/* Target vs Actual Bar */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Target</span>
                      <p className="font-semibold text-foreground">{goal.target}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Actual</span>
                      <p className="font-semibold text-foreground">{goal.actual}</p>
                    </div>
                  </div>

                  {/* Achievement bar */}
                  <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(goal.achievement, 150) / 1.5}%` }}
                      transition={{ delay: 0.3 + index * 0.06, duration: 0.7 }}
                      className={`h-full rounded-full ${
                        goal.status === "exceeded" ? "bg-emerald-500" : "bg-primary"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <PerformanceGoalForm open={goalFormOpen} onOpenChange={setGoalFormOpen} />
    </div>
  );
};
