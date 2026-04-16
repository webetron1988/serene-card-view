import { useMemo, useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Search, Info, Lock, Loader2, Save, RotateCcw, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRolesData, grantKey, type RoleKind } from "@/hooks/useRolesData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ─────────── Role model (see mem://architecture/role-model) ───────────
type SystemRoleKey = "super_admin" | "admin" | "tenant";

interface RoleColumn {
  kind: RoleKind;
  ref: string;                 // enum value or UUID
  label: string;
  color: string;
  description: string;
  fixed: boolean;
  alwaysFull: boolean;         // super_admin: every perm ticked & locked
  tier: "platform" | "tenant";
}

const SYSTEM_ROLES: RoleColumn[] = [
  { kind: "system", ref: "super_admin", label: "Super Admin", color: "bg-red-100 text-red-800", description: "Full platform access. Permissions are uneditable.", fixed: true, alwaysFull: true, tier: "platform" },
  { kind: "system", ref: "admin", label: "Admin", color: "bg-blue-100 text-blue-800", description: "Day-to-day platform operations. Editable by Super Admin only.", fixed: true, alwaysFull: false, tier: "platform" },
  { kind: "system", ref: "tenant", label: "Tenant", color: "bg-orange-100 text-orange-800", description: "Reserved — managed in tenant workspace (coming soon).", fixed: true, alwaysFull: false, tier: "tenant" },
];

