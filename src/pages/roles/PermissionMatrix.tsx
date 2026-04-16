import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Search, Info, Zap, ArrowRight } from "lucide-react";

// ─────────── Static demo data (UI only) ───────────
type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
  feature_key?: string;
};

const PLATFORM_ROLES: { role: string; label: string; color: string; description: string }[] = [
  { role: "super_admin", label: "Super Admin", color: "bg-red-100 text-red-800", description: "Full platform access — all permissions granted" },
  { role: "tenant_super_admin", label: "Tenants (Ceiling)", color: "bg-orange-100 text-orange-800", description: "Maximum permissions available to all tenants" },
];

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
  // Workforce
  { id: "p1", name: "employees.read", description: "View employee profiles", category: "Workforce" },
  { id: "p2", name: "employees.create", description: "Create new employees", category: "Workforce" },
  { id: "p3", name: "employees.update", description: "Edit employee details", category: "Workforce" },
  { id: "p4", name: "employees.delete", description: "Remove employees", category: "Workforce" },
  // Org
  { id: "p5", name: "org.units.manage", description: "Manage organization units", category: "Organization" },
  { id: "p6", name: "org.positions.manage", description: "Manage positions", category: "Organization" },
  { id: "p7", name: "org.locations.manage", description: "Manage locations", category: "Organization" },
  // Tenants
  { id: "p8", name: "tenants.read", description: "View tenants", category: "Tenants" },
  { id: "p9", name: "tenants.manage", description: "Create / suspend tenants", category: "Tenants" },
  { id: "p10", name: "tenants.billing", description: "Manage billing & plans", category: "Tenants", feature_key: "payment_collection" },
  // Analytics
  { id: "p11", name: "analytics.basic", description: "View basic analytics", category: "Analytics" },
  { id: "p12", name: "analytics.advanced", description: "Advanced cross-tenant analytics", category: "Analytics", feature_key: "advanced_analytics" },
  // Integrations
  { id: "p13", name: "integrations.api_keys", description: "Manage API keys", category: "Integrations", feature_key: "api_access" },
  { id: "p14", name: "integrations.webhooks", description: "Manage webhooks", category: "Integrations", feature_key: "webhooks" },
  { id: "p15", name: "integrations.sso", description: "Configure SSO", category: "Integrations", feature_key: "sso_integration" },
  // AI
  { id: "p16", name: "ai.models.manage", description: "Manage AI models", category: "AI", feature_key: "ai_features" },
  { id: "p17", name: "ai.guardrails.manage", description: "Configure AI guardrails", category: "AI", feature_key: "ai_features" },
  // Settings
  { id: "p18", name: "settings.branding", description: "Customize branding", category: "Settings", feature_key: "custom_css" },
  { id: "p19", name: "settings.security", description: "Manage security settings", category: "Settings" },
  { id: "p20", name: "settings.audit", description: "View audit log", category: "Settings" },
];

// Static "ceiling" set — which perms are enabled for tenants in this demo
const TENANT_CEILING = new Set(["p1", "p2", "p3", "p5", "p6", "p7", "p8", "p11", "p18", "p19", "p20"]);

export default function PermissionMatrix() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("matrix");
  const [filterType, setFilterType] = useState<"all" | "core" | "premium">("all");
  const [tenantPerms, setTenantPerms] = useState<Set<string>>(new Set(TENANT_CEILING));

  const hasRolePermission = (role: string, permId: string) => {
    if (role === "super_admin") return true;
    return tenantPerms.has(permId);
  };

  const toggleRolePermission = (role: string, permId: string) => {
    if (role === "super_admin") return;
    setTenantPerms((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) next.delete(permId);
      else next.add(permId);
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
  const tenantCeilingCount = DEMO_PERMISSIONS.filter((p) => hasRolePermission("tenant_super_admin", p.id)).length;

  return (
    <AppShell>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Role Permission Templates</h1>
              <p className="text-muted-foreground">
                Define platform-level permissions. The "Tenants" column sets the maximum permission ceiling for all tenants.
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
                    <p className="text-muted-foreground text-xs">You set the max here</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Tenant Delegation</p>
                    <p className="text-muted-foreground text-xs">Tenant admins sub-delegate to their users</p>
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

          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="text-center">
              <CardContent className="pt-4 pb-3">
                <Badge className="bg-red-100 text-red-800 mb-2">Super Admin</Badge>
                <p className="text-2xl font-bold">{DEMO_PERMISSIONS.length}</p>
                <p className="text-xs text-muted-foreground">Full platform access — all permissions</p>
              </CardContent>
            </Card>
            <Card className="text-center border-orange-200">
              <CardContent className="pt-4 pb-3">
                <Badge className="bg-orange-100 text-orange-800 mb-2">Tenants (Ceiling)</Badge>
                <p className="text-2xl font-bold">{tenantCeilingCount}</p>
                <p className="text-xs text-muted-foreground">Max permissions available to all tenants</p>
              </CardContent>
            </Card>
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
                          {PLATFORM_ROLES.map((r) => (
                            <th key={r.role} className="text-center p-3 font-medium min-w-[140px]">
                              <Badge className={r.color} variant="secondary">
                                {r.label}
                              </Badge>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(filteredCategories).map(([category, perms]) => (
                          <>
                            <tr key={category} className="bg-muted/30">
                              <td colSpan={4} className="p-2 px-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
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
                                        Requires "{FEATURE_LABELS[perm.feature_key] || perm.feature_key}" feature in tenant's subscription plan
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">
                                      Core
                                    </Badge>
                                  )}
                                </td>
                                {PLATFORM_ROLES.map((r) => (
                                  <td key={r.role} className="text-center p-3">
                                    <Checkbox
                                      checked={r.role === "super_admin" ? true : hasRolePermission(r.role, perm.id)}
                                      onCheckedChange={() => toggleRolePermission(r.role, perm.id)}
                                      disabled={r.role === "super_admin"}
                                      className={r.role === "super_admin" ? "opacity-60" : ""}
                                    />
                                  </td>
                                ))}
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
                {PLATFORM_ROLES.map((r) => {
                  const rolePerms =
                    r.role === "super_admin"
                      ? DEMO_PERMISSIONS
                      : DEMO_PERMISSIONS.filter((p) => hasRolePermission(r.role, p.id));
                  const premiumRolePerms = rolePerms.filter((p) => p.feature_key);
                  return (
                    <Card key={r.role}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 flex-wrap">
                          <Badge className={r.color}>{r.label}</Badge>
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
                            const activePerms = catPerms.filter((p) => hasRolePermission(r.role, p.id));
                            if (activePerms.length === 0 && r.role !== "super_admin") return null;
                            return (
                              <AccordionItem key={cat} value={cat}>
                                <AccordionTrigger className="text-sm py-2">
                                  {cat} ({r.role === "super_admin" ? catPerms.length : activePerms.length}/{catPerms.length})
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-1">
                                    {catPerms.map((p) => (
                                      <div key={p.id} className="flex items-center gap-2 py-1">
                                        <Checkbox
                                          checked={r.role === "super_admin" ? true : hasRolePermission(r.role, p.id)}
                                          onCheckedChange={() => toggleRolePermission(r.role, p.id)}
                                          disabled={r.role === "super_admin"}
                                        />
                                        <span className="text-sm flex-1">{p.description || p.name}</span>
                                        {p.feature_key && (
                                          <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700">
                                            <Zap className="h-2 w-2 mr-0.5" />
                                            {FEATURE_LABELS[p.feature_key] || p.feature_key}
                                          </Badge>
                                        )}
                                      </div>
                                    ))}
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
