import { motion } from "framer-motion";
import { GraduationCap, CheckCircle2, Calendar, Clock, RefreshCw } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const trainings = [
  {
    name: "Anti-Harassment Training",
    frequency: "Annual",
    lastCompleted: "Jan 20, 2024",
    dueDate: "Jan 31, 2025",
    status: "Compliant",
    icon: "🛡️",
  },
  {
    name: "Information Security Awareness",
    frequency: "Annual",
    lastCompleted: "Feb 5, 2024",
    dueDate: "Feb 28, 2025",
    status: "Compliant",
    icon: "🔐",
  },
  {
    name: "Data Privacy (GDPR/CCPA)",
    frequency: "Annual",
    lastCompleted: "Feb 10, 2024",
    dueDate: "Feb 28, 2025",
    status: "Compliant",
    icon: "📋",
  },
  {
    name: "Ethics & Compliance",
    frequency: "Annual",
    lastCompleted: "Jan 15, 2024",
    dueDate: "Jan 31, 2025",
    status: "Compliant",
    icon: "⚖️",
  },
];

export const MandatoryTrainingPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Mandatory Training Compliance"
        subtitle="Required training programs and completion tracking"
        icon={GraduationCap}
        stats={[
          { label: "Trainings", value: trainings.length },
          { label: "Compliant", value: trainings.length },
        ]}
      />

      <div className="space-y-3">
        {trainings.map((training, index) => (
          <motion.div
            key={training.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-sm transition-all">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary text-2xl shrink-0">
                    {training.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="text-sm font-semibold text-foreground">{training.name}</h4>
                      <Badge className="bg-status-completed/10 text-status-completed border-0 text-[10px] shrink-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {training.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Frequency</p>
                        <div className="flex items-center gap-1 mt-1">
                          <RefreshCw className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground">{training.frequency}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Completed</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle2 className="h-3 w-3 text-status-completed" />
                          <p className="text-xs font-medium text-foreground">{training.lastCompleted}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Next Due</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-primary" />
                          <p className="text-xs font-medium text-foreground">{training.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-xl bg-status-completed/5 border border-status-completed/20"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-status-completed shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">All trainings up to date</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {trainings.length} of {trainings.length} mandatory trainings completed within compliance window.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
