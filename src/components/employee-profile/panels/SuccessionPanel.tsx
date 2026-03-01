import { motion } from "framer-motion";
import { GitBranch, ArrowUp, ArrowDown, Clock, CheckCircle2, AlertCircle, Shield, Users, Target, Zap, BarChart3, UserCheck } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const successorTo = [
  {
    position: "VP, Data Science",
    incumbent: "Dr. Patricia Johnson",
    incumbentInitials: "PJ",
    readiness: "Ready in 1-2 Years",
    readyLevel: 2,
    readyPct: 65,
    gaps: ["Budget Management", "Executive Presence"],
    devPlan: ["Executive coaching program", "Finance for leaders course", "Shadow CFO for 2 quarters"],
    criticalExperiences: ["Led org-wide initiative", "Presented to board"],
    missingExperiences: ["P&L ownership", "M&A due diligence"],
  },
  {
    position: "Director, ML Engineering",
    incumbent: "Open Position",
    incumbentInitials: "OP",
    readiness: "Ready Now",
    readyLevel: 3,
    readyPct: 95,
    gaps: [],
    devPlan: [],
    criticalExperiences: ["Built production ML systems", "Managed cross-functional teams", "Vendor evaluation"],
    missingExperiences: [],
  },
];

const successorsFor = [
  {
    name: "Emily Rodriguez",
    initials: "ER",
    currentRole: "Data Scientist II",
    readiness: "Ready in 1-2 Years",
    readyLevel: 2,
    readyPct: 60,
    strengths: ["Technical depth", "Team collaboration", "Innovation"],
    development: ["Leadership", "Advanced ML", "Stakeholder communication"],
    ninebox: "High Performer / Medium Potential",
  },
  {
    name: "David Kim",
    initials: "DK",
    currentRole: "Data Scientist II",
    readiness: "Ready in 2-3 Years",
    readyLevel: 1,
    readyPct: 35,
    strengths: ["Problem solving", "Innovation", "Research mindset"],
    development: ["Technical Depth", "Stakeholder Mgmt", "People leadership"],
    ninebox: "Medium Performer / High Potential",
  },
];

const emergencySuccessor = {
  name: "Emily Rodriguez",
  initials: "ER",
  role: "Data Scientist II",
  designation: "Designated interim successor if unplanned absence",
  lastReviewed: "Jan 2025",
};

const benchStrength = {
  readyNow: 0,
  readySoon: 1,
  developing: 1,
  total: 2,
  benchmark: "Target: 2 ready-now successors",
};

