import { motion } from "framer-motion";
import { Users, User, Mail, Calendar, GitBranch } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ManagerCard = ({ 
  type, name, id, title, email, since, extra 
}: { 
  type: string; name: string; id?: string; title: string; email?: string; since?: string; extra?: { label: string; value: string }[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-border bg-card p-5 space-y-4"
  >
    <div className="flex items-center gap-2 mb-1">
      <Badge variant="secondary" className="text-[10px]">{type}</Badge>
    </div>
    <div className="flex items-center gap-4">
      <Avatar className="h-12 w-12 border-2 border-primary/20">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{title}</p>
      </div>
    </div>
    <div className="space-y-2 pt-2 border-t border-border">
      {id && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><User className="h-3 w-3" />Manager ID</span>
          <span className="text-xs font-medium text-foreground">{id}</span>
        </div>
      )}
      {email && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="h-3 w-3" />Email</span>
          <span className="text-xs font-medium text-foreground">{email}</span>
        </div>
      )}
      {since && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3" />Reporting Since</span>
          <span className="text-xs font-medium text-foreground">{since}</span>
        </div>
      )}
      {extra?.map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><GitBranch className="h-3 w-3" />{item.label}</span>
          <span className="text-xs font-medium text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

export const ReportingManagerPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Reporting Manager & Matrix Manager"
        subtitle="Reporting hierarchy and team structure"
        icon={Users}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ManagerCard
          type="Direct Manager"
          name="Dr. Patricia Johnson"
          id="EMP-2015-0234"
          title="VP, Data Science"
          email="patricia.johnson@company.com"
          since="Mar 10, 2022"
        />
        <ManagerCard
          type="Matrix Manager"
          name="Michael Chen"
          title="Director, Product Analytics"
          extra={[
            { label: "Matrix Relationship", value: "Project-Based (50%)" },
          ]}
        />
      </div>

      {/* Direct Reports Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Direct Reports</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-xs text-muted-foreground">Number of Direct Reports</span>
            <span className="text-sm font-semibold text-foreground">4</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-xs text-muted-foreground">Total Team Size</span>
            <span className="text-sm font-semibold text-foreground">4</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
