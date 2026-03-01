import { Calendar, Bell, Settings, Search, ChevronDown, Video } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left - Search */}
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search strategies, plans, priorities..."
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            <Video className="w-4 h-4" />
            <span className="hidden lg:inline">Go Online</span>
          </button>
          
          <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="hidden lg:inline">Schedule</span>
          </button>
          
          <div className="flex items-center gap-1 ml-2 pl-3 border-l border-border">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <button className="flex items-center gap-2 ml-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-xs font-bold shadow-md">
              S
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden lg:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