const ReadinessBar = ({ pct, size = "default" }: { pct: number; size?: "default" | "sm" }) => {
  const height = size === "sm" ? "h-1.5" : "h-2";
  const color = pct >= 80 ? "bg-primary" : pct >= 50 ? "bg-category-planning" : "bg-category-strategy";
  return (
    <div className={`w-full ${height} rounded-full bg-secondary/50 overflow-hidden`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
};

export const SuccessionPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Succession Planning"
        subtitle="Pipeline readiness, bench strength & emergency contingency"
        icon={GitBranch}
        pastel="purple"
        stats={[
          { label: "Can Succeed", value: successorTo.length },
          { label: "Bench Depth", value: successorsFor.length },
        ]}
      />

      {/* Emergency Successor Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-4 border-border/50 bg-pastel-rose/30 border-pastel-rose">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pastel-rose">
              <Shield className="h-4 w-4 text-pastel-rose-icon" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">Emergency Successor</p>
              <p className="text-[10px] text-muted-foreground">{emergencySuccessor.designation}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-pastel-blue flex items-center justify-center text-[10px] font-bold text-pastel-blue-icon">
                {emergencySuccessor.initials}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{emergencySuccessor.name}</p>
                <p className="text-[10px] text-muted-foreground">{emergencySuccessor.role}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[9px] shrink-0">Reviewed {emergencySuccessor.lastReviewed}</Badge>
          </div>
        </Card>
      </motion.div>

      {/* Bench Strength Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Ready Now", value: benchStrength.readyNow, pastelBg: "bg-pastel-green", pastelIcon: "text-pastel-green-icon", icon: CheckCircle2 },
            { label: "Ready 1-2 Yrs", value: benchStrength.readySoon, pastelBg: "bg-pastel-teal", pastelIcon: "text-pastel-teal-icon", icon: Clock },
            { label: "Developing", value: benchStrength.developing, pastelBg: "bg-pastel-peach", pastelIcon: "text-pastel-peach-icon", icon: BarChart3 },
            { label: "Total Pipeline", value: benchStrength.total, pastelBg: "bg-pastel-blue", pastelIcon: "text-pastel-blue-icon", icon: Users },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.06 }}>
              <Card className="p-3.5 border-border/50 text-center">
                <div className={`w-8 h-8 rounded-lg ${m.pastelBg} mx-auto mb-2 flex items-center justify-center`}>
                  <m.icon className={`h-4 w-4 ${m.pastelIcon}`} />
                </div>
                <p className="text-xl font-bold text-foreground">{m.value}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Successor To */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-5 border-border/50 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-pastel-blue">
                <ArrowUp className="h-4 w-4 text-pastel-blue-icon" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Can Succeed Into</h3>
            </div>
            <div className="space-y-4">
              {successorTo.map((s, i) => (
                <motion.div
                  key={s.position}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.12 }}
                  className="p-4 rounded-xl border border-border/40 bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-pastel-purple flex items-center justify-center text-[10px] font-bold text-pastel-purple-icon">
                        {s.incumbentInitials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{s.position}</p>
                        <p className="text-xs text-muted-foreground">{s.incumbent}</p>
                      </div>
                    </div>
                    <Badge className={`text-[10px] border-0 ${
                      s.readyLevel === 3 ? "bg-pastel-green text-pastel-green-icon" : "bg-pastel-peach text-pastel-peach-icon"
                    }`}>
                      {s.readyLevel === 3 ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                      {s.readiness}
                    </Badge>
                  </div>

                  {/* Readiness bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">Readiness</span>
                      <span className="text-[10px] font-semibold text-foreground">{s.readyPct}%</span>
                    </div>
                    <ReadinessBar pct={s.readyPct} />
                  </div>

                  {/* Critical Experiences */}
                  {s.criticalExperiences.length > 0 && (
                    <div className="mb-2.5">
                      <div className="flex items-center gap-1 mb-1.5">
                        <UserCheck className="h-3 w-3 text-pastel-green-icon" />
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Critical Experiences</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {s.criticalExperiences.map((e) => (
                          <Badge key={e} className="bg-pastel-green text-pastel-green-icon border-0 text-[9px]">{e}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {s.gaps.length > 0 && (
                    <div className="pt-2.5 border-t border-border/30">
                      <div className="flex items-center gap-1 mb-1.5">
                        <AlertCircle className="h-3 w-3 text-pastel-peach-icon" />
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Gaps</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {s.gaps.map((g) => (
                          <Badge key={g} variant="outline" className="text-[9px] font-normal">{g}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {s.devPlan.length > 0 && (
                    <div className="mt-2.5">
                      <div className="flex items-center gap-1 mb-1.5">
                        <Target className="h-3 w-3 text-pastel-blue-icon" />
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Development Plan</span>
                      </div>
                      <div className="space-y-1">
                        {s.devPlan.map((d) => (
                          <div key={d} className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            <span className="text-[10px] text-foreground">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Successors For (Bench) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-5 border-border/50 h-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-pastel-teal">
                <ArrowDown className="h-4 w-4 text-pastel-teal-icon" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Bench Strength</h3>
            </div>
            <p className="text-[10px] text-muted-foreground mb-4">Who can succeed into your current role</p>
            <div className="space-y-4">
              {successorsFor.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  className="p-4 rounded-xl border border-border/40 bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-pastel-blue flex items-center justify-center text-xs font-bold text-pastel-blue-icon">
                      {s.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.currentRole}</p>
                    </div>
                    <Badge className="bg-pastel-purple text-pastel-purple-icon border-0 text-[9px]">{s.ninebox}</Badge>
                  </div>

                  {/* Readiness bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">{s.readiness}</span>
                      <span className="text-[10px] font-semibold text-foreground">{s.readyPct}%</span>
                    </div>
                    <ReadinessBar pct={s.readyPct} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <Zap className="h-3 w-3 text-pastel-green-icon" />
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Strengths</span>
                      </div>
                      <div className="space-y-1">
                        {s.strengths.map(st => (
                          <Badge key={st} className="bg-pastel-green text-pastel-green-icon border-0 text-[9px] mr-1">{st}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <Target className="h-3 w-3 text-pastel-peach-icon" />
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Develop</span>
                      </div>
                      <div className="space-y-1">
                        {s.development.map(d => (
                          <Badge key={d} variant="outline" className="text-[9px] font-normal mr-1">{d}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
