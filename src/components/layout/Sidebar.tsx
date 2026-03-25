import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, ChevronLeft, ChevronRight,
  Settings, BarChart3, HelpCircle, MessageSquare, ShoppingBag,
  Shield, Key, FileText, ChevronDown, ChevronUp, Layers,
  Briefcase, Database, Package
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
      { id: "packages", label: "Packages", icon: Package, path: "/packages" },
      { id: "tenants", label: "Tenants", icon: Layers, path: "/tenants" },
      { id: "license", label: "License", icon: Key, path: "/license" },
      { id: "audit", label: "Audit Log", icon: FileText, path: "/audit" },
      { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

const bottomItems = [
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
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
        flex flex-col h-screen bg-card border-r border-border/50 sticky top-0 z-30
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[60px]" : "w-[240px]"}
      `}
    >
      {/* Logo */}
      <div className={`h-14 flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-4"} border-b border-border/50`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-foreground leading-none tracking-tight">TalentHub</h1>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">HR Platform</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[52px] w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Main navigation */}
      <nav className="flex-1 px-2 py-4 space-y-5 overflow-y-auto scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.id}>
            {!collapsed && group.label && (
              <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.1em]">
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
                        w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-[13px]
                        ${collapsed ? "justify-center" : ""}
                        ${active
                          ? "bg-primary text-primary-foreground font-medium shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }
                      `}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {hasChildren && (
                            isExpanded
                              ? <ChevronUp className="w-3.5 h-3.5 opacity-50" />
                              : <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                          )}
                        </>
                      )}
                    </button>

                    {/* Children */}
                    {hasChildren && isExpanded && !collapsed && (
                      <div className="mt-1 ml-3 pl-3 border-l border-border/40 space-y-0.5">
                        {item.children!.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => navigate(child.path)}
                            className={`
                              w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] transition-all
                              ${isActive(child.path)
                                ? "text-primary font-medium bg-primary/8"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                              }
                            `}
                          >
                            <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isActive(child.path) ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
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
      <div className="mx-3 border-t border-border/40" />

      {/* Bottom items + profile */}
      <nav className="px-2 py-3 space-y-0.5">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className={`
              w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all relative text-[13px]
              ${collapsed ? "justify-center" : ""}
              text-muted-foreground hover:text-foreground hover:bg-muted/60
            `}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
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
