import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DataRowProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  index?: number;
  isLast?: boolean;
  badge?: string;
  badgeVariant?: "success" | "warning" | "danger" | "info";
}

const badgeStyles = {
  success: "bg-status-completed/10 text-status-completed",
  warning: "bg-priority-medium/10 text-priority-medium",
  danger: "bg-priority-high/10 text-priority-high",
  info: "bg-primary/10 text-primary",
};

export const DataRow = ({ 
  label, 
  value, 
  icon: Icon, 
  index = 0, 
  isLast = false,
  badge,
  badgeVariant = "info"
}: DataRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={cn(
        "flex items-center justify-between px-5 py-3.5 hover:bg-secondary/30 transition-colors group",
        !isLast && "border-b border-border/50"
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{value}</span>
        {badge && (
          <Badge className={cn("text-[10px] border-0", badgeStyles[badgeVariant])}>
            {badge}
          </Badge>
        )}
      </div>
    </motion.div>
  );
};
