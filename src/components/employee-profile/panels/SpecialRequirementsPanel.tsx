import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Globe, Truck, Lock, Stethoscope, Accessibility, CheckCircle2 } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { SpecialRequirementsForm } from "../forms/SpecialRequirementsForm";

interface RequirementItem {
  label: string;
  value: string;
  icon: any;
  status: "clear" | "required" | "na";
}

const requirements: RequirementItem[] = [
  { label: "Visa Sponsorship", value: "Not Required", icon: Globe, status: "clear" },
  { label: "Relocation Required", value: "No", icon: Truck, status: "clear" },
  { label: "Security Clearance", value: "Not Required", icon: Lock, status: "clear" },
  { label: "Medical Clearance", value: "Cleared", icon: Stethoscope, status: "clear" },
  { label: "Special Accommodations", value: "None", icon: Accessibility, status: "clear" },
];

const statusConfig = {
  clear: { bg: "bg-status-completed/10", text: "text-status-completed", icon: CheckCircle2, label: "Clear" },
  required: { bg: "bg-priority-medium/10", text: "text-priority-medium", icon: AlertTriangle, label: "Required" },
  na: { bg: "bg-secondary", text: "text-muted-foreground", icon: ShieldCheck, label: "N/A" },
};

export const SpecialRequirementsPanel = () => {
  const [editOpen, setEditOpen] = useState(false);
  const allClear = requirements.every(r => r.status === "clear");

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Special Requirements"
        subtitle="Pre-employment conditions and accommodations"
        icon={AlertTriangle}
        onEdit={() => setEditOpen(true)}
      />

      {/* All Clear Banner */}
      {allClear && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 p-4 rounded-2xl border border-status-completed/20 bg-status-completed/5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="p-2 rounded-xl bg-status-completed/10"
          >
            <ShieldCheck className="h-5 w-5 text-status-completed" />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">No Special Requirements</h3>
            <p className="text-[11px] text-muted-foreground">All pre-employment conditions cleared</p>
          </div>
        </motion.div>
      )}

      {/* Requirements Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {requirements.map((req, index) => {
          const config = statusConfig[req.status];
          return (
            <motion.div
              key={req.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors"
            >
              <div className={`p-2.5 rounded-xl ${config.bg}`}>
                <req.icon className={`h-5 w-5 ${config.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{req.label}</p>
                <p className="text-sm font-semibold text-foreground">{req.value}</p>
              </div>
              <div className={`p-1.5 rounded-full ${config.bg}`}>
                <config.icon className={`h-3.5 w-3.5 ${config.text}`} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <SpecialRequirementsForm open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
