import { useState } from "react";
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
import { Plus, Shield, ShieldCheck, Lock, Pencil, Archive, Trash2, ExternalLink, Users, Sparkles } from "lucide-react";

// ─────────── Static demo data (UI only) — see mem://architecture/role-model ───────────
const PLATFORM_DEFAULT_ROLES = [
  {
    role: "super_admin",
    label: "Super Admin",
    description: "Full platform access. All permissions are granted and uneditable.",
    permCount: 22,
    note: "Uneditable — system-protected",
    tier: "platform" as const,
  },
  {
    role: "admin",
    label: "Admin",
    description: "Day-to-day platform operations. Permissions controlled by Super Admin only.",
    permCount: 15,
    note: "Editable by Super Admin",
    tier: "platform" as const,
  },
  {
    role: "tenant",
    label: "Tenant",
    description: "Reserved role for tenant-tier users. Managed in the tenant workspace (coming soon).",
    permCount: 10,
    note: "Tenant tier — placeholder",
    tier: "tenant" as const,
  },
];

type CustomRole = {
  id: string;
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  permCount: number;
  userCount: number;
};

const INITIAL_CUSTOM_ROLES: CustomRole[] = [
  { id: "c1", name: "Billing Manager", description: "Manages tenant subscriptions, invoices, and payment gateways.", color: "#10b981", is_active: true, permCount: 7, userCount: 2 },
  { id: "c2", name: "Onboarding Specialist", description: "Provisions new tenants, assigns plans, and runs welcome sequences.", color: "#0ea5e9", is_active: true, permCount: 9, userCount: 3 },
  { id: "c3", name: "AI Operations", description: "Manages AI model configuration, guardrails, and usage analytics.", color: "#8b5cf6", is_active: true, permCount: 6, userCount: 1 },
  { id: "c4", name: "Compliance Officer", description: "Reviews audit trails, data retention, and tenant policy compliance.", color: "#f59e0b", is_active: true, permCount: 4, userCount: 0 },
  { id: "c5", name: "Legacy Reseller Manager", description: "Old reseller workflow — replaced by Onboarding Specialist.", color: "#6366f1", is_active: false, permCount: 5, userCount: 1 },
];

const SAMPLE_ROLES = [
  { name: "Billing Manager", description: "Manages tenant subscriptions, invoices, and payment gateways.", color: "#10b981" },
  { name: "Onboarding Specialist", description: "Provisions new tenants, assigns plans, and runs welcome sequences.", color: "#0ea5e9" },
  { name: "AI Operations", description: "Manages AI model configuration, guardrails, and usage analytics.", color: "#8b5cf6" },
  { name: "Compliance Officer", description: "Reviews audit trails, data retention, and tenant policy compliance.", color: "#f59e0b" },
];

export default function RolesAccess() {
  const navigate = useNavigate();
  const [customRoles, setCustomRoles] = useState<CustomRole[]>(INITIAL_CUSTOM_ROLES);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", color: "#6366f1" });
  const [newRole, setNewRole] = useState({ name: "", description: "", color: "#6366f1" });

  const activeCustomRoles = customRoles.filter((r) => r.is_active);
  const archivedCustomRoles = customRoles.filter((r) => !r.is_active);

  const goToMatrix = () => navigate("/app/admin/roles/permissions");

  const handleCreate = () => {
    if (!newRole.name.trim()) return;
    const id = `c${Date.now()}`;
    setCustomRoles((prev) => [
      ...prev,
      { id, name: newRole.name, description: newRole.description, color: newRole.color, is_active: true, permCount: 0, userCount: 0 },
    ]);
    setNewRole({ name: "", description: "", color: "#6366f1" });
    setShowCreateDialog(false);
  };

  const handleArchive = (id: string) => {
    setCustomRoles((prev) => prev.map((r) => (r.id === id ? { ...r, is_active: false } : r)));
  };

  const handleRestore = (id: string) => {
    setCustomRoles((prev) => prev.map((r) => (r.id === id ? { ...r, is_active: true } : r)));
  };

  const handleDelete = (id: string) => {
    setCustomRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEditSave = () => {
    if (!editingRole) return;
    setCustomRoles((prev) =>
      prev.map((r) => (r.id === editingRole ? { ...r, name: editForm.name, description: editForm.description, color: editForm.color } : r)),
    );
    setEditingRole(null);
  };

  const useSample = (sample: (typeof SAMPLE_ROLES)[0]) => {
    setNewRole({ name: sample.name, description: sample.description, color: sample.color });
  };

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
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Role
          </Button>
        </div>

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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_DEFAULT_ROLES.map((role) => (
              <Card key={role.role} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <CardTitle className="text-sm font-semibold">{role.label}</CardTitle>
                    </div>
                    <Switch checked={true} disabled className="opacity-60" />
                  </div>
                  <CardDescription className="text-xs mt-1 line-clamp-2">{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {role.permCount} permissions
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-primary" onClick={goToMatrix}>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Matrix
                    </Button>
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
                <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Role
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeCustomRoles.map((role) => (
                <Card key={role.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: role.color }} />
                        <CardTitle className="text-sm font-semibold truncate">{role.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setEditingRole(role.id);
                            setEditForm({ name: role.name, description: role.description, color: role.color });
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-amber-600 hover:text-amber-700"
                          onClick={() => (role.userCount > 0 ? handleArchive(role.id) : handleDelete(role.id))}
                          title={role.userCount > 0 ? "Archive (has assigned users)" : "Delete"}
                        >
                          {role.userCount > 0 ? <Archive className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5 text-destructive" />}
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-xs mt-1 line-clamp-2">{role.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {role.permCount} permissions
                        </Badge>
                        {role.userCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {role.userCount} users
                          </Badge>
                        )}
                      </div>
                      {role.permCount === 0 ? (
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
              ))}
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
                          <div className="h-3 w-3 rounded-full shrink-0 opacity-50" style={{ backgroundColor: role.color }} />
                          <CardTitle className="text-sm font-semibold text-muted-foreground truncate">{role.name}</CardTitle>
                          <Badge variant="secondary" className="text-[10px]">Archived</Badge>
                        </div>
                      </div>
                      <CardDescription className="text-xs mt-1 line-clamp-2">{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {role.userCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {role.userCount} users
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleRestore(role.id)}>
                            Restore
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDelete(role.id)}
                            title="Delete permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
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
                <Input
                  id="role-name"
                  placeholder="e.g. Billing Manager"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role-desc">Description</Label>
                <Textarea
                  id="role-desc"
                  placeholder="What does this role do?"
                  rows={3}
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role-color">Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="role-color"
                    type="color"
                    value={newRole.color}
                    onChange={(e) => setNewRole({ ...newRole, color: e.target.value })}
                    className="h-9 w-12 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={newRole.color}
                    onChange={(e) => setNewRole({ ...newRole, color: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!newRole.name.trim()}>
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
              <DialogDescription>Update the name, description, or color of this role.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-color">Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="edit-color"
                    type="color"
                    value={editForm.color}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    className="h-9 w-12 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={editForm.color}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRole(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave} disabled={!editForm.name.trim()}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
