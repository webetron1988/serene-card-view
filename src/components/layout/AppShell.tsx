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
          {children}
        </main>
        <footer className="px-6 py-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground text-center">
            © 2025 TalentHub · Enterprise HR Platform
          </p>
        </footer>
      </div>
    </div>
  );
}
