import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, MoreHorizontal, Pencil, Trash2, Search, ChevronDown, ChevronRight, Tag, FolderTree, Layers } from "lucide-react";
import { toast } from "sonner";

interface SubCategory { id: string; name: string; description: string; slug: string; }
interface BotCategory { id: string; name: string; description: string; slug: string; icon: string; status: "active" | "inactive"; subcategories: SubCategory[]; }

const INITIAL: BotCategory[] = [
  { id: "c1", name: "Customer Support", description: "Bots for customer service and help desk", slug: "customer-support", icon: "🎧", status: "active", subcategories: [{ id: "s1", name: "Live Chat", description: "Real-time chat support", slug: "live-chat" }, { id: "s2", name: "FAQ Bot", description: "Automated FAQ responses", slug: "faq-bot" }] },
  { id: "c2", name: "Sales & Marketing", description: "Lead generation and sales automation", slug: "sales-marketing", icon: "💰", status: "active", subcategories: [{ id: "s3", name: "Lead Qualification", description: "Qualify leads automatically", slug: "lead-qualification" }] },
  { id: "c3", name: "HR & Recruitment", description: "Hiring and onboarding automation", slug: "hr-recruitment", icon: "👥", status: "active", subcategories: [] },
  { id: "c4", name: "IT Helpdesk", description: "Internal IT support automation", slug: "it-helpdesk", icon: "🖥️", status: "active", subcategories: [{ id: "s4", name: "Password Reset", description: "Self-service password resets", slug: "password-reset" }] },
  { id: "c5", name: "E-Commerce", description: "Shopping assistant and order tracking", slug: "e-commerce", icon: "🛒", status: "inactive", subcategories: [] },
];

const ICONS = ["📦", "🎧", "💰", "👥", "🖥️", "🛒", "🏥", "🏦", "📚", "🤖", "🎯", "📊", "⚡", "🔧", "🌐"];

