import { motion } from "framer-motion";
import { History, Star, TrendingUp, Trophy, ShieldCheck } from "lucide-react";
import { PanelHeader } from "./PanelHeader";

const history = [
  { year: "2024", rating: 4.5, category: "Exceeds Expectations", goalAchievement: 115, manager: "Dr. Patricia Johnson", accomplishment: "ML Fraud Detection System", promoted: false },
  { year: "2023", rating: 4.5, category: "Exceeds Expectations", goalAchievement: 112, manager: "Dr. Patricia Johnson", accomplishment: "Data Platform Migration", promoted: false },
  { year: "2022", rating: 4.8, category: "Outstanding", goalAchievement: 120, manager: "Dr. Patricia Johnson", accomplishment: "Promoted to Senior DS", promoted: true },
  { year: "2021", rating: 4.2, category: "Exceeds Expectations", goalAchievement: 105, manager: "Robert Williams", accomplishment: "Customer Analytics Platform", promoted: false },
  { year: "2020", rating: 4.3, category: "Exceeds Expectations", goalAchievement: 110, manager: "Robert Williams", accomplishment: "Promoted to Data Scientist II", promoted: true },
];

export const PerformanceHistoryPanel = () => {
  const maxRating = Math.max(...history.map((h) => h.rating));
  const avgRating = (history.reduce((s, h) => s + h.rating, 0) / history.length).toFixed(2);

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Performance Ratings History"
        subtitle="5-year performance trajectory & accomplishments"
        icon={History}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "5-Year Average", value: `${avgRating}`, suffix: "/ 5.0", icon: Star, color: "text-amber-500" },
          { label: "Highest Rating", value: `${maxRating}`, suffix: "(2022)", icon: Trophy, color: "text-primary" },
          { label: "Consecutive High Performer", value: "5", suffix: "Years", icon: TrendingUp, color: "text-emerald-500" },
          { label: "PIPs", value: "0", suffix: "", icon: ShieldCheck, color: "text-emerald-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border border-border bg-card p-4 text-center"
          >
            <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2`} />
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-black text-foreground">{stat.value}</span>
              {stat.suffix && <span className="text-xs text-muted-foreground font-medium">{stat.suffix}</span>}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Visual Rating Timeline — Line Chart Style */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-6">Rating Trajectory</h3>
        {(() => {
          const sorted = history.slice().reverse(); // 2020→2024
          const minR = 3.5;
          const maxR = 5.0;
          const chartH = 140;
          const getBarH = (r: number) => ((r - minR) / (maxR - minR)) * chartH;

          return (
            <div className="flex items-end justify-between gap-4 px-4" style={{ height: chartH + 60 }}>
              {sorted.map((entry, i) => {
                const barH = getBarH(entry.rating);
                return (
                  <div key={entry.year} className="flex-1 flex flex-col items-center gap-1">
                    {entry.rating === maxRating && (
                      <Trophy className="h-5 w-5 text-amber-500 mb-0.5" />
                    )}
                    <span className={`text-sm font-bold ${entry.rating >= 4.5 ? "text-primary" : "text-foreground"}`}>
                      {entry.rating}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: barH }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                      className="w-full max-w-[36px] rounded-lg bg-primary/10"
                    />
                    <span className="text-xs font-medium text-muted-foreground mt-2">{entry.year}</span>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </motion.div>

      {/* Year-by-Year Detail Cards */}
      <div className="space-y-3">
        {history.map((entry, index) => (
          <motion.div
            key={entry.year}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.07 }}
            className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black ${
                  entry.rating >= 4.5 ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"
                }`}>
                  {entry.year}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">{entry.rating} / 5.0</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      entry.category === "Outstanding" ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
                    }`}>
                      {entry.category}
                    </span>
                    {entry.promoted && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/10 text-violet-600">
                        ⬆ Promoted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{entry.accomplishment} • {entry.manager}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                <TrendingUp className="h-3 w-3" />
                {entry.goalAchievement}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
