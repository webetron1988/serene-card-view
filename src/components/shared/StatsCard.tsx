import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatsCardProps {
  label?: string;
  title?: string;
  value: string | number;
  icon: LucideIcon | React.ReactNode;
  trend?: string | { value: number; positive: boolean };
  trendUp?: boolean;
  colorClass?: string;
  onClick?: () => void;
}

export function StatsCard({
  label, title, value, icon, trend, trendUp = true, colorClass = "bg-primary/10 text-primary", onClick
}: StatsCardProps) {
  const displayLabel = label || title || "";
  const isIconComponent = typeof icon === 'function' || (typeof icon === 'object' && icon !== null && '$$typeof' in icon && 'render' in (icon as any));
  const Icon = isIconComponent ? icon as LucideIcon : null;
  const trendStr = typeof trend === 'object' ? `${trend.positive ? '+' : '-'}${trend.value}%` : trend;
  const isTrendUp = typeof trend === 'object' ? trend.positive : trendUp;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-card border border-border/60 rounded-xl p-5 transition-all duration-200 overflow-hidden ${onClick ? "cursor-pointer hover:border-primary/30 hover:shadow-sm" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[13px] text-muted-foreground font-medium">{displayLabel}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}>
          {Icon ? <Icon className="w-5 h-5" /> : icon as React.ReactNode}
        </div>
      </div>
      {trendStr && (
        <div className="mt-3 flex items-center gap-1.5">
          {isTrendUp
            ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          }
          <span className={`text-xs font-medium ${isTrendUp ? "text-emerald-600" : "text-rose-600"}`}>
            {trendStr}
          </span>
        </div>
      )}
    </div>
  );
}
