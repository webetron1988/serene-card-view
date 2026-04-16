import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Search, Info, Zap, ArrowRight, Lock, Eye } from "lucide-react";

// ─────────── Role model (see mem://architecture/role-model) ───────────
type RoleKey = "super_admin" | "admin" | "tenant" | string; // string = custom role id

interface RoleColumn {
  key: RoleKey;
  label: string;
  color: string;
  description: string;
  fixed: boolean;          // built-in, non-deletable
  alwaysFull: boolean;     // super_admin: every perm ticked & locked
  tier: "platform" | "tenant";
}

const FIXED_ROLES: RoleColumn[] = [
  { key: "super_admin", label: "Super Admin", color: "bg-red-100 text-red-800",     description: "Full platform access. Permissions are uneditable.", fixed: true, alwaysFull: true,  tier: "platform" },
  { key: "admin",       label: "Admin",       color: "bg-blue-100 text-blue-800",   description: "Day-to-day platform operations. Editable by Super Admin only.", fixed: true, alwaysFull: false, tier: "platform" },
  { key: "tenant",      label: "Tenant",      color: "bg-orange-100 text-orange-800", description: "Reserved — managed in tenant workspace (coming soon).", fixed: true, alwaysFull: false, tier: "tenant" },
];

const CUSTOM_ROLES: RoleColumn[] = [
  { key: "billing_manager",   label: "Billing Manager",   color: "bg-emerald-100 text-emerald-800", description: "Manages tenant subscriptions, invoices, payment gateways.", fixed: false, alwaysFull: false, tier: "platform" },
  { key: "support_agent",     label: "Support Agent",     color: "bg-cyan-100 text-cyan-800",       description: "Read-only tenant access for troubleshooting.",              fixed: false, alwaysFull: false, tier: "platform" },
];

const ALL_ROLES: RoleColumn[] = [...FIXED_ROLES, ...CUSTOM_ROLES];

type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
  feature_key?: string;
};

const FEATURE_LABELS: Record<string, string> = {
  certificates: "Certificates",
  api_access: "API Access",
  webhooks: "Webhooks",
  advanced_analytics: "Advanced Analytics",
  ai_features: "AI Features",
  sso_integration: "SSO",
  custom_css: "Branding",
  payment_collection: "Payments",
};

const DEMO_PERMISSIONS: Permission[] = [
  { id: "p1", name: "employees.read",       description: "View employee profiles",        category: "Workforce" },
  { id: "p2", name: "employees.create",     description: "Create new employees",          category: "Workforce" },
  { id: "p3", name: "employees.update",     description: "Edit employee details",         category: "Workforce" },
  { id: "p4", name: "employees.delete",     description: "Remove employees",              category: "Workforce" },
  { id: "p5", name: "org.units.manage",     description: "Manage organization units",     category: "Organization" },
  { id: "p6", name: "org.positions.manage", description: "Manage positions",              category: "Organization" },
  { id: "p7", name: "org.locations.manage", description: "Manage locations",              category: "Organization" },
  { id: "p8", name: "tenants.read",         description: "View tenants",                  category: "Tenants" },
  { id: "p9", name: "tenants.manage",       description: "Create / suspend tenants",      category: "Tenants" },
  { id: "p10", name: "tenants.billing",     description: "Manage billing & plans",        category: "Tenants",     feature_key: "payment_collection" },
  { id: "p11", name: "analytics.basic",     description: "View basic analytics",          category: "Analytics" },
  { id: "p12", name: "analytics.advanced",  description: "Advanced cross-tenant analytics", category: "Analytics", feature_key: "advanced_analytics" },
  { id: "p13", name: "integrations.api_keys", description: "Manage API keys",             category: "Integrations", feature_key: "api_access" },
  { id: "p14", name: "integrations.webhooks", description: "Manage webhooks",             category: "Integrations", feature_key: "webhooks" },
  { id: "p15", name: "integrations.sso",    description: "Configure SSO",                 category: "Integrations", feature_key: "sso_integration" },
  { id: "p16", name: "ai.models.manage",    description: "Manage AI models",              category: "AI",          feature_key: "ai_features" },
  { id: "p17", name: "ai.guardrails.manage", description: "Configure AI guardrails",      category: "AI",          feature_key: "ai_features" },
  { id: "p18", name: "settings.branding",   description: "Customize branding",            category: "Settings",    feature_key: "custom_css" },
  { id: "p19", name: "settings.security",   description: "Manage security settings",      category: "Settings" },
  { id: "p20", name: "settings.audit",      description: "View audit log",                category: "Settings" },
  { id: "p21", name: "roles.create",        description: "Create custom roles",           category: "Roles & Access" },
  { id: "p22", name: "roles.manage",        description: "Edit custom role permissions",  category: "Roles & Access" },
];

