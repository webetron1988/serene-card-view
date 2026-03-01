import { useState } from "react";
import {
  Store, Search, Star, Download, Eye, Package,
  CheckCircle2, Lock, Zap, Globe, Users, BarChart3,
  BookOpen, Shield, Settings2, Plus, X, Filter,
  ArrowRight, Tag, Clock, Layers, ExternalLink, Heart
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type LibraryCategory =
  | "hr_core" | "recruitment" | "learning" | "performance" | "payroll"
  | "analytics" | "compliance" | "integrations" | "utilities";

type Library = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: LibraryCategory;
  version: string;
  publisher: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  tags: string[];
  price: "free" | "included" | number;
  installed: boolean;
  featured: boolean;
  new: boolean;
  icon: string;
  screenshots: string[];
  features: string[];
  requirements: string[];
  lastUpdated: string;
};

const CATEGORY_CONFIG: Record<LibraryCategory, { label: string; color: string; icon: React.ReactNode }> = {
  hr_core: { label: "HR Core", color: "bg-violet-100 text-violet-700", icon: <Users className="h-4 w-4" /> },
  recruitment: { label: "Recruitment", color: "bg-blue-100 text-blue-700", icon: <Zap className="h-4 w-4" /> },
  learning: { label: "Learning & Dev", color: "bg-emerald-100 text-emerald-700", icon: <BookOpen className="h-4 w-4" /> },
  performance: { label: "Performance", color: "bg-amber-100 text-amber-700", icon: <BarChart3 className="h-4 w-4" /> },
  payroll: { label: "Payroll", color: "bg-rose-100 text-rose-700", icon: <Layers className="h-4 w-4" /> },
  analytics: { label: "Analytics", color: "bg-sky-100 text-sky-700", icon: <BarChart3 className="h-4 w-4" /> },
  compliance: { label: "Compliance", color: "bg-red-100 text-red-700", icon: <Shield className="h-4 w-4" /> },
  integrations: { label: "Integrations", color: "bg-indigo-100 text-indigo-700", icon: <Globe className="h-4 w-4" /> },
  utilities: { label: "Utilities", color: "bg-gray-100 text-gray-700", icon: <Settings2 className="h-4 w-4" /> },
};

