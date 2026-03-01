import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

interface ProfileSectionNavProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  sectionLabel?: string;
}

export const ProfileSectionNav = ({ sections, activeSection, onSectionChange, sectionLabel = "Personal Profile" }: ProfileSectionNavProps) => {
  return (
    <nav className="w-56 border-r border-border bg-card/30 min-h-[calc(100vh-280px)]">
      <div className="p-4 space-y-1">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          {sectionLabel}
        </p>
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          return (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-all group",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <span>{section.label}</span>
              <ChevronRight className={cn(
                "h-3.5 w-3.5 transition-transform",
                isActive ? "text-primary" : "opacity-0 group-hover:opacity-50",
                isActive && "translate-x-0.5"
              )} />
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
