import { useState } from "react";
import {
  Building2, Plus, Search, Filter, MoreHorizontal, Edit2, Trash2,
  ChevronRight, ChevronDown, Users, MapPin, X, AlertTriangle,
  GitBranch, CheckCircle2, Archive, RefreshCw, Download
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type UnitType = "holding" | "legal_entity" | "division" | "business_unit" | "department" | "section" | "team";

type OrgUnit = {
  id: string;
  name: string;
  code: string;
  type: UnitType;
  parent: string;
  parentId: string;
  head: string;
  employees: number;
  location: string;
  status: "active" | "inactive" | "archived";
  effectiveFrom: string;
  effectiveTo?: string;
  level: number;
};

const sampleUnits: OrgUnit[] = [
  { id: "1", name: "TalentCorp Global Holdings", code: "TCG", type: "holding", parent: "—", parentId: "", head: "Alexandra Stone", employees: 1284, location: "San Francisco, CA", status: "active", effectiveFrom: "2018-01-01", level: 0 },
  { id: "2", name: "TalentCorp Inc.", code: "TCI", type: "legal_entity", parent: "TalentCorp Global Holdings", parentId: "1", head: "James Wilson", employees: 890, location: "San Francisco, CA", status: "active", effectiveFrom: "2018-01-01", level: 1 },
  { id: "3", name: "TalentCorp EMEA Ltd.", code: "TCE", type: "legal_entity", parent: "TalentCorp Global Holdings", parentId: "1", head: "Sophie Martin", employees: 248, location: "London, UK", status: "active", effectiveFrom: "2019-06-01", level: 1 },
  { id: "4", name: "TalentCorp APAC Pte.", code: "TCAP", type: "legal_entity", parent: "TalentCorp Global Holdings", parentId: "1", head: "Chen Wei", employees: 146, location: "Singapore", status: "active", effectiveFrom: "2020-03-01", level: 1 },
  { id: "5", name: "Technology Division", code: "TECH", type: "division", parent: "TalentCorp Inc.", parentId: "2", head: "Tom Williams", employees: 420, location: "San Francisco, CA", status: "active", effectiveFrom: "2018-01-01", level: 2 },
  { id: "6", name: "People & Culture", code: "HR", type: "division", parent: "TalentCorp Inc.", parentId: "2", head: "Lisa Park", employees: 68, location: "Palo Alto, CA", status: "active", effectiveFrom: "2018-01-01", level: 2 },
  { id: "7", name: "Finance & Operations", code: "FIN", type: "division", parent: "TalentCorp Inc.", parentId: "2", head: "CFO", employees: 120, location: "New York, NY", status: "active", effectiveFrom: "2018-01-01", level: 2 },
  { id: "8", name: "Engineering", code: "ENG", type: "department", parent: "Technology Division", parentId: "5", head: "Sarah Chen", employees: 280, location: "San Francisco, CA", status: "active", effectiveFrom: "2018-01-01", level: 3 },
  { id: "9", name: "Product", code: "PROD", type: "department", parent: "Technology Division", parentId: "5", head: "Priya Patel", employees: 85, location: "San Francisco, CA", status: "active", effectiveFrom: "2018-01-01", level: 3 },
  { id: "10", name: "AI Research", code: "AI", type: "department", parent: "Technology Division", parentId: "5", head: "TBD", employees: 55, location: "San Francisco, CA", status: "active", effectiveFrom: "2022-01-01", level: 3 },
  { id: "11", name: "Talent Acquisition", code: "TA", type: "department", parent: "People & Culture", parentId: "6", head: "HR Manager", employees: 22, location: "Palo Alto, CA", status: "active", effectiveFrom: "2018-01-01", level: 3 },
  { id: "12", name: "HR Business Partners", code: "HRBP", type: "department", parent: "People & Culture", parentId: "6", head: "Fatima Al-Hassan", employees: 18, location: "Palo Alto, CA", status: "active", effectiveFrom: "2018-01-01", level: 3 },
  { id: "13", name: "Frontend Team", code: "FE", type: "team", parent: "Engineering", parentId: "8", head: "Mike Lee", employees: 45, location: "San Francisco, CA", status: "active", effectiveFrom: "2019-01-01", level: 4 },
  { id: "14", name: "Backend Team", code: "BE", type: "team", parent: "Engineering", parentId: "8", head: "Raj Patel", employees: 52, location: "San Francisco, CA", status: "active", effectiveFrom: "2019-01-01", level: 4 },
  { id: "15", name: "DevOps Team", code: "DO", type: "team", parent: "Engineering", parentId: "8", head: "David Kim", employees: 18, location: "Seoul, South Korea", status: "active", effectiveFrom: "2021-01-01", level: 4 },
  { id: "16", name: "Legacy Systems", code: "LEG-SYS", type: "department", parent: "Technology Division", parentId: "5", head: "—", employees: 0, location: "San Francisco, CA", status: "archived", effectiveFrom: "2018-01-01", effectiveTo: "2023-12-31", level: 3 },
];

const typeColors: Record<UnitType, string> = {
  holding: "bg-slate-100 text-slate-700", legal_entity: "bg-primary/10 text-primary",
  division: "bg-purple-100 text-purple-700", business_unit: "bg-indigo-100 text-indigo-700",
  department: "bg-sky-100 text-sky-700", section: "bg-teal-100 text-teal-700", team: "bg-emerald-100 text-emerald-700",
};

const unitTypes: UnitType[] = ["holding", "legal_entity", "division", "business_unit", "department", "section", "team"];

const stats = [
  { label: "Total Units", value: "38", icon: Building2, trend: "+3 this quarter", trendUp: true, colorClass: "bg-primary/10 text-primary" },
  { label: "Active", value: "35", icon: CheckCircle2, trend: "92.1% active", trendUp: true, colorClass: "bg-emerald-100 text-emerald-600" },
  { label: "Departments", value: "12", icon: GitBranch, trend: "Across 3 regions", trendUp: true, colorClass: "bg-sky-100 text-sky-600" },
  { label: "Teams", value: "18", icon: Users, trend: "+5 this year", trendUp: true, colorClass: "bg-purple-100 text-purple-600" },
];

function UnitForm({ unit, onSave, onClose }: {
  unit?: OrgUnit | null;
  onSave: (data: Partial<OrgUnit>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: unit?.name || "",
    code: unit?.code || "",
    type: unit?.type || "department",
    parentId: unit?.parentId || "",
    head: unit?.head || "",
    location: unit?.location || "",
    effectiveFrom: unit?.effectiveFrom || new Date().toISOString().split("T")[0],
    effectiveTo: unit?.effectiveTo || "",
  });

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2">
          <Label>Unit Name *</Label>
          <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Engineering Department" />
        </div>
        <div className="space-y-1.5">
          <Label>Unit Code *</Label>
          <Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. ENG" maxLength={20} />
        </div>
        <div className="space-y-1.5">
          <Label>Unit Type *</Label>
          <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as UnitType }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {unitTypes.map(t => <SelectItem key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label>Parent Unit</Label>
          <Select value={form.parentId} onValueChange={v => setForm(p => ({ ...p, parentId: v }))}>
            <SelectTrigger><SelectValue placeholder="Select parent unit (root if blank)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">— Root (No parent)</SelectItem>
              {sampleUnits.filter(u => u.id !== unit?.id).map(u => (
                <SelectItem key={u.id} value={u.id}>
                  {"  ".repeat(u.level)}{u.name} ({u.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label>Unit Head</Label>
          <Input value={form.head} onChange={e => setForm(p => ({ ...p, head: e.target.value }))} placeholder="e.g. John Smith" />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label>Location</Label>
          <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. San Francisco, CA" />
        </div>
        <div className="space-y-1.5">
          <Label>Effective From</Label>
          <Input type="date" value={form.effectiveFrom} onChange={e => setForm(p => ({ ...p, effectiveFrom: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Effective To (optional)</Label>
          <Input type="date" value={form.effectiveTo} onChange={e => setForm(p => ({ ...p, effectiveTo: e.target.value }))} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button className="flex-1" onClick={() => onSave({ ...form, parent: sampleUnits.find(u => u.id === form.parentId)?.name || "—" })}>
          {unit ? "Save Changes" : "Create Unit"}
        </Button>
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

export default function OrgUnits() {
  const [units, setUnits] = useState(sampleUnits);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [selected, setSelected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "tree">("table");
  const [formOpen, setFormOpen] = useState(false);
  const [editUnit, setEditUnit] = useState<OrgUnit | null>(null);
  const [deleteUnit, setDeleteUnit] = useState<OrgUnit | null>(null);
  const [archiveUnit, setArchiveUnit] = useState<OrgUnit | null>(null);

  const filtered = units.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.code.toLowerCase().includes(search.toLowerCase()) || u.head.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || u.type === typeFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleSave = (data: Partial<OrgUnit>) => {
    if (editUnit) {
      setUnits(p => p.map(u => u.id === editUnit.id ? { ...u, ...data } : u));
      toast.success("Org unit updated");
      setEditUnit(null);
    } else {
      const newUnit: OrgUnit = { ...sampleUnits[0], ...data as OrgUnit, id: String(Date.now()), status: "active", employees: 0, level: 1 };
      setUnits(p => [...p, newUnit]);
      toast.success("Org unit created");
      setFormOpen(false);
    }
  };

  const handleArchive = () => {
    if (!archiveUnit) return;
    setUnits(p => p.map(u => u.id === archiveUnit.id ? { ...u, status: "archived" } : u));
    toast.success(`"${archiveUnit.name}" archived`);
    setArchiveUnit(null);
  };

  const handleDelete = () => {
    if (!deleteUnit) return;
    setUnits(p => p.filter(u => u.id !== deleteUnit.id));
    toast.success(`"${deleteUnit.name}" deleted`);
    setDeleteUnit(null);
  };

  return (
    <AppShell title="Org Units" subtitle="Organisation structure management">
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <PageHeader
          title="Organisation Units"
          subtitle={`${units.filter(u => u.status === "active").length} active units across the organisation`}
          icon={Building2}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.success("Exported units to CSV")}>
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button size="sm" onClick={() => setFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Unit
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => <StatsCard key={s.label} {...s} />)}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search units..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {unitTypes.map(t => <SelectItem key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Unit Name</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Parent</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Head</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employees</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Effective</th>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">No org units found.</td></tr>
                ) : filtered.map(unit => (
                  <tr key={unit.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" style={{ paddingLeft: `${unit.level * 20}px` }}>
                        <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">{unit.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{unit.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge className={`text-xs ${typeColors[unit.type]}`} variant="outline">
                        {unit.type.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{unit.parent}</td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{unit.head || "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm">{unit.employees}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {unit.location}
                      </div>
                    </td>
                    <td className="px-3 py-3"><StatusBadge status={unit.status} /></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {new Date(unit.effectiveFrom).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      {unit.effectiveTo && ` → ${new Date(unit.effectiveTo).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                    </td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditUnit(unit)}><Edit2 className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { const newChild: OrgUnit = { id: String(Date.now()), name: "", code: "", type: "department", parent: unit.name, parentId: unit.id, head: "", employees: 0, location: unit.location, status: "active", effectiveFrom: new Date().toISOString().split("T")[0], level: unit.level + 1 }; setEditUnit(newChild); setFormOpen(true); }}>
                            <Plus className="w-4 h-4 mr-2" /> Add Sub-unit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setArchiveUnit(unit)} className="text-amber-600">
                            <Archive className="w-4 h-4 mr-2" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteUnit(unit)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Form */}
      <Sheet open={formOpen && !editUnit} onOpenChange={v => { if (!v) setFormOpen(false); }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4"><SheetTitle>Create Org Unit</SheetTitle></SheetHeader>
          <UnitForm onSave={handleSave} onClose={() => setFormOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Edit Form */}
      <Sheet open={!!editUnit} onOpenChange={v => { if (!v) setEditUnit(null); }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4"><SheetTitle>Edit Org Unit</SheetTitle></SheetHeader>
          {editUnit && <UnitForm unit={editUnit} onSave={handleSave} onClose={() => setEditUnit(null)} />}
        </SheetContent>
      </Sheet>

      {/* Archive Confirmation */}
      <Dialog open={!!archiveUnit} onOpenChange={() => setArchiveUnit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Archive className="w-5 h-5 text-amber-500" /> Archive Org Unit</DialogTitle>
            <DialogDescription>Archive <strong>{archiveUnit?.name}</strong>? The unit will be deactivated but preserved for historical records.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveUnit(null)}>Cancel</Button>
            <Button className="bg-amber-500 hover:bg-amber-600" onClick={handleArchive}>Archive Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteUnit} onOpenChange={() => setDeleteUnit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Delete Org Unit</DialogTitle>
            <DialogDescription>Permanently delete <strong>{deleteUnit?.name}</strong>? This cannot be undone and will affect {deleteUnit?.employees} employees.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUnit(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