export default function PermissionMatrix() {
  const { hasPlatformRole, loading: authLoading, user } = useAuth();
  const { permissions, platformCustomRoles, grants, loading, error, refresh } = useRolesData();

  // Determine viewer role from real auth
  const viewerRole: SystemRoleKey | null = useMemo(() => {
    if (authLoading || !user) return null;
    if (hasPlatformRole("super_admin")) return "super_admin";
    if (hasPlatformRole("admin")) return "admin";
    return null;
  }, [authLoading, user, hasPlatformRole]);

  // Build column list from system + custom roles, scoped by viewer
  const allRoles: RoleColumn[] = useMemo(() => {
    const customCols: RoleColumn[] = platformCustomRoles
      .filter((r) => !r.is_archived)
      .map((r) => ({
        kind: "platform_custom",
        ref: r.id,
        label: r.name,
        color: "bg-emerald-100 text-emerald-800",
        description: r.description ?? "",
        fixed: false,
        alwaysFull: false,
        tier: "platform",
      }));
    return [...SYSTEM_ROLES, ...customCols];
  }, [platformCustomRoles]);

  const visibleRoles = useMemo<RoleColumn[]>(() => {
    if (viewerRole === "super_admin") return allRoles;
    // Admin viewer: hide super_admin column entirely
    return allRoles.filter((r) => !(r.kind === "system" && r.ref === "super_admin"));
  }, [viewerRole, allRoles]);

  // Local mutable grants set for the editor (Save button persists)
  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [originalDraft, setOriginalDraft] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  // Hydrate draft from server data
  useEffect(() => {
    const next = new Set<string>();
    for (const g of grants) next.add(grantKey(g.role_kind, g.role_ref, g.permission_key));
    setDraft(next);
    setOriginalDraft(new Set(next));
  }, [grants]);

  const isDirty = useMemo(() => {
    if (draft.size !== originalDraft.size) return true;
    for (const k of draft) if (!originalDraft.has(k)) return true;
    return false;
  }, [draft, originalDraft]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("matrix");

  const isCellChecked = (role: RoleColumn, permKey: string) => {
    if (role.alwaysFull) return true;
    return draft.has(grantKey(role.kind, role.ref, permKey));
  };

  // Self-edit lock + viewer scope + tenant placeholder + super_admin lock
  const isCellDisabled = (role: RoleColumn) => {
    if (!viewerRole) return true;
    if (role.alwaysFull) return true;
    if (role.kind === "system" && role.ref === "tenant") return true;
    if (role.kind === "system" && role.ref === viewerRole) return true;
    if (viewerRole === "admin" && role.kind === "system" && role.ref === "admin") return true;
    return false;
  };

  const toggleCell = (role: RoleColumn, permKey: string) => {
    if (isCellDisabled(role)) return;
    setDraft((prev) => {
      const next = new Set(prev);
      const k = grantKey(role.kind, role.ref, permKey);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      const toAdd: { role_kind: RoleKind; role_ref: string; permission_key: string }[] = [];
      const toRemove: { role_kind: RoleKind; role_ref: string; permission_key: string }[] = [];

      for (const k of draft) if (!originalDraft.has(k)) {
        const [kind, ref, permKey] = k.split("::");
        toAdd.push({ role_kind: kind as RoleKind, role_ref: ref, permission_key: permKey });
      }
      for (const k of originalDraft) if (!draft.has(k)) {
        const [kind, ref, permKey] = k.split("::");
        toRemove.push({ role_kind: kind as RoleKind, role_ref: ref, permission_key: permKey });
      }

      if (toAdd.length > 0) {
        const { error: insErr } = await supabase.from("role_permissions").insert(toAdd);
        if (insErr) throw insErr;
      }
      for (const r of toRemove) {
        const { error: delErr } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role_kind", r.role_kind)
          .eq("role_ref", r.role_ref)
          .eq("permission_key", r.permission_key);
        if (delErr) throw delErr;
      }

      toast.success(`Saved ${toAdd.length + toRemove.length} change${toAdd.length + toRemove.length === 1 ? "" : "s"}`);
      await refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDraft(new Set(originalDraft));
    toast.info("Changes discarded");
  };

  const permissionsByCategory = useMemo(() => {
    return permissions.reduce<Record<string, typeof permissions>>((acc, p) => {
      (acc[p.category] = acc[p.category] || []).push(p);
      return acc;
    }, {});
  }, [permissions]);

  const filteredCategories = useMemo(() => {
    return Object.entries(permissionsByCategory).reduce<Record<string, typeof permissions>>((acc, [cat, perms]) => {
      const filtered = perms.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.key.toLowerCase().includes(q) ||
          p.label.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          cat.toLowerCase().includes(q)
        );
      });
      if (filtered.length > 0) acc[cat] = filtered;
      return acc;
    }, {});
  }, [permissionsByCategory, searchQuery]);

  const colSpan = 2 + visibleRoles.length;

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (!viewerRole) {
    return (
      <AppShell>
        <Card className="max-w-xl mx-auto mt-10">
          <CardContent className="py-8 text-center space-y-2">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
            <h2 className="text-lg font-semibold">Platform role required</h2>
            <p className="text-sm text-muted-foreground">
              You need a platform-tier role (super_admin or admin) to view the Permission Matrix.
            </p>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

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
                {permissions.length} permissions
              </Badge>
              <Button variant="outline" size="sm" onClick={handleReset} disabled={!isDirty || saving}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!isDirty || saving}>
                {saving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                Save Changes
              </Button>
            </div>
          </div>

          {error && (
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="py-3 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </CardContent>
            </Card>
          )}

          {/* Viewer info */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-3 text-sm flex items-center gap-3 flex-wrap">
              <Badge className={viewerRole === "super_admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                Logged in as {viewerRole === "super_admin" ? "Super Admin" : "Admin"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {viewerRole === "super_admin"
                  ? "You see all role columns. Your own column is locked to prevent privilege drift."
                  : "Super Admin column is hidden. Your own (Admin) column is read-only."}
              </span>
            </CardContent>
          </Card>

          {/* Stats per visible role */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {visibleRoles.map((r) => {
              const count = r.alwaysFull
                ? permissions.length
                : Array.from(draft).filter((k) => k.startsWith(`${r.kind}::${r.ref}::`)).length;
              return (
                <Card key={`${r.kind}-${r.ref}`} className="text-center">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Badge className={r.color} variant="secondary">{r.label}</Badge>
                      {r.fixed && <Lock className="h-3 w-3 text-muted-foreground" />}
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
            </div>

            <TabsContent value="matrix" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium min-w-[280px]">Permission</th>
                          <th className="text-center p-3 font-medium min-w-[80px]">Type</th>
                          {visibleRoles.map((r) => (
                            <th key={`${r.kind}-${r.ref}`} className="text-center p-3 font-medium min-w-[130px]">
                              <div className="flex items-center justify-center gap-1">
                                <Badge className={r.color} variant="secondary">{r.label}</Badge>
                                {r.fixed && <Lock className="h-3 w-3 text-muted-foreground" />}
                              </div>
                              {r.kind === "system" && r.ref === viewerRole && (
                                <p className="text-[10px] text-muted-foreground mt-1">your role · read-only</p>
                              )}
                              {r.kind === "system" && r.ref === "tenant" && (
                                <p className="text-[10px] text-muted-foreground mt-1">tenant tier</p>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(filteredCategories).map(([category, perms]) => (
                          <>
                            <tr key={`cat-${category}`} className="bg-muted/30">
                              <td colSpan={colSpan} className="p-2 px-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                {category}
                              </td>
                            </tr>
                            {perms.map((perm) => (
                              <tr key={perm.key} className="border-b hover:bg-muted/20">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{perm.key}</span>
                                    {perm.description && (
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Info className="h-3 w-3 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>{perm.description}</TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground mt-0.5">{perm.label}</p>
                                </td>
                                <td className="text-center p-3">
                                  {perm.is_destructive ? (
                                    <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive">Destructive</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-[10px]">Standard</Badge>
                                  )}
                                </td>
                                {visibleRoles.map((r) => {
                                  const disabled = isCellDisabled(r);
                                  return (
                                    <td key={`${r.kind}-${r.ref}`} className="text-center p-3">
                                      <Checkbox
                                        checked={isCellChecked(r, perm.key)}
                                        onCheckedChange={() => toggleCell(r, perm.key)}
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
                    ? permissions
                    : permissions.filter((p) => isCellChecked(r, p.key));
                  return (
                    <Card key={`br-${r.kind}-${r.ref}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 flex-wrap">
                          <Badge className={r.color}>{r.label}</Badge>
                          {r.fixed && <Lock className="h-3 w-3 text-muted-foreground" />}
                          <span className="text-sm font-normal text-muted-foreground">{rolePerms.length} permissions</span>
                        </CardTitle>
                        <CardDescription>{r.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="multiple" className="w-full">
                          {Object.entries(permissionsByCategory).map(([cat, catPerms]) => {
                            const activePerms = catPerms.filter((p) => isCellChecked(r, p.key));
                            if (activePerms.length === 0 && !r.alwaysFull) return null;
                            return (
                              <AccordionItem key={cat} value={cat}>
                                <AccordionTrigger className="text-sm py-2">
                                  {cat} ({r.alwaysFull ? catPerms.length : activePerms.length}/{catPerms.length})
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-1">
                                    {catPerms.map((p) => {
                                      const checked = isCellChecked(r, p.key);
                                      const disabled = isCellDisabled(r);
                                      return (
                                        <div key={p.key} className="flex items-center gap-2 py-1">
                                          <Checkbox
                                            checked={checked}
                                            onCheckedChange={() => toggleCell(r, p.key)}
                                            disabled={disabled}
                                            className={disabled ? "opacity-60" : ""}
                                          />
                                          <span className="text-sm flex-1">{p.label}</span>
                                          {p.is_destructive && (
                                            <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive">!</Badge>
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