export default function BotCategoriesPage() {
  const [categories, setCategories] = useState<BotCategory[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<BotCategory | null>(null);
  const [catForm, setCatForm] = useState({ name: "", description: "", slug: "", icon: "📦", status: "active" as "active" | "inactive" });
  const [scDialogOpen, setScDialogOpen] = useState(false);
  const [scParentId, setScParentId] = useState<string | null>(null);
  const [scForm, setScForm] = useState({ name: "", description: "", slug: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<{ type: "cat" | "sub"; catId: string; scId?: string; name: string } | null>(null);

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));
  const toggleExpand = (id: string) => setExpandedCats(p => ({ ...p, [id]: !p[id] }));

  const openCreateCat = () => { setEditingCat(null); setCatForm({ name: "", description: "", slug: "", icon: "📦", status: "active" }); setCatDialogOpen(true); };
  const openEditCat = (c: BotCategory) => { setEditingCat(c); setCatForm({ name: c.name, description: c.description, slug: c.slug, icon: c.icon, status: c.status }); setCatDialogOpen(true); };

  const handleSaveCat = () => {
    if (!catForm.name.trim()) { toast.error("Name is required"); return; }
    const slug = catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (editingCat) {
      setCategories(cs => cs.map(c => c.id === editingCat.id ? { ...c, ...catForm, slug } : c));
      toast.success(`Category "${catForm.name}" updated`);
    } else {
      setCategories(cs => [...cs, { id: `c${Date.now()}`, ...catForm, slug, subcategories: [] }]);
      toast.success(`Category "${catForm.name}" created`);
    }
    setCatDialogOpen(false);
  };

  const openCreateSc = (catId: string) => { setScParentId(catId); setScForm({ name: "", description: "", slug: "" }); setScDialogOpen(true); };

  const handleSaveSc = () => {
    if (!scParentId || !scForm.name.trim()) { toast.error("Name is required"); return; }
    const slug = scForm.slug || scForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setCategories(cs => cs.map(c => c.id === scParentId ? { ...c, subcategories: [...c.subcategories, { id: `s${Date.now()}`, ...scForm, slug }] } : c));
    toast.success(`Subcategory "${scForm.name}" added`);
    setScDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleting) return;
    if (deleting.type === "cat") {
      setCategories(cs => cs.filter(c => c.id !== deleting.catId));
    } else {
      setCategories(cs => cs.map(c => c.id === deleting.catId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== deleting.scId) } : c));
    }
    toast.success(`"${deleting.name}" deleted`);
    setDeleteOpen(false); setDeleting(null);
  };

  const activeCats = categories.filter(c => c.status === "active").length;
  const totalSubs = categories.reduce((s, c) => s + c.subcategories.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Bot Categories</h2>
        <p className="text-sm text-muted-foreground">Manage categories and subcategories for the bot marketplace.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><FolderTree className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold text-foreground">{categories.length}</p><p className="text-xs text-muted-foreground">Total Categories</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Tag className="h-5 w-5 text-emerald-500" /></div><div><p className="text-2xl font-bold text-foreground">{activeCats}</p><p className="text-xs text-muted-foreground">Active</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Layers className="h-5 w-5 text-blue-500" /></div><div><p className="text-2xl font-bold text-foreground">{totalSubs}</p><p className="text-xs text-muted-foreground">Subcategories</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Categories & Subcategories</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 w-56" /></div>
              <Button size="sm" onClick={openCreateCat}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          {filtered.map(cat => (
            <Collapsible key={cat.id} open={expandedCats[cat.id]} onOpenChange={() => toggleExpand(cat.id)}>
              <div className="border rounded-lg">
                <div className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                  <CollapsibleTrigger className="flex items-center gap-3 flex-1 text-left">
                    {expandedCats[cat.id] ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{cat.name}</span>
                        <Badge variant={cat.status === "active" ? "default" : "secondary"} className="text-[10px]">{cat.status}</Badge>
                        <Badge variant="outline" className="text-[10px]">{cat.subcategories.length} sub</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </div>
                  </CollapsibleTrigger>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openCreateSc(cat.id)}><Plus className="h-3.5 w-3.5 mr-2" /> Add Subcategory</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditCat(cat)}><Pencil className="h-3.5 w-3.5 mr-2" /> Edit Category</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => { setDeleting({ type: "cat", catId: cat.id, name: cat.name }); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CollapsibleContent>
                  {cat.subcategories.length > 0 && (
                    <div className="border-t">
                      {cat.subcategories.map(sc => (
                        <div key={sc.id} className="flex items-center justify-between px-4 py-2.5 pl-12 hover:bg-muted/20 transition-colors border-b last:border-0">
                          <div><p className="text-sm font-medium text-foreground">{sc.name}</p><p className="text-xs text-muted-foreground">{sc.description}</p></div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-mono">{sc.slug}</Badge>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setDeleting({ type: "sub", catId: cat.id, scId: sc.id, name: sc.name }); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {cat.subcategories.length === 0 && (
                    <div className="border-t px-4 py-4 text-center"><p className="text-xs text-muted-foreground mb-2">No subcategories yet</p><Button variant="outline" size="sm" onClick={() => openCreateSc(cat.id)}><Plus className="h-3.5 w-3.5 mr-1" /> Add Subcategory</Button></div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No categories found</div>}
        </CardContent>
      </Card>

      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCat ? "Edit Category" : "Create Category"}</DialogTitle><DialogDescription>{editingCat ? "Update category details." : "Add a new bot category."}</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Icon</Label><div className="flex flex-wrap gap-1.5 mt-1">{ICONS.map(icon => (<button key={icon} onClick={() => setCatForm(f => ({ ...f, icon }))} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors ${catForm.icon === icon ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"}`}>{icon}</button>))}</div></div>
            <div><Label>Name</Label><Input value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Customer Support" /></div>
            <div><Label>Slug</Label><Input value={catForm.slug} onChange={e => setCatForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated from name" /></div>
            <div><Label>Description</Label><Textarea value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"><div><Label className="text-sm font-medium">Active</Label><p className="text-xs text-muted-foreground">Visible in marketplace</p></div><Switch checked={catForm.status === "active"} onCheckedChange={v => setCatForm(f => ({ ...f, status: v ? "active" : "inactive" }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setCatDialogOpen(false)}>Cancel</Button><Button onClick={handleSaveCat}>{editingCat ? "Update" : "Create"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={scDialogOpen} onOpenChange={setScDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Subcategory</DialogTitle><DialogDescription>Add a subcategory to this category.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={scForm.name} onChange={e => setScForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Live Chat" /></div>
            <div><Label>Slug</Label><Input value={scForm.slug} onChange={e => setScForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" /></div>
            <div><Label>Description</Label><Textarea value={scForm.description} onChange={e => setScForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setScDialogOpen(false)}>Cancel</Button><Button onClick={handleSaveSc}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete {deleting?.type === "cat" ? "Category" : "Subcategory"}</DialogTitle><DialogDescription>Are you sure you want to delete "{deleting?.name}"?{deleting?.type === "cat" ? " All subcategories will also be removed." : ""}</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
