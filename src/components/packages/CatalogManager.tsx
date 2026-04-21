import { useMemo, useState } from "react";
import {
  Plus, Pencil, Trash2, ArrowUp, ArrowDown, AlertCircle, X, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  useFeatureCatalog, FeatureCatalogItem, FeatureValueType,
} from "@/hooks/useFeatureCatalog";

const TYPE_LABELS: Record<FeatureValueType, string> = {
  boolean: "Toggle",
  limit: "Numeric limit",
  retention: "Retention (days)",
  text: "Text",
};

const TYPE_BADGE: Record<FeatureValueType, string> = {
  boolean: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  limit:   "bg-primary/10 text-primary",
  retention: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  text:    "bg-muted text-muted-foreground",
};

function slugify(s: string) {
  return s
    .replace(/[^a-zA-Z0-9 ]+/g, "")
    .trim()
    .split(/\s+/)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
}

interface DraftItem {
  id?: string;
  key: string;
  label: string;
  category: string;
  value_type: FeatureValueType;
}

export function CatalogManager() {
  const {
    items, loading, saving,
    create, update, remove,
    reorderWithinCategory, reorderCategories, inspectUsage,
  } = useFeatureCatalog();

  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<DraftItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FeatureCatalogItem | null>(null);
  const [deleteBlockedReason, setDeleteBlockedReason] = useState<string | null>(null);
  const [deleteChecking, setDeleteChecking] = useState(false);

  // Group + order
  const grouped = useMemo(() => {
    const map = new Map<string, FeatureCatalogItem[]>();
    for (const it of items) {
      if (!map.has(it.category)) map.set(it.category, []);
      map.get(it.category)!.push(it);
    }
    return Array.from(map.entries()).map(([name, list]) => ({ name, items: list }));
  }, [items]);

  const categoryOrder = grouped.map(g => g.name);

  function openCreate() {
    setDraft({
      key: "", label: "", category: grouped[0]?.name ?? "General", value_type: "boolean",
    });
    setEditorOpen(true);
  }

  function openEdit(item: FeatureCatalogItem) {
    setDraft({
      id: item.id, key: item.key, label: item.label,
      category: item.category, value_type: item.value_type,
    });
    setEditorOpen(true);
  }

  async function handleSave() {
    if (!draft) return;
    const key = draft.key.trim();
    const label = draft.label.trim();
    const category = draft.category.trim();
    if (!key || !label || !category) {
      toast.error("Key, label, and category are required");
      return;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(key)) {
      toast.error("Key must start with a letter and contain only letters, numbers, or underscores");
      return;
    }
    try {
      if (draft.id) {
        await update(draft.id, {
          label, category, value_type: draft.value_type,
          // Note: we intentionally do NOT rename the key here, since plan data is stored against it.
        });
        toast.success("Feature updated");
      } else {
        await create({ key, label, category, value_type: draft.value_type });
        toast.success("Feature added to catalog");
      }
      setEditorOpen(false);
      setDraft(null);
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    }
  }

  async function attemptDelete(item: FeatureCatalogItem) {
    setDeleteTarget(item);
    setDeleteBlockedReason(null);
    setDeleteChecking(true);
    try {
      const usage = await inspectUsage(item.key);
      const usingPlans = Array.from(new Map(
        [...usage.flagPlans, ...usage.entitlementPlans].map(p => [p.id, p])
      ).values());
      if (usingPlans.length > 0) {
        setDeleteBlockedReason(`In use by ${usingPlans.length} plan${usingPlans.length === 1 ? "" : "s"}: ${usingPlans.map(p => p.name).join(", ")}`);
      }
    } catch (e: any) {
      setDeleteBlockedReason(e.message ?? "Failed to check usage");
    } finally {
      setDeleteChecking(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteBlockedReason) return;
    try {
      await remove(deleteTarget.id);
      toast.success(`Removed "${deleteTarget.label}"`);
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message ?? "Delete failed");
    }
  }

  async function move(item: FeatureCatalogItem, dir: -1 | 1) {
    const cat = grouped.find(g => g.name === item.category);
    if (!cat) return;
    const idx = cat.items.findIndex(i => i.id === item.id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= cat.items.length) return;
    const ids = cat.items.map(i => i.id);
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    try {
      await reorderWithinCategory(item.category, ids);
    } catch (e: any) {
      toast.error(e.message ?? "Reorder failed");
    }
  }

  async function moveCategory(category: string, dir: -1 | 1) {
    const idx = categoryOrder.indexOf(category);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= categoryOrder.length) return;
    const next = [...categoryOrder];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    try {
      await reorderCategories(next);
    } catch (e: any) {
      toast.error(e.message ?? "Reorder failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Feature Catalog</h3>
          <p className="text-xs text-muted-foreground">
            Source of truth for every plan limit, toggle, and text field. Changes apply everywhere instantly.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1.5" strokeWidth={1.5} /> Add feature
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground p-12 text-center bg-card border border-border/60 rounded-xl">
          Loading catalog…
        </div>
      ) : grouped.length === 0 ? (
        <div className="text-sm text-muted-foreground p-12 text-center bg-card border border-border/60 rounded-xl">
          No features yet. Add your first feature to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((cat, catIdx) => (
            <div key={cat.name} className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-muted/30 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">{cat.name}</h4>
                  <Badge variant="outline" className="text-[10px]">{cat.items.length}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7"
                    disabled={catIdx === 0 || saving}
                    onClick={() => moveCategory(cat.name, -1)}
                    title="Move category up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7"
                    disabled={catIdx === grouped.length - 1 || saving}
                    onClick={() => moveCategory(cat.name, 1)}
                    title="Move category down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {cat.items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                      <td className="p-3 w-12">
                        <div className="flex flex-col items-center gap-0.5">
                          <Button
                            variant="ghost" size="icon" className="h-5 w-5"
                            disabled={idx === 0 || saving}
                            onClick={() => move(item, -1)}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost" size="icon" className="h-5 w-5"
                            disabled={idx === cat.items.length - 1 || saving}
                            onClick={() => move(item, 1)}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <code className="text-[10px] text-muted-foreground font-mono">{item.key}</code>
                      </td>
                      <td className="p-3 w-40">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${TYPE_BADGE[item.value_type]}`}>
                          {TYPE_LABELS[item.value_type]}
                        </span>
                      </td>
                      <td className="p-3 w-24 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => attemptDelete(item)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <Dialog open={editorOpen} onOpenChange={(v) => { setEditorOpen(v); if (!v) setDraft(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit feature" : "Add feature"}</DialogTitle>
            <DialogDescription>
              {draft?.id
                ? "Renaming the underlying key isn't allowed once the feature exists. Update label, category, or type instead."
                : "Define a new entry that every plan can configure."}
            </DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Display label</Label>
                <Input
                  value={draft.label}
                  onChange={e => {
                    const label = e.target.value;
                    setDraft(d => d && {
                      ...d,
                      label,
                      // Auto-fill key from label only on create
                      key: d.id ? d.key : (d.key === "" || d.key === slugify(d.label) ? slugify(label) : d.key),
                    });
                  }}
                  placeholder="e.g. Custom workflows"
                />
              </div>
              <div>
                <Label className="text-xs">Storage key</Label>
                <Input
                  value={draft.key}
                  onChange={e => setDraft(d => d && { ...d, key: e.target.value })}
                  disabled={!!draft.id}
                  placeholder="customWorkflows"
                  className="font-mono text-xs"
                />
                {!draft.id && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Used as the JSON property on plans. Letters, numbers, underscores. Cannot be changed later.
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <Input
                  value={draft.category}
                  onChange={e => setDraft(d => d && { ...d, category: e.target.value })}
                  placeholder="HR Modules"
                  list="catalog-categories"
                />
                <datalist id="catalog-categories">
                  {Array.from(new Set(items.map(i => i.category))).map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label className="text-xs">Value type</Label>
                <Select
                  value={draft.value_type}
                  onValueChange={v => setDraft(d => d && { ...d, value_type: v as FeatureValueType })}
                  disabled={!!draft.id}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">{TYPE_LABELS.boolean}</SelectItem>
                    <SelectItem value="limit">{TYPE_LABELS.limit}</SelectItem>
                    <SelectItem value="retention">{TYPE_LABELS.retention}</SelectItem>
                    <SelectItem value="text">{TYPE_LABELS.text}</SelectItem>
                  </SelectContent>
                </Select>
                {!!draft.id && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Type is locked once the feature exists to keep plan data consistent.
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => { setEditorOpen(false); setDraft(null); }}>
              <X className="h-3.5 w-3.5 mr-1.5" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-3.5 w-3.5 mr-1.5" /> {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) { setDeleteTarget(null); setDeleteBlockedReason(null); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.label}"?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteChecking
                ? "Checking which plans use this feature…"
                : deleteBlockedReason
                  ? "Cannot delete — at least one plan still references this feature."
                  : "This permanently removes the catalog row. Plans don't reference it, so no plan data is affected."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteBlockedReason && (
            <div className="flex gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>{deleteBlockedReason}</div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              disabled={!!deleteBlockedReason || deleteChecking || saving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}