import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Settings, Shield, Wallet, Brain, ShieldAlert, Key, Mail,
  BellRing, Puzzle, Palette, Globe, UserPlus, Users, Building2, FolderTree
} from "lucide-react";

const settingsNav = [
  { label: "General", icon: Settings, path: "/admin/settings" },
  { label: "Registration", icon: UserPlus, path: "/admin/settings/registration" },
  { label: "Roles & Permissions", icon: Users, path: "/admin/settings/roles" },
  { label: "Departments", icon: Building2, path: "/admin/settings/departments" },
  { label: "Bot Categories", icon: FolderTree, path: "/admin/settings/bot-categories" },
  { label: "Branding", icon: Palette, path: "/admin/settings/branding" },
  { label: "Security", icon: Shield, path: "/admin/settings/security" },
  { label: "Payments", icon: Wallet, path: "/admin/settings/payments" },
  { label: "AI Models", icon: Brain, path: "/admin/settings/ai-models" },
  { label: "Guardrails", icon: ShieldAlert, path: "/admin/settings/guardrails" },
  { label: "API Keys", icon: Key, path: "/admin/settings/api-keys" },
  { label: "Email", icon: Mail, path: "/admin/settings/email" },
  { label: "Notifications", icon: BellRing, path: "/admin/settings/notifications" },
  { label: "Integrations", icon: Puzzle, path: "/admin/settings/integrations" },
  { label: "Channels", icon: Globe, path: "/admin/settings/channels" },
];

export default function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="flex gap-8 min-h-[calc(100vh-12rem)]">
      <aside className="w-56 flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground mb-1">Settings</h2>
        <p className="text-xs text-muted-foreground mb-6">Platform configuration</p>
        <nav className="space-y-0.5">
          {settingsNav.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/admin/settings" && location.pathname.startsWith(item.path));
            const isGeneral = item.path === "/admin/settings" && location.pathname === "/admin/settings";
            const active = isGeneral || (item.path !== "/admin/settings" && isActive);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
