import { Copy, Trash2, Edit, Clock, User, Users, Calendar, Target, BarChart3, DollarSign, Briefcase } from "lucide-react";

interface StrategyCardProps {
  code: string;
  title: string;
  description: string;
  category: "HR Strategy" | "Talent" | "HR Budget" | "Planning" | "Strategy" | "Analytics";
  status: "Draft" | "Active" | "Completed" | "In Progress";
  priority: "Low" | "Medium" | "High";
  progress: number;
  createdAt: string;
  assignee?: {
    name: string;
    role?: string;
  };
}

const statusConfig = {
  "Draft": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Draft" },
  "Active": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "In Progress" },
  "In Progress": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "In Progress" },
  "Completed": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
};

const priorityConfig = {
  Low: "bg-emerald-50 text-emerald-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-rose-50 text-rose-600",
};

const categoryIconConfig = {
  "HR Strategy": { icon: Briefcase, bg: "bg-indigo-50", color: "text-indigo-600" },
  "Talent": { icon: Users, bg: "bg-blue-50", color: "text-blue-600" },
  "HR Budget": { icon: DollarSign, bg: "bg-green-50", color: "text-green-600" },
  "Planning": { icon: Calendar, bg: "bg-purple-50", color: "text-purple-600" },
  "Strategy": { icon: Target, bg: "bg-emerald-50", color: "text-emerald-600" },
  "Analytics": { icon: BarChart3, bg: "bg-orange-50", color: "text-orange-600" },
};

export function StrategyCard({
  code,
  title,
  description,
  category,
  status,
  priority,
  progress,
  createdAt,
  assignee,
}: StrategyCardProps) {
  const hasProgress = progress > 0;
  const CategoryIcon = categoryIconConfig[category].icon;

  return (
    <article className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
      {/* Header - Category on Left, Status on Right */}
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-primary" />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
            {category}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[status].dot}`} />
          {statusConfig[status].label}
        </span>
      </header>

      {/* Category Icon + Title */}
      <div className="flex items-start gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg ${categoryIconConfig[category].bg} flex items-center justify-center flex-shrink-0`}>
          <CategoryIcon className={`w-4.5 h-4.5 ${categoryIconConfig[category].color}`} />
        </div>
        <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 pt-1">
          {title}
        </h3>
      </div>

      {/* Code & Priority */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground font-mono">{code}</span>
        <span className="text-muted-foreground/30">•</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityConfig[priority]}`}>
          {priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
        {description}
      </p>

      {/* Progress Section */}
      <div className="mb-4">
        {hasProgress ? (
          <>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-semibold">{progress}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 bg-secondary/50 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            <span className="text-xs text-muted-foreground">Not started yet</span>
          </div>
        )}
      </div>

      {/* Footer - Assignee & Time/Actions */}
      <footer className="flex items-center justify-between pt-4 border-t border-border relative">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          {assignee ? (
            <div>
              <p className="text-sm font-medium text-foreground leading-tight">{assignee.name}</p>
              {assignee.role && (
                <p className="text-[11px] text-muted-foreground">{assignee.role}</p>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Unassigned</span>
          )}
        </div>
        
        {/* Time - Hidden on hover */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:opacity-0 transition-opacity duration-200">
          <Clock className="w-3.5 h-3.5" />
          <span>{createdAt}</span>
        </div>

        {/* Action Icons - Visible on hover */}
        <div className="absolute right-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </article>
  );
}
