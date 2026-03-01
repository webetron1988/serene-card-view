import { motion } from "framer-motion";
import { GitBranch, CheckCircle2, Clock, User, Users, Monitor, Phone, Send, FileCheck } from "lucide-react";
import { PanelHeader } from "./PanelHeader";

const stages = [
  { stage: "Application Received", date: "Apr 15, 2018", interviewer: "—", result: "Passed", notes: "Strong resume", icon: FileCheck, color: "bg-primary" },
  { stage: "Phone Screen", date: "Apr 20, 2018", interviewer: "HR Recruiter", result: "Passed", notes: "Good communication", icon: Phone, color: "bg-primary" },
  { stage: "Technical Assessment", date: "Apr 25, 2018", interviewer: "Online", result: "92%", notes: "Excellent coding skills", icon: Monitor, color: "bg-status-completed" },
  { stage: "Technical Interview", date: "May 5, 2018", interviewer: "Robert Williams", result: "Strong Hire", notes: "Deep ML knowledge", icon: User, color: "bg-status-completed" },
  { stage: "Panel Interview", date: "May 12, 2018", interviewer: "Panel (4)", result: "Hire", notes: "Great culture fit", icon: Users, color: "bg-status-completed" },
  { stage: "Final Interview", date: "May 20, 2018", interviewer: "VP, Technology", result: "Hire", notes: "Approved", icon: User, color: "bg-status-completed" },
  { stage: "Offer Extended", date: "May 25, 2018", interviewer: "HR", result: "Accepted", notes: "—", icon: Send, color: "bg-status-completed" },
];

const resultBadge = (result: string) => {
  const styles: Record<string, string> = {
    "Passed": "bg-primary/10 text-primary",
    "92%": "bg-status-completed/10 text-status-completed",
    "Strong Hire": "bg-status-completed/10 text-status-completed",
    "Hire": "bg-status-completed/10 text-status-completed",
    "Approved": "bg-status-completed/10 text-status-completed",
    "Accepted": "bg-status-completed/10 text-status-completed",
  };
  return styles[result] || "bg-secondary text-muted-foreground";
};

export const RecruitmentTimelinePanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Recruitment Process Timeline"
        subtitle="Complete hiring journey from application to offer"
        icon={GitBranch}
        stats={[
          { label: "Time to Hire", value: "40 Days" },
          { label: "Interviews", value: "5" },
          { label: "Decision", value: "Strong Hire" },
        ]}
      />

      {/* Visual Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-1">
            {stages.map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="flex-1 h-1.5 rounded-full bg-status-completed origin-left"
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">Apr 15</span>
            <span className="text-[10px] text-muted-foreground">May 25</span>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="px-6 pb-6">
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[18px] top-6 bottom-6 w-px bg-border" />

            <div className="space-y-0">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.06 }}
                  className="relative flex items-start gap-4 py-3 group"
                >
                  {/* Node */}
                  <div className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-xl ${stage.color} flex items-center justify-center shadow-sm`}>
                    <stage.icon className="h-4 w-4 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{stage.stage}</h4>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[11px] text-muted-foreground">{stage.date}</span>
                          {stage.interviewer !== "—" && (
                            <span className="text-[11px] text-muted-foreground">• {stage.interviewer}</span>
                          )}
                        </div>
                        {stage.notes !== "—" && (
                          <p className="text-[11px] text-muted-foreground/70 mt-1 italic">"{stage.notes}"</p>
                        )}
                      </div>
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold ${resultBadge(stage.result)}`}>
                        {stage.result}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