// Default permission sets per role (demo)
const DEFAULT_PERMS: Record<RoleKey, Set<string>> = {
  super_admin: new Set(DEMO_PERMISSIONS.map((p) => p.id)), // ignored — alwaysFull
  admin: new Set(["p1","p2","p3","p5","p6","p7","p8","p11","p13","p14","p18","p19","p20","p21","p22"]),
  tenant: new Set(["p1","p2","p3","p5","p6","p7","p11","p18","p19","p20"]),
  billing_manager: new Set(["p8","p10"]),
  support_agent: new Set(["p1","p5","p6","p7","p8","p11","p20"]),
};

export default function PermissionMatrix() {
  // Demo viewer toggle — in production this comes from useAuth()
  const [viewerRole, setViewerRole] = useState<"super_admin" | "admin">("super_admin");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("matrix");
  const [filterType, setFilterType] = useState<"all" | "core" | "premium">("all");
  const [grants, setGrants] = useState<Record<RoleKey, Set<string>>>(() => {
    // Clone defaults so state is mutable
    const out: Record<RoleKey, Set<string>> = {} as never;
    for (const k of Object.keys(DEFAULT_PERMS)) out[k] = new Set(DEFAULT_PERMS[k]);
    return out;
  });

  // Visible columns based on viewer
  const visibleRoles = useMemo<RoleColumn[]>(() => {
    if (viewerRole === "super_admin") return ALL_ROLES;
    // Admin viewer: hide super_admin column entirely
    return ALL_ROLES.filter((r) => r.key !== "super_admin");
  }, [viewerRole]);

  const isCellChecked = (role: RoleColumn, permId: string) => {
    if (role.alwaysFull) return true;
    return grants[role.key]?.has(permId) ?? false;
  };

  // Self-edit lock + viewer scope + tenant placeholder + super_admin lock
  const isCellDisabled = (role: RoleColumn) => {
    if (role.alwaysFull) return true;             // super_admin always locked
    if (role.key === "tenant") return true;       // tenant managed elsewhere
    if (role.key === viewerRole) return true;     // self-edit lock
    if (viewerRole === "admin" && role.key === "admin") return true; // admin can't edit own
    return false;
  };

  const toggleCell = (role: RoleColumn, permId: string) => {
    if (isCellDisabled(role)) return;
    setGrants((prev) => {
      const next = { ...prev };
      const set = new Set(next[role.key]);
      if (set.has(permId)) set.delete(permId);
      else set.add(permId);
      next[role.key] = set;
      return next;
    });
  };

  const permissionsByCategory = DEMO_PERMISSIONS.reduce<Record<string, Permission[]>>((acc, p) => {
    (acc[p.category] = acc[p.category] || []).push(p);
    return acc;
  }, {});

  const filteredCategories = Object.entries(permissionsByCategory).reduce<Record<string, Permission[]>>((acc, [cat, perms]) => {
    const filtered = perms.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterType === "all" ||
        (filterType === "core" && !p.feature_key) ||
        (filterType === "premium" && !!p.feature_key);
      return matchesSearch && matchesFilter;
    });
    if (filtered.length > 0) acc[cat] = filtered;
    return acc;
  }, {});

  const coreCount = DEMO_PERMISSIONS.filter((p) => !p.feature_key).length;
  const premiumCount = DEMO_PERMISSIONS.filter((p) => !!p.feature_key).length;

  const colSpan = 2 + visibleRoles.length;

  return (
    <AppShell>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Permission Matrix</h1>
              <p className="text-muted-foreground">
                Define platform-level permissions per role. Super Admin has full uneditable access.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                {coreCount} Core
              </Badge>
              <Badge variant="outline" className="gap-1 border-amber-300 text-amber-700">
                <Zap className="h-3 w-3" />
                {premiumCount} Premium
              </Badge>
            </div>
          </div>

          {/* Viewer toggle (demo only) */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-3">
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Preview as</span>
                </div>
                <Select value={viewerRole} onValueChange={(v) => setViewerRole(v as "super_admin" | "admin")}>
                  <SelectTrigger className="h-8 w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground">
                  {viewerRole === "super_admin"
                    ? "You see all role columns. Your own column is locked."
                    : "Super Admin column is hidden. Your own (Admin) column is read-only."}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cascade explanation */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-4">
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Platform Ceiling</p>
                    <p className="text-muted-foreground text-xs">Super Admin sets the max</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Role Delegation</p>
                    <p className="text-muted-foreground text-xs">Grant per platform role</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Plan Gating</p>
                    <p className="text-muted-foreground text-xs">Subscription restricts at runtime</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats per visible role */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {visibleRoles.map((r) => {
              const count = r.alwaysFull ? DEMO_PERMISSIONS.length : (grants[r.key]?.size ?? 0);
              return (
                <Card key={r.key} className="text-center">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Badge className={r.color} variant="secondary">{r.label}</Badge>
                      {(r.fixed) && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 min-h-[2.25rem]">{r.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
              <TabsTrigger value="by-role">By Role</TabsTrigger>
            </TabsList>

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <div className="relative max-w-sm flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-1">
                <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>
                  All
                </Button>
                <Button variant={filterType === "core" ? "default" : "outline"} size="sm" onClick={() => setFilterType("core")}>
                  Core
                </Button>
                <Button
                  variant={filterType === "premium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("premium")}
                  className={filterType === "premium" ? "" : "border-amber-300 text-amber-700 hover:bg-amber-50"}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Premium
                </Button>
              </div>
            </div>

            <TabsContent value="matrix" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium min-w-[250px]">Permission</th>
                          <th className="text-center p-3 font-medium min-w-[80px]">Gate</th>
                          {visibleRoles.map((r) => (
                            <th key={r.key} className="text-center p-3 font-medium min-w-[130px]">
                              <div className="flex items-center justify-center gap-1">
                                <Badge className={r.color} variant="secondary">{r.label}</Badge>
                                {r.fixed && <Lock className="h-3 w-3 text-muted-foreground" />}
                              </div>
                              {r.key === viewerRole && (
                                <p className="text-[10px] text-muted-foreground mt-1">your role · read-only</p>
                              )}
                              {r.key === "tenant" && (
                                <p className="text-[10px] text-muted-foreground mt-1">tenant tier</p>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(filteredCategories).map(([category, perms]) => (
                          <>
                            <tr key={category} className="bg-muted/30">
                              <td colSpan={colSpan} className="p-2 px-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                {category}
                              </td>
                            </tr>
                            {perms.map((perm) => (
                              <tr key={perm.id} className="border-b hover:bg-muted/20">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{perm.name}</span>
                                    {perm.description && (
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Info className="h-3 w-3 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>{perm.description}</TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                </td>
                                <td className="text-center p-3">
                                  {perm.feature_key ? (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 gap-1">
                                          <Zap className="h-2.5 w-2.5" />
                                          {FEATURE_LABELS[perm.feature_key] || perm.feature_key}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Requires "{FEATURE_LABELS[perm.feature_key] || perm.feature_key}" feature in subscription plan
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">Core</Badge>
                                  )}
                                </td>
                                {visibleRoles.map((r) => {
                                  const disabled = isCellDisabled(r);
                                  return (
                                    <td key={r.key} className="text-center p-3">
                                      <Checkbox
                                        checked={isCellChecked(r, perm.id)}
                                        onCheckedChange={() => toggleCell(r, perm.id)}
                                        disabled={disabled}
                                        className={disabled ? "opacity-60 cursor-not-allowed" : ""}
                                      />
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="by-role" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {visibleRoles.map((r) => {
                  const rolePerms = r.alwaysFull
                    ? DEMO_PERMISSIONS
                    : DEMO_PERMISSIONS.filter((p) => isCellChecked(r, p.id));
                  const premiumRolePerms = rolePerms.filter((p) => p.feature_key);
                  return (
                    <Card key={r.key}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 flex-wrap">
                          <Badge className={r.color}>{r.label}</Badge>
                          {r.fixed && <Lock className="h-3 w-3 text-muted-foreground" />}
                          <span className="text-sm font-normal text-muted-foreground">{rolePerms.length} permissions</span>
                          {premiumRolePerms.length > 0 && (
                            <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                              <Zap className="h-2.5 w-2.5 mr-0.5" />
                              {premiumRolePerms.length} premium
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{r.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="multiple" className="w-full">
                          {Object.entries(permissionsByCategory).map(([cat, catPerms]) => {
                            const activePerms = catPerms.filter((p) => isCellChecked(r, p.id));
                            if (activePerms.length === 0 && !r.alwaysFull) return null;
                            return (
                              <AccordionItem key={cat} value={cat}>
                                <AccordionTrigger className="text-sm py-2">
                                  {cat} ({r.alwaysFull ? catPerms.length : activePerms.length}/{catPerms.length})
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-1">
                                    {catPerms.map((p) => {
                                      const checked = isCellChecked(r, p.id);
                                      const disabled = isCellDisabled(r);
                                      return (
                                        <div key={p.id} className="flex items-center gap-2 py-1">
                                          <Checkbox
                                            checked={checked}
                                            onCheckedChange={() => toggleCell(r, p.id)}
                                            disabled={disabled}
                                            className={disabled ? "opacity-60" : ""}
                                          />
                                          <span className="text-sm flex-1">{p.description || p.name}</span>
                                          {p.feature_key && (
                                            <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700">
                                              <Zap className="h-2 w-2 mr-0.5" />
                                              {FEATURE_LABELS[p.feature_key] || p.feature_key}
                                            </Badge>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    </AppShell>
  );
}
