import { motion } from "framer-motion";
import { Building2, Layers, Hash, FileText, ChevronRight } from "lucide-react";
import { PanelHeader } from "./PanelHeader";

const orgPath = [
  { label: "Business Unit", value: "Technology" },
  { label: "Division", value: "Data & Analytics" },
  { label: "Department", value: "Data Science & Analytics" },
  { label: "Team", value: "ML Engineering" },
];

const financials = [
  { icon: Hash, label: "Cost Centre", value: "CC-TECH-DS-001" },
  { icon: Hash, label: "Cost Centre Name", value: "Data Science Operations" },
  { icon: Hash, label: "GL Code", value: "6100-1500-0847" },
  { icon: FileText, label: "Legal Entity", value: "Company Inc. (US)" },
];

export const OrgStructurePanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Org Structure & Cost Centre"
        subtitle="Organizational hierarchy and financial mapping"
        icon={Building2}
      />

      {/* Org Hierarchy Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          Organizational Hierarchy
        </h4>
        <div className="flex flex-wrap items-center gap-1">
          {orgPath.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="flex items-center gap-1"
            >
              <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                <p className="text-[10px] text-muted-foreground mb-0.5">{item.label}</p>
                <p className="text-xs font-semibold text-foreground">{item.value}</p>
              </div>
              {i < orgPath.length - 1 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Financial Mapping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Hash className="h-4 w-4 text-primary" />
          Financial Mapping
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {financials.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              className="group p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
