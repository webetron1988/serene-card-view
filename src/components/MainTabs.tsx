import { Briefcase, Shield, LayoutDashboard, Users, BarChart3, Settings, Home } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "strategy", label: "Strategy", icon: Briefcase },
  { id: "governance", label: "Governance", icon: Shield },
  { id: "pmo", label: "PMO", icon: LayoutDashboard },
  { id: "workforce", label: "Workforce", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

interface MainTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function MainTabs({ activeTab, onTabChange }: MainTabsProps) {
  return (
    <div className="relative">
      {/* Glass morphism container */}
      <div className="bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm rounded-2xl p-1.5 border border-border/50 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }
              `}
              style={{
                animationDelay: `${index * 0.05}s`
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{tab.label}</span>
              
              {/* Active indicator dot */}
              {activeTab === tab.id && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Subtle decorative line */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full" />
    </div>
  );
}
