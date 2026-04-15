import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto page-enter">
            {children}
          </div>
        </main>
        <footer className="px-6 py-3 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground/60 text-center tracking-wide">
            © 2026 AchievHR · Enterprise Talent Platform
          </p>
        </footer>
      </div>
    </div>
  );
}
