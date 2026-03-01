import { useState } from "react";
import { motion } from "framer-motion";
import { Accessibility, ShieldCheck, Calendar, Monitor, CheckCircle2 } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Badge } from "@/components/ui/badge";
import { WorkingConditionForm } from "../forms/WorkingConditionForm";

export const WorkingConditionPanel = () => {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Working Condition Changes"
        subtitle="Disability accommodations and ergonomic assessments"
        icon={Accessibility}
        onEdit={() => setEditOpen(true)}
      />

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-status-completed/10">
            <ShieldCheck className="h-6 w-6 text-status-completed" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">No Accommodations Required</h3>
            <p className="text-xs text-muted-foreground">All ergonomic assessments are up to date</p>
          </div>
          <Badge className="ml-auto bg-status-completed/10 text-status-completed border-0">All Clear</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Accessibility, label: "Accommodation Required", value: "No", status: "clear" },
            { icon: Accessibility, label: "Accommodation Type", value: "—", status: "na" },
            { icon: Calendar, label: "Ergonomic Assessment", value: "Completed (Jan 2024)", status: "done" },
            { icon: Monitor, label: "Special Equipment", value: "Standing Desk, Ergonomic Chair", status: "active" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30"
            >
              <div className="mt-0.5 flex-shrink-0">
                {item.status === "clear" || item.status === "done" ? (
                  <CheckCircle2 className="h-4 w-4 text-status-completed" />
                ) : (
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <WorkingConditionForm open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
