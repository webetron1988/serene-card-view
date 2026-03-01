import { useState } from "react";
import {
  Briefcase, Plus, Search, MoreHorizontal, Edit2, Trash2,
  Users, X, AlertTriangle, CheckCircle2, Clock, Download, Filter
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Position = {
  id: string;
  title: string;
  code: string;
  orgUnit: string;
  orgUnitId: string;
  reportsTo: string;
  level: string;
  employmentType: string;
  incumbentCount: number;
  maxHeadcount: number;
  isVacant: boolean;
  status: "active" | "inactive" | "archived";
  effectiveFrom: string;
};

const samplePositions: Position[] = [
  { id: "POS-001", title: "Chief Executive Officer", code: "CEO", orgUnit: "TalentCorp Global Holdings", orgUnitId: "1", reportsTo: "Board of Directors", level: "C", employmentType: "Full-time", incumbentCount: 1, maxHeadcount: 1, isVacant: false, status: "active", effectiveFrom: "2018-01-01" },
  { id: "POS-002", title: "Chief Technology Officer", code: "CTO", orgUnit: "TalentCorp Inc.", orgUnitId: "2", reportsTo: "CEO", level: "C", employmentType: "Full-time", incumbentCount: 1, maxHeadcount: 1, isVacant: false, status: "active", effectiveFrom: "2018-01-01" },
  { id: "POS-003", title: "Chief People Officer", code: "CPO", orgUnit: "TalentCorp Inc.", orgUnitId: "2", reportsTo: "CEO", level: "C", employmentType: "Full-time", incumbentCount: 1, maxHeadcount: 1, isVacant: false, status: "active", effectiveFrom: "2018-01-01" },
  { id: "POS-004", title: "VP Engineering", code: "VP-ENG", orgUnit: "Technology Division", orgUnitId: "5", reportsTo: "CTO", level: "VP", employmentType: "Full-time", incumbentCount: 1, maxHeadcount: 1, isVacant: false, status: "active", effectiveFrom: "2019-01-01" },
  { id: "POS-005", title: "VP Product", code: "VP-PROD", orgUnit: "Technology Division", orgUnitId: "5", reportsTo: "CTO", level: "VP", employmentType: "Full-time", incumbentCount: 1, maxHeadcount: 1, isVacant: false, status: "active", effectiveFrom: "2019-01-01" },
  { id: "POS-006", title: "Senior Software Engineer", code: "SSE", orgUnit: "Engineering", orgUnitId: "8", reportsTo: "VP Engineering", level: "L5", employmentType: "Full-time", incumbentCount: 45, maxHeadcount: 55, isVacant: true, status: "active", effectiveFrom: "2018-01-01" },
  { id: "POS-007", title: "Software Engineer", code: "SE", orgUnit: "Engineering", orgUnitId: "8", reportsTo: "VP Engineering", level: "L4", employmentType: "Full-time", incumbentCount: 68, maxHeadcount: 75, isVacant: true, status: "active", effectiveFrom: "2018-01-01" },
  { id: "POS-008", title: "Product Manager", code: "PM", orgUnit: "Product", orgUnitId: "9", reportsTo: "VP Product", level: "M1", employmentType: "Full-time", incumbentCount: 12, maxHeadcount: 15, isVacant: true, status: "active", effectiveFrom: "2019-01-01" },
  { id: "POS-009", title: "HR Manager", code: "HRM", orgUnit: "People & Culture", orgUnitId: "6", reportsTo: "CPO", level: "M2", employmentType: "Full-time", incumbentCount: 4, maxHeadcount: 5, isVacant: true, status: "active", effectiveFrom: "2018-01-01" },
  { id: "POS-010", title: "Machine Learning Engineer", code: "MLE", orgUnit: "AI Research", orgUnitId: "10", reportsTo: "VP Engineering", level: "L5", employmentType: "Full-time", incumbentCount: 12, maxHeadcount: 20, isVacant: true, status: "active", effectiveFrom: "2022-01-01" },
  { id: "POS-011", title: "HRBP", code: "HRBP", orgUnit: "HR Business Partners", orgUnitId: "12", reportsTo: "CPO", level: "L3", employmentType: "Full-time", incumbentCount: 8, maxHeadcount: 10, isVacant: true, status: "active", effectiveFrom: "2020-01-01" },
  { id: "POS-012", title: "DevOps Engineer", code: "DEVOPS", orgUnit: "DevOps Team", orgUnitId: "15", reportsTo: "VP Engineering", level: "L4", employmentType: "Full-time", incumbentCount: 10, maxHeadcount: 12, isVacant: true, status: "active", effectiveFrom: "2021-01-01" },
  { id: "POS-013", title: "Finance Analyst", code: "FA", orgUnit: "Finance & Operations", orgUnitId: "7", reportsTo: "CFO", level: "L2", employmentType: "Full-time", incumbentCount: 18, maxHeadcount: 20, isVacant: true, status: "active", effectiveFrom: "2018-01-01" },
  { id: "POS-014", title: "Senior Account Executive", code: "SAE", orgUnit: "EMEA Sales", orgUnitId: "8", reportsTo: "VP EMEA", level: "L4", employmentType: "Full-time", incumbentCount: 35, maxHeadcount: 40, isVacant: true, status: "active", effectiveFrom: "2019-06-01" },
];

const stats = [
  { label: "Total Positions", value: "147", icon: Briefcase, trend: "+8 this quarter", trendUp: true, colorClass: "bg-primary/10 text-primary" },
  { label: "Filled", value: "124", icon: CheckCircle2, trend: "84.4% fill rate", trendUp: true, colorClass: "bg-emerald-100 text-emerald-600" },
  { label: "Vacant", value: "23", icon: Clock, trend: "Needs hiring", trendUp: false, colorClass: "bg-amber-100 text-amber-600" },
  { label: "Headcount Cap", value: "170", icon: Users, trend: "+15 approved", trendUp: true, colorClass: "bg-sky-100 text-sky-600" },
];

function PositionForm({ position, onSave, onClose }: {
  position?: Position | null;
  onSave: (data: Partial<Position>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: position?.title || "",
    code: position?.code || "",
    orgUnit: position?.orgUnit || "",
    reportsTo: position?.reportsTo || "",
    level: position?.level || "",
    employmentType: position?.employmentType || "Full-time",
    maxHeadcount: position?.maxHeadcount || 1,
    isVacant: position?.isVacant ?? true,
    effectiveFrom: position?.effectiveFrom || new Date().toISOString().split("T")[0],
  });

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2">
          <Label>Position Title *</Label>
          <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior Software Engineer" />
        </div>
        <div className="space-y-1.5">
          <Label>Position Code *</Label>
          <Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. SSE" />
        </div>
        <div className="space-y-1.5">
          <Label>Job Level</Label>
          <Input value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} placeholder="e.g. L4, M1, VP, C" />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label>Org Unit</Label>
          <Input value={form.orgUnit} onChange={e => setForm(p => ({ ...p, orgUnit: e.target.value }))} placeholder="e.g. Engineering Department" />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label>Reports To</Label>
          <Input value={form.reportsTo} onChange={e => setForm(p => ({ ...p, reportsTo: e.target.value }))} placeholder="e.g. VP Engineering" />
        </div>
        <div className="space-y-1.5">
          <Label>Employment Type</Label>
          <Select value={form.employmentType} onValueChange={v => setForm(p => ({ ...p, employmentType: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contractor">Contractor</SelectItem>
              <SelectItem value="Intern">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Max Headcount</Label>
          <Input type="number" min="1" value={form.maxHeadcount} onChange={e => setForm(p => ({ ...p, maxHeadcount: Number(e.target.value) }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Effective From</Label>
          <Input type="date" value={form.effectiveFrom} onChange={e => setForm(p => ({ ...p, effectiveFrom: e.target.value }))} />
        </div>
        <div className="flex items-center gap-3 pt-5">
          <Switch checked={form.isVacant} onCheckedChange={v => setForm(p => ({ ...p, isVacant: v }))} />
          <Label>Mark as Vacant</Label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button className="flex-1" onClick={() => onSave({ ...form, incumbentCount: 0, orgUnitId: "", status: "active" })}>
          {position ? "Save Changes" : "Create Position"}
        </Button>
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

export default function Positions() {
  const [positions, setPositions] = useState(samplePositions);
  const [search, setSearch] = useState("");
  const [vacantFilter, setVacantFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editPosition, setEditPosition] = useState<Position | null>(null);
  const [deletePosition, setDeletePosition] = useState<Position | null>(null);

  const levels = [...new Set(samplePositions.map(p => p.level))];

  const filtered = positions.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()) || p.orgUnit.toLowerCase().includes(search.toLowerCase());
    const matchVacant = vacantFilter === "all" || (vacantFilter === "vacant" ? p.isVacant : !p.isVacant);
    const matchLevel = levelFilter === "all" || p.level === levelFilter;
    return matchSearch && matchVacant && matchLevel;
  });

  const totalVacancies = filtered.reduce((s, p) => s + (p.maxHeadcount - p.incumbentCount), 0);

  const handleSave = (data: Partial<Position>) => {
    if (editPosition) {
      setPositions(prev => prev.map(p => p.id === editPosition.id ? { ...p, ...data } : p));
      toast.success("Position updated");
      setEditPosition(null);
    } else {
      setPositions(prev => [{ ...samplePositions[0], ...data as Position, id: `POS-${String(prev.length + 1).padStart(3, "0")}` }, ...prev]);
      toast.success("Position created");
      setFormOpen(false);
    }
  };

  return (
    <AppShell title="Positions" subtitle="Manage organisation positions">
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <PageHeader
          title="Positions"
          subtitle={`${positions.length} positions · ${totalVacancies} total vacancies`}
          icon={Briefcase}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.success("Exported positions")}>
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button size="sm" onClick={() => setFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Create Position
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => <StatsCard key={s.label} {...s} />)}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search positions..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            <Select value={vacantFilter} onValueChange={setVacantFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="vacant">Vacant Only</SelectItem>
                <SelectItem value="filled">Filled Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Position</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Org Unit</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reports To</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Level</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Headcount</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(pos => {
                  const fillRate = pos.maxHeadcount > 0 ? (pos.incumbentCount / pos.maxHeadcount) * 100 : 100;
                  const vacancies = pos.maxHeadcount - pos.incumbentCount;
                  return (
                    <tr key={pos.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{pos.title}</p>
                            <p className="text-xs text-muted-foreground font-mono">{pos.code} · {pos.employmentType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-muted-foreground">{pos.orgUnit}</td>
                      <td className="px-3 py-3 text-sm text-muted-foreground">{pos.reportsTo}</td>
                      <td className="px-3 py-3">
                        <Badge variant="outline" className="text-xs font-mono">{pos.level}</Badge>
                      </td>
                      <td className="px-3 py-3 min-w-[150px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground">{pos.incumbentCount}/{pos.maxHeadcount}</span>
                            {vacancies > 0 && <span className="text-amber-600">{vacancies} open</span>}
                          </div>
                          <Progress value={fillRate} className="h-1.5" />
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={pos.status} />
                          {pos.isVacant && <Badge className="text-[10px] bg-amber-100 text-amber-700">Hiring</Badge>}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditPosition(pos)}><Edit2 className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setPositions(prev => prev.map(p => p.id === pos.id ? { ...p, isVacant: !p.isVacant } : p)); toast.success("Position status updated"); }}>
                              {pos.isVacant ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Mark Filled</> : <><Clock className="w-4 h-4 mr-2" /> Mark Vacant</>}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeletePosition(pos)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4"><SheetTitle>Create Position</SheetTitle></SheetHeader>
          <PositionForm onSave={handleSave} onClose={() => setFormOpen(false)} />
        </SheetContent>
      </Sheet>

      <Sheet open={!!editPosition} onOpenChange={v => { if (!v) setEditPosition(null); }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4"><SheetTitle>Edit Position</SheetTitle></SheetHeader>
          {editPosition && <PositionForm position={editPosition} onSave={handleSave} onClose={() => setEditPosition(null)} />}
        </SheetContent>
      </Sheet>

      <Dialog open={!!deletePosition} onOpenChange={() => setDeletePosition(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Delete Position</DialogTitle>
            <DialogDescription>Permanently delete <strong>{deletePosition?.title}</strong>? This will remove all headcount records.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePosition(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setPositions(p => p.filter(x => x.id !== deletePosition?.id)); toast.success("Position deleted"); setDeletePosition(null); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
