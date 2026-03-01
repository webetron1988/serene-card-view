import { motion } from "framer-motion";
import { Crosshair, TrendingUp } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
const skills = [{
  name: "Technical Leadership",
  current: 85,
  target: 90
}, {
  name: "Strategic Planning",
  current: 65,
  target: 85
}, {
  name: "Budget Management",
  current: 50,
  target: 75
}, {
  name: "Stakeholder Management",
  current: 75,
  target: 90
}, {
  name: "Executive Presence",
  current: 70,
  target: 85
}];
export const SkillsGapAnalysisPanel = () => {
  return <div className="space-y-6">
      <PanelHeader title="Skills Gap Analysis" subtitle="Current vs target role skill assessment" icon={Crosshair} pastel="teal" />

      <motion.div initial={{
      opacity: 0,
      y: 15
    }} animate={{
      opacity: 1,
      y: 0
    }}>
        <Card className="p-6 border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg bg-pastel-purple">
              <TrendingUp className="h-4 w-4 text-pastel-purple-icon" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Current vs Target Role Skills (VP, Data Science)</h3>
          </div>

          <div className="space-y-6">
            {skills.map((skill, i) => {
            const gap = skill.target - skill.current;
            return <motion.div key={skill.name} initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.1 + i * 0.08
            }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {skill.current}% <span className="text-muted-foreground/50">(Target: {skill.target}%)</span>
                    </span>
                  </div>
                  <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                    {/* Target marker */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10" style={{
                  left: `${skill.target}%`
                }} />
                    {/* Current progress */}
                    <motion.div initial={{
                  width: 0
                }} animate={{
                  width: `${skill.current}%`
                }} transition={{
                  delay: 0.2 + i * 0.08,
                  duration: 0.8,
                  ease: "easeOut"
                }} className={`h-full rounded-full ${gap <= 5 ? "bg-emerald-500" : gap <= 15 ? "bg-primary" : "bg-amber-500"}`} />
                    {/* Gap zone */}
                    {gap > 0 && <div className="absolute top-0 bottom-0 bg-primary/10 border-l border-dashed border-primary/30" style={{
                  left: `${skill.current}%`,
                  width: `${gap}%`
                }} />}
                  </div>
                  {gap > 10 && <p className="text-[10px] text-amber-600 mt-1">Gap: {gap}% — development required</p>}
                </motion.div>;
          })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="w-3 h-2 rounded-sm bg-primary" /> Current Level
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="w-3 h-2 rounded-sm bg-primary/10 border border-dashed border-primary/30" /> Gap to Target
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="w-0.5 h-3 bg-foreground/30" /> Target Level
            </div>
          </div>
        </Card>
      </motion.div>
    </div>;
};