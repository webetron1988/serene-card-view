import { LucideIcon } from "lucide-react";

interface Action {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  actions?: Action[] | React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon: Icon, iconColor = "bg-primary/10 text-primary", actions, children }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {children}
        {Array.isArray(actions)
          ? actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  action.variant === "secondary"
                    ? "bg-secondary text-foreground hover:bg-secondary/80"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                }`}
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                {action.label}
              </button>
            ))
          : actions}
      </div>
    </div>
  );
}
