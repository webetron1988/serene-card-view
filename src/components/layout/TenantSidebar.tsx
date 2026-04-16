import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, ChevronLeft, ChevronRight,
  Settings, HelpCircle, MessageSquare, Briefcase, Target, BookOpen,
  TrendingUp, Award, FileText
} from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";

export function TenantSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantCode } = useParams<{ tenantCode: string }>();
  const { branding } = useTenant();

  const base = `/tenant/${tenantCode}`;

  const navGroups = [
    {
      label: "",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: `${base}/dashboard` },
      ],
    },
    {
      label: "Workforce",
      items: [
        { label: "Employees", icon: Users, path: `${base}/employees` },
        { label: "Org Chart", icon: Building2, path: `${base}/org-chart` },
        { label: "Positions", icon: Briefcase, path: `${base}/positions` },
      ],
    },
    {
      label: "Talent",
      items: [
        { label: "Competencies", icon: Award, path: `${base}/competencies` },
        { label: "Jobs", icon: FileText, path: `${base}/jobs` },
        { label: "IDP", icon: BookOpen, path: `${base}/idp` },
        { label: "Career Path", icon: TrendingUp, path: `${base}/career-path` },
        { label: "Strategy", icon: Target, path: `${base}/strategy` },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Settings", icon: Settings, path: `${base}/settings` },
      ],
    },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside
      className={`flex flex-col h-screen bg-card border-r border-border/50 sticky top-0 z-30 transition-all duration-300 ${
        collapsed ? "w-[60px]" : "w-[240px]"
      }`}
    >
      {/* Tenant logo */}
      <div className={`h-14 flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-4"} border-b border-border/50`}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold"
          style={{ background: `hsl(var(--tenant-primary, 221 83% 53%))` }}
        >
          {branding?.logoText ?? "T"}
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-foreground leading-none tracking-tight truncate">
              {branding?.displayName ?? "Tenant"}
            </h1>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">Powered by AchievHR</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[52px] w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <nav className="flex-1 px-2 py-4 space-y-5 overflow-y-auto scrollbar-hide">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {!collapsed && group.label && (
              <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.1em]">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-[13px] ${
                      collapsed ? "justify-center" : ""
                    } ${
                      active
                        ? "text-white font-medium shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                    style={active ? { background: `hsl(var(--tenant-primary, 221 83% 53%))` } : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-3 border-t border-border/40" />

      <nav className="px-2 py-3 space-y-0.5">
        <button className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/60 ${collapsed ? "justify-center" : ""}`}>
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-left">Messages</span>}
        </button>
        <button className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/60 ${collapsed ? "justify-center" : ""}`}>
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-left">Help</span>}
        </button>
      </nav>
    </aside>
  );
}
