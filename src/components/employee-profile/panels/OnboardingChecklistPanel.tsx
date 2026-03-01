import { motion } from "framer-motion";
import { ClipboardCheck, CheckCircle2, Shield, Scale, Heart, Monitor, GraduationCap, Users, BarChart3 } from "lucide-react";
import { PanelHeader } from "./PanelHeader";

interface ChecklistItem {
  task: string;
  category: string;
  dueDate: string;
  completed: string;
  icon: any;
  categoryColor: string;
}

const checklistItems: ChecklistItem[] = [
  { task: "Complete I-9 Form", category: "Compliance", dueDate: "Jun 15, 2018", completed: "Jun 15, 2018", icon: Shield, categoryColor: "bg-priority-high/10 text-priority-high" },
  { task: "Sign Employment Agreement", category: "Legal", dueDate: "Jun 15, 2018", completed: "Jun 15, 2018", icon: Scale, categoryColor: "bg-primary/10 text-primary" },
  { task: "Complete Benefits Enrollment", category: "HR", dueDate: "Jun 30, 2018", completed: "Jun 20, 2018", icon: Heart, categoryColor: "bg-status-completed/10 text-status-completed" },
  { task: "IT Equipment Setup", category: "IT", dueDate: "Jun 15, 2018", completed: "Jun 15, 2018", icon: Monitor, categoryColor: "bg-category-analytics/10 text-category-analytics" },
  { task: "Security Training", category: "Training", dueDate: "Jun 22, 2018", completed: "Jun 18, 2018", icon: GraduationCap, categoryColor: "bg-priority-medium/10 text-priority-medium" },
  { task: "Meet with Manager", category: "Integration", dueDate: "Jun 15, 2018", completed: "Jun 15, 2018", icon: Users, categoryColor: "bg-category-talent/10 text-category-talent" },
  { task: "30-Day Check-in", category: "Integration", dueDate: "Jul 15, 2018", completed: "Jul 15, 2018", icon: Users, categoryColor: "bg-category-talent/10 text-category-talent" },
  { task: "60-Day Check-in", category: "Integration", dueDate: "Aug 15, 2018", completed: "Aug 15, 2018", icon: Users, categoryColor: "bg-category-talent/10 text-category-talent" },
  { task: "90-Day Review", category: "Performance", dueDate: "Sep 15, 2018", completed: "Sep 15, 2018", icon: BarChart3, categoryColor: "bg-status-completed/10 text-status-completed" },
];

const isEarlyCompletion = (due: string, completed: string) => {
  return new Date(completed) < new Date(due);
};

export const OnboardingChecklistPanel = () => {
  const completedCount = checklistItems.length;
  const totalCount = checklistItems.length;

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Onboarding Checklist"
        subtitle="New hire onboarding task completion tracking"
        icon={ClipboardCheck}
        stats={[
          { label: "Completed", value: `${completedCount}/${totalCount}` },
          { label: "Completion", value: "100%" },
        ]}
      />

      {/* Completion Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-status-completed/20 bg-status-completed/5"
      >
        <div className="p-6">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative"
            >
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke="hsl(var(--status-completed))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="97.4"
                  initial={{ strokeDashoffset: 97.4 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-status-completed">100%</span>
              </div>
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Onboarding Complete</h3>
              <p className="text-sm text-muted-foreground">All {totalCount} tasks completed successfully</p>
              <p className="text-[11px] text-status-completed mt-1">Several tasks completed ahead of schedule</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="divide-y divide-border/50">
          {checklistItems.map((item, index) => {
            const early = isEarlyCompletion(item.dueDate, item.completed);
            return (
              <motion.div
                key={item.task}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.04 }}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-secondary/30 transition-colors group"
              >
                {/* Check Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05, type: "spring" }}
                >
                  <CheckCircle2 className="h-5 w-5 text-status-completed flex-shrink-0" />
                </motion.div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{item.task}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${item.categoryColor}`}>
                      {item.category}
                    </span>
                    {early && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-primary/10 text-primary">
                        Early ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="hidden md:flex items-center gap-6 text-[11px] text-muted-foreground">
                  <div>
                    <span className="text-muted-foreground/60">Due: </span>
                    <span>{item.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/60">Done: </span>
                    <span className="text-foreground font-medium">{item.completed}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
