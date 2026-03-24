import { Bell, Settings, Search, ChevronDown, Command } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left spacer */}
        <div className="min-w-0" />

        {/* Center: Search */}
        <div className="flex flex-1 max-w-md">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-10 py-2 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card focus:border-border transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-muted-foreground/40">
              <kbd className="text-[10px] font-medium bg-background/80 border border-border/50 rounded px-1 py-0.5">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-card" />
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted"
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>

          <div className="w-px h-5 bg-border/60 mx-1" />

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-[11px] font-bold shadow-sm">
              A
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-foreground leading-none">Admin</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Super Admin</p>
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground/60 hidden lg:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
