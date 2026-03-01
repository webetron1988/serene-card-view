import { motion } from "framer-motion";
import { ClipboardCheck, CheckCircle2, Calendar, FileText, Clock } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const policies = [
  { name: "Code of Conduct", version: "v2024.1", acknowledged: "Jan 15, 2024", dueDate: "Jan 31, 2024", status: "completed" },
  { name: "Information Security Policy", version: "v2024.2", acknowledged: "Feb 1, 2024", dueDate: "Feb 15, 2024", status: "completed" },
  { name: "Anti-Harassment Policy", version: "v2024.1", acknowledged: "Jan 15, 2024", dueDate: "Jan 31, 2024", status: "completed" },
  { name: "Data Privacy Policy", version: "v2024.1", acknowledged: "Jan 20, 2024", dueDate: "Jan 31, 2024", status: "completed" },
  { name: "Remote Work Policy", version: "v2023.2", acknowledged: "Mar 1, 2023", dueDate: "Mar 15, 2023", status: "completed" },
  { name: "Insider Trading Policy", version: "v2024.1", acknowledged: "Jan 15, 2024", dueDate: "Jan 31, 2024", status: "completed" },
];

export const PolicyAcknowledgmentsPanel = () => {
  const completedCount = policies.filter(p => p.status === "completed").length;
  const totalCount = 12;
  const complianceRate = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Policy Acknowledgments"
        subtitle="Corporate policy review and compliance tracking"
        icon={ClipboardCheck}
        stats={[
          { label: "Policies", value: totalCount },
          { label: "Completed", value: completedCount },
        ]}
      />

      {/* Compliance Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-5 border-status-completed/30 bg-gradient-to-r from-status-completed/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-completed/10">
                <CheckCircle2 className="h-5 w-5 text-status-completed" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Compliance Rate</p>
                <p className="text-xs text-muted-foreground">All required policies acknowledged</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-status-completed">{complianceRate}%</p>
              <p className="text-xs text-muted-foreground">{completedCount} of {totalCount}</p>
            </div>
          </div>
          <Progress value={complianceRate} className="h-2 bg-secondary" />
        </Card>
      </motion.div>

      {/* Policies List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="overflow-hidden border-border/50">
          <div className="divide-y divide-border/50">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.03 }}
                className="p-4 hover:bg-secondary/30 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className="p-2 rounded-lg bg-status-completed/10 group-hover:bg-status-completed/20 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-status-completed" />
                  </div>

                  {/* Policy Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground">{policy.name}</h4>
                      <Badge className="bg-secondary text-muted-foreground border-0 text-[10px]">
                        {policy.version}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Acknowledged: {policy.acknowledged}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due: {policy.dueDate}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge className="bg-status-completed/10 text-status-completed border-0 text-[10px]">
                    ✓ Completed
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50"
      >
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{totalCount}</p>
            <p className="text-[10px] text-muted-foreground">Total Policies</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-status-completed">{completedCount}</p>
            <p className="text-[10px] text-muted-foreground">Acknowledged</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-status-completed">{complianceRate}%</p>
            <p className="text-[10px] text-muted-foreground">Compliance Rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
