import { motion } from "framer-motion";
import { Settings, Users, DollarSign, PenTool, Plane, Briefcase } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Badge } from "@/components/ui/badge";

export const WorkTypePanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Work Type & Classification"
        subtitle="Role classification, authority levels, and travel requirements"
        icon={Settings}
      />

      {/* Classification Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Knowledge Worker</h3>
            <p className="text-xs text-muted-foreground">Individual Contributor with Team Lead</p>
          </div>
          <Badge className="ml-auto bg-category-talent/10 text-category-talent border-0">People Manager</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: DollarSign, label: "Budget Authority", value: "$500,000", color: "bg-status-completed/10 text-status-completed" },
            { icon: PenTool, label: "Signing Authority", value: "Up to $50,000", color: "bg-category-planning/10 text-category-planning" },
            { icon: Plane, label: "Travel Required", value: "10-20%", color: "bg-category-strategy/10 text-category-strategy" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="relative rounded-xl bg-secondary/40 p-4 text-center"
            >
              <div className={`inline-flex p-2 rounded-lg ${item.color.split(' ')[0]} mb-2`}>
                <item.icon className={`h-4 w-4 ${item.color.split(' ')[1]}`} />
              </div>
              <p className="text-sm font-bold text-foreground">{item.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
