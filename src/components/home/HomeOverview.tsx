import { useState } from "react";
import { ChevronDown, ChevronRight, Target, Shield, FolderKanban, ExternalLink } from "lucide-react";
import { MiniCard } from "./MiniCard";

type AccordionSection = "strategy" | "governance" | "pmo" | null;
type StatusTab = "draft" | "pending" | "completed";

const sectionConfig = {
  strategy: {
    icon: Target,
    label: "Strategy",
    color: "text-primary",
    bg: "bg-primary/10",
    borderColor: "border-l-primary",
    stats: { draft: 5, pending: 3, completed: 12 },
    link: "strategy",
  },
  governance: {
    icon: Shield,
    label: "Governance",
    color: "text-purple-600",
    bg: "bg-purple-100",
    borderColor: "border-l-purple-500",
    stats: { draft: 3, pending: 2, completed: 8 },
    link: "governance",
  },
  pmo: {
    icon: FolderKanban,
    label: "PMO",
    color: "text-blue-600",
    bg: "bg-blue-100",
    borderColor: "border-l-blue-500",
    stats: { draft: 4, pending: 5, completed: 15 },
    link: "pmo",
  },
};

// Sample data for each section
const sampleData = {
  strategy: {
    draft: [
      { title: "Q4 Workforce Planning Initiative", category: "Workforce", status: "Draft" as const, priority: "High" as const, assignee: "John Doe", createdAt: "2d ago" },
      { title: "Employee Engagement Framework", category: "HR Strategy", status: "Draft" as const, priority: "Medium" as const, assignee: "Jane Smith", createdAt: "5d ago" },
      { title: "Talent Acquisition Strategy 2025", category: "Talent", status: "Draft" as const, priority: "High" as const, assignee: "Mike Johnson", createdAt: "1w ago" },
      { title: "Performance Review Restructure", category: "Performance", status: "Draft" as const, priority: "Medium" as const, assignee: "Sarah Lee", createdAt: "3d ago" },
      { title: "Budget Allocation Review", category: "Budget", status: "Draft" as const, priority: "Low" as const, assignee: "Tom White", createdAt: "4d ago" },
    ],
    pending: [
      { title: "Leadership Development Program", category: "Talent", status: "Pending" as const, priority: "High" as const, assignee: "Sarah Wilson", createdAt: "3d ago" },
      { title: "Performance Management Redesign", category: "Performance", status: "Pending" as const, priority: "Medium" as const, assignee: "Tom Brown", createdAt: "1w ago" },
      { title: "Remote Work Policy Update", category: "HR Strategy", status: "Pending" as const, priority: "High" as const, assignee: "Lisa Chen", createdAt: "2d ago" },
    ],
    completed: [
      { title: "Remote Work Policy Implementation", category: "HR Strategy", status: "Completed" as const, priority: "High" as const, assignee: "Lisa Chen", createdAt: "2w ago" },
      { title: "Compensation Review 2024", category: "Budget", status: "Completed" as const, priority: "Medium" as const, assignee: "David Lee", createdAt: "3w ago" },
    ],
  },
  governance: {
    draft: [
      { title: "Data Privacy Policy Update", category: "Policy", status: "Draft" as const, priority: "High" as const, assignee: "Emily Davis", createdAt: "1d ago" },
      { title: "Compliance Training Framework", category: "Compliance", status: "Draft" as const, priority: "Medium" as const, assignee: "Robert Taylor", createdAt: "4d ago" },
      { title: "Internal Audit Guidelines", category: "Audit", status: "Draft" as const, priority: "Low" as const, assignee: "Amy White", createdAt: "5d ago" },
    ],
    pending: [
      { title: "Risk Assessment Protocol", category: "Risk", status: "Pending" as const, priority: "High" as const, assignee: "Amy White", createdAt: "2d ago" },
      { title: "GDPR Compliance Review", category: "Compliance", status: "Pending" as const, priority: "High" as const, assignee: "Chris Martin", createdAt: "3d ago" },
    ],
    completed: [
      { title: "Audit Compliance Report Q3", category: "Audit", status: "Completed" as const, priority: "High" as const, assignee: "Chris Martin", createdAt: "1mo ago" },
      { title: "Employee Handbook Update", category: "Policy", status: "Completed" as const, priority: "Medium" as const, assignee: "Emily Davis", createdAt: "2w ago" },
    ],
  },
  pmo: {
    draft: [
      { title: "HRIS Implementation Phase 2", category: "Implementation", status: "Draft" as const, priority: "High" as const, assignee: "Kevin Brown", createdAt: "3d ago", progress: 0 },
      { title: "Office Relocation Project", category: "Migration", status: "Draft" as const, priority: "Medium" as const, assignee: "Nancy Green", createdAt: "1w ago", progress: 0 },
      { title: "Benefits Portal Upgrade", category: "Enhancement", status: "Draft" as const, priority: "Low" as const, assignee: "Paul Adams", createdAt: "4d ago", progress: 0 },
      { title: "Training Center Setup", category: "Implementation", status: "Draft" as const, priority: "Medium" as const, assignee: "Grace Lee", createdAt: "5d ago", progress: 0 },
    ],
    pending: [
      { title: "Learning Management System Rollout", category: "Rollout", status: "Pending" as const, priority: "High" as const, assignee: "Paul Adams", createdAt: "5d ago", progress: 45 },
      { title: "Employee Portal Enhancement", category: "Enhancement", status: "Pending" as const, priority: "Medium" as const, assignee: "Grace Lee", createdAt: "1w ago", progress: 72 },
      { title: "Payroll System Integration", category: "Implementation", status: "Pending" as const, priority: "High" as const, assignee: "Kevin Brown", createdAt: "2d ago", progress: 30 },
      { title: "Data Center Migration", category: "Migration", status: "Pending" as const, priority: "High" as const, assignee: "James Wilson", createdAt: "4d ago", progress: 58 },
      { title: "Mobile App Development", category: "Enhancement", status: "Pending" as const, priority: "Medium" as const, assignee: "Nancy Green", createdAt: "6d ago", progress: 25 },
    ],
    completed: [
      { title: "Payroll System Migration", category: "Migration", status: "Completed" as const, priority: "High" as const, assignee: "James Wilson", createdAt: "2w ago", progress: 100 },
      { title: "HR Analytics Dashboard", category: "Implementation", status: "Completed" as const, priority: "Medium" as const, assignee: "Grace Lee", createdAt: "3w ago", progress: 100 },
    ],
  },
};

