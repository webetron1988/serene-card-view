import { useState } from "react";
import { Shield, Plus, Lock, Users, ChevronRight, Check, X, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

const systemRoles = [
  { name: "Platform Super Admin", tier: "platform", users: 2, desc: "Full platform control, all permissions", locked: true },
  { name: "Platform Manager", tier: "platform", users: 5, desc: "Cross-tenant management and support", locked: true },
  { name: "Tenant Super Admin", tier: "tenant", users: 12, desc: "Full tenant control, billing, users", locked: true },
  { name: "HR Director", tier: "tenant", users: 24, desc: "All HR functions, approvals, org structure", locked: true },
  { name: "HR Manager", tier: "tenant", users: 67, desc: "Team HR functions, limited approvals", locked: true },
  { name: "Department Head", tier: "tenant", users: 48, desc: "Department view, approve team requests", locked: true },
  { name: "Team Lead", tier: "tenant", users: 134, desc: "Direct reports management", locked: false },
  { name: "Employee", tier: "tenant", users: 987, desc: "Self-service, view own data", locked: true },
  { name: "Auditor", tier: "tenant", users: 8, desc: "Full read-only, export reports", locked: true },
  { name: "Finance Liaison", tier: "tenant", users: 15, desc: "Compensation and payroll view", locked: false },
];

const permissionGroups = [
  {
    module: "Employee Profile",
    permissions: [
      { key: "employee:read:own", desc: "View own profile", roles: ["Employee", "Team Lead", "HR Manager", "HR Director"] },
      { key: "employee:read:team", desc: "View team profiles", roles: ["Team Lead", "HR Manager", "HR Director"] },
      { key: "employee:update:department", desc: "Edit dept employees", roles: ["HR Manager", "HR Director"] },
      { key: "employee:create:org", desc: "Create employees", roles: ["HR Director", "Tenant Super Admin"] },
    ],
  },
  {
    module: "Job Profiles",
    permissions: [
      { key: "job_profile:read:org", desc: "View job profiles", roles: ["Employee", "Team Lead", "HR Manager", "HR Director"] },
      { key: "job_profile:create:org", desc: "Create job profiles", roles: ["HR Manager", "HR Director"] },
      { key: "job_profile:update:org", desc: "Edit job profiles", roles: ["HR Director"] },
    ],
  },
  {
    module: "Organisation",
    permissions: [
      { key: "org_structure:read:org", desc: "View org chart", roles: ["Employee", "Team Lead", "HR Manager", "HR Director"] },
      { key: "org_structure:update:org", desc: "Modify org structure", roles: ["HR Director", "Tenant Super Admin"] },
    ],
  },
];

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>("HR Manager");

  const filtered = systemRoles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Roles & Permissions" subtitle="Manage roles and access control">
      <div className="space-y-6">
        <PageHeader
          title="Roles & Permissions"
          subtitle="Two-tier RBAC — Platform and Tenant level roles"
          icon={Shield}
          iconColor="bg-purple-100 text-purple-600"
          actions={[{ label: "Create Custom Role", icon: Plus, onClick: () => {} }]}
        />

        {/* Tab toggle */}
        <div className="bg-gradient-to-r from-card/80 via-card to-card/80 rounded-xl p-1.5 border border-border/50 w-fit">
          <div className="flex items-center gap-1">
            {["roles", "permissions"].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === t
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {t === "roles" ? "Roles" : "Permission Matrix"}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "roles" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Role list */}
            <div className="lg:col-span-1 bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    placeholder="Search roles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-secondary/50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="divide-y divide-border max-h-[540px] overflow-y-auto scrollbar-hide">
                {/* Platform tier */}
                <div className="px-4 py-2 bg-secondary/30">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Platform Tier</p>
                </div>
                {filtered.filter(r => r.tier === "platform").map(role => (
                  <button
                    key={role.name}
                    onClick={() => setSelectedRole(role.name)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                      selectedRole === role.name ? "bg-primary/8 bg-primary/5" : "hover:bg-secondary/40"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${selectedRole === role.name ? "bg-primary" : "bg-border"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground truncate">{role.name}</span>
                        {role.locked && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{role.users} users</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  </button>
                ))}

                {/* Tenant tier */}
                <div className="px-4 py-2 bg-secondary/30">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tenant Tier</p>
                </div>
                {filtered.filter(r => r.tier === "tenant").map(role => (
                  <button
                    key={role.name}
                    onClick={() => setSelectedRole(role.name)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                      selectedRole === role.name ? "bg-primary/5" : "hover:bg-secondary/40"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${selectedRole === role.name ? "bg-primary" : "bg-border"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground truncate">{role.name}</span>
                        {role.locked && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{role.users} users</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Role detail */}
            <div className="lg:col-span-2 space-y-4">
              {selectedRole && (() => {
                const role = systemRoles.find(r => r.name === selectedRole)!;
                return (
                  <>
                    <div className="bg-card border border-border rounded-xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground">{role.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{role.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{role.tier} tier</span>
                          {!role.locked && (
                            <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                              Edit Role
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span><strong className="text-foreground">{role.users}</strong> users assigned</span>
                        </div>
                        {role.locked && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            <span>System role (read-only)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Permissions for this role */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-border">
                        <h4 className="text-sm font-semibold text-foreground">Permissions granted to {role.name}</h4>
                      </div>
                      <div className="divide-y divide-border">
                        {permissionGroups.map(group => (
                          <div key={group.module} className="px-5 py-4">
                            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">{group.module}</h5>
                            <div className="space-y-2">
                              {group.permissions.map(perm => {
                                const hasPermission = perm.roles.includes(selectedRole);
                                return (
                                  <div key={perm.key} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${hasPermission ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                                      {hasPermission ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                    </div>
                                    <div className="flex-1">
                                      <span className="text-sm text-foreground">{perm.desc}</span>
                                      <span className="ml-2 font-mono text-[11px] text-muted-foreground">{perm.key}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-64">Permission</th>
                    {["Employee", "Team Lead", "HR Manager", "HR Director", "Tenant Super Admin"].map(r => (
                      <th key={r} className="px-3 py-3 text-center font-semibold text-muted-foreground whitespace-nowrap">{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {permissionGroups.map(group => (
                    <>
                      <tr key={group.module} className="bg-secondary/20">
                        <td colSpan={6} className="px-4 py-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{group.module}</span>
                        </td>
                      </tr>
                      {group.permissions.map(perm => (
                        <tr key={perm.key} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-foreground">{perm.desc}</p>
                              <p className="font-mono text-muted-foreground mt-0.5">{perm.key}</p>
                            </div>
                          </td>
                          {["Employee", "Team Lead", "HR Manager", "HR Director", "Tenant Super Admin"].map(role => (
                            <td key={role} className="px-3 py-3 text-center">
                              {perm.roles.includes(role)
                                ? <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                                : <span className="w-4 h-4 block mx-auto text-border">—</span>
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
