import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, CheckCircle2, Calendar, Clock, ArrowRight } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkExperienceForm } from "../forms/WorkExperienceForm";

const experiences = [
  {
    company: "Current Company",
    title: "Senior Data Scientist",
    from: "Jun 2018",
    to: "Present",
    duration: "6.5 Years",
    location: "New York",
    current: true,
    verified: true,
    highlights: ["Led ML fraud detection saving $12M annually", "Built real-time data platform", "Mentored 8 junior scientists"],
  },
  {
    company: "Tech Corp Inc.",
    title: "Data Scientist",
    from: "Jul 2015",
    to: "Jun 2018",
    duration: "3 Years",
    location: "San Francisco",
    current: false,
    verified: true,
    highlights: ["Developed customer churn prediction model", "Optimized recommendation engine (+23% CTR)"],
  },
  {
    company: "Analytics Startup",
    title: "Junior Data Analyst",
    from: "Jun 2009",
    to: "Jun 2013",
    duration: "4 Years",
    location: "Boston",
    current: false,
    verified: true,
    highlights: ["Built first analytics dashboard", "Automated reporting workflows"],
  },
];

// Descending: latest first (already in order)
const timelineData = experiences;

export const WorkExperiencePanel = () => {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Work Experience"
        subtitle="Professional career journey and accomplishments"
        icon={Briefcase}
        pastel="rose"
        onAdd={() => setFormOpen(true)}
        addLabel="Add Experience"
        stats={[
          { label: "Total Experience", value: "15+ Yrs" },
          { label: "Current Tenure", value: "6.5 Yrs" },
        ]}
      />

      {/* Summary Metrics */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Experience", value: "15+ Years", pastelBg: "bg-pastel-blue", pastelIcon: "text-pastel-blue-icon", icon: Clock },
          { label: "Relevant Experience", value: "13+ Years", pastelBg: "bg-pastel-green", pastelIcon: "text-pastel-green-icon", icon: Briefcase },
          { label: "Current Tenure", value: "6.5 Years", pastelBg: "bg-pastel-peach", pastelIcon: "text-pastel-peach-icon", icon: Calendar },
        ].map((m) => (
          <Card key={m.label} className="p-4 border-border/50 text-center">
            <div className={`w-9 h-9 rounded-lg ${m.pastelBg} mx-auto mb-2 flex items-center justify-center`}>
              <m.icon className={`h-5 w-5 ${m.pastelIcon}`} />
            </div>
            <p className="text-lg font-bold text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* Descending Timeline — latest at top */}
      <Card className="p-5 border-border/50">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 rounded-lg bg-pastel-rose">
            <Briefcase className="h-4 w-4 text-pastel-rose-icon" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Career Timeline</h3>
          <span className="text-[9px] text-muted-foreground">(latest → oldest)</span>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-category-planning to-border" />

          <div className="space-y-0">
            {timelineData.map((exp, index) => {
              const isLatest = index === 0;
              return (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.12 }}
                  className="relative pl-14 pb-6 last:pb-0"
                >
                  <div className={`absolute left-2.5 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isLatest ? "border-primary bg-primary/20" : "border-muted-foreground/30 bg-card"
                  }`}>
                    {isLatest && <div className="absolute inset-1 rounded-full bg-primary animate-pulse" />}
                  </div>

                  <div className={`p-5 rounded-xl border border-border/40 bg-card hover:shadow-md transition-all ${
                    isLatest ? "ring-1 ring-primary/10" : ""
                  }`}>
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="text-sm font-bold text-foreground">{exp.title}</h3>
                          {exp.current && <Badge className="bg-pastel-blue text-pastel-blue-icon border-0 text-[9px]">Current</Badge>}
                          {exp.verified && <CheckCircle2 className="h-3.5 w-3.5 text-pastel-green-icon" />}
                        </div>
                        <p className="text-sm text-primary font-medium">{exp.company}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">{exp.duration}</Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{exp.from} <ArrowRight className="h-3 w-3" /> {exp.to}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{exp.location}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/30">
                      <div className="space-y-1.5">
                        {exp.highlights.map((h) => (
                          <div key={h} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span className="text-xs text-foreground">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>
      <WorkExperienceForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