const SAMPLE_LIBRARIES: Library[] = [
  {
    id: "lib-001", name: "Smart Onboarding Flow", description: "Automated employee onboarding with task checklists, document collection, and welcome emails.",
    longDescription: "Transform your onboarding experience with intelligent automation. This library provides a complete onboarding workflow engine that guides new hires through every step—from document collection to equipment setup. Includes customizable checklists, automated reminders, e-signature integration, and real-time progress tracking for HR teams.",
    category: "hr_core", version: "2.4.1", publisher: "TalentHub Core", rating: 4.8, reviewCount: 342,
    downloads: 12450, tags: ["onboarding", "automation", "workflow", "documents"],
    price: "included", installed: true, featured: true, new: false, icon: "🚀",
    screenshots: [], features: ["Automated task assignment", "Document collection & e-sign", "Welcome email sequences", "Progress dashboard", "Custom checklist builder", "Slack/Teams notifications"],
    requirements: ["TalentHub Core 2.0+"], lastUpdated: "2024-01-15"
  },
  {
    id: "lib-002", name: "AI Resume Parser", description: "Parse and extract structured data from resumes using advanced AI models.",
    longDescription: "Leverage cutting-edge AI to automatically extract and structure candidate information from resumes in any format. Supports PDF, Word, and plain text. Integrates directly with your recruitment pipeline to populate candidate profiles instantly.",
    category: "recruitment", version: "1.2.0", publisher: "TalentHub AI", rating: 4.6, reviewCount: 178,
    downloads: 8920, tags: ["AI", "recruitment", "resume", "parsing", "automation"],
    price: 49, installed: false, featured: true, new: false, icon: "🤖",
    screenshots: [], features: ["Multi-format support (PDF, DOCX)", "95%+ extraction accuracy", "Skills taxonomy mapping", "Bulk processing mode", "API webhook support"],
    requirements: ["TalentHub Core 2.0+", "Recruitment Module"], lastUpdated: "2024-02-01"
  },
  {
    id: "lib-003", name: "360° Feedback Suite", description: "Comprehensive peer review and 360-degree feedback management system.",
    longDescription: "Build a culture of continuous feedback with a powerful 360-degree review system. Create custom review cycles, manage multi-rater feedback, and generate insightful reports that help employees grow and managers make informed decisions.",
    category: "performance", version: "3.1.0", publisher: "TalentHub Core", rating: 4.9, reviewCount: 512,
    downloads: 21300, tags: ["performance", "feedback", "reviews", "360"],
    price: "included", installed: true, featured: false, new: false, icon: "⭐",
    screenshots: [], features: ["Custom review templates", "Anonymous feedback option", "Automated reminders", "Visual reports & heatmaps", "Goal alignment tracking", "Manager calibration tools"],
    requirements: ["Performance Module"], lastUpdated: "2024-01-20"
  },
  {
    id: "lib-004", name: "Learning Path Builder", description: "Create structured learning journeys with content curation, quizzes, and certifications.",
    longDescription: "Design engaging learning experiences that drive skill development. Build custom learning paths that combine internal content, external courses (LinkedIn Learning, Coursera), and hands-on assessments. Track completion and award certificates automatically.",
    category: "learning", version: "2.0.5", publisher: "EduTech Partner", rating: 4.5, reviewCount: 89,
    downloads: 4200, tags: ["learning", "LMS", "training", "certifications", "skills"],
    price: 99, installed: false, featured: false, new: true, icon: "📚",
    screenshots: [], features: ["Drag-and-drop path builder", "External content integration", "Quiz & assessment engine", "Certification management", "Completion tracking", "SCORM compatible"],
    requirements: ["TalentHub Core 2.0+", "Learning Module"], lastUpdated: "2024-02-10"
  },
  {
    id: "lib-005", name: "Payroll Reconciliation", description: "Automated payroll data validation and reconciliation with detailed variance reports.",
    longDescription: "Eliminate manual payroll errors with intelligent reconciliation. Automatically validates payroll data against HR records, flags discrepancies, and generates detailed variance reports. Supports multi-currency and multi-country payroll structures.",
    category: "payroll", version: "1.5.2", publisher: "FinHR Systems", rating: 4.7, reviewCount: 203,
    downloads: 9100, tags: ["payroll", "finance", "reconciliation", "compliance"],
    price: 149, installed: false, featured: false, new: false, icon: "💰",
    screenshots: [], features: ["Multi-currency support", "Variance detection & alerts", "Audit trail", "GL export", "Bank reconciliation", "Tax compliance checks"],
    requirements: ["Payroll Module", "Finance Integration"], lastUpdated: "2024-01-08"
  },
  {
    id: "lib-006", name: "Workforce Analytics Pro", description: "Advanced HR analytics with predictive insights, attrition modeling, and executive dashboards.",
    longDescription: "Make data-driven workforce decisions with advanced analytics. Includes real-time dashboards, predictive attrition modeling, headcount forecasting, and custom report builders. Connect to your existing BI tools via API.",
    category: "analytics", version: "4.0.0", publisher: "DataHR Inc.", rating: 4.9, reviewCount: 678,
    downloads: 31200, tags: ["analytics", "BI", "predictive", "dashboard", "reporting"],
    price: 199, installed: false, featured: true, new: false, icon: "📊",
    screenshots: [], features: ["Pre-built executive dashboards", "Attrition prediction model", "Headcount forecasting", "Custom report builder", "Power BI / Tableau export", "Real-time KPI tracking"],
    requirements: ["TalentHub Core 2.0+"], lastUpdated: "2024-02-05"
  },
  {
    id: "lib-007", name: "GDPR Compliance Toolkit", description: "Data privacy management tools to ensure GDPR and global data protection compliance.",
    longDescription: "Stay compliant with evolving data privacy regulations. This toolkit provides automated data subject request handling, consent management, data retention policies, and comprehensive audit logs for GDPR, CCPA, and other privacy frameworks.",
    category: "compliance", version: "2.2.1", publisher: "LegalTech Corp", rating: 4.4, reviewCount: 156,
    downloads: 7800, tags: ["GDPR", "compliance", "privacy", "data protection"],
    price: 79, installed: true, featured: false, new: false, icon: "🔒",
    screenshots: [], features: ["Automated DSR handling", "Consent management", "Data retention automation", "Privacy impact assessments", "Right to erasure workflows", "Compliance reports"],
    requirements: ["TalentHub Core 2.0+"], lastUpdated: "2024-01-25"
  },
  {
    id: "lib-008", name: "Slack Integration Pack", description: "Deep Slack integration for HR notifications, approvals, and employee self-service.",
    longDescription: "Bring HR workflows directly into Slack. Employees can submit requests, get notified of approvals, and access self-service HR functions without leaving their workspace. Managers can approve time-off, expenses, and other requests with a single click.",
    category: "integrations", version: "3.5.0", publisher: "TalentHub Core", rating: 4.8, reviewCount: 445,
    downloads: 18600, tags: ["Slack", "integration", "notifications", "self-service"],
    price: "included", installed: true, featured: false, new: false, icon: "💬",
    screenshots: [], features: ["Time-off requests in Slack", "Approval workflows via DM", "HR bot with NLP", "Org announcement broadcasts", "Birthday & anniversary alerts", "New hire welcome messages"],
    requirements: ["TalentHub Core 2.0+", "Slack workspace admin"], lastUpdated: "2024-01-30"
  },
  {
    id: "lib-009", name: "Employee Wellness Hub", description: "Mental health resources, wellness challenges, and EAP integration for employee well-being.",
    longDescription: "Prioritize employee well-being with a comprehensive wellness platform. Connect employees to mental health resources, run company-wide wellness challenges, track participation, and integrate with Employee Assistance Programs (EAPs).",
    category: "hr_core", version: "1.1.0", publisher: "WellnessFirst", rating: 4.6, reviewCount: 92,
    downloads: 3400, tags: ["wellness", "mental health", "EAP", "benefits"],
    price: 59, installed: false, featured: false, new: true, icon: "💚",
    screenshots: [], features: ["Mental health resource library", "Wellness challenge engine", "EAP provider integration", "Anonymous usage tracking", "Participation dashboards", "Push notification campaigns"],
    requirements: ["TalentHub Core 2.0+"], lastUpdated: "2024-02-12"
  },
  {
    id: "lib-010", name: "Job Board Connector", description: "Publish job openings to 50+ job boards simultaneously with one-click posting.",
    longDescription: "Reach more candidates by publishing to all major job boards from a single interface. Supports Indeed, LinkedIn, Glassdoor, Monster, and 50+ niche boards. Track source effectiveness and optimize your recruitment spend.",
    category: "recruitment", version: "2.8.0", publisher: "RecruitBoost", rating: 4.5, reviewCount: 267,
    downloads: 11500, tags: ["recruitment", "job boards", "posting", "sourcing"],
    price: 129, installed: false, featured: false, new: false, icon: "📋",
    screenshots: [], features: ["50+ job board integrations", "One-click multi-posting", "Source tracking & ROI", "Automated job refresh", "ATS sync", "Sponsored post management"],
    requirements: ["Recruitment Module"], lastUpdated: "2024-01-18"
  },
];