interface AccordionSectionProps {
  section: "strategy" | "governance" | "pmo";
  isOpen: boolean;
  onToggle: () => void;
  onViewAll: (section: string) => void;
}

function AccordionSectionComponent({ section, isOpen, onToggle, onViewAll }: AccordionSectionProps) {
  const [activeTab, setActiveTab] = useState<StatusTab>("draft");
  const config = sectionConfig[section];
  const Icon = config.icon;
  const data = sampleData[section];

  const statusTabs: { id: StatusTab; label: string; count: number; color: string }[] = [
    { id: "draft", label: "Draft", count: config.stats.draft, color: "bg-amber-500" },
    { id: "pending", label: "Pending", count: config.stats.pending, color: "bg-blue-500" },
    { id: "completed", label: "Completed", count: config.stats.completed, color: "bg-emerald-500" },
  ];

  return (
    <div className={`border border-border rounded-xl overflow-hidden bg-card border-l-4 ${config.borderColor} shadow-sm`}>
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-secondary/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shadow-sm`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <h3 className="text-sm font-bold text-foreground">{config.label}</h3>
        </div>
        <div className="flex items-center gap-4">
          {/* Compact Stats */}
          <div className="flex items-center gap-3">
            {statusTabs.map((tab) => (
              <div key={tab.id} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${tab.color}`} />
                <span className="text-xs font-medium text-muted-foreground">{tab.count}</span>
              </div>
            ))}
          </div>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-primary/10' : 'bg-secondary/50'}`}>
            {isOpen ? (
              <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="border-t border-border">
          {/* Status Tabs */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border/50">
            <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-1">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                    ${activeTab === tab.id
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${tab.color}`} />
                  {tab.label}
                  <span className={`ml-1 text-[10px] ${activeTab === tab.id ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => onViewAll(config.link)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
            >
              View All
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid - 5 columns */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
            {data[activeTab].map((item, index) => (
              <MiniCard 
                key={index} 
                {...item} 
                type={section}
                progress={section === "pmo" ? (item as any).progress : undefined}
              />
            ))}
            {data[activeTab].length === 0 && (
              <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                No items in this category
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface HomeOverviewProps {
  onNavigate: (tab: string) => void;
}

export function HomeOverview({ onNavigate }: HomeOverviewProps) {
  const [openSection, setOpenSection] = useState<AccordionSection>("strategy");

  const handleToggle = (section: AccordionSection) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-3">
      <AccordionSectionComponent
        section="strategy"
        isOpen={openSection === "strategy"}
        onToggle={() => handleToggle("strategy")}
        onViewAll={onNavigate}
      />
      <AccordionSectionComponent
        section="governance"
        isOpen={openSection === "governance"}
        onToggle={() => handleToggle("governance")}
        onViewAll={onNavigate}
      />
      <AccordionSectionComponent
        section="pmo"
        isOpen={openSection === "pmo"}
        onToggle={() => handleToggle("pmo")}
        onViewAll={onNavigate}
      />
    </div>
  );
}
