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
      className={`group relative bg-card border border-border rounded-xl p-4 transition-all duration-300 overflow-hidden ${onClick ? "cursor-pointer hover:border-primary/30" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{displayLabel}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center transition-transform group-hover:scale-110`}>
          {Icon ? <Icon className="w-5 h-5" /> : icon as React.ReactNode}
        </div>
      </div>
      {trendStr && (
        <div className="relative mt-2 flex items-center gap-1">
          {isTrendUp
            ? <TrendingUp className="w-3 h-3 text-emerald-500" />
            : <TrendingDown className="w-3 h-3 text-rose-500" />
          }
          <span className={`text-[10px] font-medium ${isTrendUp ? "text-emerald-500" : "text-rose-500"}`}>
            {trendStr}
          </span>
        </div>
      )}
    </div>
  );
}
