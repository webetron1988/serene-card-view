import { Target, Shield, Briefcase, BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

const modules = [
  {
    id: "strategy",
    label: "Strategy",
    icon: Target,
    total: 24,
    completed: 18,
    trend: "up",
    trendValue: "+12%",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "governance",
    label: "Governance",
    icon: Shield,
    total: 15,
    completed: 10,
    trend: "up",
    trendValue: "+8%",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    id: "pmo",
    label: "PMO",
    icon: Briefcase,
    total: 32,
    completed: 22,
    trend: "down",
    trendValue: "-3%",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    total: 8,
    completed: 8,
    trend: "neutral",
    trendValue: "0%",
    color: "bg-emerald-500/10 text-emerald-600",
  },
];

export const HomeAnalytics = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {modules.map((module) => {
        const Icon = module.icon;
        const TrendIcon = module.trend === "up" ? TrendingUp : module.trend === "down" ? TrendingDown : Minus;
        const trendColor = module.trend === "up" ? "text-emerald-500" : module.trend === "down" ? "text-rose-500" : "text-muted-foreground";
        
        return (
          <div
            key={module.id}
            className="group relative bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{module.completed}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{module.label}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${module.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="relative mt-2 flex items-center gap-1">
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
              <span className={`text-[10px] font-medium ${trendColor}`}>
                {module.trendValue} this week
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