export default function Marketplace() {
  const [libraries, setLibraries] = useState<Library[]>(SAMPLE_LIBRARIES);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<LibraryCategory | "all">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [tab, setTab] = useState("browse");

  const [selected, setSelected] = useState<Library | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [uninstallOpen, setUninstallOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["lib-001", "lib-003"]));

  const filtered = libraries.filter(lib => {
    const matchSearch = !search ||
      lib.name.toLowerCase().includes(search.toLowerCase()) ||
      lib.description.toLowerCase().includes(search.toLowerCase()) ||
      lib.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = categoryFilter === "all" || lib.category === categoryFilter;
    const matchPrice =
      priceFilter === "all" ||
      (priceFilter === "free" && (lib.price === "free" || lib.price === "included")) ||
      (priceFilter === "paid" && typeof lib.price === "number");
    const matchTab = tab === "installed" ? lib.installed : tab === "favorites" ? favorites.has(lib.id) : true;
    return matchSearch && matchCat && matchPrice && matchTab;
  });

  const featured = libraries.filter(l => l.featured);
  const installedCount = libraries.filter(l => l.installed).length;

  function openDetail(lib: Library) {
    setSelected(lib);
    setDetailOpen(true);
  }

  function openInstall(lib: Library) {
    setSelected(lib);
    setInstallOpen(true);
  }

  function openUninstall(lib: Library) {
    setSelected(lib);
    setUninstallOpen(true);
  }

  function handleInstall() {
    if (!selected) return;
    setLibraries(prev => prev.map(l => l.id === selected.id ? { ...l, installed: true } : l));
    setInstallOpen(false);
    setDetailOpen(false);
    toast.success(`"${selected.name}" installed successfully`);
  }

  function handleUninstall() {
    if (!selected) return;
    setLibraries(prev => prev.map(l => l.id === selected.id ? { ...l, installed: false } : l));
    setUninstallOpen(false);
    toast.success(`"${selected.name}" uninstalled`);
  }

  function toggleFavorite(id: string) {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderPrice(price: Library["price"]) {
    if (price === "free") return <span className="text-emerald-600 font-semibold text-sm">Free</span>;
    if (price === "included") return <span className="text-primary font-semibold text-sm">Included</span>;
    return <span className="font-semibold text-sm">${price}/mo</span>;
  }

  function renderPriceBadge(price: Library["price"]) {
    if (price === "free") return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Free</Badge>;
    if (price === "included") return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Included</Badge>;
    return <Badge variant="secondary" className="bg-amber-100 text-amber-700">${price}/mo</Badge>;
  }

  return (
    <AppShell title="Marketplace" subtitle="Discover and install HR modules and libraries">
      <PageHeader
        title="Marketplace"
        subtitle="Extend TalentHub with modules, integrations, and libraries"
      />

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="browse">
              <Store className="h-4 w-4 mr-1" /> Browse
            </TabsTrigger>
            <TabsTrigger value="installed">
              <Package className="h-4 w-4 mr-1" /> Installed
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">{installedCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-1" /> Saved
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">{favorites.size}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Featured Banner */}
        {tab === "browse" && (
          <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border p-6 mb-2">
            <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wide">Featured</p>
            <h3 className="text-lg font-bold mb-1">Workforce Analytics Pro</h3>
            <p className="text-sm text-muted-foreground mb-3 max-w-md">Advanced predictive analytics and executive dashboards. Make data-driven workforce decisions with AI-powered insights.</p>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => openDetail(libraries.find(l => l.id === "lib-006")!)}>
                Learn More <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>4.9</span>
                <span>·</span>
                <span>31.2k installs</span>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search libraries..."
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
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as any)}
            className="border rounded-md px-3 text-sm bg-background h-9 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={priceFilter}
            onChange={e => setPriceFilter(e.target.value as any)}
            className="border rounded-md px-3 text-sm bg-background h-9 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Prices</option>
            <option value="free">Free / Included</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <TabsContent value="browse" className="mt-0">
          <LibraryGrid
            libs={filtered}
            favorites={favorites}
            onDetail={openDetail}
            onInstall={openInstall}
            onUninstall={openUninstall}
            onFavorite={toggleFavorite}
            renderPrice={renderPrice}
            renderPriceBadge={renderPriceBadge}
          />
        </TabsContent>

        <TabsContent value="installed" className="mt-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No libraries installed yet</p>
              <p className="text-sm mt-1">Browse the marketplace to find and install libraries</p>
              <Button className="mt-4" onClick={() => setTab("browse")}>Browse Marketplace</Button>
            </div>
          ) : (
            <LibraryGrid
              libs={filtered}
              favorites={favorites}
              onDetail={openDetail}
              onInstall={openInstall}
              onUninstall={openUninstall}
              onFavorite={toggleFavorite}
              renderPrice={renderPrice}
              renderPriceBadge={renderPriceBadge}
            />
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No saved libraries</p>
              <p className="text-sm mt-1">Click the heart icon on any library to save it for later</p>
            </div>
          ) : (
            <LibraryGrid
              libs={filtered}
              favorites={favorites}
              onDetail={openDetail}
              onInstall={openInstall}
              onUninstall={openUninstall}
              onFavorite={toggleFavorite}
              renderPrice={renderPrice}
              renderPriceBadge={renderPriceBadge}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{selected.icon}</div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">by {selected.publisher} · v{selected.version}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_CONFIG[selected.category].color}`}>
                        {CATEGORY_CONFIG[selected.category].label}
                      </span>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{selected.rating}</span>
                    <span className="text-muted-foreground">({selected.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{(selected.downloads / 1000).toFixed(1)}k installs</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Updated {selected.lastUpdated}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-2">About</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.longDescription}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Features</h4>
                  <ul className="space-y-1.5">
                    {selected.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {selected.requirements.map(r => (
                      <li key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1">
                  {selected.tags.map(t => (
                    <Badge key={t} variant="outline" className="text-xs">
                      <Tag className="h-2.5 w-2.5 mr-1" />{t}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <div className="mt-0.5">{renderPrice(selected.price)}</div>
                  </div>
                  {selected.installed ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => { setDetailOpen(false); openUninstall(selected); }}>
                        Uninstall
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.info("Opening configuration...")}>
                        <Settings2 className="h-4 w-4 mr-1" /> Configure
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => { setDetailOpen(false); openInstall(selected); }}>
                      <Plus className="h-4 w-4 mr-1" /> Install
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Install Confirm Dialog */}
      <Dialog open={installOpen} onOpenChange={setInstallOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install {selected?.name}?</DialogTitle>
            <DialogDescription>
              {typeof selected?.price === "number"
                ? `This will add $${selected.price}/month to your subscription. You can uninstall at any time.`
                : "This library is included with your current plan. No additional cost."}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="rounded-lg border p-3 space-y-2 text-sm">
              <p className="font-medium">{selected.name} v{selected.version}</p>
              <p className="text-muted-foreground">{selected.description}</p>
              <div className="flex items-center gap-2 pt-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-muted-foreground">Compatible with your current plan</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setInstallOpen(false)}>Cancel</Button>
            <Button onClick={handleInstall}>
              <Download className="h-4 w-4 mr-1" /> Confirm Install
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Uninstall Confirm Dialog */}
      <Dialog open={uninstallOpen} onOpenChange={setUninstallOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uninstall {selected?.name}?</DialogTitle>
            <DialogDescription>
              Uninstalling this library will disable all its features and workflows. Data created by this library will be preserved but may become inaccessible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUninstallOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleUninstall}>Uninstall</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function LibraryGrid({
  libs, favorites, onDetail, onInstall, onUninstall, onFavorite, renderPrice, renderPriceBadge
}: {
  libs: Library[];
  favorites: Set<string>;
  onDetail: (lib: Library) => void;
  onInstall: (lib: Library) => void;
  onUninstall: (lib: Library) => void;
  onFavorite: (id: string) => void;
  renderPrice: (price: Library["price"]) => React.ReactNode;
  renderPriceBadge: (price: Library["price"]) => React.ReactNode;
}) {
  if (libs.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Store className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No libraries found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {libs.map(lib => {
        const catConf = CATEGORY_CONFIG[lib.category];
        const isFav = favorites.has(lib.id);
        return (
          <div key={lib.id} className="border rounded-xl p-4 bg-card hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-2xl">{lib.icon}</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm leading-tight">{lib.name}</p>
                    {lib.new && <Badge className="h-4 px-1 text-xs bg-emerald-100 text-emerald-700 border-0">New</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{lib.publisher}</p>
                </div>
              </div>
              <button onClick={() => onFavorite(lib.id)} className="text-muted-foreground hover:text-rose-500 transition-colors">
                <Heart className={`h-4 w-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{lib.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${catConf.color}`}>
                {catConf.label}
              </span>
              {renderPriceBadge(lib.price)}
              {lib.installed && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-0.5" /> Installed
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{lib.rating}</span>
                <span>({lib.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{(lib.downloads / 1000).toFixed(1)}k</span>
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => onDetail(lib)}>
                <Eye className="h-3 w-3 mr-1" /> Details
              </Button>
              {lib.installed ? (
                <Button variant="outline" size="sm" className="flex-1 text-xs text-destructive" onClick={() => onUninstall(lib)}>
                  Uninstall
                </Button>
              ) : (
                <Button size="sm" className="flex-1 text-xs" onClick={() => onInstall(lib)}>
                  <Plus className="h-3 w-3 mr-1" /> Install
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
