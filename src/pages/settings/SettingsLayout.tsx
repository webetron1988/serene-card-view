import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Settings, Shield, Wallet, Brain, ShieldAlert, Key, Mail,
  BellRing, Puzzle, Palette, Globe, UserPlus, Users, Building2, FolderTree,
  Scale, FileArchive
} from "lucide-react";

const settingsNav = [
  { label: "General", icon: Settings, path: "/app/admin/settings" },
  { label: "Registration", icon: UserPlus, path: "/app/admin/settings/registration" },
  { label: "Roles & Permissions", icon: Users, path: "/app/admin/settings/roles" },
  { label: "Departments", icon: Building2, path: "/app/admin/settings/departments" },
  { label: "Bot Categories", icon: FolderTree, path: "/app/admin/settings/bot-categories" },
  { label: "Branding", icon: Palette, path: "/app/admin/settings/branding" },
  { label: "Security", icon: Shield, path: "/app/admin/settings/security" },
  { label: "Policy & Governance", icon: Scale, path: "/app/admin/settings/policy" },
  { label: "Document Vault", icon: FileArchive, path: "/app/admin/settings/document-vault" },
  { label: "Payments", icon: Wallet, path: "/app/admin/settings/payments" },
  { label: "AI Models", icon: Brain, path: "/app/admin/settings/ai-models" },
  { label: "Guardrails", icon: ShieldAlert, path: "/app/admin/settings/guardrails" },
  { label: "API Keys", icon: Key, path: "/app/admin/settings/api-keys" },
  { label: "Email", icon: Mail, path: "/app/admin/settings/email" },
  { label: "Notifications", icon: BellRing, path: "/app/admin/settings/notifications" },
  { label: "Integrations", icon: Puzzle, path: "/app/admin/settings/integrations" },
  { label: "Channels", icon: Globe, path: "/app/admin/settings/channels" },
];

const ROOT = "/app/admin/settings";

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
              (item.path !== ROOT && location.pathname.startsWith(item.path));
            const isGeneral = item.path === ROOT && location.pathname === ROOT;
            const active = isGeneral || (item.path !== ROOT && isActive);

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
