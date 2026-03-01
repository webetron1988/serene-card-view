import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Building2, Calendar, CheckCircle2, Award, BookOpen, Microscope } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EducationForm } from "../forms/EducationForm";

const educationData = [
  {
    degree: "Master of Science (M.S.)",
    field: "Data Science",
    institution: "Stanford University",
    year: "2013 – 2015",
    gpa: "3.9 / 4.0",
    verified: true,
    honors: "Magna Cum Laude",
    thesis: "Deep Learning Approaches for Financial Time Series Prediction",
    logo: "🟥",
    activities: ["Research Assistant", "Teaching Assistant - ML 101", "Data Science Club President"],
  },
  {
    degree: "Bachelor of Science (B.S.)",
    field: "Computer Science",
    institution: "MIT",
    year: "2005 – 2009",
    gpa: "3.8 / 4.0",
    verified: true,
    honors: "Dean's List (All Semesters)",
    thesis: null,
    logo: "🟦",
    activities: ["ACM Chapter Member", "Hackathon Winner (2x)", "Varsity Track & Field"],
  },
];

// Descending: latest (index 0) at top, oldest at bottom — already in order
const timelineData = educationData;

const continuingEd = [
  { name: "MLOps Engineering", provider: "Google Cloud Training", year: "2024", hours: 40 },
  { name: "Executive Leadership Program", provider: "Wharton Online", year: "2023", hours: 80 },
  { name: "Deep Learning Specialization", provider: "Coursera / Andrew Ng", year: "2020", hours: 120 },
];

export const EducationPanel = () => {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Education & Qualifications"
        subtitle="Academic background, credentials & continuing education"
        icon={GraduationCap}
        pastel="blue"
        onAdd={() => setFormOpen(true)}
        addLabel="Add Education"
        stats={[
          { label: "Highest Degree", value: "M.S." },
          { label: "Specialization", value: "Data Science" },
        ]}
      />

      {/* Timeline — descending (latest at top, oldest at bottom) */}
      <Card className="p-5 border-border/50">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 rounded-lg bg-pastel-blue">
            <GraduationCap className="h-4 w-4 text-pastel-blue-icon" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Academic Timeline</h3>
          <span className="text-[9px] text-muted-foreground">(latest → oldest)</span>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-category-planning to-border" />

          <div className="space-y-0">
            {timelineData.map((edu, index) => {
              const isLatest = index === 0;
              return (
                <motion.div
                  key={edu.institution}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative pl-14 pb-6 last:pb-0"
                >
                  <div className={`absolute left-2.5 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isLatest ? "border-primary bg-primary/20" : "border-muted-foreground/30 bg-card"
                  }`}>
                    {isLatest && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>

                  <div className="p-5 rounded-xl border border-border/40 bg-card hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{edu.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-bold text-foreground">{edu.degree}</h3>
                          {edu.verified && (
                            <Badge className="bg-pastel-green text-pastel-green-icon border-0 text-[9px] gap-0.5">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-primary font-medium">{edu.field}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{edu.institution}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{edu.year}</span>
                          <span className="flex items-center gap-1"><Award className="h-3 w-3" />{edu.gpa}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/30 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Honors</p>
                        <div className="flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-pastel-peach-icon" />
                          <span className="text-xs font-medium text-foreground">{edu.honors}</span>
                        </div>
                        {edu.thesis && (
                          <div className="mt-2">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Thesis</p>
                            <div className="flex items-start gap-1.5">
                              <Microscope className="h-3.5 w-3.5 text-pastel-purple-icon mt-0.5" />
                              <span className="text-[11px] text-foreground leading-relaxed">{edu.thesis}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Activities</p>
                        <div className="flex flex-wrap gap-1">
                          {edu.activities.map((a) => (
                            <Badge key={a} variant="secondary" className="text-[10px] font-normal">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Continuing Education */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-border/50">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-pastel-green">
                <BookOpen className="h-4 w-4 text-pastel-green-icon" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Continuing Education</h3>
              <Badge variant="secondary" className="text-[10px]">{continuingEd.reduce((a, c) => a + c.hours, 0)} Hrs</Badge>
            </div>
            <div className="space-y-2.5">
              {continuingEd.map((ce, i) => (
                <motion.div
                  key={ce.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{ce.name}</p>
                    <p className="text-xs text-muted-foreground">{ce.provider}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{ce.hours} hrs</span>
                    <Badge variant="outline" className="text-[10px]">{ce.year}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
      <EducationForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
