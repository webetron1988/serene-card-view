import { Bell, Settings, Search, ChevronDown, Moon, Sun, Command } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Breadcrumb / title */}
        <div className="flex flex-col min-w-0">
          {title && (
            <h2 className="text-sm font-semibold text-foreground truncate">{title}</h2>
          )}
          {subtitle && (
            <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        {/* Center: Search */}
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employees, jobs, policies..."
              className="w-full pl-10 pr-10 py-2 bg-secondary/50 border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
              <Command className="w-3 h-3" />
              <span className="text-[10px] font-medium">K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {/* Notification bell */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* User menu */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">
              A
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-foreground leading-none">Admin User</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Super Admin</p>
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden lg:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
