import { 
  LayoutGrid, LayoutList, SlidersHorizontal, Plus, FileText, Target, ChevronDown, ArrowUpDown
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const statusFilters = [
  { id: "all", label: "All", count: 24 },
  { id: "approved", label: "Approved", count: 12 },
  { id: "draft", label: "Draft", count: 8 },
  { id: "in-progress", label: "In Progress", count: 5 },
  { id: "pending", label: "Pending", count: 3 },
  { id: "hold", label: "On Hold", count: 1 },
];

const sortOptions = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "priority", label: "Priority" },
];

export function ActionToolbar() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("newest");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCreateOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border/50">
      {/* Left: Status Filters - Minimal underline style */}
      <div className="flex items-center gap-1">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              relative px-3 py-2 text-sm font-medium transition-all duration-200
              ${activeFilter === filter.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            <span className="flex items-center gap-1.5">
              {filter.label}
              <span className={`
                text-[10px] px-1.5 py-0.5 rounded-full transition-colors
                ${activeFilter === filter.id 
                  ? "bg-primary/15 text-primary font-semibold" 
                  : "bg-muted text-muted-foreground"
                }
              `}>
                {filter.count}
              </span>
            </span>
            
            {/* Active indicator line */}
            {activeFilter === filter.id && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Create New Dropdown - Split button design */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setCreateOpen(!createOpen)}
            className="group inline-flex items-center gap-0 bg-primary rounded-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25"
          >
            {/* Icon circle */}
            <span className="flex items-center justify-center w-9 h-9 bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
              <Plus className={`w-4 h-4 text-primary-foreground transition-transform duration-200 ${createOpen ? 'rotate-45' : ''}`} />
            </span>
            {/* Text section */}
            <span className="flex items-center gap-1.5 px-3 pr-3 text-sm font-medium text-primary-foreground">
              Create
              <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${createOpen ? 'rotate-180' : ''}`} />
            </span>
          </button>
          
          {createOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">New Plan</p>
                  <p className="text-[10px] text-muted-foreground">Create a strategic plan</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left border-t border-border">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">New Priority</p>
                  <p className="text-[10px] text-muted-foreground">Define strategic priority</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">Sort</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {sortOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setActiveSort(option.id);
                    setSortOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                    activeSort === option.id 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {option.label}
                  {activeSort === option.id && (
                    <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Filter Button */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all">
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* View Toggle */}
        <div className="flex items-center p-0.5 bg-secondary/50 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "grid" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list" 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
