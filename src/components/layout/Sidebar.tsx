import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, Map, ChevronLeft, ChevronRight,
  Settings, BarChart3, HelpCircle, MessageSquare, ShoppingBag,
  Shield, Key, FileText, User, ChevronDown, ChevronUp, Layers,
  GitBranch, Briefcase, Database
} from "lucide-react";

const navGroups = [
  {
    id: "main",
    label: "",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    id: "hr",
    label: "HR Modules",
    items: [
      { id: "workforce", label: "Workforce", icon: Users, path: "/workforce", children: [
        { id: "employee-list", label: "Employee Directory", path: "/workforce/employees" },
        { id: "org-chart", label: "Org Chart", path: "/org/chart" },
        { id: "org-units", label: "Org Units", path: "/org/units" },
        { id: "positions", label: "Positions", path: "/org/positions" },
        { id: "locations", label: "Locations", path: "/org/locations" },
      ]},
    ],
  },
  {
    id: "platform",
    label: "Platform",
    items: [
      { id: "marketplace", label: "Marketplace", icon: ShoppingBag, path: "/marketplace" },
      { id: "master-data", label: "Master Data", icon: Database, path: "/master-data" },
    ],
  },
  {
    id: "admin",
    label: "Administration",
    items: [
      { id: "users", label: "Users", icon: Users, path: "/users" },
      { id: "roles", label: "Roles & Permissions", icon: Shield, path: "/roles" },
      { id: "tenants", label: "Tenants", icon: Layers, path: "/tenants" },
      { id: "license", label: "License", icon: Key, path: "/license" },
      { id: "audit", label: "Audit Log", icon: FileText, path: "/audit" },
      { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

const bottomItems = [
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "help", label: "Help", icon: HelpCircle },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["workforce"]);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const toggleExpand = (id: string) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <aside
      className={`
        flex flex-col h-screen bg-card border-r border-border sticky top-0 z-30
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Logo */}
      <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "gap-3"} border-b border-border`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-md">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-foreground leading-none whitespace-nowrap">TalentHub</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">HR Platform</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-14 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shadow-sm z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Main navigation */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.id}>
            {!collapsed && group.label && (
              <p className="px-3 mb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedGroups.includes(item.id);
                const active = isActive(item.path);

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (hasChildren && !collapsed) {
                          toggleExpand(item.id);
                        } else {
                          navigate(item.path);
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                        ${collapsed ? "justify-center" : ""}
                        ${active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        }
                      `}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                      {!collapsed && (
                        <>
                          <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                          {hasChildren && (
                            isExpanded
                              ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                              : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                          {active && !hasChildren && (
                            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          )}
                        </>
                      )}
                    </button>

                    {/* Children */}
                    {hasChildren && isExpanded && !collapsed && (
                      <div className="mt-0.5 ml-4 pl-3 border-l border-border space-y-0.5">
                        {item.children!.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => navigate(child.path)}
                            className={`
                              w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                              ${isActive(child.path)
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                              }
                            `}
                          >
                            <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-border" />

      {/* Bottom items + profile */}
      <nav className="px-2 py-3 space-y-0.5">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative
              ${collapsed ? "justify-center" : ""}
              text-muted-foreground hover:text-foreground hover:bg-secondary/60
            `}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
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

        {/* User profile */}
        <button
          onClick={() => navigate("/profile")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mt-1 border-t border-border pt-3
            ${collapsed ? "justify-center" : ""}
            hover:bg-secondary/60
          `}
          title={collapsed ? "My Profile" : undefined}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate">Admin User</p>
              <p className="text-[10px] text-muted-foreground truncate">Super Admin</p>
            </div>
          )}
        </button>
      </nav>
    </aside>
  );
}
