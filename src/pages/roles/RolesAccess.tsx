import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, Shield, ShieldCheck, Lock, Pencil, Archive, Trash2, ExternalLink, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRolesData } from "@/hooks/useRolesData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SAMPLE_ROLES = [
  { name: "Billing Manager", description: "Manages tenant subscriptions, invoices, and payment gateways." },
  { name: "Onboarding Specialist", description: "Provisions new tenants, assigns plans, and runs welcome sequences." },
  { name: "AI Operations", description: "Manages AI model configuration, guardrails, and usage analytics." },
  { name: "Compliance Officer", description: "Reviews audit trails, data retention, and tenant policy compliance." },
];

export default function RolesAccess() {
  const navigate = useNavigate();
  const { hasPlatformRole, loading: authLoading, user } = useAuth();
  const { permissions, platformCustomRoles, grants, loading, error, refresh } = useRolesData();

  const isSuperAdmin = hasPlatformRole("super_admin");
  const isAdmin = hasPlatformRole("admin");
  // Admin can create roles only if they hold roles.create
  const adminCanCreate = useMemo(
    () => grants.some((g) => g.role_kind === "system" && g.role_ref === "admin" && g.permission_key === "roles.create"),
    [grants]
  );
  const canCreate = isSuperAdmin || (isAdmin && adminCanCreate);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const activeCustomRoles = platformCustomRoles.filter((r) => !r.is_archived);
  const archivedCustomRoles = platformCustomRoles.filter((r) => r.is_archived);

  // System role permission counts (read from server grants)
  const systemPermCount = useMemo(() => {
    const totals: Record<string, number> = { super_admin: permissions.length, admin: 0, tenant: 0 };
    for (const g of grants) {
      if (g.role_kind !== "system") continue;
      if (g.role_ref === "super_admin") continue; // always full
      totals[g.role_ref] = (totals[g.role_ref] ?? 0) + 1;
    }
    return totals;
  }, [grants, permissions.length]);

  const customPermCount = (roleId: string) =>
    grants.filter((g) => g.role_kind === "platform_custom" && g.role_ref === roleId).length;

  const goToMatrix = () => navigate("/app/admin/roles/permissions");

  const handleCreate = async () => {
    if (!newRole.name.trim()) return;
    setSubmitting(true);
    try {
      const { error: insErr } = await supabase
        .from("platform_custom_roles")
        .insert({ name: newRole.name.trim(), description: newRole.description.trim() || null, created_by: user?.id ?? null });
      if (insErr) throw insErr;
      toast.success(`Role "${newRole.name}" created`);
      setNewRole({ name: "", description: "" });
      setShowCreateDialog(false);
      await refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create role";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id: string) => {
    const { error: err } = await supabase.from("platform_custom_roles").update({ is_archived: true }).eq("id", id);
    if (err) toast.error(err.message);
    else { toast.success("Role archived"); await refresh(); }
  };

  const handleRestore = async (id: string) => {
    const { error: err } = await supabase.from("platform_custom_roles").update({ is_archived: false }).eq("id", id);
    if (err) toast.error(err.message);
    else { toast.success("Role restored"); await refresh(); }
  };

  const handleDelete = async (id: string) => {
    const { error: err } = await supabase.from("platform_custom_roles").delete().eq("id", id);
    if (err) toast.error(err.message);
    else { toast.success("Role deleted"); await refresh(); }
  };

  const handleEditSave = async () => {
    if (!editingRole) return;
    const { error: err } = await supabase
      .from("platform_custom_roles")
      .update({ name: editForm.name.trim(), description: editForm.description.trim() || null })
      .eq("id", editingRole);
    if (err) toast.error(err.message);
    else { toast.success("Role updated"); setEditingRole(null); await refresh(); }
  };

  const useSample = (sample: (typeof SAMPLE_ROLES)[0]) => {
    setNewRole({ name: sample.name, description: sample.description });
  };

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  const PLATFORM_DEFAULT_ROLES = [
    { role: "super_admin", label: "Super Admin", description: "Full platform access. All permissions are granted and uneditable.", permCount: systemPermCount.super_admin, note: "Uneditable — system-protected", tier: "platform" as const },
    { role: "admin", label: "Admin", description: "Day-to-day platform operations. Permissions controlled by Super Admin only.", permCount: systemPermCount.admin, note: "Editable by Super Admin", tier: "platform" as const },
    { role: "tenant", label: "Tenant", description: "Reserved role for tenant-tier users. Managed in the tenant workspace (coming soon).", permCount: systemPermCount.tenant, note: "Tenant tier — placeholder", tier: "tenant" as const },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
            <p className="text-muted-foreground">
              Manage default and custom roles for the platform. Configure permissions in the Permission Matrix.
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} disabled={!canCreate} title={!canCreate ? "Requires roles.create permission" : undefined}>
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Role
          </Button>
        </div>

        {error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="py-3 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </CardContent>
          </Card>
        )}

        {/* Section 1: Default Roles */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Default Roles</h2>
            <Badge variant="secondary" className="text-xs">System</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            These roles are built-in and cannot be modified or removed. Permissions are managed in the Permission Matrix.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORM_DEFAULT_ROLES.map((role) => (
              <Card key={role.role} className={`relative ${role.tier === "tenant" ? "border-dashed opacity-80" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <CardTitle className="text-sm font-semibold">{role.label}</CardTitle>
                      {role.role === "super_admin" && (<Badge variant="secondary" className="text-[10px]">Uneditable</Badge>)}
                      {role.tier === "tenant" && (<Badge variant="outline" className="text-[10px]">Tenant tier</Badge>)}
                    </div>
                    <Switch checked={true} disabled className="opacity-60" />
                  </div>
                  <CardDescription className="text-xs mt-1 line-clamp-2">{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="text-xs w-fit">{role.permCount} permissions</Badge>
                      <span className="text-[10px] text-muted-foreground">{role.note}</span>
                    </div>
                    {role.tier === "platform" && (
                      <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-primary" onClick={goToMatrix}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Matrix
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Section 2: Custom Roles (Active) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
            <h2 className="text-lg font-semibold">Custom Roles</h2>
            <Badge className="text-xs">{activeCustomRoles.length}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Specialized roles created for your platform's specific operational needs.</p>

          {activeCustomRoles.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Shield className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-base font-semibold mb-1">No Custom Roles Yet</h3>
                <p className="text-muted-foreground text-sm text-center max-w-sm mb-4">
                  Create specialized roles like Billing Manager, Onboarding Specialist, or AI Operations to delegate platform responsibilities.
                </p>
                <Button variant="outline" onClick={() => setShowCreateDialog(true)} disabled={!canCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Role
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeCustomRoles.map((role) => {
                const permCount = customPermCount(role.id);
                return (
                  <Card key={role.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-3 w-3 rounded-full shrink-0 bg-emerald-500" />
                          <CardTitle className="text-sm font-semibold truncate">{role.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7"
                            disabled={!isSuperAdmin}
                            onClick={() => { setEditingRole(role.id); setEditForm({ name: role.name, description: role.description ?? "" }); }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-amber-600 hover:text-amber-700"
                            disabled={!isSuperAdmin}
                            onClick={() => handleArchive(role.id)}
                            title="Archive"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="text-xs mt-1 line-clamp-2">{role.description || "No description"}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{permCount} permissions</Badge>
                        {permCount === 0 ? (
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2 text-primary border-primary/30" onClick={goToMatrix}>
                            <Plus className="h-3 w-3 mr-1" />
                            Add Permissions
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-primary" onClick={goToMatrix}>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Matrix
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Archived Roles */}
        {archivedCustomRoles.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-muted-foreground">Archived Roles</h2>
                <Badge variant="outline" className="text-xs">{archivedCustomRoles.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Deactivated roles. Users assigned to these roles retain the assignment but lose associated permissions.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {archivedCustomRoles.map((role) => (
                  <Card key={role.id} className="opacity-70 border-dashed">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-3 w-3 rounded-full shrink-0 opacity-50 bg-emerald-500" />
                          <CardTitle className="text-sm font-semibold text-muted-foreground truncate">{role.name}</CardTitle>
                          <Badge variant="secondary" className="text-[10px]">Archived</Badge>
                        </div>
                      </div>
                      <CardDescription className="text-xs mt-1 line-clamp-2">{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="sm" className="text-xs h-7" disabled={!isSuperAdmin} onClick={() => handleRestore(role.id)}>
                          Restore
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                          disabled={!isSuperAdmin}
                          onClick={() => handleDelete(role.id)}
                          title="Delete permanently"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Custom Role</DialogTitle>
              <DialogDescription>
                Define a specialized role for your platform. After creation, assign permissions in the Permission Matrix.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Quick start from a template</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_ROLES.map((s) => (
                    <Button key={s.name} variant="outline" size="sm" className="text-xs h-7" onClick={() => useSample(s)}>
                      {s.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role-name">Name</Label>
                <Input id="role-name" placeholder="e.g. Billing Manager" value={newRole.name} onChange={(e) => setNewRole({ ...newRole, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role-desc">Description</Label>
                <Textarea id="role-desc" placeholder="What does this role do?" rows={3} value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newRole.name.trim() || submitting}>
                {submitting && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Custom Role</DialogTitle>
              <DialogDescription>Update the name or description of this role.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea id="edit-desc" rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRole(null)}>Cancel</Button>
              <Button onClick={handleEditSave} disabled={!editForm.name.trim()}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
