import { useState } from "react";
import { Bell, Settings, Search, ChevronDown, User, LogOut, Circle, Clock, MinusCircle, Moon, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

const statusOptions = [
  { value: "available", label: "Available", icon: Circle, color: "text-emerald-500", fill: "fill-emerald-500" },
  { value: "away", label: "Away", icon: Clock, color: "text-amber-500", fill: "fill-amber-500" },
  { value: "busy", label: "Busy", icon: MinusCircle, color: "text-destructive", fill: "" },
  { value: "dnd", label: "Do Not Disturb", icon: Moon, color: "text-purple-500", fill: "" },
  { value: "offline", label: "Appear Offline", icon: WifiOff, color: "text-muted-foreground", fill: "" },
] as const;

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<string>("available");

  const activeStatus = statusOptions.find(s => s.value === currentStatus) ?? statusOptions[0];
  const ActiveStatusIcon = activeStatus.icon;

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
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

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl hover:bg-muted transition-colors focus:outline-none">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">
                    A
                  </div>
                  {/* Status dot on avatar */}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                    currentStatus === "available" ? "bg-emerald-500" :
                    currentStatus === "away" ? "bg-amber-500" :
                    currentStatus === "busy" ? "bg-destructive" :
                    currentStatus === "dnd" ? "bg-purple-500" :
                    "bg-muted-foreground"
                  }`} />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-foreground leading-none">Admin User</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Super Admin</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground/60 hidden lg:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72 p-0 rounded-xl shadow-xl border border-border/60 overflow-hidden">
              {/* Profile Summary Card */}
              <div className="bg-gradient-to-br from-primary/8 via-primary/4 to-transparent px-4 pt-4 pb-3">
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                      A
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${
                      currentStatus === "available" ? "bg-emerald-500" :
                      currentStatus === "away" ? "bg-amber-500" :
                      currentStatus === "busy" ? "bg-destructive" :
                      currentStatus === "dnd" ? "bg-purple-500" :
                      "bg-muted-foreground"
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">Admin User</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Super Admin</p>
                    <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">admin@company.com</p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="m-0" />

              {/* Status Selector */}
              <div className="p-1.5">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer">
                    <ActiveStatusIcon className={`w-4 h-4 ${activeStatus.color} ${activeStatus.fill}`} />
                    <span className="flex-1 text-foreground">{activeStatus.label}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-medium">STATUS</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-48 rounded-xl p-1.5">
                      {statusOptions.map((status) => {
                        const Icon = status.icon;
                        const isActive = currentStatus === status.value;
                        return (
                          <DropdownMenuItem
                            key={status.value}
                            onClick={() => setCurrentStatus(status.value)}
                            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer ${isActive ? "bg-primary/8" : ""}`}
                          >
                            <Icon className={`w-4 h-4 ${status.color} ${status.fill}`} />
                            <span className={isActive ? "font-medium text-foreground" : "text-foreground/80"}>{status.label}</span>
                            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </div>

              <DropdownMenuSeparator className="mx-2" />

              {/* Menu Items */}
              <div className="p-1.5">
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="mx-2" />

              <div className="p-1.5">
                <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/8">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
