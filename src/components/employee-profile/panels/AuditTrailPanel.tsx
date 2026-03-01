import { motion } from "framer-motion";
import { History, ArrowRight, User, UserCog, Calendar } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const changes = [
  {
    dateTime: "Dec 1, 2024 10:30",
    field: "Permanent Address",
    oldValue: "123 Main St...",
    newValue: "456 Park Ave...",
    changedBy: "Self Service",
    byType: "self" as const,
  },
  {
    dateTime: "Nov 15, 2024 14:22",
    field: "Tax Withholding",
    oldValue: "2 Allowances",
    newValue: "3 Allowances",
    changedBy: "Self Service",
    byType: "self" as const,
  },
  {
    dateTime: "Apr 1, 2024 09:00",
    field: "Base Salary",
    oldValue: "$155,000",
    newValue: "$165,000",
    changedBy: "HR Admin",
    byType: "admin" as const,
  },
  {
    dateTime: "Jan 15, 2024 11:45",
    field: "Benefits Election",
    oldValue: "PPO Standard",
    newValue: "PPO Premium",
    changedBy: "Self Service",
    byType: "self" as const,
  },
];

const byTypeStyles = {
  self: { bg: "bg-primary/10", text: "text-primary", icon: User },
  admin: { bg: "bg-category-talent/10", text: "text-category-talent", icon: UserCog },
};

export const AuditTrailPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Audit Trail (Recent Changes)"
        subtitle="Record of recent modifications to employee profile"
        icon={History}
        stats={[
          { label: "Changes", value: changes.length },
        ]}
      />

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[23px] top-4 bottom-4 w-px bg-border/60" />

        <div className="space-y-4">
          {changes.map((change, index) => {
            const style = byTypeStyles[change.byType];
            const ByIcon = style.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-14"
              >
                {/* Timeline dot */}
                <div className={`absolute left-3 top-5 p-1.5 rounded-full ${style.bg} z-10`}>
                  <ByIcon className={`h-3.5 w-3.5 ${style.text}`} />
                </div>

                <Card className="overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{change.field}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-[11px] text-muted-foreground">{change.dateTime}</p>
                        </div>
                      </div>
                      <Badge className={`border-0 text-[10px] shrink-0 ${style.bg} ${style.text}`}>
                        <ByIcon className="h-3 w-3 mr-1" />
                        {change.changedBy}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Previous</p>
                        <p className="text-xs font-medium text-muted-foreground line-through">{change.oldValue}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Updated</p>
                        <p className="text-xs font-medium text-foreground">{change.newValue}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
