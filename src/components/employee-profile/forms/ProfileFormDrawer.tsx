import { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { LucideIcon } from "lucide-react";

interface ProfileFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export const ProfileFormDrawer = ({ open, onOpenChange, title, description, icon: Icon, children }: ProfileFormDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[50vw] sm:max-w-none overflow-y-auto">
        <SheetHeader className="pb-6 border-b border-border mb-6">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <SheetTitle className="text-lg">{title}</SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </div>
          </div>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};
