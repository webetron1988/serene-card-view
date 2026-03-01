import { motion } from "framer-motion";
import { Briefcase, Hash, FileText, Layers, Calendar, ChevronRight } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Badge } from "@/components/ui/badge";

const jobDetails = [
  { icon: Hash, label: "Job Code", value: "DS-SR-003" },
  { icon: FileText, label: "Position ID", value: "POS-2022-0847" },
  { icon: Layers, label: "Job Family", value: "Data Science & Analytics" },
  { icon: Layers, label: "Job Sub-Family", value: "Machine Learning" },
  { icon: FileText, label: "FLSA Status", value: "Exempt" },
  { icon: FileText, label: "EEO Category", value: "Professional" },
  { icon: Calendar, label: "Effective Date", value: "Mar 10, 2022" },
];

export const JobTitlePanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Job Title & Designation"
        subtitle="Current position and classification details"
        icon={Briefcase}
      />

      {/* Hero Title Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="relative p-6">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-foreground">Senior Data Scientist</h3>
                <Badge className="bg-status-completed/10 text-status-completed border-0 text-[10px]">Active</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Data Science & Analytics</span>
                <ChevronRight className="h-3 w-3" />
                <span>Machine Learning</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Details Grid - Floating Cards Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {jobDetails.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.04 }}
            className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <item.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-sm font-semibold text-foreground leading-tight">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
