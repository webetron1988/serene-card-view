import { motion } from "framer-motion";
import { FileText, Clock, Calendar, Users, AlertCircle, Shield, Percent } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Badge } from "@/components/ui/badge";

export const ContractPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Nature of Contract & Employment"
        subtitle="Employment terms, schedule, and contract details"
        icon={FileText}
      />

      {/* Contract Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-status-completed" />
        <div className="p-6 pl-7 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-status-completed/10">
              <Shield className="h-6 w-6 text-status-completed" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-base font-bold text-foreground">Permanent • Full-Time</h3>
                <Badge className="bg-status-completed/10 text-status-completed border-0 text-[10px]">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Since Jun 15, 2018 • FTE 1.0</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">6+ Years</p>
              <p className="text-[10px] text-muted-foreground">Tenure</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detail Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: "Work Schedule", value: "Standard", sub: "40 hrs/week" },
          { icon: Percent, label: "FTE", value: "1.0", sub: "Full allocation" },
          { icon: AlertCircle, label: "Notice Period", value: "30 Days", sub: "Required" },
          { icon: Users, label: "Union Member", value: "No", sub: "Non-union" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.04 }}
            className="group rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-all"
          >
            <item.icon className="h-4 w-4 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-sm font-bold text-foreground">{item.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h4 className="text-sm font-semibold text-foreground mb-4">Contract Timeline</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <div>
              <p className="text-xs font-medium text-foreground">Jun 15, 2018</p>
              <p className="text-[10px] text-muted-foreground">Contract Start</p>
            </div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-primary via-primary/50 to-border" />
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-border border-2 border-muted-foreground/30" />
            <div>
              <p className="text-xs font-medium text-foreground">No End Date</p>
              <p className="text-[10px] text-muted-foreground">Permanent</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
