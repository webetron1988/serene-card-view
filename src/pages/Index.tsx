import { DashboardHeader } from "@/components/DashboardHeader";
import { QuickActions } from "@/components/QuickActions";
import { MainTabs } from "@/components/MainTabs";
import { LeftSidebar } from "@/components/LeftSidebar";
import { HomeContent } from "@/components/home/HomeContent";
import { StrategyContent } from "@/components/strategy/StrategyContent";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent onNavigateToTab={setActiveTab} />;
      case "strategy":
        return <StrategyContent />;
      case "governance":
      case "pmo":
      case "workforce":
      case "analytics":
      case "settings":
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p className="text-lg">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content coming soon...</p>
          </div>
        );
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 p-4 lg:p-6 space-y-5 overflow-y-auto">
          {/* Quick Actions Banner */}
          <QuickActions />
          
          {/* Main Navigation Tabs */}
          <MainTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Tab Content */}
          {renderTabContent()}
        </main>
        
        {/* Minimal Footer */}
        <footer className="px-6 py-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground text-center">© 2025 BlueNxt Consulting</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
