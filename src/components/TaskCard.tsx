import { Copy, Trash2, Edit, Clock, User, Users, Calendar, Target, BarChart3 } from "lucide-react";

interface TaskCardProps {
  code: string;
  title: string;
  description: string;
  category: "Talent" | "Planning" | "Strategy" | "Analytics";
  status: "Draft" | "Active" | "Completed";
  priority: "Low" | "Medium" | "High";
  progress: number;
  createdAt: string;
  assignee?: {
    name: string;
    designation?: string;
  };
}

const statusConfig = {
  Draft: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Draft" },
  Active: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "In Progress" },
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
};

const priorityConfig = {
  Low: "bg-priority-low/10 text-priority-low",
  Medium: "bg-priority-medium/10 text-priority-medium",
  High: "bg-priority-high/10 text-priority-high",
};

const categoryIconConfig = {
  Talent: { icon: Users, bg: "bg-blue-50", color: "text-blue-600" },
  Planning: { icon: Calendar, bg: "bg-purple-50", color: "text-purple-600" },
  Strategy: { icon: Target, bg: "bg-emerald-50", color: "text-emerald-600" },
  Analytics: { icon: BarChart3, bg: "bg-orange-50", color: "text-orange-600" },
};

export function TaskCard({
  code,
  title,
  description,
  category,
  status,
  priority,
  progress,
  createdAt,
  assignee,
}: TaskCardProps) {
  const hasProgress = progress > 0;

  return (
    <article className="card-elevated card-elevated-hover rounded-xl p-5 opacity-0 animate-fade-in group">
      {/* Header - Category on Left, Status & Actions on Right */}
      <header className="flex items-center justify-between mb-3">
        {/* Category with Triangle Marker on Left */}
        <div className="flex items-center gap-1.5">
          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-primary" />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
            {category}
          </span>
        </div>

        {/* Status on Right */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[status].dot}`} />
          {statusConfig[status].label}
        </span>
      </header>

      {/* Category Icon + Title */}
      <div className="flex items-start gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg ${categoryIconConfig[category].bg} flex items-center justify-center flex-shrink-0`}>
          {(() => {
            const IconComponent = categoryIconConfig[category].icon;
            return <IconComponent className={`w-4.5 h-4.5 ${categoryIconConfig[category].color}`} />;
          })()}
        </div>
        <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 pt-1">
          {title}
        </h3>
      </div>

      {/* Code & Priority */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground font-mono">
          {code}
        </span>
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
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
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

      {/* Footer - Assignee on left, Time on right */}
      <footer className="flex items-center justify-between pt-3 border-t border-border">
        {/* Assignee on left */}
        {assignee ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground leading-tight">
                {assignee.name}
              </p>
              {assignee.designation && (
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {assignee.designation}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Unassigned</span>
          </div>
        )}

        {/* Time on right - hidden on hover, replaced by action icons */}
        <div className="relative">
          {/* Time - visible by default, hidden on hover */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:opacity-0 transition-opacity duration-200">
            <Clock className="w-3.5 h-3.5" />
            <span>{createdAt}</span>
          </div>
          
          {/* Action icons - hidden by default, visible on hover */}
          <div className="absolute inset-0 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="action-button" title="Edit">
              <Edit className="w-4 h-4" />
            </button>
            <button className="action-button" title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>
            <button className="action-button hover:text-destructive" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}
