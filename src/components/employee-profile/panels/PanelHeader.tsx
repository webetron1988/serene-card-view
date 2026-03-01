import { motion } from "framer-motion";
import { LucideIcon, Pencil, Plus } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface StatItem {
  label: string;
  value: string | number;
}

type PastelVariant = "blue" | "rose" | "green" | "peach" | "purple" | "teal";

interface PanelHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  stats?: StatItem[];
  children?: ReactNode;
  pastel?: PastelVariant;
  onEdit?: () => void;
  onAdd?: () => void;
  addLabel?: string;
}

const pastelStyles: Record<PastelVariant, { bg: string; icon: string }> = {
  blue: { bg: "bg-pastel-blue", icon: "text-pastel-blue-icon" },
  rose: { bg: "bg-pastel-rose", icon: "text-pastel-rose-icon" },
  green: { bg: "bg-pastel-green", icon: "text-pastel-green-icon" },
  peach: { bg: "bg-pastel-peach", icon: "text-pastel-peach-icon" },
  purple: { bg: "bg-pastel-purple", icon: "text-pastel-purple-icon" },
  teal: { bg: "bg-pastel-teal", icon: "text-pastel-teal-icon" },
};

export const PanelHeader = ({ title, subtitle, icon: Icon, stats, pastel = "blue", onEdit, onAdd, addLabel = "Add" }: PanelHeaderProps) => {
  const style = pastelStyles[pastel];
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${style.bg}`}>
          <Icon className={`h-5 w-5 ${style.icon}`} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {stats && stats.length > 0 && (
          <div className="hidden sm:flex items-center gap-6 mr-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                {index < stats.length - 1 && (
                  <div className="ml-4 h-6 w-px bg-border" />
                )}
              </div>
            ))}
          </div>
        )}

        {onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd} className="gap-1.5 text-xs h-8">
            <Plus className="h-3.5 w-3.5" />
            {addLabel}
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};
