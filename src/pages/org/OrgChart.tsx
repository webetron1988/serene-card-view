import { useState } from "react";
import {
  Building2, Users, ChevronDown, ChevronRight, ZoomIn, ZoomOut,
  Maximize2, Search, Filter, Download, MoreHorizontal, UserCircle,
  X, Briefcase, MapPin, Mail, Edit2, Plus, GitBranch
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type OrgNode = {
  id: string;
  name: string;
  code: string;
  type: "holding" | "legal_entity" | "division" | "department" | "team" | "business_unit";
  head?: string;
  headTitle?: string;
  employees: number;
  location?: string;
  children?: OrgNode[];
};

const orgData: OrgNode = {
  id: "1", name: "TalentCorp Global Holdings", code: "TCG", type: "holding", head: "Alexandra Stone", headTitle: "Group CEO", employees: 1284, location: "San Francisco, CA",
  children: [
    {
      id: "2", name: "TalentCorp Inc.", code: "TCI", type: "legal_entity", head: "James Wilson", headTitle: "President", employees: 890, location: "San Francisco, CA",
      children: [
        {
          id: "5", name: "Technology Division", code: "TECH", type: "division", head: "Tom Williams", headTitle: "CTO", employees: 420, location: "San Francisco, CA",
          children: [
            { id: "10", name: "Engineering", code: "ENG", type: "department", head: "Sarah Chen", headTitle: "VP Engineering", employees: 280, location: "San Francisco, CA", children: [
              { id: "15", name: "Frontend Team", code: "FE", type: "team", head: "Mike Lee", headTitle: "Team Lead", employees: 45, location: "San Francisco, CA" },
              { id: "16", name: "Backend Team", code: "BE", type: "team", head: "Raj Patel", headTitle: "Team Lead", employees: 52, location: "San Francisco, CA" },
              { id: "17", name: "DevOps Team", code: "DO", type: "team", head: "David Kim", headTitle: "Team Lead", employees: 18, location: "Seoul, South Korea" },
            ]},
            { id: "11", name: "Product", code: "PROD", type: "department", head: "Priya Patel", headTitle: "VP Product", employees: 85, location: "San Francisco, CA", children: [
              { id: "18", name: "Product Strategy", code: "PS", type: "team", employees: 12, location: "San Francisco, CA" },
              { id: "19", name: "UX & Design", code: "UX", type: "team", employees: 24, location: "New York, NY" },
            ]},
            { id: "12", name: "AI Research", code: "AI", type: "department", employees: 55, location: "San Francisco, CA" },
          ],
        },
        {
          id: "6", name: "People & Culture", code: "HR", type: "division", head: "Lisa Park", headTitle: "CPO", employees: 68, location: "Palo Alto, CA",
          children: [
            { id: "13", name: "Talent Acquisition", code: "TA", type: "department", employees: 22, location: "Palo Alto, CA" },
            { id: "14", name: "HR Business Partners", code: "HRBP", type: "department", employees: 18, location: "Palo Alto, CA" },
            { id: "20", name: "Learning & Development", code: "LND", type: "department", employees: 12, location: "Palo Alto, CA" },
          ],
        },
        {
          id: "7", name: "Finance & Operations", code: "FIN", type: "division", employees: 120, location: "New York, NY",
          children: [
            { id: "21", name: "Finance", code: "FIN-D", type: "department", employees: 48, location: "New York, NY" },
            { id: "22", name: "Operations", code: "OPS", type: "department", employees: 35, location: "Chicago, IL" },
            { id: "23", name: "Legal & Compliance", code: "LEG", type: "department", employees: 20, location: "New York, NY" },
          ],
        },
      ],
    },
    {
      id: "3", name: "TalentCorp EMEA Ltd.", code: "TCE", type: "legal_entity", head: "Sophie Martin", headTitle: "VP EMEA", employees: 248, location: "London, UK",
      children: [
        { id: "8", name: "EMEA Sales", code: "EMEA-SALES", type: "department", employees: 95, location: "London, UK" },
        { id: "9", name: "EMEA Engineering", code: "EMEA-ENG", type: "department", employees: 110, location: "Paris, France" },
        { id: "24", name: "EMEA HR", code: "EMEA-HR", type: "department", employees: 18, location: "London, UK" },
        { id: "25", name: "Middle East & Africa", code: "MEA", type: "business_unit", head: "Fatima Al-Hassan", headTitle: "Director MEA", employees: 25, location: "Dubai, UAE" },
      ],
    },
    {
      id: "4", name: "TalentCorp APAC Pte.", code: "TCAP", type: "legal_entity", head: "Chen Wei", headTitle: "VP APAC", employees: 146, location: "Singapore",
      children: [
        { id: "26", name: "APAC Engineering", code: "APAC-ENG", type: "department", employees: 78, location: "Shanghai, China" },
        { id: "27", name: "APAC Sales", code: "APAC-SALES", type: "department", employees: 45, location: "Singapore" },
        { id: "28", name: "India Operations", code: "IND", type: "business_unit", employees: 23, location: "Mumbai, India" },
      ],
    },
  ],
};

const typeColors: Record<string, string> = {
  holding: "bg-slate-800 text-white border-slate-700",
  legal_entity: "bg-primary text-primary-foreground border-primary/80",
  division: "bg-purple-600 text-white border-purple-500",
  business_unit: "bg-indigo-600 text-white border-indigo-500",
  department: "bg-sky-600 text-white border-sky-500",
  team: "bg-emerald-600 text-white border-emerald-500",
};

const typeLabels: Record<string, string> = {
  holding: "Holding", legal_entity: "Legal Entity", division: "Division",
  business_unit: "Business Unit", department: "Department", team: "Team",
};

const typeBadgeColors: Record<string, string> = {
  holding: "bg-slate-100 text-slate-700", legal_entity: "bg-primary/10 text-primary",
  division: "bg-purple-100 text-purple-700", business_unit: "bg-indigo-100 text-indigo-700",
  department: "bg-sky-100 text-sky-700", team: "bg-emerald-100 text-emerald-700",
};

function countAll(node: OrgNode): number {
  return 1 + (node.children?.reduce((s, c) => s + countAll(c), 0) ?? 0);
}

function OrgNodeCard({ node, depth, onSelect, selectedId, searchTerm }: {
  node: OrgNode;
  depth: number;
  onSelect: (n: OrgNode) => void;
  selectedId: string | null;
  searchTerm: string;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  const matchesSearch = searchTerm && (
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (node.head && node.head.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div
        className={`relative rounded-xl border-2 shadow-sm cursor-pointer transition-all min-w-[180px] max-w-[200px]
          ${typeColors[node.type]}
          ${isSelected ? "ring-2 ring-offset-2 ring-primary scale-105 shadow-lg" : "hover:shadow-md hover:scale-[1.02]"}
          ${matchesSearch ? "ring-2 ring-yellow-400" : ""}
        `}
        onClick={() => onSelect(node)}
      >
        <div className="p-3">
          <div className="flex items-start justify-between gap-1 mb-1.5">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold opacity-70 uppercase tracking-wide">{typeLabels[node.type]}</p>
              <p className="text-sm font-bold leading-tight mt-0.5 line-clamp-2">{node.name}</p>
            </div>
            <span className="text-[10px] opacity-60 font-mono flex-shrink-0">{node.code}</span>
          </div>
          {node.head && (
            <div className="flex items-center gap-1.5 mt-2 opacity-80">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {node.head.split(" ").map(n => n[0]).join("")}
              </div>
              <p className="text-[10px] truncate">{node.head}</p>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2 opacity-70">
            <Users className="w-3 h-3" />
            <span className="text-[10px]">{node.employees} employees</span>
          </div>
        </div>
        {hasChildren && (
          <button
            className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-current flex items-center justify-center text-inherit shadow z-10 hover:scale-110 transition-transform"
            onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-8 flex gap-8 items-start relative">
          {/* Horizontal connector line */}
          {node.children!.length > 1 && (
            <div
              className="absolute top-0 left-0 right-0 h-px bg-border"
              style={{ top: 0 }}
            />
          )}
          {/* Vertical line from parent */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-border" />
          {node.children!.map((child) => (
            <div key={child.id} className="relative flex flex-col items-center">
              {/* Vertical line to child */}
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-border -translate-y-4" />
              <OrgNodeCard node={child} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} searchTerm={searchTerm} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NodeDetailPanel({ node, onClose }: { node: OrgNode; onClose: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${typeBadgeColors[node.type]}`}>
          <Building2 className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{node.name}</h3>
          <p className="text-sm text-muted-foreground">{typeLabels[node.type]} · {node.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Employees", value: node.employees.toString(), icon: Users },
          { label: "Sub-units", value: (node.children?.length ?? 0).toString(), icon: GitBranch },
          { label: "Location", value: node.location || "—", icon: MapPin },
          { label: "Total Headcount", value: countAll(node) > 1 ? `${node.employees}+` : node.employees.toString(), icon: Users },
        ].map(item => (
          <div key={item.label} className="p-3 bg-secondary/40 rounded-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
            </div>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {node.head && (
        <div className="p-3 bg-secondary/40 rounded-lg">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Unit Head</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
              {node.head.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{node.head}</p>
              <p className="text-xs text-muted-foreground">{node.headTitle}</p>
            </div>
          </div>
        </div>
      )}

      {node.children && node.children.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Sub-units ({node.children.length})</p>
          <div className="space-y-2">
            {node.children.map(c => (
              <div key={c.id} className="flex items-center justify-between p-2.5 bg-secondary/40 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={`text-[10px] ${typeBadgeColors[c.type]}`}>{typeLabels[c.type]}</Badge>
                  <span className="text-sm text-foreground">{c.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{c.employees} emp.</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button size="sm" className="flex-1" variant="outline">
          <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit Unit
        </Button>
        <Button size="sm" className="flex-1" variant="outline">
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Sub-unit
        </Button>
      </div>
    </div>
  );
}

export default function OrgChart() {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const totalUnits = countAll(orgData);

  return (
    <AppShell title="Org Chart" subtitle="Interactive organisation structure">
      <div className="flex flex-col -m-6 lg:-m-8" style={{ height: "calc(100vh - 112px)" }}>
        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-border/60 bg-card/50 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Organisation Chart</h2>
            <Badge variant="secondary" className="text-xs">{totalUnits} units</Badge>
          </div>
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search units, heads..."
              className="pl-9 w-64 h-8 text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="holding">Holding</SelectItem>
              <SelectItem value="legal_entity">Legal Entity</SelectItem>
              <SelectItem value="division">Division</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-secondary" onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}>
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-secondary" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}>
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
            <Maximize2 className="w-3.5 h-3.5 mr-2" /> Reset
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Org chart exported as PNG")}>
            <Download className="w-3.5 h-3.5 mr-2" /> Export
          </Button>
        </div>

        {/* Legend */}
        <div className="px-6 py-2 border-b border-border bg-secondary/20 flex items-center gap-4 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Legend:</span>
          {Object.entries(typeLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${key === "holding" ? "bg-slate-800" : key === "legal_entity" ? "bg-primary" : key === "division" ? "bg-purple-600" : key === "business_unit" ? "bg-indigo-600" : key === "department" ? "bg-sky-600" : "bg-emerald-600"}`} />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-8">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s" }}>
              <OrgNodeCard
                node={orgData}
                depth={0}
                onSelect={setSelectedNode}
                selectedId={selectedNode?.id ?? null}
                searchTerm={searchTerm}
              />
            </div>
          </div>

          {/* Side panel */}
          {selectedNode && (
            <div className="w-72 border-l border-border bg-card overflow-y-auto">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold">Unit Details</h3>
                <button onClick={() => setSelectedNode(null)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="p-4">
                <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
