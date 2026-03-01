import { useState } from "react";
import {
  Database, Plus, Search, MoreHorizontal, Edit2, Trash2,
  Lock, Unlock, Globe, Building2, AlertTriangle, Download,
  X, CheckCircle2, Filter, ChevronRight, Tag, Layers
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Scope = "system" | "tenant";
type DataItem = {
  id: string;
  code: string;
  label: string;
  description: string;
  scope: Scope;
  status: "active" | "inactive";
  sortOrder: number;
  parentId?: string;
};

type DataCategory = {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  items: DataItem[];
};

const INITIAL_CATEGORIES: DataCategory[] = [
  {
    key: "domains",
    label: "Business Domains",
    icon: <Globe className="h-4 w-4" />,
    description: "Top-level business area classifications used across org structure.",
    items: [
      { id: "d1", code: "TECH", label: "Technology", description: "Engineering, software, IT operations", scope: "system", status: "active", sortOrder: 1 },
      { id: "d2", code: "FIN", label: "Finance", description: "Accounting, treasury, FP&A", scope: "system", status: "active", sortOrder: 2 },
      { id: "d3", code: "HR", label: "Human Resources", description: "People ops, talent, L&D", scope: "system", status: "active", sortOrder: 3 },
      { id: "d4", code: "OPS", label: "Operations", description: "Supply chain, logistics, facilities", scope: "system", status: "active", sortOrder: 4 },
      { id: "d5", code: "MKT", label: "Marketing", description: "Brand, digital, growth", scope: "system", status: "active", sortOrder: 5 },
      { id: "d6", code: "LEGAL", label: "Legal & Compliance", description: "Corporate law, compliance, risk", scope: "system", status: "active", sortOrder: 6 },
      { id: "d7", code: "SALES", label: "Sales", description: "Revenue, partnerships, customer success", scope: "system", status: "active", sortOrder: 7 },
      { id: "d8", code: "STRAT", label: "Strategy", description: "Corporate strategy, M&A", scope: "tenant", status: "active", sortOrder: 8 },
    ]
  },
  {
    key: "job_levels",
    label: "Job Levels",
    icon: <Layers className="h-4 w-4" />,
    description: "Organizational hierarchy levels for roles and positions.",
    items: [
      { id: "jl1", code: "L1", label: "Level 1 - Individual Contributor", description: "Junior ICs, entry level", scope: "system", status: "active", sortOrder: 1 },
      { id: "jl2", code: "L2", label: "Level 2 - Associate", description: "Associate ICs", scope: "system", status: "active", sortOrder: 2 },
      { id: "jl3", code: "L3", label: "Level 3 - Senior", description: "Senior ICs", scope: "system", status: "active", sortOrder: 3 },
      { id: "jl4", code: "L4", label: "Level 4 - Lead", description: "Tech leads and specialists", scope: "system", status: "active", sortOrder: 4 },
      { id: "jl5", code: "L5", label: "Level 5 - Principal", description: "Principal engineers, specialists", scope: "system", status: "active", sortOrder: 5 },
      { id: "jl6", code: "M1", label: "Manager", description: "Team managers", scope: "system", status: "active", sortOrder: 6 },
      { id: "jl7", code: "M2", label: "Senior Manager", description: "Senior managers", scope: "system", status: "active", sortOrder: 7 },
      { id: "jl8", code: "D1", label: "Director", description: "Directors", scope: "system", status: "active", sortOrder: 8 },
      { id: "jl9", code: "VP", label: "Vice President", description: "Vice presidents", scope: "system", status: "active", sortOrder: 9 },
      { id: "jl10", code: "C", label: "C-Suite / Executive", description: "C-level executives", scope: "system", status: "active", sortOrder: 10 },
    ]
  },
  {
    key: "employment_types",
    label: "Employment Types",
    icon: <Building2 className="h-4 w-4" />,
    description: "Types of employment relationships and contracts.",
    items: [
      { id: "et1", code: "FTE", label: "Full-Time Employee", description: "Regular full-time employment", scope: "system", status: "active", sortOrder: 1 },
      { id: "et2", code: "PTE", label: "Part-Time Employee", description: "Regular part-time employment", scope: "system", status: "active", sortOrder: 2 },
      { id: "et3", code: "CONT", label: "Contractor", description: "Independent contractor", scope: "system", status: "active", sortOrder: 3 },
      { id: "et4", code: "TEMP", label: "Temporary", description: "Fixed-term or seasonal", scope: "system", status: "active", sortOrder: 4 },
      { id: "et5", code: "INT", label: "Intern", description: "Internship programs", scope: "system", status: "active", sortOrder: 5 },
      { id: "et6", code: "CONS", label: "Consultant", description: "External consulting engagement", scope: "tenant", status: "active", sortOrder: 6 },
    ]
  },
  {
    key: "departments",
    label: "Department Types",
    icon: <Building2 className="h-4 w-4" />,
    description: "Standard department classifications.",
    items: [
      { id: "dep1", code: "ENGR", label: "Engineering", description: "Software and hardware engineering", scope: "system", status: "active", sortOrder: 1 },
      { id: "dep2", code: "PROD", label: "Product", description: "Product management and design", scope: "system", status: "active", sortOrder: 2 },
      { id: "dep3", code: "DATA", label: "Data & Analytics", description: "Data science and analytics", scope: "system", status: "active", sortOrder: 3 },
      { id: "dep4", code: "SECU", label: "Security", description: "InfoSec and cybersecurity", scope: "system", status: "active", sortOrder: 4 },
      { id: "dep5", code: "INFRA", label: "Infrastructure", description: "DevOps, SRE, cloud", scope: "system", status: "active", sortOrder: 5 },
    ]
  },
  {
    key: "currencies",
    label: "Currencies",
    icon: <Tag className="h-4 w-4" />,
    description: "Supported currencies for compensation and payroll.",
    items: [
      { id: "cur1", code: "USD", label: "US Dollar", description: "United States Dollar", scope: "system", status: "active", sortOrder: 1 },
      { id: "cur2", code: "EUR", label: "Euro", description: "European Euro", scope: "system", status: "active", sortOrder: 2 },
      { id: "cur3", code: "GBP", label: "British Pound", description: "Pound Sterling", scope: "system", status: "active", sortOrder: 3 },
      { id: "cur4", code: "SGD", label: "Singapore Dollar", description: "Singapore Dollar", scope: "system", status: "active", sortOrder: 4 },
      { id: "cur5", code: "INR", label: "Indian Rupee", description: "Indian Rupee", scope: "system", status: "active", sortOrder: 5 },
      { id: "cur6", code: "AED", label: "UAE Dirham", description: "Emirati Dirham", scope: "system", status: "active", sortOrder: 6 },
      { id: "cur7", code: "BRL", label: "Brazilian Real", description: "Brazilian Real", scope: "system", status: "active", sortOrder: 7 },
      { id: "cur8", code: "AUD", label: "Australian Dollar", description: "Australian Dollar", scope: "system", status: "active", sortOrder: 8 },
    ]
  },
  {
    key: "leave_types",
    label: "Leave Types",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Types of employee leave and absence categories.",
    items: [
      { id: "lt1", code: "ANN", label: "Annual Leave", description: "Paid annual vacation leave", scope: "system", status: "active", sortOrder: 1 },
      { id: "lt2", code: "SICK", label: "Sick Leave", description: "Medical sick days", scope: "system", status: "active", sortOrder: 2 },
      { id: "lt3", code: "MAT", label: "Maternity Leave", description: "Maternity leave", scope: "system", status: "active", sortOrder: 3 },
      { id: "lt4", code: "PAT", label: "Paternity Leave", description: "Paternity leave", scope: "system", status: "active", sortOrder: 4 },
      { id: "lt5", code: "BRVT", label: "Bereavement Leave", description: "Compassionate/bereavement leave", scope: "system", status: "active", sortOrder: 5 },
      { id: "lt6", code: "UNP", label: "Unpaid Leave", description: "Approved unpaid absence", scope: "system", status: "active", sortOrder: 6 },
      { id: "lt7", code: "STUDY", label: "Study Leave", description: "Educational leave", scope: "tenant", status: "active", sortOrder: 7 },
      { id: "lt8", code: "VOL", label: "Volunteer Leave", description: "Community volunteering days", scope: "tenant", status: "active", sortOrder: 8 },
    ]
  },
  {
    key: "skills",
    label: "Skill Categories",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Skill taxonomy categories for employee profiles and JDs.",
    items: [
      { id: "sk1", code: "SOFT", label: "Soft Skills", description: "Communication, leadership, teamwork", scope: "system", status: "active", sortOrder: 1 },
      { id: "sk2", code: "TECH_SKILL", label: "Technical Skills", description: "Engineering and technical expertise", scope: "system", status: "active", sortOrder: 2 },
      { id: "sk3", code: "MGMT", label: "Management Skills", description: "People and project management", scope: "system", status: "active", sortOrder: 3 },
      { id: "sk4", code: "LANG", label: "Languages", description: "Spoken and written language skills", scope: "system", status: "active", sortOrder: 4 },
      { id: "sk5", code: "CERT", label: "Certifications", description: "Professional certifications", scope: "system", status: "active", sortOrder: 5 },
      { id: "sk6", code: "IND", label: "Industry Knowledge", description: "Domain and industry expertise", scope: "tenant", status: "active", sortOrder: 6 },
    ]
  },
];

const emptyItem: Omit<DataItem, "id"> = {
  code: "", label: "", description: "", scope: "tenant", status: "active", sortOrder: 0
};

export default function MasterData() {
  const [categories, setCategories] = useState<DataCategory[]>(INITIAL_CATEGORIES);
  const [activeTab, setActiveTab] = useState("domains");
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState<"all" | "system" | "tenant">("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [form, setForm] = useState<Omit<DataItem, "id">>(emptyItem);

  const currentCategory = categories.find(c => c.key === activeTab)!;

  const filteredItems = currentCategory?.items.filter(item => {
    const matchSearch = !search ||
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase());
    const matchScope = scopeFilter === "all" || item.scope === scopeFilter;
    return matchSearch && matchScope;
  }) ?? [];

  function updateCategoryItems(key: string, updater: (items: DataItem[]) => DataItem[]) {
    setCategories(prev => prev.map(c => c.key === key ? { ...c, items: updater(c.items) } : c));
  }

  function openCreate() {
    setForm({ ...emptyItem, sortOrder: (currentCategory?.items.length ?? 0) + 1 });
    setCreateOpen(true);
  }

  function openEdit(item: DataItem) {
    if (item.scope === "system") {
      toast.error("System-managed items cannot be edited");
      return;
    }
    setSelectedItem(item);
    setForm({ ...item });
    setEditOpen(true);
  }

  function openDelete(item: DataItem) {
    if (item.scope === "system") {
      toast.error("System-managed items cannot be deleted");
      return;
    }
    setSelectedItem(item);
    setDeleteOpen(true);
  }

  function handleCreate() {
    const newItem: DataItem = { ...form, id: `item-${Date.now()}` };
    updateCategoryItems(activeTab, items => [...items, newItem]);
    setCreateOpen(false);
    toast.success(`"${form.label}" added to ${currentCategory.label}`);
  }

  function handleEdit() {
    if (!selectedItem) return;
    updateCategoryItems(activeTab, items =>
      items.map(i => i.id === selectedItem.id ? { ...form, id: selectedItem.id } : i)
    );
    setEditOpen(false);
    toast.success(`"${form.label}" updated`);
  }

  function handleDelete() {
    if (!selectedItem) return;
    updateCategoryItems(activeTab, items => items.filter(i => i.id !== selectedItem.id));
    setDeleteOpen(false);
    toast.success(`"${selectedItem.label}" deleted`);
  }

  function handleToggleStatus(item: DataItem) {
    if (item.scope === "system") {
      toast.error("System items cannot be toggled");
      return;
    }
    const newStatus = item.status === "active" ? "inactive" : "active";
    updateCategoryItems(activeTab, items =>
      items.map(i => i.id === item.id ? { ...i, status: newStatus } : i)
    );
    toast.success(`"${item.label}" ${newStatus === "active" ? "activated" : "deactivated"}`);
  }

  const f = (field: keyof Omit<DataItem, "id">, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <AppShell title="Master Data" subtitle="Manage platform reference data and lookup values">
      <PageHeader
        title="Master Data"
        subtitle="Reference data, lookup values, and classification taxonomies"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Export started")}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        }
      />

      <div className="flex gap-6">
        {/* Category sidebar */}
        <div className="w-56 shrink-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-2">Categories</p>
          <nav className="space-y-0.5">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === cat.key ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
              >
                <div className="flex items-center gap-2">
                  {cat.icon}
                  <span>{cat.label}</span>
                </div>
                <span className={`text-xs ${activeTab === cat.key ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {cat.items.filter(i => i.status === "active").length}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {currentCategory && (
            <>
              <div className="mb-4">
                <h3 className="font-semibold">{currentCategory.label}</h3>
                <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <Select value={scopeFilter} onValueChange={v => setScopeFilter(v as any)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scopes</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="tenant">Tenant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 px-1">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>System-managed (read-only)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Unlock className="h-3 w-3" />
                  <span>Tenant-managed (editable)</span>
                </div>
              </div>

              {/* Items table */}
              <div className="border rounded-lg overflow-hidden bg-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Label</th>
                      <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Description</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Scope</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          <Database className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p>No items found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map(item => (
                        <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="p-3">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{item.code}</code>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              {item.scope === "system" ? (
                                <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                              ) : (
                                <Unlock className="h-3 w-3 text-primary shrink-0" />
                              )}
                              <span className="font-medium">{item.label}</span>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground text-xs hidden md:table-cell">
                            {item.description}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className={item.scope === "system" ? "bg-gray-50 text-gray-600 text-xs" : "bg-blue-50 text-blue-600 text-xs"}>
                              {item.scope === "system" ? "System" : "Tenant"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <StatusBadge status={item.status === "active" ? "active" : "inactive"} />
                          </td>
                          <td className="p-3">
                            {item.scope === "tenant" ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEdit(item)}>
                                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleStatus(item)}>
                                    {item.status === "active"
                                      ? <><X className="h-4 w-4 mr-2 text-amber-600" /> Deactivate</>
                                      : <><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" /> Activate</>
                                    }
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive" onClick={() => openDelete(item)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <div className="h-7 w-7" />
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {filteredItems.length} items · {filteredItems.filter(i => i.scope === "system").length} system · {filteredItems.filter(i => i.scope === "tenant").length} tenant
              </p>
            </>
          )}
        </div>
      </div>

      {/* Create Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Item to {currentCategory?.label}</SheetTitle>
          </SheetHeader>
          <ItemForm form={form} setForm={setForm} />
          <div className="flex gap-2 mt-6">
            <Button className="flex-1" onClick={handleCreate} disabled={!form.code || !form.label}>
              Add Item
            </Button>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Item</SheetTitle>
          </SheetHeader>
          <ItemForm form={form} setForm={setForm} />
          <div className="flex gap-2 mt-6">
            <Button className="flex-1" onClick={handleEdit}>Save Changes</Button>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Item
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedItem?.label}</strong>? This may affect records referencing this value.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function ItemForm({
  form,
  setForm,
}: {
  form: Omit<DataItem, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<DataItem, "id">>>;
}) {
  const f = (field: keyof Omit<DataItem, "id">, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Code *</Label>
          <Input value={form.code} onChange={e => f("code", e.target.value.toUpperCase())} placeholder="e.g. ENG" className="mt-1 font-mono" />
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input type="number" value={form.sortOrder} onChange={e => f("sortOrder", +e.target.value)} className="mt-1" />
        </div>
        <div className="col-span-2">
          <Label>Label *</Label>
          <Input value={form.label} onChange={e => f("label", e.target.value)} placeholder="Display label" className="mt-1" />
        </div>
        <div className="col-span-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => f("description", e.target.value)} placeholder="Optional description" className="mt-1 resize-none" rows={2} />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={v => f("status", v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        <Unlock className="h-3 w-3 inline mr-1" />
        New items are tenant-managed and can be edited or deleted.
      </div>
    </div>
  );
}
