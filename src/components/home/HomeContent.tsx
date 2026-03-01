import { useState } from "react";
import { HomeAnalytics } from "./HomeAnalytics";
import { HomeSubTabs } from "./HomeSubTabs";
import { HomeOverview } from "./HomeOverview";
import { ThoughtLeadership } from "./ThoughtLeadership";
import { Resources } from "./Resources";
import { AIAssistantSection } from "./AIAssistantSection";

interface HomeContentProps {
  onNavigateToTab?: (tab: string) => void;
}

export function HomeContent({ onNavigateToTab }: HomeContentProps) {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  const handleViewAll = (section: string) => {
    if (onNavigateToTab) {
      onNavigateToTab(section);
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <HomeAnalytics />
      
      {/* Sub Tabs with Create Button */}
      <HomeSubTabs activeTab={activeSubTab} onTabChange={setActiveSubTab} />
      
      {/* All Sections on Page */}
      <div className="space-y-8">
        {/* Overview Section - Accordions */}
        <HomeOverview onNavigate={handleViewAll} />
        
        {/* Thought Leadership Section */}
        <ThoughtLeadership />
        
        {/* Resource Library Section */}
        <Resources />
        
        {/* AI Assistant Section */}
        <AIAssistantSection />
      </div>
    </div>
  );
}
