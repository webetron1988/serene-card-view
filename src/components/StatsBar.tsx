import { FileText, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total", value: "24", icon: FileText, trend: "+3", color: "bg-primary/10 text-primary" },
  { label: "Approved", value: "12", icon: CheckCircle2, trend: "+2", color: "bg-emerald-500/10 text-emerald-600" },
  { label: "Pending", value: "8", icon: Clock, trend: null, color: "bg-amber-500/10 text-amber-600" },
  { label: "On Hold", value: "4", icon: AlertCircle, trend: "-1", color: "bg-rose-500/10 text-rose-600" },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          
          {stat.trend && (
            <div className="relative mt-2 flex items-center gap-1">
              <TrendingUp className={`w-3 h-3 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`} />
              <span className={`text-[10px] font-medium ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend} this week
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
