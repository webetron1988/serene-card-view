import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Target, CheckCircle2, Users, Clock, Sparkles } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillForm } from "../forms/SkillForm";

interface Skill {
  name: string;
  level: "Expert" | "Advanced" | "Intermediate" | "Target";
  pct: number;
  endorsements?: number;
  lastValidated?: string;
}

const coreSkills: Skill[] = [
  { name: "Machine Learning", level: "Expert", pct: 95, endorsements: 14, lastValidated: "Oct 2024" },
  { name: "Python", level: "Expert", pct: 95, endorsements: 18, lastValidated: "Sep 2024" },
  { name: "Statistical Analysis", level: "Expert", pct: 92, endorsements: 11, lastValidated: "Oct 2024" },
  { name: "SQL", level: "Expert", pct: 90, endorsements: 9, lastValidated: "Aug 2024" },
  { name: "Deep Learning", level: "Advanced", pct: 85, endorsements: 8, lastValidated: "Oct 2024" },
  { name: "TensorFlow", level: "Advanced", pct: 82, endorsements: 7, lastValidated: "Jul 2024" },
  { name: "Data Visualization", level: "Advanced", pct: 80, endorsements: 6, lastValidated: "Sep 2024" },
  { name: "AWS", level: "Advanced", pct: 78, endorsements: 5, lastValidated: "Jun 2024" },
];

const developingSkills: Skill[] = [
  { name: "GenAI / LLMs", level: "Intermediate", pct: 55, endorsements: 3, lastValidated: "Nov 2024" },
  { name: "MLOps", level: "Intermediate", pct: 50, endorsements: 2, lastValidated: "Oct 2024" },
  { name: "Executive Presence", level: "Intermediate", pct: 45, endorsements: 4, lastValidated: "Sep 2024" },
];

const nextRoleGaps = [
  { name: "Budget Management", current: 2, required: 4 },
  { name: "Strategic Planning", current: 2, required: 4 },
  { name: "P&L Ownership", current: 1, required: 3 },
  { name: "Vendor Management", current: 2, required: 3 },
];

const getLevelStyle = (level: string) => {
  switch (level) {
    case "Expert": return { badge: "bg-pastel-blue text-pastel-blue-icon", bar: "bg-primary", dot: "bg-primary" };
    case "Advanced": return { badge: "bg-pastel-teal text-pastel-teal-icon", bar: "bg-category-planning", dot: "bg-category-planning" };
    case "Intermediate": return { badge: "bg-pastel-peach text-pastel-peach-icon", bar: "bg-category-strategy", dot: "bg-category-strategy" };
    default: return { badge: "bg-pastel-purple text-pastel-purple-icon", bar: "bg-muted-foreground/30", dot: "bg-muted-foreground" };
  }
};

const getLevelNum = (level: string) => {
  switch (level) {
    case "Expert": return 5;
    case "Advanced": return 4;
    case "Intermediate": return 3;
    default: return 1;
  }
};

const ProficiencyDots = ({ level }: { level: string }) => {
  const filled = getLevelNum(level);
  const style = getLevelStyle(level);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= filled ? style.dot : "bg-secondary"}`} />
      ))}
    </div>
  );
};

const SkillCard = ({ skill, index, sectionDelay }: { skill: Skill; index: number; sectionDelay: number }) => {
  const style = getLevelStyle(skill.level);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: sectionDelay + index * 0.05 }}
      className="p-3 rounded-xl border border-border/40 bg-card hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">{skill.name}</span>
        <Badge className={`text-[9px] border-0 ${style.badge}`}>{skill.level}</Badge>
      </div>
      <div className="h-1.5 rounded-full bg-secondary/50 overflow-hidden mb-2.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.pct}%` }}
          transition={{ delay: sectionDelay + index * 0.05 + 0.3, duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${style.bar}`}
        />
      </div>
      <div className="flex items-center justify-between">
        <ProficiencyDots level={skill.level} />
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          {skill.endorsements && (
            <span className="flex items-center gap-0.5"><Users className="h-3 w-3" />{skill.endorsements}</span>
          )}
          {skill.lastValidated && (
            <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{skill.lastValidated}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/** Fractional dot renderer: e.g. 3.5 out of 5 = ●●●◐○ */
const FractionalDots = ({ value, max = 5, color = "bg-primary" }: { value: number; max?: number; color?: string }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => {
        const diff = value - i;
        if (diff >= 1) {
          return <div key={i} className={`w-2.5 h-2.5 rounded-full ${color}`} />;
        }
        if (diff > 0) {
          // Half-filled dot
          return (
            <div key={i} className="relative w-2.5 h-2.5 rounded-full bg-secondary overflow-hidden">
              <div className={`absolute inset-0 ${color}`} style={{ clipPath: `inset(0 ${(1 - diff) * 100}% 0 0)` }} />
            </div>
          );
        }
        return <div key={i} className="w-2.5 h-2.5 rounded-full bg-secondary" />;
      })}
    </div>
  );
};

export const SkillsPanel = () => {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Skills & Capabilities"
        subtitle="Validated proficiencies, peer endorsements & growth roadmap"
        icon={Zap}
        pastel="peach"
        onAdd={() => setFormOpen(true)}
        addLabel="Add Skill"
        stats={[
          { label: "Core Skills", value: coreSkills.length },
          { label: "Endorsements", value: coreSkills.reduce((a, s) => a + (s.endorsements || 0), 0) },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Core Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="p-5 border-border/50 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-pastel-blue">
                <CheckCircle2 className="h-4 w-4 text-pastel-blue-icon" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Core Skills (Validated)</h3>
              <Badge variant="secondary" className="text-[10px]">{coreSkills.length} Skills</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coreSkills.map((skill, i) => (
                <SkillCard key={skill.name} skill={skill} index={i} sectionDelay={0} />
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {/* Developing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-5 border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-pastel-peach">
                  <TrendingUp className="h-4 w-4 text-pastel-peach-icon" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Developing</h3>
              </div>
              <div className="space-y-3">
                {developingSkills.map((skill, i) => (
                  <SkillCard key={skill.name} skill={skill} index={i} sectionDelay={0.3} />
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Skill Gap to Next Role */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-5 border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-pastel-purple">
                  <Sparkles className="h-4 w-4 text-pastel-purple-icon" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Gap to Next Role</h3>
              </div>
              <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider">Director, ML Engineering</p>
              <div className="space-y-3">
                {nextRoleGaps.map((gap, i) => (
                  <motion.div
                    key={gap.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-foreground">{gap.name}</span>
                      <span className="text-[10px] text-muted-foreground">L{gap.current} → L{gap.required}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((l) => (
                        <div key={l} className="flex-1 h-1.5 rounded-full relative overflow-hidden bg-secondary">
                          {l <= gap.current && <div className="absolute inset-0 bg-primary rounded-full" />}
                          {l > gap.current && l <= gap.required && (
                            <div className="absolute inset-0 bg-primary/20 rounded-full border border-dashed border-primary/40" />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
      <SkillForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
