import { Clock, User, Target, Shield, Briefcase, Users, DollarSign, Calendar, BarChart3, FolderKanban, FileCheck, AlertTriangle } from "lucide-react";

type CardType = "strategy" | "governance" | "pmo";

interface MiniCardProps {
  title: string;
  category: string;
  status: "Draft" | "Pending" | "Completed";
  priority: "Low" | "Medium" | "High";
  assignee?: string;
  createdAt: string;
  type: CardType;
  progress?: number; // Only for PMO cards
}

const statusConfig = {
  "Draft": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  "Pending": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "Completed": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

const priorityConfig = {
  Low: "bg-emerald-50 text-emerald-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-rose-50 text-rose-600",
};

const categoryIconMap: Record<string, { icon: typeof Target; bg: string; color: string }> = {
  // Strategy categories
  "HR Strategy": { icon: Briefcase, bg: "bg-indigo-50", color: "text-indigo-600" },
  "Talent": { icon: Users, bg: "bg-blue-50", color: "text-blue-600" },
  "Workforce": { icon: Users, bg: "bg-cyan-50", color: "text-cyan-600" },
  "Performance": { icon: Target, bg: "bg-emerald-50", color: "text-emerald-600" },
  "Budget": { icon: DollarSign, bg: "bg-green-50", color: "text-green-600" },
  // Governance categories
  "Policy": { icon: FileCheck, bg: "bg-purple-50", color: "text-purple-600" },
  "Compliance": { icon: Shield, bg: "bg-violet-50", color: "text-violet-600" },
  "Risk": { icon: AlertTriangle, bg: "bg-amber-50", color: "text-amber-600" },
  "Audit": { icon: BarChart3, bg: "bg-slate-50", color: "text-slate-600" },
  // PMO categories
  "Implementation": { icon: FolderKanban, bg: "bg-blue-50", color: "text-blue-600" },
  "Migration": { icon: Calendar, bg: "bg-orange-50", color: "text-orange-600" },
  "Enhancement": { icon: Target, bg: "bg-teal-50", color: "text-teal-600" },
  "Rollout": { icon: Users, bg: "bg-pink-50", color: "text-pink-600" },
};

const getDefaultIcon = (type: CardType) => {
  switch (type) {
    case "strategy": return { icon: Target, bg: "bg-primary/10", color: "text-primary" };
    case "governance": return { icon: Shield, bg: "bg-purple-50", color: "text-purple-600" };
    case "pmo": return { icon: FolderKanban, bg: "bg-blue-50", color: "text-blue-600" };
  }
};

export function MiniCard({ title, category, status, priority, assignee, createdAt, type, progress }: MiniCardProps) {
  const categoryConfig = categoryIconMap[category] || getDefaultIcon(type);
  const CategoryIcon = categoryConfig.icon;
  const showProgress = type === "pmo";
  const hasProgress = showProgress && progress !== undefined && progress > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-3 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer group">
      {/* Header - Category with Icon on Left, Status on Right */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded ${categoryConfig.bg} flex items-center justify-center`}>
            <CategoryIcon className={`w-3 h-3 ${categoryConfig.color}`} />
          </div>
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
            {category}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${statusConfig[status].bg} ${statusConfig[status].text}`}>
          <span className={`w-1 h-1 rounded-full ${statusConfig[status].dot}`} />
          {status}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-xs font-semibold text-foreground line-clamp-2 mb-2 leading-tight min-h-[2rem]">
        {title}
      </h4>

      {/* Priority Badge */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${priorityConfig[priority]}`}>
          {priority}
        </span>
      </div>

      {/* Progress Bar - Only for PMO */}
      {showProgress && (
        <div className="mb-2">
          {hasProgress ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground">Progress</span>
                <span className="text-[9px] font-semibold text-foreground">{progress}%</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 py-1 px-2 bg-secondary/50 rounded">
              <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="text-[9px] text-muted-foreground">Not started</span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-2.5 h-2.5 text-muted-foreground" />
          </div>
          <span className="text-[9px] text-muted-foreground truncate max-w-[60px]">{assignee || "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <Clock className="w-2.5 h-2.5" />
          <span>{createdAt}</span>
        </div>
      </div>
    </div>
  );
}
