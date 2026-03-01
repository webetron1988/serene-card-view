import { motion } from "framer-motion";
import { Star, TrendingUp, Shield, AlertTriangle, Target, Clock, Zap } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const nineBoxData = {
  position: "High Performer / High Potential",
  label: "⭐ Star",
  performance: "High (4.5 / 5.0)",
  potential: "High",
  row: 0,
  col: 2,
};

const nineBoxGrid = [
  { row: [
    { label: "Enigma", desc: "Low Perf / High Pot" },
    { label: "Growth Employee", desc: "Med Perf / High Pot" },
    { label: "⭐ Star", desc: "High Perf / High Pot" },
  ]},
  { row: [
    { label: "Dilemma", desc: "Low Perf / Med Pot" },
    { label: "Core Player", desc: "Med Perf / Med Pot" },
    { label: "High Performer", desc: "High Perf / Med Pot" },
  ]},
  { row: [
    { label: "Risk", desc: "Low Perf / Low Pot" },
    { label: "Average", desc: "Med Perf / Low Pot" },
    { label: "Solid Performer", desc: "High Perf / Low Pot" },
  ]},
];

const talentMetrics = [
  { label: "Talent Pool", value: "Leadership Pipeline", icon: Target, pastelBg: "bg-pastel-blue", pastelIcon: "text-pastel-blue-icon" },
  { label: "Readiness", value: "Ready Now", icon: TrendingUp, pastelBg: "bg-pastel-green", pastelIcon: "text-pastel-green-icon" },
  { label: "Flight Risk", value: "Low", icon: Shield, pastelBg: "bg-pastel-teal", pastelIcon: "text-pastel-teal-icon" },
  { label: "Impact of Loss", value: "Critical", icon: AlertTriangle, pastelBg: "bg-pastel-rose", pastelIcon: "text-pastel-rose-icon" },
  { label: "Retention Priority", value: "High", icon: Zap, pastelBg: "bg-pastel-peach", pastelIcon: "text-pastel-peach-icon" },
  { label: "Time in Role", value: "2.75 Years", icon: Clock, pastelBg: "bg-pastel-purple", pastelIcon: "text-pastel-purple-icon" },
];

export const TalentProfilePanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Talent Profile & 9-Box Classification"
        subtitle="Strategic talent positioning, risk assessment & retention analysis"
        icon={Star}
        pastel="peach"
        stats={[
          { label: "Classification", value: "Star" },
          { label: "Flight Risk", value: "Low" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* 9-Box Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
          <Card className="p-5 border-border/50 h-full">
            <h3 className="text-sm font-semibold text-foreground mb-4">9-Box Grid Position</h3>

            <div className="relative">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] uppercase tracking-widest text-muted-foreground whitespace-nowrap font-medium">
                Potential →
              </div>

              <div className="ml-6">
                <div className="absolute left-6 top-0 h-full flex flex-col justify-around text-[8px] text-muted-foreground -ml-0.5">
                  <span>High</span><span>Med</span><span>Low</span>
                </div>
                <div className="ml-6">
                  <div className="grid grid-cols-3 gap-2">
                    {nineBoxGrid.map((rowData, ri) =>
                      rowData.row.map((cell, ci) => {
                        const isActive = ri === nineBoxData.row && ci === nineBoxData.col;
                        return (
                          <motion.div
                            key={`${ri}-${ci}`}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: ri * 0.08 + ci * 0.04 }}
                            className={`relative rounded-xl p-3 min-h-[80px] flex flex-col items-center justify-center text-center transition-all ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                                : ri === 0 && ci >= 1 ? "bg-pastel-blue/50 text-foreground border border-pastel-blue"
                                : ri <= 1 && ci === 2 ? "bg-pastel-green/50 text-foreground border border-pastel-green"
                                : "bg-secondary/30 text-muted-foreground border border-transparent"
                            }`}
                          >
                            <span className="text-[11px] font-semibold leading-tight">
                              {cell.label}
                            </span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-card rounded-full flex items-center justify-center shadow-md border-2 border-primary"
                              >
                                <span className="text-[9px] font-bold text-primary">JM</span>
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                  <div className="flex justify-around mt-2 text-[8px] text-muted-foreground">
                    <span>Low</span><span>Medium</span><span>High</span>
                  </div>
                  <p className="text-center text-[9px] uppercase tracking-widest text-muted-foreground mt-1 font-medium">
                    Performance →
                  </p>
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-4 p-3 rounded-xl bg-pastel-blue/50 border border-pastel-blue"
            >
              <p className="text-xs text-primary font-semibold">{nineBoxData.label} — {nineBoxData.position}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Performance: {nineBoxData.performance} · Potential: {nineBoxData.potential}</p>
            </motion.div>
          </Card>
        </motion.div>

        {/* Talent Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="p-5 border-border/50 h-full">
            <h3 className="text-sm font-semibold text-foreground mb-4">Talent Assessment</h3>
            <div className="space-y-2.5">
              {talentMetrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className={`flex items-center justify-between p-3 rounded-xl ${m.pastelBg}/30 transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${m.pastelBg}`}>
                      <m.icon className={`h-4 w-4 ${m.pastelIcon}`} />
                    </div>
                    <span className="text-sm text-foreground">{m.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${m.pastelIcon}`}>{m.value}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
