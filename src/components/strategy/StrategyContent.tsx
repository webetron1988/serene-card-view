import { StatsBar } from "@/components/StatsBar";
import { ActionToolbar } from "@/components/ActionToolbar";
import { StrategyCard } from "@/components/StrategyCard";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

const sampleStrategies = [
  {
    code: "STAT0015",
    title: "Set Strategic Goals",
    description: "Identify clear, measurable objectives aligned with the vision.",
    category: "Talent" as const,
    status: "Draft" as const,
    priority: "Low" as const,
    progress: 0,
    createdAt: "2 weeks ago",
    assignee: { name: "Alex Chen", role: "Product Lead" },
  },
  {
    code: "STAT0016",
    title: "Analyze Market & Competitors",
    description: "Study industry trends and competitor capabilities to find opportunities.",
    category: "Talent" as const,
    status: "Draft" as const,
    priority: "High" as const,
    progress: 0,
    createdAt: "2 weeks ago",
    assignee: { name: "Sarah Kim" },
  },
  {
    code: "STAT0017",
    title: "Define Resource Allocation",
    description: "Establish budget and resource distribution across departments.",
    category: "Planning" as const,
    status: "In Progress" as const,
    priority: "Medium" as const,
    progress: 72,
    createdAt: "1 week ago",
    assignee: { name: "Mike Ross", role: "Finance Manager" },
  },
  {
    code: "STAT0018",
    title: "Build Stakeholder Alignment",
    description: "Ensure all stakeholders are aligned on strategic priorities.",
    category: "Strategy" as const,
    status: "In Progress" as const,
    priority: "High" as const,
    progress: 30,
    createdAt: "3 days ago",
    assignee: { name: "Emma Liu", role: "Strategy Director" },
  },
  {
    code: "STAT0019",
    title: "Review Performance Metrics",
    description: "Analyze KPIs and adjust strategy based on data insights.",
    category: "Analytics" as const,
    status: "Completed" as const,
    priority: "Low" as const,
    progress: 100,
    createdAt: "1 month ago",
    assignee: { name: "David Park" },
  },
  {
    code: "STAT0020",
    title: "Quarterly Business Review",
    description: "Comprehensive review of quarterly achievements and roadblocks.",
    category: "Talent" as const,
    status: "Draft" as const,
    priority: "Medium" as const,
    progress: 0,
    createdAt: "5 days ago",
    assignee: { name: "Lisa Wang", role: "Operations Head" },
  },
];

export function StrategyContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  const displayedStrategies = showAll ? sampleStrategies : sampleStrategies.slice(0, 6);
  const remainingCount = sampleStrategies.length - 6;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowAll(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <StatsBar />
      
      {/* Status Filter Toolbar */}
      <ActionToolbar />
      
      {/* Strategy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedStrategies.map((strategy, index) => (
          <div
            key={strategy.code}
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
          >
            <StrategyCard {...strategy} />
          </div>
        ))}
      </div>
      
      {/* Modern Load More Section */}
      {!showAll && remainingCount > 0 && (
        <div className="relative py-8">
          {/* Decorative gradient line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="relative flex justify-center">
            <button 
              onClick={handleLoadMore}
              disabled={isLoading}
              className="group flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm font-medium text-foreground">Loading...</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-foreground">Show {remainingCount} more strategies</span>
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ChevronDown className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
