import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Briefcase, Shield, LayoutDashboard, Users, BarChart3, 
  Settings, ChevronLeft, ChevronRight, Home, FileText, 
  Target, Calendar, MessageSquare, HelpCircle, UserCircle
} from "lucide-react";

const menuItems = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "strategy", label: "Strategy", icon: Briefcase, path: "/" },
  { id: "governance", label: "Governance", icon: Shield, path: "/" },
  { id: "pmo", label: "PMO", icon: LayoutDashboard, path: "/" },
  { id: "workforce", label: "Workforce", icon: Users, path: "/" },
  { id: "workforce-profile", label: "Workforce Profile", icon: UserCircle, path: "/employee/1" },
  { id: "plans", label: "Plans", icon: FileText, path: "/" },
  { id: "priorities", label: "Priorities", icon: Target, path: "/" },
];

const bottomItems = [
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "help", label: "Help", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

export function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveItem = () => {
    if (location.pathname.startsWith("/employee")) return "workforce-profile";
    return "home";
  };

  const activeItem = getActiveItem();

  return (
    <aside 
      className={`
        flex flex-col h-screen bg-card border-r border-border sticky top-0
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-56"}
      `}
    >
      {/* Logo */}
      <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
        <img 
          src="https://app.achievhr.ai/uploads/img/logo/Screenshot_2025-04-29_at_3_30_57PM.png" 
          alt="AchievHR Logo" 
          className="w-9 h-9 rounded-lg object-contain flex-shrink-0"
        />
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-semibold text-foreground leading-none whitespace-nowrap">AchievHR</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Your HR Command Center</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shadow-sm z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Main navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
              ${collapsed ? "justify-center" : ""}
              ${activeItem === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }
            `}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${activeItem === item.id ? "text-primary" : ""}`} />
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
            {activeItem === item.id && !collapsed && (
              <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-border" />

      {/* Bottom navigation */}
      <nav className="px-2 py-4 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {}}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative
              ${collapsed ? "justify-center" : ""}
              ${activeItem === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }
            `}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${activeItem === item.id ? "text-primary" : ""}`} />
            {!collapsed && (
              <>
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {collapsed && item.badge && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </nav>

    </aside>
  );
}