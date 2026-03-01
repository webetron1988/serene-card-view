import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Trophy, Star, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ratingBreakdown = [
  { label: "Technical Excellence", score: 4.7, max: 5 },
  { label: "Leadership & Influence", score: 4.3, max: 5 },
  { label: "Innovation & Initiative", score: 4.6, max: 5 },
  { label: "Collaboration", score: 4.5, max: 5 },
  { label: "Communication", score: 4.2, max: 5 },
];

const yearData: Record<string, {
  managerRating: string;
  selfRating: string;
  finalRating: string;
  category: string;
  status: "completed" | "in-progress";
  competencies: { label: string; score: number; max: number }[];
}> = {
  "2024": {
    managerRating: "4.5 / 5.0",
    selfRating: "4.3 / 5.0",
    finalRating: "Pending",
    category: "Exceeds Expectations",
    status: "in-progress",
    competencies: ratingBreakdown,
  },
  "2023": {
    managerRating: "4.5 / 5.0",
    selfRating: "4.4 / 5.0",
    finalRating: "4.5 / 5.0",
    category: "Exceeds Expectations",
    status: "completed",
    competencies: [
      { label: "Technical Excellence", score: 4.5, max: 5 },
      { label: "Leadership & Influence", score: 4.2, max: 5 },
      { label: "Innovation & Initiative", score: 4.4, max: 5 },
      { label: "Collaboration", score: 4.6, max: 5 },
      { label: "Communication", score: 4.1, max: 5 },
    ],
  },
  "2022": {
    managerRating: "4.8 / 5.0",
    selfRating: "4.5 / 5.0",
    finalRating: "4.8 / 5.0",
    category: "Outstanding",
    status: "completed",
    competencies: [
      { label: "Technical Excellence", score: 4.9, max: 5 },
      { label: "Leadership & Influence", score: 4.6, max: 5 },
      { label: "Innovation & Initiative", score: 4.8, max: 5 },
      { label: "Collaboration", score: 4.7, max: 5 },
      { label: "Communication", score: 4.4, max: 5 },
    ],
  },
  "2021": {
    managerRating: "4.2 / 5.0",
    selfRating: "4.0 / 5.0",
    finalRating: "4.2 / 5.0",
    category: "Exceeds Expectations",
    status: "completed",
    competencies: [
      { label: "Technical Excellence", score: 4.3, max: 5 },
      { label: "Leadership & Influence", score: 3.9, max: 5 },
      { label: "Innovation & Initiative", score: 4.1, max: 5 },
      { label: "Collaboration", score: 4.3, max: 5 },
      { label: "Communication", score: 4.0, max: 5 },
    ],
  },
  "2020": {
    managerRating: "4.3 / 5.0",
    selfRating: "4.1 / 5.0",
    finalRating: "4.3 / 5.0",
    category: "Exceeds Expectations",
    status: "completed",
    competencies: [
      { label: "Technical Excellence", score: 4.2, max: 5 },
      { label: "Leadership & Influence", score: 3.8, max: 5 },
      { label: "Innovation & Initiative", score: 4.3, max: 5 },
      { label: "Collaboration", score: 4.1, max: 5 },
      { label: "Communication", score: 3.9, max: 5 },
    ],
  },
};

const years = ["2024", "2023", "2022", "2021", "2020"];

export const PerformanceSummaryPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Performance Summary"
        subtitle="Current cycle overview & multi-dimensional assessment"
        icon={BarChart3}
      />

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Current Rating", value: "4.5", suffix: "/ 5.0", icon: Star, accent: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-500" },
          { label: "Goal Achievement", value: "115", suffix: "%", icon: TrendingUp, accent: "from-emerald-500/20 to-green-500/20", iconColor: "text-emerald-500" },
          { label: "High Performer Streak", value: "5", suffix: "Years", icon: Trophy, accent: "from-primary/20 to-primary/10", iconColor: "text-primary" },
          { label: "5-Year Avg Rating", value: "4.3", suffix: "/ 5.0", icon: BarChart3, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-500" },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${metric.accent} p-5`}
          >
            <metric.icon className={`h-5 w-5 ${metric.iconColor} mb-3`} />
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-foreground tracking-tight">{metric.value}</span>
              <span className="text-sm font-medium text-muted-foreground">{metric.suffix}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Year History & Competency — Side by side */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Left: Year Status Card with internal tabs */}
        <Tabs defaultValue="2024" className="h-full">
          <div className="rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col">
            <div className="px-5 py-3 border-b border-border bg-primary/5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Performance Year History</span>
              </div>
              <TabsList className="h-7 bg-muted/50">
                {years.map((y) => (
                  <TabsTrigger key={y} value={y} className="text-[11px] px-2.5 py-0.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    {y}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {years.map((year) => {
              const data = yearData[year];
              return (
                <TabsContent key={year} value={year} className="mt-0">
                  <div className="px-5 py-3 flex items-center justify-end">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      data.status === "in-progress"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}>
                      {data.status === "in-progress" ? (
                        <><AlertCircle className="h-3 w-3" /> In Progress — Pending Calibration</>
                      ) : (
                        <><CheckCircle2 className="h-3 w-3" /> Completed</>
                      )}
                    </span>
                  </div>
                  <div className="px-5 pb-5 grid grid-cols-2 gap-6">
                    {[
                      { label: "Manager Rating", value: data.managerRating, done: true },
                      { label: "Self Rating", value: data.selfRating, done: true },
                      { label: "Final Rating", value: data.finalRating, done: data.finalRating !== "Pending" },
                      { label: "Category", value: data.category, done: true },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center gap-1.5 mb-1">
                          {item.done ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{item.label}</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </div>
        </Tabs>

        {/* Right: Competency Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-5 h-full flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Competency Breakdown
          </h3>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {ratingBreakdown.map((item, index) => {
              const percentage = (item.score / item.max) * 100;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground">{item.label}</span>
                    <span className="text-xs font-bold text-foreground">{item.score}</span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.2 + index * 0.06, duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        percentage >= 90 ? "bg-emerald-500" : percentage >= 80 ? "bg-primary" : "bg-amber-500"
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
