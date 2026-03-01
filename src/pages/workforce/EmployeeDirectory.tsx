import { useState } from "react";
import {
  Users, Search, Filter, Download, Upload, Plus, MoreHorizontal,
  Mail, Phone, MapPin, Building2, Briefcase, Calendar, ChevronDown,
  ChevronLeft, ChevronRight, X, Edit2, Trash2, UserCheck, UserX,
  Eye, FileText, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  Shield, Star, ExternalLink
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const avatarColors = [
  "from-primary to-primary/60", "from-purple-500 to-purple-400",
  "from-emerald-500 to-emerald-400", "from-amber-500 to-amber-400",
  "from-rose-500 to-rose-400", "from-sky-500 to-sky-400",
  "from-indigo-500 to-indigo-400", "from-pink-500 to-pink-400",
];

const sampleEmployees = [
  { id: "EMP-001", name: "Sarah Chen", email: "sarah.chen@company.com", phone: "+1 415 555 0101", department: "Engineering", jobTitle: "Senior Software Engineer", manager: "Tom Williams", location: "San Francisco, CA", status: "active", joinDate: "2021-03-15", level: "L5", employmentType: "Full-time", salary: "$145,000", skills: ["React", "TypeScript", "Node.js"], bio: "Experienced software engineer with 8 years in full-stack development." },
  { id: "EMP-002", name: "Mark Johnson", email: "mark.johnson@company.com", phone: "+1 212 555 0102", department: "HR", jobTitle: "HR Manager", manager: "Lisa Park", location: "New York, NY", status: "active", joinDate: "2019-07-20", level: "M2", employmentType: "Full-time", salary: "$110,000", skills: ["HRIS", "Talent Management", "Compliance"], bio: "HR professional with expertise in talent acquisition and employee relations." },
  { id: "EMP-003", name: "Priya Patel", email: "priya.patel@company.com", phone: "+44 20 7946 0103", department: "Product", jobTitle: "Product Manager", manager: "James Wilson", location: "London, UK", status: "active", joinDate: "2020-11-01", level: "M1", employmentType: "Full-time", salary: "£95,000", skills: ["Product Strategy", "Agile", "UX Research"], bio: "Product leader with a track record of launching successful SaaS products." },
  { id: "EMP-004", name: "Tom Williams", email: "tom.williams@company.com", phone: "+1 415 555 0104", department: "Engineering", jobTitle: "VP of Engineering", manager: "CEO", location: "San Francisco, CA", status: "active", joinDate: "2018-04-10", level: "VP", employmentType: "Full-time", salary: "$220,000", skills: ["Engineering Leadership", "Architecture", "Strategy"], bio: "Engineering executive with 15 years leading high-performing teams." },
  { id: "EMP-005", name: "Lisa Park", email: "lisa.park@company.com", phone: "+1 650 555 0105", department: "HR", jobTitle: "Chief People Officer", manager: "CEO", location: "Palo Alto, CA", status: "active", joinDate: "2017-09-05", level: "C", employmentType: "Full-time", salary: "$230,000", skills: ["People Strategy", "Culture", "Executive Leadership"], bio: "People leader focused on building world-class culture and talent programs." },
  { id: "EMP-006", name: "James Wilson", email: "james.wilson@company.com", phone: "+1 312 555 0106", department: "Product", jobTitle: "Chief Product Officer", manager: "CEO", location: "Chicago, IL", status: "active", joinDate: "2019-01-15", level: "C", employmentType: "Full-time", salary: "$210,000", skills: ["Product Vision", "Go-to-Market", "Innovation"], bio: "Product visionary with a decade of experience building enterprise SaaS." },
  { id: "EMP-007", name: "Ana Rodriguez", email: "ana.rodriguez@company.com", phone: "+34 91 555 0107", department: "Finance", jobTitle: "Finance Analyst", manager: "CFO", location: "Madrid, Spain", status: "on_leave", joinDate: "2022-02-28", level: "L2", employmentType: "Full-time", salary: "€65,000", skills: ["Financial Modeling", "Excel", "SAP"], bio: "Finance analyst specializing in FP&A and business intelligence." },
  { id: "EMP-008", name: "David Kim", email: "david.kim@company.com", phone: "+82 2 555 0108", department: "Engineering", jobTitle: "DevOps Engineer", manager: "Tom Williams", location: "Seoul, South Korea", status: "active", joinDate: "2021-06-14", level: "L4", employmentType: "Full-time", salary: "₩95,000,000", skills: ["Kubernetes", "AWS", "CI/CD"], bio: "DevOps engineer with expertise in cloud infrastructure and automation." },
  { id: "EMP-009", name: "Sophie Martin", email: "sophie.martin@company.com", phone: "+33 1 555 0109", department: "Marketing", jobTitle: "Marketing Manager", manager: "CMO", location: "Paris, France", status: "active", joinDate: "2020-08-17", level: "M1", employmentType: "Full-time", salary: "€82,000", skills: ["Digital Marketing", "Brand Strategy", "SEO"], bio: "Marketing professional with expertise in B2B SaaS growth strategies." },
  { id: "EMP-010", name: "Raj Sharma", email: "raj.sharma@company.com", phone: "+91 98 5550 0110", department: "Sales", jobTitle: "Senior Account Executive", manager: "Head of Sales", location: "Mumbai, India", status: "inactive", joinDate: "2021-10-01", level: "L4", employmentType: "Full-time", salary: "₹45,00,000", skills: ["Enterprise Sales", "CRM", "Negotiation"], bio: "Sales professional focused on enterprise accounts in the APAC region." },
  { id: "EMP-011", name: "Chen Wei", email: "chen.wei@company.com", phone: "+86 10 5550 0111", department: "Engineering", jobTitle: "Machine Learning Engineer", manager: "Tom Williams", location: "Shanghai, China", status: "active", joinDate: "2022-05-23", level: "L5", employmentType: "Full-time", salary: "¥800,000", skills: ["Python", "TensorFlow", "MLOps"], bio: "ML engineer building AI-powered features for the TalentHub platform." },
  { id: "EMP-012", name: "Fatima Al-Hassan", email: "fatima@company.com", phone: "+971 4 555 0112", department: "HR", jobTitle: "HRBP", manager: "Lisa Park", location: "Dubai, UAE", status: "active", joinDate: "2022-09-12", level: "L3", employmentType: "Full-time", salary: "AED 210,000", skills: ["HR Business Partnering", "Employee Relations", "Training"], bio: "HRBP supporting the Middle East & Africa region across all HR functions." },
];

const departments = ["All Departments", "Engineering", "HR", "Product", "Finance", "Marketing", "Sales"];
const statuses = ["All Status", "active", "inactive", "on_leave"];
const locations = ["All Locations", "San Francisco, CA", "New York, NY", "London, UK", "Paris, France", "Dubai, UAE", "Mumbai, India", "Seoul, South Korea", "Shanghai, China", "Madrid, Spain", "Palo Alto, CA", "Chicago, IL"];

const stats = [
  { label: "Total Employees", value: "1,284", icon: Users, trend: "+12 this month", trendUp: true, colorClass: "bg-primary/10 text-primary" },
  { label: "Active", value: "1,247", icon: CheckCircle2, trend: "97.1% rate", trendUp: true, colorClass: "bg-emerald-100 text-emerald-600" },
  { label: "On Leave", value: "18", icon: Clock, trend: "2 returning soon", trendUp: false, colorClass: "bg-amber-100 text-amber-600" },
  { label: "Inactive", value: "19", icon: UserX, trend: "This quarter", trendUp: false, colorClass: "bg-rose-100 text-rose-600" },
];

function EmployeeForm({ employee, onSave, onClose }: {
  employee?: typeof sampleEmployees[0] | null;
  onSave: (data: Partial<typeof sampleEmployees[0]>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    department: employee?.department || "",
    jobTitle: employee?.jobTitle || "",
    manager: employee?.manager || "",
    location: employee?.location || "",
    employmentType: employee?.employmentType || "Full-time",
    level: employee?.level || "",
    salary: employee?.salary || "",
    joinDate: employee?.joinDate || "",
    bio: employee?.bio || "",
  });

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Full Name *</Label>
          <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. John Smith" />
        </div>
        <div className="space-y-1.5">
          <Label>Email Address *</Label>
          <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@company.com" />
        </div>
        <div className="space-y-1.5">
          <Label>Phone</Label>
          <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 000 000 0000" />
        </div>
        <div className="space-y-1.5">
          <Label>Department *</Label>
          <Select value={form.department} onValueChange={v => setForm(p => ({ ...p, department: v }))}>
            <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
            <SelectContent>
              {departments.filter(d => d !== "All Departments").map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Job Title *</Label>
          <Input value={form.jobTitle} onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))} placeholder="e.g. Senior Engineer" />
        </div>
        <div className="space-y-1.5">
          <Label>Manager</Label>
          <Select value={form.manager} onValueChange={v => setForm(p => ({ ...p, manager: v }))}>
            <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
            <SelectContent>
              {sampleEmployees.map(e => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Location</Label>
          <Select value={form.location} onValueChange={v => setForm(p => ({ ...p, location: v }))}>
            <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
            <SelectContent>
              {locations.filter(l => l !== "All Locations").map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
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
          <Label>Job Level</Label>
          <Input value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} placeholder="e.g. L4, M1, VP" />
        </div>
        <div className="space-y-1.5">
          <Label>Start Date</Label>
          <Input type="date" value={form.joinDate} onChange={e => setForm(p => ({ ...p, joinDate: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Salary</Label>
          <Input value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="e.g. $120,000" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Bio / Notes</Label>
        <Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Brief description..." rows={3} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button className="flex-1" onClick={() => onSave(form)}>
          {employee ? "Save Changes" : "Add Employee"}
        </Button>
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

function EmployeeDetailDrawer({ employee, onClose, onEdit, onDeactivate }: {
  employee: typeof sampleEmployees[0];
  onClose: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColors[sampleEmployees.indexOf(employee) % avatarColors.length]} text-white flex items-center justify-center text-xl font-bold flex-shrink-0`}>
          {employee.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{employee.name}</h3>
          <p className="text-sm text-muted-foreground">{employee.jobTitle}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <StatusBadge status={employee.status} />
            <Badge variant="outline" className="text-xs">{employee.level}</Badge>
            <Badge variant="secondary" className="text-xs">{employee.employmentType}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}><Edit2 className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={onDeactivate}>
            <UserX className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
          <TabsTrigger value="employment" className="flex-1">Employment</TabsTrigger>
          <TabsTrigger value="compensation" className="flex-1">Compensation</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Email</p>
                <p className="text-sm text-foreground">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg">
              <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Phone</p>
                <p className="text-sm text-foreground">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Location</p>
                <p className="text-sm text-foreground">{employee.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg">
              <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Department</p>
                <p className="text-sm text-foreground">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg">
              <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Reports To</p>
                <p className="text-sm text-foreground">{employee.manager}</p>
              </div>
            </div>
          </div>
          {employee.bio && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">About</p>
              <p className="text-sm text-foreground leading-relaxed">{employee.bio}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {employee.skills.map(s => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="employment" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Employee ID", value: employee.id },
              { label: "Job Title", value: employee.jobTitle },
              { label: "Job Level", value: employee.level },
              { label: "Employment Type", value: employee.employmentType },
              { label: "Start Date", value: new Date(employee.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
              { label: "Tenure", value: `${Math.floor((Date.now() - new Date(employee.joinDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years` },
            ].map(item => (
              <div key={item.label} className="p-3 bg-secondary/40 rounded-lg">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compensation" className="space-y-4 mt-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Annual Salary</p>
            <p className="text-2xl font-bold text-primary">{employee.salary}</p>
          </div>
          <div className="p-3 bg-secondary/40 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Compensation details require HR Director access</p>
            <Button size="sm" variant="outline" className="w-full">
              <Shield className="w-3.5 h-3.5 mr-2" /> Request Access
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-3 mt-4">
          {[
            { action: "Profile updated", detail: "Job title changed", time: "2 days ago", icon: Edit2 },
            { action: "Role assigned", detail: "Team Lead role added", time: "1 week ago", icon: Shield },
            { action: "Review completed", detail: "Q4 2024 performance review", time: "2 months ago", icon: Star },
            { action: "Joined company", detail: `Start date: ${new Date(employee.joinDate).toLocaleDateString()}`, time: new Date(employee.joinDate).toLocaleDateString(), icon: CheckCircle2 },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState(sampleEmployees);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [viewEmployee, setViewEmployee] = useState<typeof sampleEmployees[0] | null>(null);
  const [editEmployee, setEditEmployee] = useState<typeof sampleEmployees[0] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deactivateEmployee, setDeactivateEmployee] = useState<typeof sampleEmployees[0] | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const pageSize = 10;

  const filtered = employees.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.jobTitle.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All Departments" || e.department === deptFilter;
    const matchStatus = statusFilter === "All Status" || e.status === statusFilter;
    const matchLoc = locationFilter === "All Locations" || e.location === locationFilter;
    return matchSearch && matchDept && matchStatus && matchLoc;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id: string) => setSelected(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(e => e.id));

  const handleSave = (data: Partial<typeof sampleEmployees[0]>) => {
    if (editEmployee) {
      setEmployees(p => p.map(e => e.id === editEmployee.id ? { ...e, ...data } : e));
      toast.success("Employee updated successfully");
      setEditEmployee(null);
    } else {
      const newEmp = { ...sampleEmployees[0], ...data, id: `EMP-${String(employees.length + 1).padStart(3, "0")}`, skills: [], status: "active" as const };
      setEmployees(p => [newEmp, ...p]);
      toast.success("Employee added successfully");
      setAddOpen(false);
    }
  };

  const handleDeactivate = () => {
    if (!deactivateEmployee) return;
    setEmployees(p => p.map(e => e.id === deactivateEmployee.id ? { ...e, status: e.status === "active" ? "inactive" : "active" } as typeof e : e));
    toast.success(`Employee ${deactivateEmployee.status === "active" ? "deactivated" : "activated"}`);
    setDeactivateEmployee(null);
    if (viewEmployee?.id === deactivateEmployee.id) setViewEmployee(null);
  };

  const handleDelete = (emp: typeof sampleEmployees[0]) => {
    setEmployees(p => p.filter(e => e.id !== emp.id));
    toast.success("Employee removed");
  };

  const activeFilters = [deptFilter !== "All Departments" && deptFilter, statusFilter !== "All Status" && statusFilter, locationFilter !== "All Locations" && locationFilter].filter(Boolean);

  return (
    <AppShell title="Employee Directory" subtitle="Manage your workforce">
      <div className="space-y-6">
        <PageHeader
          title="Employee Directory"
          subtitle={`${employees.length} employees across ${[...new Set(employees.map(e => e.location))].length} locations`}
          icon={Users}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
                <Upload className="w-4 h-4 mr-2" /> Import CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success("Export started — file will download shortly")}>
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Employee
              </Button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => <StatsCard key={s.label} {...s} />)}
        </div>

        {/* Search + filters */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, title, or ID..."
                className="pl-9"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            <Select value={deptFilter} onValueChange={v => { setDeptFilter(v); setPage(1); }}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
              <Filter className="w-4 h-4 mr-2" />
              More Filters
              {activeFilters.length > 0 && <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">{activeFilters.length}</Badge>}
            </Button>
            {activeFilters.length > 0 && (
              <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => { setDeptFilter("All Departments"); setStatusFilter("All Status"); setLocationFilter("All Locations"); }}>
                Clear all
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="px-4 py-2 flex gap-2 border-b border-border flex-wrap">
              {activeFilters.map(f => (
                <Badge key={f as string} variant="secondary" className="gap-1 text-xs">
                  {f}
                  <button onClick={() => {
                    if (f === deptFilter) setDeptFilter("All Departments");
                    if (f === statusFilter) setStatusFilter("All Status");
                    if (f === locationFilter) setLocationFilter("All Locations");
                  }}><X className="w-3 h-3" /></button>
                </Badge>
              ))}
            </div>
          )}

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-3">
              <span className="text-sm font-medium text-primary">{selected.length} selected</span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={() => { toast.success(`Exported ${selected.length} employees`); setSelected([]); }}>
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Export selected
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => { toast.success(`Deactivated ${selected.length} employees`); setSelected([]); }}>
                  <UserX className="w-3.5 h-3.5 mr-1.5" /> Deactivate
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="w-10 px-4 py-3">
                    <Checkbox checked={selected.length === paginated.length && paginated.length > 0} onCheckedChange={toggleAll} />
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employee</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Department</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Manager</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Joined</th>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">No employees found matching your search.</td></tr>
                ) : paginated.map((emp, i) => (
                  <tr key={emp.id} className="hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setViewEmployee(emp)}>
                    <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggleSelect(emp.id); }}>
                      <Checkbox checked={selected.includes(emp.id)} onCheckedChange={() => toggleSelect(emp.id)} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[(employees.indexOf(emp)) % avatarColors.length]} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                          {emp.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.id} · {emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="secondary" className="text-xs">{emp.department}</Badge>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{emp.jobTitle}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" /> <span className="text-xs">{emp.location}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{emp.manager}</td>
                    <td className="px-3 py-3"><StatusBadge status={emp.status} /></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{new Date(emp.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                    <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewEmployee(emp)}><Eye className="w-4 h-4 mr-2" /> View Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditEmployee(emp); }}><Edit2 className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setDeactivateEmployee(emp)} className={emp.status === "active" ? "text-destructive" : "text-emerald-600"}>
                            {emp.status === "active" ? <><UserX className="w-4 h-4 mr-2" /> Deactivate</> : <><UserCheck className="w-4 h-4 mr-2" /> Activate</>}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(emp)}><Trash2 className="w-4 h-4 mr-2" /> Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} employees
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <Button key={p} variant={page === p ? "default" : "outline"} size="sm" className="h-8 w-8 p-0 text-xs" onClick={() => setPage(p)}>
                    {p}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* View Employee Drawer */}
      <Sheet open={!!viewEmployee} onOpenChange={() => setViewEmployee(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Employee Profile</SheetTitle>
          </SheetHeader>
          {viewEmployee && (
            <EmployeeDetailDrawer
              employee={viewEmployee}
              onClose={() => setViewEmployee(null)}
              onEdit={() => { setEditEmployee(viewEmployee); setViewEmployee(null); }}
              onDeactivate={() => { setDeactivateEmployee(viewEmployee); setViewEmployee(null); }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Add Employee Drawer */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Add New Employee</SheetTitle>
          </SheetHeader>
          <EmployeeForm onSave={handleSave} onClose={() => setAddOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Edit Employee Drawer */}
      <Sheet open={!!editEmployee} onOpenChange={() => setEditEmployee(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Edit Employee</SheetTitle>
          </SheetHeader>
          {editEmployee && <EmployeeForm employee={editEmployee} onSave={handleSave} onClose={() => setEditEmployee(null)} />}
        </SheetContent>
      </Sheet>

      {/* More Filters Drawer */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent className="w-80">
          <SheetHeader className="pb-4">
            <SheetTitle>Advanced Filters</SheetTitle>
          </SheetHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="pt-4 flex gap-3">
              <Button className="flex-1" onClick={() => setFilterOpen(false)}>Apply Filters</Button>
              <Button variant="outline" className="flex-1" onClick={() => { setDeptFilter("All Departments"); setStatusFilter("All Status"); setLocationFilter("All Locations"); setFilterOpen(false); }}>Clear</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Deactivate Confirmation */}
      <Dialog open={!!deactivateEmployee} onOpenChange={() => setDeactivateEmployee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {deactivateEmployee?.status === "active" ? "Deactivate" : "Activate"} Employee
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {deactivateEmployee?.status === "active" ? "deactivate" : "activate"} <strong>{deactivateEmployee?.name}</strong>?
              {deactivateEmployee?.status === "active" && " They will lose access to the platform immediately."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateEmployee(null)}>Cancel</Button>
            <Button variant={deactivateEmployee?.status === "active" ? "destructive" : "default"} onClick={handleDeactivate}>
              {deactivateEmployee?.status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Employees via CSV</DialogTitle>
            <DialogDescription>Upload a CSV file with employee data. Download the template below to get started.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Template downloaded")}>
              <Download className="w-4 h-4 mr-2" /> Download CSV Template
            </Button>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Drop your CSV file here</p>
              <p className="text-xs text-muted-foreground">or click to browse — max 5MB</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.success("3 employees imported successfully")}>Browse Files</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Import complete"); setImportOpen(false); }}>Start Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
