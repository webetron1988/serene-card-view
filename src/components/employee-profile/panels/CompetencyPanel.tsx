import { motion } from "framer-motion";
import { Gauge, Users, Wrench, Brain, Wifi, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Competency {
  name: string;
  current: number;
  required: number;
  max: number;
  priority?: boolean;
}

const leadershipCompetencies: Competency[] = [
  { name: "Strategic Thinking", current: 4.2, required: 4.5, max: 5 },
  { name: "People Leadership", current: 4.0, required: 4.5, max: 5, priority: true },
  { name: "Decision Making", current: 4.5, required: 4.5, max: 5 },
  { name: "Change Management", current: 3.8, required: 4.0, max: 5, priority: true },
  { name: "Stakeholder Management", current: 4.1, required: 4.0, max: 5 },
];

const technicalCompetencies: Competency[] = [
  { name: "Technical Excellence", current: 4.8, required: 4.5, max: 5 },
  { name: "Innovation & Research", current: 4.5, required: 4.0, max: 5 },
  { name: "Problem Solving", current: 4.7, required: 4.5, max: 5 },
  { name: "Architecture & Design", current: 4.3, required: 4.5, max: 5 },
];

const behaviouralCompetencies: Competency[] = [
  { name: "Communication", current: 4.3, required: 4.5, max: 5, priority: true },
  { name: "Teamwork & Collaboration", current: 4.5, required: 4.0, max: 5 },
  { name: "Adaptability & Resilience", current: 4.4, required: 4.0, max: 5 },
  { name: "Emotional Intelligence", current: 4.0, required: 4.0, max: 5 },
  { name: "Integrity & Ethics", current: 4.8, required: 4.5, max: 5 },
];

const digitalCompetencies: Competency[] = [
  { name: "Digital Fluency", current: 4.7, required: 4.5, max: 5 },
  { name: "Data-Driven Mindset", current: 4.9, required: 4.5, max: 5 },
  { name: "Agile & DevOps", current: 4.2, required: 4.0, max: 5 },
  { name: "Cybersecurity Awareness", current: 3.5, required: 4.0, max: 5, priority: true },
];

interface DomainConfig {
  title: string;
  icon: React.ElementType;
  pastelBg: string;
  pastelIcon: string;
  barColor: string;
  competencies: Competency[];
}

const domains: DomainConfig[] = [
  { title: "Leadership", icon: Users, pastelBg: "bg-pastel-blue", pastelIcon: "text-pastel-blue-icon", barColor: "bg-primary", competencies: leadershipCompetencies },
  { title: "Technical", icon: Wrench, pastelBg: "bg-pastel-teal", pastelIcon: "text-pastel-teal-icon", barColor: "bg-category-planning", competencies: technicalCompetencies },
  { title: "Behavioural", icon: Brain, pastelBg: "bg-pastel-purple", pastelIcon: "text-pastel-purple-icon", barColor: "bg-category-talent", competencies: behaviouralCompetencies },
  { title: "Digital", icon: Wifi, pastelBg: "bg-pastel-peach", pastelIcon: "text-pastel-peach-icon", barColor: "bg-category-strategy", competencies: digitalCompetencies },
];

/** Fractional dot renderer: e.g. 3.5 = ●●●◐○ */
const FractionalDots = ({ value, max = 5, colorClass = "bg-primary" }: { value: number; max?: number; colorClass?: string }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }, (_, i) => {
      const diff = value - i;
      if (diff >= 1) return <div key={i} className={`w-2 h-2 rounded-full ${colorClass}`} />;
      if (diff > 0) return (
        <div key={i} className="relative w-2 h-2 rounded-full bg-secondary overflow-hidden">
          <div className={`absolute inset-0 ${colorClass}`} style={{ clipPath: `inset(0 ${(1 - diff) * 100}% 0 0)` }} />
        </div>
      );
      return <div key={i} className="w-2 h-2 rounded-full bg-secondary" />;
    })}
  </div>
);

