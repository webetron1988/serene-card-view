import { useState } from "react";
import { motion } from "framer-motion";
import { Route, Target, Compass, ChevronRight, MapPin, Globe, Briefcase } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CareerAspirationForm } from "../forms/CareerAspirationForm";

const careerPath = [
  { role: "Senior Data Scientist", grade: "L7", timeline: "Current", status: "current" as const },
  { role: "Director, ML Engineering", grade: "L8", timeline: "1-2 Years", status: "next" as const },
  { role: "VP, Data Science", grade: "L9", timeline: "3-5 Years", status: "future" as const },
  { role: "Chief Data Officer", grade: "L10", timeline: "5-7 Years", status: "aspiration" as const },
];

const aspirations = [
  { label: "Career Aspiration", value: "Chief Data Officer", icon: Target },
  { label: "Target Timeline", value: "5-7 Years", icon: Compass },
  { label: "Preferred Track", value: "Leadership Track", icon: Route },
  { label: "Geographic Mobility", value: "Open to Relocation", icon: MapPin },
  { label: "Functional Mobility", value: "Open", icon: Briefcase },
  { label: "International Assignment", value: "Interested", icon: Globe },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "current": return { bg: "bg-primary", text: "text-primary-foreground", border: "border-primary", light: "bg-pastel-blue" };
    case "next": return { bg: "bg-category-planning", text: "text-white", border: "border-category-planning", light: "bg-pastel-teal" };
    case "future": return { bg: "bg-category-talent", text: "text-white", border: "border-category-talent", light: "bg-pastel-purple" };
    case "aspiration": return { bg: "bg-category-strategy", text: "text-white", border: "border-category-strategy", light: "bg-pastel-peach" };
    default: return { bg: "bg-secondary", text: "text-foreground", border: "border-border", light: "bg-secondary" };
  }
};

const aspirationPastels = [
  { bg: "bg-pastel-blue", icon: "text-pastel-blue-icon" },
  { bg: "bg-pastel-peach", icon: "text-pastel-peach-icon" },
  { bg: "bg-pastel-green", icon: "text-pastel-green-icon" },
  { bg: "bg-pastel-rose", icon: "text-pastel-rose-icon" },
  { bg: "bg-pastel-teal", icon: "text-pastel-teal-icon" },
  { bg: "bg-pastel-purple", icon: "text-pastel-purple-icon" },
];

export const CareerPathPanel = () => {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Career Path & Aspirations"
        subtitle="Career trajectory, growth roadmap & professional aspirations"
        icon={Route}
        pastel="teal"
        onEdit={() => setEditOpen(true)}
        stats={[
          { label: "Aspiration", value: "CDO" },
          { label: "Timeline", value: "5-7 Yrs" },
        ]}
      />

      {/* Career Path Visualization */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg bg-pastel-teal">
              <Compass className="h-4 w-4 text-pastel-teal-icon" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Career Trajectory</h3>
          </div>

          {/* Horizontal Path with proper overflow */}
          <div className="flex items-stretch gap-0 overflow-x-auto pb-3 pt-4">
            {careerPath.map((step, i) => {
              const style = getStatusStyle(step.status);
              return (
                <motion.div
                  key={step.role}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.12 }}
                  className="flex items-center shrink-0"
                >
                  <div className={`relative p-4 rounded-xl border-2 ${style.border} bg-card min-w-[170px] min-h-[100px] flex flex-col justify-center ${
                    step.status === "current" ? "ring-4 ring-primary/15 shadow-md" : ""
                  }`}>
                    <div className={`absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${style.bg} ${style.text}`}>
                      {step.grade}
                    </div>
                    <p className="text-sm font-semibold text-foreground mt-2 leading-snug">{step.role}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{step.timeline}</p>
                    {step.status === "current" && (
                      <Badge className="mt-2 bg-pastel-blue text-pastel-blue-icon border-0 text-[9px]">You are here</Badge>
                    )}
                  </div>
                  {i < careerPath.length - 1 && (
                    <div className="flex items-center px-1.5 shrink-0">
                      <div className="w-5 h-0.5 bg-border" />
                      <ChevronRight className="h-4 w-4 text-muted-foreground -ml-1" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Aspirations & Mobility */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-5 border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-pastel-peach">
              <Target className="h-4 w-4 text-pastel-peach-icon" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Aspirations & Mobility</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {aspirations.map((a, i) => {
              const ps = aspirationPastels[i % aspirationPastels.length];
              return (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="p-3 rounded-xl bg-secondary/20 flex items-start gap-2.5"
                >
                  <div className={`p-1 rounded-md ${ps.bg}`}>
                    <a.icon className={`h-4 w-4 ${ps.icon}`} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{a.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
      <CareerAspirationForm open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
