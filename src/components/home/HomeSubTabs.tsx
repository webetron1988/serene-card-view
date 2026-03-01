import { useState, useRef, useEffect } from "react";
import { Home, Lightbulb, BookOpen, Bot, Plus, ChevronDown, FileText, Target, Shield, FolderKanban, Users, ClipboardList } from "lucide-react";

const subTabs = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "thought-leadership", label: "Thought Leadership", icon: Lightbulb },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "ai-assistant", label: "AI Assistant", icon: Bot },
];

const createOptions = [
  { id: "strategic-plan", label: "Strategic Plan", description: "Create a new strategic plan", icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  { id: "priorities", label: "Priorities", description: "Define strategic priorities", icon: Target, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "policy", label: "Policy", description: "Create new policy document", icon: ClipboardList, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "governance", label: "Governance", description: "Add governance framework", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "project", label: "Project", description: "Start a new project", icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "raci", label: "RACI", description: "Create RACI matrix", icon: Users, color: "text-rose-500", bg: "bg-rose-500/10" },
];

interface HomeSubTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function HomeSubTabs({ activeTab, onTabChange }: HomeSubTabsProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCreateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between border-b border-border/50 mb-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-1">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                ${isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Create New Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setCreateOpen(!createOpen)}
          className="group inline-flex items-center gap-0 bg-primary rounded-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25"
        >
          <span className="flex items-center justify-center w-9 h-9 bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
            <Plus className={`w-4 h-4 text-primary-foreground transition-transform duration-200 ${createOpen ? 'rotate-45' : ''}`} />
          </span>
          <span className="flex items-center gap-1.5 px-3 pr-3 text-sm font-medium text-primary-foreground">
            Create
            <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${createOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>
        
        {createOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
            {createOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left ${
                    index > 0 ? "border-t border-border/50" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${option.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${option.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{option.label}</p>
                    <p className="text-[10px] text-muted-foreground">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