const GapBar = ({ comp, delay, barColor }: { comp: Competency; delay: number; barColor: string }) => {
  const gap = comp.required - comp.current;
  const isAbove = comp.current >= comp.required;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-foreground">{comp.name}</span>
          {comp.priority && (
            <Badge className="bg-pastel-rose text-pastel-rose-icon border-0 text-[8px] px-1.5 py-0">PRIORITY</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <FractionalDots value={comp.current} colorClass={barColor} />
          <span className="text-muted-foreground font-medium">{comp.current}</span>
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-secondary/50 overflow-hidden">
        {/* Required level marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/20 z-10"
          style={{ left: `${(comp.required / comp.max) * 100}%` }}
        />
        {/* Current level bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(comp.current / comp.max) * 100}%` }}
          transition={{ delay: delay + 0.2, duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-[9px] text-muted-foreground">Required: {comp.required}</span>
        {!isAbove && (
          <span className="text-[9px] text-pastel-rose-icon">Gap: {Math.abs(gap).toFixed(1)}</span>
        )}
        {isAbove && (
          <span className="text-[9px] text-pastel-green-icon">✓ Met</span>
        )}
      </div>
    </motion.div>
  );
};

const DomainCard = ({ domain, index }: { domain: DomainConfig; index: number }) => {
  const avg = domain.competencies.reduce((a, c) => a + c.current, 0) / domain.competencies.length;
  const gaps = domain.competencies.filter(c => c.current < c.required).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
    >
      <Card className="p-5 border-border/50 h-full">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${domain.pastelBg}`}>
              <domain.icon className={`h-4 w-4 ${domain.pastelIcon}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{domain.title}</h3>
              <p className="text-[10px] text-muted-foreground">{domain.competencies.length} competencies</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-foreground">{avg.toFixed(1)}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {gaps > 0 ? (
                <span className="text-[9px] text-pastel-peach-icon flex items-center gap-0.5">
                  <AlertTriangle className="h-2.5 w-2.5" />{gaps} gap{gaps > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-[9px] text-pastel-green-icon flex items-center gap-0.5">
                  <CheckCircle2 className="h-2.5 w-2.5" />On track
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-3.5">
          {domain.competencies.map((c, i) => (
            <GapBar key={c.name} comp={c} delay={index * 0.12 + i * 0.06} barColor={domain.barColor} />
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export const CompetencyPanel = () => {
  const allComps = domains.flatMap(d => d.competencies);
  const overallAvg = (allComps.reduce((a, c) => a + c.current, 0) / allComps.length).toFixed(1);
  const totalGaps = allComps.filter(c => c.current < c.required).length;
  const priorities = allComps.filter(c => c.priority).length;

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Competency Assessment"
        subtitle="Organizational competency framework — current vs required levels with gap analysis"
        icon={Gauge}
        pastel="green"
        stats={[
          { label: "Overall Score", value: overallAvg },
          { label: "Gaps", value: totalGaps },
          { label: "Priorities", value: priorities },
        ]}
      />

      {/* Domain Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {domains.map((d, i) => {
          const avg = d.competencies.reduce((a, c) => a + c.current, 0) / d.competencies.length;
          return (
            <motion.div key={d.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-3 border-border/50 text-center">
                <div className={`w-8 h-8 rounded-lg ${d.pastelBg} mx-auto mb-2 flex items-center justify-center`}>
                  <d.icon className={`h-4 w-4 ${d.pastelIcon}`} />
                </div>
                <p className="text-lg font-bold text-foreground">{avg.toFixed(1)}</p>
                <FractionalDots value={avg} colorClass={d.barColor} />
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">{d.title}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Domain Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {domains.map((domain, i) => (
          <DomainCard key={domain.title} domain={domain} index={i} />
        ))}
      </div>
    </div>
  );
};
