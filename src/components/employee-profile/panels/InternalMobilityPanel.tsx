import { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle, ArrowRight, Calendar, MapPin, Briefcase, Globe, CheckCircle2, Clock } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InternalMobilityForm } from "../forms/InternalMobilityForm";

const transfers = [
  {
    date: "Jun 2021",
    type: "Special Assignment",
    from: { team: "Data Science", location: "New York" },
    to: { team: "Product Analytics", location: "New York" },
    duration: "6 Months",
    reason: "Cross-functional product strategy initiative",
    outcome: "Launched A/B testing framework adopted org-wide",
    skills: ["Product Thinking", "A/B Testing", "Stakeholder Communication"],
  },
  {
    date: "Mar 2020",
    type: "Team Transfer",
    from: { team: "Analytics Team", location: "New York" },
    to: { team: "ML Engineering", location: "New York" },
    duration: "Permanent",
    reason: "Career development toward ML specialization",
    outcome: "Built production ML pipeline serving 10M daily predictions",
    skills: ["MLOps", "Production ML", "System Design"],
  },
];

// Already descending (latest first)

const mobilityProfile = [
  { label: "Open to Relocation", value: "Yes", icon: MapPin, active: true },
  { label: "Preferred Locations", value: "NYC, SF, London", icon: Globe, active: true },
  { label: "International Interest", value: "Yes", icon: Globe, active: true },
  { label: "Remote Preference", value: "Hybrid", icon: Briefcase, active: false },
];

export const InternalMobilityPanel = () => {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Internal Mobility & Transfers"
        subtitle="Movement history, cross-functional exposure & mobility preferences"
        icon={Shuffle}
        pastel="teal"
        onEdit={() => setEditOpen(true)}
        stats={[
          { label: "Internal Moves", value: transfers.length },
          { label: "Open to Relocation", value: "Yes" },
        ]}
      />

      {/* Mobility Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mobilityProfile.map((p, i) => {
            const pastels = [
              { bg: "bg-pastel-blue", icon: "text-pastel-blue-icon" },
              { bg: "bg-pastel-green", icon: "text-pastel-green-icon" },
              { bg: "bg-pastel-purple", icon: "text-pastel-purple-icon" },
              { bg: "bg-pastel-peach", icon: "text-pastel-peach-icon" },
            ];
            const ps = pastels[i % pastels.length];
            return (
              <motion.div key={p.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                <Card className="p-3.5 border-border/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`p-1 rounded-md ${ps.bg}`}>
                      <p.icon className={`h-3.5 w-3.5 ${ps.icon}`} />
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.label}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{p.value}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Transfer Journey — descending */}
      <Card className="p-5 border-border/50">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 rounded-lg bg-pastel-teal">
            <Clock className="h-4 w-4 text-pastel-teal-icon" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Movement History</h3>
          <span className="text-[9px] text-muted-foreground">(latest → oldest)</span>
        </div>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {transfers.map((t, i) => (
              <motion.div
                key={t.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="relative pl-14"
              >
                <div className="absolute left-2.5 top-2 w-5 h-5 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center">
                  <Shuffle className="h-2.5 w-2.5 text-primary" />
                </div>

                <div className="p-4 rounded-xl border border-border/40 bg-card hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{t.date}</span>
                    </div>
                    <Badge className={`text-[10px] border-0 ${
                      t.type === "Special Assignment" ? "bg-pastel-purple text-pastel-purple-icon" : "bg-pastel-blue text-pastel-blue-icon"
                    }`}>{t.type}</Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 p-3 rounded-lg bg-secondary/30 text-center">
                      <p className="text-sm font-semibold text-foreground">{t.from.team}</p>
                      <p className="text-[10px] text-muted-foreground">{t.from.location}</p>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 shrink-0 px-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      <span className="text-[8px] text-muted-foreground">{t.duration}</span>
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-pastel-blue/50 border border-primary/10 text-center">
                      <p className="text-sm font-semibold text-primary">{t.to.team}</p>
                      <p className="text-[10px] text-muted-foreground">{t.to.location}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">{t.reason}</p>

                  <div className="p-2.5 rounded-lg bg-pastel-green/50 border border-pastel-green mb-3">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-pastel-green-icon mt-0.5 shrink-0" />
                      <p className="text-xs text-foreground">{t.outcome}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[9px] text-muted-foreground mr-0.5">Skills gained:</span>
                    {t.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px] font-normal">{s}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
      <InternalMobilityForm open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
