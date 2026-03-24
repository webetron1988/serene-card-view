import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Building2, Users, Search } from "lucide-react";
import { toast } from "sonner";

interface Department { id: string; name: string; description: string; headCount: number; status: "active" | "inactive"; }

const INITIAL: Department[] = [
  { id: "d1", name: "Engineering", description: "Software development and infrastructure", headCount: 45, status: "active" },
  { id: "d2", name: "Human Resources", description: "People operations and talent acquisition", headCount: 12, status: "active" },
  { id: "d3", name: "Marketing", description: "Brand, growth and communications", headCount: 18, status: "active" },
  { id: "d4", name: "Finance", description: "Accounting, payroll and budgeting", headCount: 8, status: "active" },
  { id: "d5", name: "Sales", description: "Revenue and client relationships", headCount: 24, status: "active" },
  { id: "d6", name: "Legacy Support", description: "Deprecated — merged into Engineering", headCount: 0, status: "inactive" },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [deleting, setDeleting] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: "", description: "", status: "active" as "active" | "inactive" });

  const filtered = departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm({ name: "", description: "", status: "active" }); setDialogOpen(true); };
  const openEdit = (d: Department) => { setEditing(d); setForm({ name: d.name, description: d.description, status: d.status }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (editing) {
      setDepartments(ds => ds.map(d => d.id === editing.id ? { ...d, ...form } : d));
      toast.success(`Department "${form.name}" updated`);
    } else {
      setDepartments(ds => [...ds, { id: `d${Date.now()}`, ...form, headCount: 0 }]);
      toast.success(`Department "${form.name}" created`);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleting) return;
    setDepartments(ds => ds.filter(d => d.id !== deleting.id));
    toast.success(`Department "${deleting.name}" deleted`);
    setDeleteOpen(false); setDeleting(null);
  };

  const active = departments.filter(d => d.status === "active").length;
  const totalMembers = departments.reduce((s, d) => s + d.headCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Departments</h2>
        <p className="text-sm text-muted-foreground">Manage organizational departments used across team management.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold text-foreground">{departments.length}</p><p className="text-xs text-muted-foreground">Total Departments</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Building2 className="h-5 w-5 text-emerald-500" /></div><div><p className="text-2xl font-bold text-foreground">{active}</p><p className="text-xs text-muted-foreground">Active</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Users className="h-5 w-5 text-blue-500" /></div><div><p className="text-2xl font-bold text-foreground">{totalMembers}</p><p className="text-xs text-muted-foreground">Total Members</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">All Departments</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 w-56" /></div>
              <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Department</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead className="text-center">Members</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="w-10"></TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">{d.description}</TableCell>
                  <TableCell className="text-center">{d.headCount}</TableCell>
                  <TableCell className="text-center"><Badge variant={d.status === "active" ? "default" : "secondary"} className="text-[11px]">{d.status}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(d)}><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => { setDeleting(d); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No departments found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Department" : "Create Department"}</DialogTitle><DialogDescription>{editing ? "Update department details." : "Add a new department."}</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Engineering" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." rows={3} /></div>
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"><div><Label className="text-sm font-medium">Active</Label><p className="text-xs text-muted-foreground">Department is available for assignment</p></div><Switch checked={form.status === "active"} onCheckedChange={v => setForm(f => ({ ...f, status: v ? "active" : "inactive" }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Department</DialogTitle><DialogDescription>Are you sure you want to delete "{deleting?.name}"? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
