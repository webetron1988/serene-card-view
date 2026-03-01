import { useState } from "react";
import {
  MapPin, Plus, Search, MoreHorizontal, Edit2, Trash2,
  Globe, Building2, Home, Wifi, Users, X, AlertTriangle,
  Clock, Download, Filter, Phone, Mail, ExternalLink
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
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Location = {
  id: string;
  name: string;
  code: string;
  type: "headquarters" | "office" | "branch" | "remote_hub" | "warehouse" | "data_center";
  country: string;
  countryCode: string;
  city: string;
  state: string;
  address: string;
  postalCode: string;
  timezone: string;
  phone: string;
  email: string;
  employeeCount: number;
  capacity: number;
  status: "active" | "inactive" | "under_construction";
};

const TIMEZONES = [
  "UTC-12:00 (Baker Island)",
  "UTC-11:00 (American Samoa)",
  "UTC-10:00 (Hawaii)",
  "UTC-08:00 (Pacific)",
  "UTC-07:00 (Mountain)",
  "UTC-06:00 (Central)",
  "UTC-05:00 (Eastern)",
  "UTC-04:00 (Atlantic)",
  "UTC-03:00 (Brazil)",
  "UTC+00:00 (London/UTC)",
  "UTC+01:00 (Central Europe)",
  "UTC+02:00 (Eastern Europe)",
  "UTC+03:00 (Moscow/Riyadh)",
  "UTC+04:00 (Dubai/Baku)",
  "UTC+05:00 (Karachi)",
  "UTC+05:30 (Mumbai/Kolkata)",
  "UTC+06:00 (Dhaka)",
  "UTC+07:00 (Bangkok/Jakarta)",
  "UTC+08:00 (Singapore/Beijing)",
  "UTC+09:00 (Tokyo/Seoul)",
  "UTC+10:00 (Sydney/AEST)",
  "UTC+12:00 (Auckland)",
];

const SAMPLE_LOCATIONS: Location[] = [
  {
    id: "loc-001", name: "Global Headquarters", code: "HQ-NYC", type: "headquarters",
    country: "United States", countryCode: "US", city: "New York", state: "NY",
    address: "350 Fifth Avenue, Suite 4500", postalCode: "10118",
    timezone: "UTC-05:00 (Eastern)", phone: "+1 212-555-0100", email: "hq@talentcorp.com",
    employeeCount: 245, capacity: 300, status: "active"
  },
  {
    id: "loc-002", name: "London Office", code: "OFF-LDN", type: "office",
    country: "United Kingdom", countryCode: "GB", city: "London", state: "England",
    address: "1 Canada Square, Canary Wharf", postalCode: "E14 5AB",
    timezone: "UTC+00:00 (London/UTC)", phone: "+44 20-7555-0200", email: "london@talentcorp.com",
    employeeCount: 98, capacity: 150, status: "active"
  },
  {
    id: "loc-003", name: "Singapore APAC Hub", code: "HUB-SGP", type: "office",
    country: "Singapore", countryCode: "SG", city: "Singapore", state: "Central Region",
    address: "One Raffles Quay, North Tower, Level 35", postalCode: "048583",
    timezone: "UTC+08:00 (Singapore/Beijing)", phone: "+65 6555-0300", email: "singapore@talentcorp.com",
    employeeCount: 67, capacity: 100, status: "active"
  },
  {
    id: "loc-004", name: "Mumbai Development Center", code: "DEV-MUM", type: "office",
    country: "India", countryCode: "IN", city: "Mumbai", state: "Maharashtra",
    address: "Bandra Kurla Complex, G Block", postalCode: "400051",
    timezone: "UTC+05:30 (Mumbai/Kolkata)", phone: "+91 22-5555-0400", email: "mumbai@talentcorp.com",
    employeeCount: 134, capacity: 200, status: "active"
  },
  {
    id: "loc-005", name: "Dubai Regional Office", code: "OFF-DXB", type: "branch",
    country: "United Arab Emirates", countryCode: "AE", city: "Dubai", state: "Dubai",
    address: "DIFC Gate Building, Level 14", postalCode: "507291",
    timezone: "UTC+04:00 (Dubai/Baku)", phone: "+971 4-555-0500", email: "dubai@talentcorp.com",
    employeeCount: 42, capacity: 80, status: "active"
  },
  {
    id: "loc-006", name: "São Paulo Office", code: "OFF-SAO", type: "office",
    country: "Brazil", countryCode: "BR", city: "São Paulo", state: "SP",
    address: "Avenida Brigadeiro Faria Lima, 3500", postalCode: "04538-132",
    timezone: "UTC-03:00 (Brazil)", phone: "+55 11-5555-0600", email: "saopaulo@talentcorp.com",
    employeeCount: 31, capacity: 60, status: "active"
  },
  {
    id: "loc-007", name: "Remote Hub - Pacific", code: "REM-PAC", type: "remote_hub",
    country: "United States", countryCode: "US", city: "Los Angeles", state: "CA",
    address: "WeWork, 11601 Wilshire Blvd", postalCode: "90025",
    timezone: "UTC-08:00 (Pacific)", phone: "+1 310-555-0700", email: "la@talentcorp.com",
    employeeCount: 18, capacity: 50, status: "active"
  },
  {
    id: "loc-008", name: "Frankfurt Data Center", code: "DC-FRA", type: "data_center",
    country: "Germany", countryCode: "DE", city: "Frankfurt", state: "Hesse",
    address: "Eschborner Landstraße 100", postalCode: "60489",
    timezone: "UTC+01:00 (Central Europe)", phone: "+49 69-5555-0800", email: "datacenter@talentcorp.com",
    employeeCount: 8, capacity: 20, status: "active"
  },
  {
    id: "loc-009", name: "Tokyo Liaison Office", code: "LIA-TKY", type: "branch",
    country: "Japan", countryCode: "JP", city: "Tokyo", state: "Tokyo",
    address: "Marunouchi Building, 2-4-1 Marunouchi", postalCode: "100-6320",
    timezone: "UTC+09:00 (Tokyo/Seoul)", phone: "+81 3-5555-0900", email: "tokyo@talentcorp.com",
    employeeCount: 12, capacity: 30, status: "inactive"
  },
  {
    id: "loc-010", name: "Sydney Australia Office", code: "OFF-SYD", type: "office",
    country: "Australia", countryCode: "AU", city: "Sydney", state: "NSW",
    address: "1 Martin Place, Level 20", postalCode: "2000",
    timezone: "UTC+10:00 (Sydney/AEST)", phone: "+61 2-5555-1000", email: "sydney@talentcorp.com",
    employeeCount: 24, capacity: 40, status: "under_construction"
  },
];

const TYPE_CONFIG: Record<Location["type"], { label: string; color: string; icon: React.ReactNode }> = {
  headquarters: { label: "Headquarters", color: "bg-violet-100 text-violet-700", icon: <Building2 className="h-3 w-3" /> },
  office: { label: "Office", color: "bg-blue-100 text-blue-700", icon: <Building2 className="h-3 w-3" /> },
  branch: { label: "Branch", color: "bg-sky-100 text-sky-700", icon: <MapPin className="h-3 w-3" /> },
  remote_hub: { label: "Remote Hub", color: "bg-emerald-100 text-emerald-700", icon: <Wifi className="h-3 w-3" /> },
  warehouse: { label: "Warehouse", color: "bg-amber-100 text-amber-700", icon: <Building2 className="h-3 w-3" /> },
  data_center: { label: "Data Center", color: "bg-red-100 text-red-700", icon: <Globe className="h-3 w-3" /> },
};

const emptyLocation: Omit<Location, "id"> = {
  name: "", code: "", type: "office",
  country: "", countryCode: "", city: "", state: "",
  address: "", postalCode: "", timezone: "UTC+00:00 (London/UTC)",
  phone: "", email: "",
  employeeCount: 0, capacity: 0, status: "active"
};

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>(SAMPLE_LOCATIONS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selected, setSelected] = useState<Location | null>(null);
  const [form, setForm] = useState<Omit<Location, "id">>(emptyLocation);

  const filtered = locations.filter(loc => {
    const matchSearch = search === "" ||
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.code.toLowerCase().includes(search.toLowerCase()) ||
      loc.city.toLowerCase().includes(search.toLowerCase()) ||
      loc.country.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || loc.type === typeFilter;
    const matchStatus = statusFilter === "all" || loc.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const stats = {
    total: locations.length,
    active: locations.filter(l => l.status === "active").length,
    countries: new Set(locations.map(l => l.countryCode)).size,
    totalEmployees: locations.reduce((sum, l) => sum + l.employeeCount, 0),
  };

  function openCreate() {
    setForm(emptyLocation);
    setCreateOpen(true);
  }

  function openEdit(loc: Location) {
    setSelected(loc);
    setForm({ ...loc });
    setEditOpen(true);
  }

  function openView(loc: Location) {
    setSelected(loc);
    setViewOpen(true);
  }

  function openDelete(loc: Location) {
    setSelected(loc);
    setDeleteOpen(true);
  }

  function handleCreate() {
    const newLoc: Location = { ...form, id: `loc-${Date.now()}` };
    setLocations(prev => [newLoc, ...prev]);
    setCreateOpen(false);
    toast.success(`Location "${form.name}" created successfully`);
  }

  function handleEdit() {
    if (!selected) return;
    setLocations(prev => prev.map(l => l.id === selected.id ? { ...form, id: selected.id } : l));
    setEditOpen(false);
    toast.success(`Location "${form.name}" updated successfully`);
  }

  function handleDelete() {
    if (!selected) return;
    setLocations(prev => prev.filter(l => l.id !== selected.id));
    setDeleteOpen(false);
    toast.success(`Location "${selected.name}" deleted`);
  }

  function handleSetStatus(loc: Location, status: Location["status"]) {
    setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, status } : l));
    toast.success(`Location "${loc.name}" marked as ${status.replace("_", " ")}`);
  }

  const utilizationPct = (loc: Location) =>
    loc.capacity > 0 ? Math.round((loc.employeeCount / loc.capacity) * 100) : 0;

  return (
    <AppShell title="Locations" subtitle="Manage office locations and work sites">
      <PageHeader
        title="Locations"
        subtitle="Office locations, remote hubs, and facilities worldwide"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Export started")}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> Add Location
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Locations" value={stats.total} icon={<MapPin className="h-5 w-5" />} />
        <StatsCard title="Active Locations" value={stats.active} icon={<Building2 className="h-5 w-5" />} trend={{ value: 2, positive: true }} />
        <StatsCard title="Countries" value={stats.countries} icon={<Globe className="h-5 w-5" />} />
        <StatsCard title="Total Employees" value={stats.totalEmployees} icon={<Users className="h-5 w-5" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="headquarters">Headquarters</SelectItem>
            <SelectItem value="office">Office</SelectItem>
            <SelectItem value="branch">Branch</SelectItem>
            <SelectItem value="remote_hub">Remote Hub</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="data_center">Data Center</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="under_construction">Under Construction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left p-3 font-medium text-muted-foreground">Location</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Country / City</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Timezone</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Utilization</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>No locations found</p>
                </td>
              </tr>
            ) : (
              filtered.map(loc => {
                const typeConf = TYPE_CONFIG[loc.type];
                const util = utilizationPct(loc);
                return (
                  <tr key={loc.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer"
                    onClick={() => openView(loc)}>
                    <td className="p-3" onClick={e => e.stopPropagation()}>
                      <button className="text-left hover:text-primary" onClick={() => openView(loc)}>
                        <p className="font-medium">{loc.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{loc.code}</p>
                      </button>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeConf.color}`}>
                        {typeConf.icon}
                        {typeConf.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{loc.country}</p>
                      <p className="text-xs text-muted-foreground">{loc.city}{loc.state ? `, ${loc.state}` : ""}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />{loc.timezone}
                      </p>
                    </td>
                    <td className="p-3 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${util > 90 ? "bg-red-500" : util > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(util, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{loc.employeeCount}/{loc.capacity}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <StatusBadge
                        status={loc.status === "active" ? "active" : loc.status === "inactive" ? "inactive" : "pending"}
                        label={loc.status === "under_construction" ? "Construction" : undefined}
                      />
                    </td>
                    <td className="p-3" onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openView(loc)}>
                            <ExternalLink className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(loc)}>
                            <Edit2 className="h-4 w-4 mr-2" /> Edit Location
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {loc.status !== "active" && (
                            <DropdownMenuItem onClick={() => handleSetStatus(loc, "active")}>
                              <Globe className="h-4 w-4 mr-2 text-emerald-600" /> Set Active
                            </DropdownMenuItem>
                          )}
                          {loc.status !== "inactive" && (
                            <DropdownMenuItem onClick={() => handleSetStatus(loc, "inactive")}>
                              <X className="h-4 w-4 mr-2 text-amber-600" /> Set Inactive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => openDelete(loc)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{filtered.length} of {locations.length} locations</p>

      {/* View Details Sheet */}
      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected?.name}</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-4 space-y-4 overflow-y-auto h-[calc(100vh-120px)] pr-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_CONFIG[selected.type].color}`}>
                  {TYPE_CONFIG[selected.type].label}
                </span>
                <StatusBadge status={selected.status === "active" ? "active" : "inactive"} />
                <span className="text-xs font-mono text-muted-foreground">{selected.code}</span>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-medium text-sm">Address</h4>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p>{selected.address}</p>
                    <p>{selected.city}{selected.state ? `, ${selected.state}` : ""} {selected.postalCode}</p>
                    <p>{selected.country}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Timezone</p>
                  <p className="text-sm font-medium mt-1">{selected.timezone.split(" ")[0]}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Utilization</p>
                  <p className="text-sm font-medium mt-1">{selected.employeeCount} / {selected.capacity}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-medium text-sm">Contact</h4>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{selected.phone}</span>
                  </div>
                )}
                {selected.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{selected.email}</span>
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-medium text-sm mb-3">Capacity Overview</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${utilizationPct(selected) > 90 ? "bg-red-500" : utilizationPct(selected) > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min(utilizationPct(selected), 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{utilizationPct(selected)}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{selected.employeeCount} employees · {selected.capacity - selected.employeeCount} seats available</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => { setViewOpen(false); openEdit(selected); }}>
                  <Edit2 className="h-4 w-4 mr-1" /> Edit Location
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setViewOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Location</SheetTitle>
          </SheetHeader>
          <LocationForm form={form} setForm={setForm} />
          <div className="flex gap-2 mt-6">
            <Button className="flex-1" onClick={handleCreate} disabled={!form.name || !form.code || !form.country}>
              Create Location
            </Button>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Location</SheetTitle>
          </SheetHeader>
          <LocationForm form={form} setForm={setForm} />
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
              Delete Location
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selected?.name}</strong>? This action cannot be undone and will affect all employees and assignments linked to this location.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function LocationForm({
  form,
  setForm,
}: {
  form: Omit<Location, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Location, "id">>>;
}) {
  const f = (field: keyof Omit<Location, "id">, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>Location Name *</Label>
          <Input value={form.name} onChange={e => f("name", e.target.value)} placeholder="e.g. New York Office" className="mt-1" />
        </div>
        <div>
          <Label>Location Code *</Label>
          <Input value={form.code} onChange={e => f("code", e.target.value.toUpperCase())} placeholder="e.g. OFF-NYC" className="mt-1 font-mono" />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={v => f("type", v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="headquarters">Headquarters</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="branch">Branch</SelectItem>
              <SelectItem value="remote_hub">Remote Hub</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="data_center">Data Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />
      <p className="text-sm font-medium">Address</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>Street Address</Label>
          <Textarea value={form.address} onChange={e => f("address", e.target.value)} placeholder="Street address" className="mt-1 resize-none" rows={2} />
        </div>
        <div>
          <Label>Country *</Label>
          <Input value={form.country} onChange={e => f("country", e.target.value)} placeholder="e.g. United States" className="mt-1" />
        </div>
        <div>
          <Label>City</Label>
          <Input value={form.city} onChange={e => f("city", e.target.value)} placeholder="e.g. New York" className="mt-1" />
        </div>
        <div>
          <Label>State / Province</Label>
          <Input value={form.state} onChange={e => f("state", e.target.value)} placeholder="e.g. NY" className="mt-1" />
        </div>
        <div>
          <Label>Postal Code</Label>
          <Input value={form.postalCode} onChange={e => f("postalCode", e.target.value)} placeholder="e.g. 10001" className="mt-1" />
        </div>
      </div>

      <Separator />
      <p className="text-sm font-medium">Details</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>Timezone</Label>
          <Select value={form.timezone} onValueChange={v => f("timezone", v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {TIMEZONES.map(tz => (
                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Capacity (seats)</Label>
          <Input type="number" value={form.capacity} onChange={e => f("capacity", +e.target.value)} className="mt-1" />
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
              <SelectItem value="under_construction">Under Construction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="+1 212-555-0100" className="mt-1" />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={form.email} onChange={e => f("email", e.target.value)} placeholder="office@company.com" className="mt-1" />
        </div>
      </div>
    </div>
  );
}
