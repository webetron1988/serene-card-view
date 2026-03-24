import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Shield, Crown, Briefcase, Headphones, ChevronDown, ChevronRight, Lock, Info, Eye } from "lucide-react";
import { toast } from "sonner";

interface Permission { id: string; label: string; description: string; }
interface PermissionGroup { id: string; label: string; icon: typeof Shield; description: string; permissions: Permission[]; }

const platformGroups: PermissionGroup[] = [
  { id: "p_tenants", label: "Tenant Management", icon: Shield, description: "Manage tenants and accounts", permissions: [{ id: "p.tenants.view", label: "View Tenants", description: "View tenant list" }, { id: "p.tenants.create", label: "Create Tenants", description: "Add new tenants" }, { id: "p.tenants.edit", label: "Edit Tenants", description: "Modify tenant settings" }, { id: "p.tenants.delete", label: "Delete Tenants", description: "Remove tenants" }] },
  { id: "p_billing", label: "Plans & Billing", icon: Shield, description: "Manage plans and billing", permissions: [{ id: "p.plans.view", label: "View Plans", description: "View plan configurations" }, { id: "p.plans.create", label: "Create Plans", description: "Create subscription plans" }, { id: "p.plans.edit", label: "Edit Plans", description: "Modify plans" }, { id: "p.billing.invoices", label: "View Invoices", description: "Access billing history" }] },
  { id: "p_analytics", label: "Platform Analytics", icon: Shield, description: "Access analytics", permissions: [{ id: "p.analytics.dashboard", label: "Dashboard", description: "View analytics overview" }, { id: "p.analytics.export", label: "Export Reports", description: "Download data" }] },
  { id: "p_settings", label: "Platform Settings", icon: Shield, description: "Global configuration", permissions: [{ id: "p.settings.general", label: "General Settings", description: "Platform defaults" }, { id: "p.settings.security", label: "Security", description: "Security policies" }, { id: "p.settings.roles", label: "Roles & Permissions", description: "Role management" }] },
];

type RoleId = "super_admin" | "admin" | "support_staff";
interface RoleConfig { id: RoleId; label: string; description: string; icon: typeof Crown; color: string; immutable?: boolean; }

const roles: RoleConfig[] = [
  { id: "super_admin", label: "Super Admin", description: "Unrestricted access", icon: Crown, color: "text-amber-500", immutable: true },
  { id: "admin", label: "Admin", description: "Full platform management", icon: Shield, color: "text-primary" },
  { id: "support_staff", label: "Support Staff", description: "View & support tenants", icon: Headphones, color: "text-blue-500" },
];

function getDefaults(roleId: RoleId): Record<string, boolean> {
  const perms: Record<string, boolean> = {};
  const all = platformGroups.flatMap(g => g.permissions);
  if (roleId === "super_admin") all.forEach(p => perms[p.id] = true);
  else if (roleId === "admin") { all.forEach(p => perms[p.id] = true); perms["p.settings.roles"] = false; }
  else { all.forEach(p => perms[p.id] = false); ["p.tenants.view", "p.analytics.dashboard"].forEach(id => perms[id] = true); }
  return perms;
}

export default function RolesPermissionsPage() {
  const [activeRole, setActiveRole] = useState<RoleId>("super_admin");
  const [permissions, setPermissions] = useState<Record<RoleId, Record<string, boolean>>>(() => {
    const r: any = {};
    roles.forEach(role => r[role.id] = getDefaults(role.id));
    return r;
  });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const all: Record<string, boolean> = {};
    platformGroups.forEach(g => all[g.id] = true);
    return all;
  });

  const currentRole = roles.find(r => r.id === activeRole)!;
  const currentPerms = permissions[activeRole] || {};
  const totalEnabled = Object.values(currentPerms).filter(Boolean).length;
  const totalPerms = Object.keys(currentPerms).length;

  const togglePerm = (permId: string) => {
    if (currentRole.immutable) return;
    setPermissions(prev => ({ ...prev, [activeRole]: { ...prev[activeRole], [permId]: !prev[activeRole][permId] } }));
  };

  const getGroupStatus = (group: PermissionGroup) => {
    const enabled = group.permissions.filter(p => currentPerms[p.id]).length;
    return { enabled, total: group.permissions.length };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure granular access control for platform staff.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setPermissions(prev => ({ ...prev, [activeRole]: getDefaults(activeRole) })); toast.info("Reset to defaults"); }} className="text-xs" disabled={currentRole.immutable}>Reset</Button>
          <Button size="sm" onClick={() => toast.success(`Permissions for ${currentRole.label} saved`)} className="text-xs" disabled={currentRole.immutable}>Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {roles.map(role => {
          const rp = permissions[role.id] || {};
          const enabled = Object.values(rp).filter(Boolean).length;
          const total = Object.keys(rp).length;
          const isActive = activeRole === role.id;
          return (
            <button key={role.id} onClick={() => setActiveRole(role.id)} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-start ${isActive ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20" : "border-border/50 hover:border-border hover:bg-muted/30"}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-primary/10" : "bg-muted/60"}`}><role.icon className={`w-4 h-4 ${role.color}`} strokeWidth={1.5} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5"><span className="text-sm font-semibold text-foreground">{role.label}</span>{role.immutable && <Lock className="w-3 h-3 text-amber-500" strokeWidth={1.5} />}</div>
                <p className="text-[10px] text-muted-foreground truncate">{role.description}</p>
                <div className="flex items-center gap-1.5 mt-1"><div className="w-12 h-1 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${total > 0 ? (enabled / total) * 100 : 0}%` }} /></div><span className="text-[9px] text-muted-foreground">{enabled}/{total}</span></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
        <div>
          <div className="flex items-center gap-2"><p className="text-sm font-medium text-foreground">{currentRole.label}</p>{currentRole.immutable && <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-300 text-amber-600"><Lock className="w-2.5 h-2.5 mr-1" />Read-Only</Badge>}</div>
          <p className="text-xs text-muted-foreground mt-0.5">{totalEnabled} of {totalPerms} permissions enabled</p>
        </div>
      </div>

      <div className="space-y-3">
        {platformGroups.map(group => {
          const status = getGroupStatus(group);
          const isExpanded = expandedGroups[group.id];
          return (
            <Card key={group.id} className="border-border/50 overflow-hidden">
              <button onClick={() => setExpandedGroups(prev => ({ ...prev, [group.id]: !prev[group.id] }))} className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center"><group.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /></div><div className="text-start"><h4 className="text-sm font-medium text-foreground">{group.label}</h4><p className="text-[11px] text-muted-foreground">{group.description}</p></div></div>
                <div className="flex items-center gap-3"><Badge variant={status.enabled === status.total ? "default" : status.enabled === 0 ? "outline" : "secondary"} className="text-[10px] font-medium">{status.enabled}/{status.total}</Badge>{isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}</div>
              </button>
              {isExpanded && (
                <div className="border-t border-border/40">
                  {group.permissions.map((perm, idx) => (
                    <div key={perm.id} className={`flex items-center justify-between px-4 py-3 hover:bg-muted/20 ${idx < group.permissions.length - 1 ? "border-b border-border/20" : ""}`}>
                      <div className="flex items-center gap-3 ps-11 flex-1 min-w-0"><Eye className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" strokeWidth={1.5} /><div><span className="text-sm text-foreground">{perm.label}</span><p className="text-[11px] text-muted-foreground">{perm.description}</p></div></div>
                      <Switch checked={currentPerms[perm.id] || false} onCheckedChange={() => togglePerm(perm.id)} disabled={currentRole.immutable} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
