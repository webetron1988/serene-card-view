import { useState } from "react";
import { Save, FileText, Download, Trash2, Eye, FolderOpen, Plus, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  category: string;
  version: string;
  status: "active" | "draft" | "archived";
  lastUpdated: string;
  size: string;
  accessLevel: "platform" | "tenant" | "public";
}

const defaultDocuments: Document[] = [
  { id: "1", name: "Terms of Service", category: "Legal", version: "3.2", status: "active", lastUpdated: "2026-03-15", size: "245 KB", accessLevel: "public" },
  { id: "2", name: "Privacy Policy", category: "Legal", version: "2.8", status: "active", lastUpdated: "2026-03-10", size: "180 KB", accessLevel: "public" },
  { id: "3", name: "Data Processing Agreement", category: "Compliance", version: "1.5", status: "active", lastUpdated: "2026-02-28", size: "320 KB", accessLevel: "tenant" },
  { id: "4", name: "Employee Handbook Template", category: "HR Templates", version: "4.1", status: "active", lastUpdated: "2026-03-01", size: "1.2 MB", accessLevel: "tenant" },
  { id: "5", name: "Acceptable Use Policy", category: "Security", version: "2.0", status: "active", lastUpdated: "2026-01-20", size: "95 KB", accessLevel: "platform" },
  { id: "6", name: "Incident Response Plan", category: "Security", version: "1.3", status: "active", lastUpdated: "2026-02-15", size: "410 KB", accessLevel: "platform" },
  { id: "7", name: "Onboarding Checklist", category: "HR Templates", version: "3.0", status: "active", lastUpdated: "2026-03-05", size: "78 KB", accessLevel: "tenant" },
  { id: "8", name: "GDPR Compliance Guide", category: "Compliance", version: "1.1", status: "draft", lastUpdated: "2026-03-12", size: "560 KB", accessLevel: "platform" },
  { id: "9", name: "Performance Review Template", category: "HR Templates", version: "2.4", status: "active", lastUpdated: "2026-02-20", size: "150 KB", accessLevel: "tenant" },
  { id: "10", name: "SOC 2 Audit Report", category: "Compliance", version: "1.0", status: "archived", lastUpdated: "2025-12-01", size: "2.8 MB", accessLevel: "platform" },
];

export default function DocumentVaultPage() {
  const [documents] = useState(defaultDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [vaultSettings, setVaultSettings] = useState({
    versioningEnabled: true,
    maxVersions: "10",
    requireApproval: true,
    autoArchiveDays: "365",
    encryptAtRest: true,
    watermarkEnabled: false,
    maxFileSize: "25",
    allowedFormats: "pdf,docx,xlsx,pptx,txt,csv",
  });

  const categories = ["all", ...Array.from(new Set(documents.map(d => d.category)))];
  const filtered = documents
    .filter(d => categoryFilter === "all" || d.category === categoryFilter)
    .filter(d => statusFilter === "all" || d.status === statusFilter)
    .filter(d => !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const statusColor = (s: string) => {
    if (s === "active") return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (s === "draft") return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-muted-foreground bg-muted/50 border-border";
  };

  const accessColor = (a: string) => {
    if (a === "public") return "text-blue-600 bg-blue-50 border-blue-200";
    if (a === "tenant") return "text-purple-600 bg-purple-50 border-purple-200";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Document Vault</h3>
        <p className="text-sm text-muted-foreground mt-1">Manage platform policy documents, templates, and compliance artifacts with version control.</p>
      </div>

      {/* Vault Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Vault Configuration
          </CardTitle>
          <CardDescription className="text-xs">Document storage, versioning, and access control settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "versioningEnabled", label: "Version Control", desc: "Track all document revisions." },
              { key: "requireApproval", label: "Require Approval", desc: "Documents need admin approval before publishing." },
              { key: "encryptAtRest", label: "Encrypt at Rest", desc: "Encrypt all stored documents." },
              { key: "watermarkEnabled", label: "Watermark Downloads", desc: "Add tenant/user watermark to downloaded files." },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Switch checked={vaultSettings[item.key as keyof typeof vaultSettings] as boolean} onCheckedChange={(v) => setVaultSettings(s => ({ ...s, [item.key]: v }))} />
              </div>
            ))}
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Max Versions</Label>
              <Input type="number" value={vaultSettings.maxVersions} onChange={(e) => setVaultSettings(s => ({ ...s, maxVersions: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Auto-Archive (days)</Label>
              <Input type="number" value={vaultSettings.autoArchiveDays} onChange={(e) => setVaultSettings(s => ({ ...s, autoArchiveDays: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max File Size (MB)</Label>
              <Input type="number" value={vaultSettings.maxFileSize} onChange={(e) => setVaultSettings(s => ({ ...s, maxFileSize: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Allowed Formats</Label>
            <Input value={vaultSettings.allowedFormats} onChange={(e) => setVaultSettings(s => ({ ...s, allowedFormats: e.target.value }))} className="text-sm" placeholder="pdf,docx,xlsx,..." />
            <p className="text-[10px] text-muted-foreground">Comma-separated file extensions.</p>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Vault configuration saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Library */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Document Library
              </CardTitle>
              <CardDescription className="text-xs mt-1">{documents.length} documents · {documents.filter(d => d.status === "active").length} active</CardDescription>
            </div>
            <Button size="sm" className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              <Input placeholder="Search documents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="text-sm pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="text-sm w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-sm w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Document List */}
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr,100px,60px,80px,80px,100px] gap-2 px-4 py-2.5 bg-muted/50 border-b text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Document</span>
              <span>Category</span>
              <span>Ver</span>
              <span>Status</span>
              <span>Access</span>
              <span className="text-right">Actions</span>
            </div>
            {filtered.map((doc, i) => (
              <div key={doc.id} className={`grid grid-cols-[1fr,100px,60px,80px,80px,100px] gap-2 px-4 py-3 items-center ${i < filtered.length - 1 ? "border-b" : ""}`}>
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{doc.lastUpdated} · {doc.size}</p>
                </div>
                <span className="text-xs text-muted-foreground">{doc.category}</span>
                <span className="text-xs font-mono text-muted-foreground">v{doc.version}</span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 w-fit ${statusColor(doc.status)}`}>{doc.status}</Badge>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 w-fit ${accessColor(doc.accessLevel)}`}>{doc.accessLevel}</Badge>
                <div className="flex justify-end gap-1">
                  <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="View">
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Download">
                    <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}