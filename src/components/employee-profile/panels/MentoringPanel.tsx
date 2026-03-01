import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, GraduationCap, CheckCircle2, Clock, CalendarDays } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const asMentor = [
  { name: "Emily Rodriguez", program: "Technical Mentoring", start: "Jan 2024", end: "Dec 2024", status: "Active", role: "mentor" },
  { name: "David Kim", program: "Career Development", start: "Jun 2023", end: "Jun 2024", status: "Completed", role: "mentor" },
  { name: "Lisa Chen", program: "New Hire Buddy", start: "Mar 2024", end: "Jun 2024", status: "Completed", role: "mentor" },
];

const asMentee = [
  { name: "Dr. Patricia Johnson", program: "Leadership Mentoring", start: "Jan 2023", end: "Dec 2024", status: "Active", role: "mentee" },
  { name: "External Coach", program: "Executive Coaching", start: "Jun 2024", end: "Dec 2024", status: "Active", role: "mentee" },
];

const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

type ViewMode = "all" | "mentor" | "mentee";

export const MentoringPanel = () => {
  const [view, setView] = useState<ViewMode>("all");

  const allItems = [
    ...asMentor.map(m => ({ ...m, type: "Mentor" as const })),
    ...asMentee.map(m => ({ ...m, type: "Mentee" as const })),
  ];

  const filtered = view === "all" ? allItems
    : view === "mentor" ? allItems.filter(i => i.type === "Mentor")
    : allItems.filter(i => i.type === "Mentee");

  return (
    <div className="space-y-6">
      <PanelHeader title="Mentoring Programs" subtitle="Mentoring relationships as mentor and mentee" icon={Users} pastel="rose" />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-gradient-to-br from-primary/20 to-primary/10 p-5">
          <Users className="h-5 w-5 text-primary mb-3" />
          <span className="text-3xl font-black text-foreground tracking-tight">{allItems.length}</span>
          <p className="text-xs text-muted-foreground mt-1">Total Relationships</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl border border-border bg-gradient-to-br from-status-completed/20 to-status-completed/10 p-5">
          <UserCheck className="h-5 w-5 text-status-completed mb-3" />
          <span className="text-3xl font-black text-foreground tracking-tight">{asMentor.length}</span>
          <p className="text-xs text-muted-foreground mt-1">As Mentor</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="rounded-2xl border border-border bg-gradient-to-br from-violet-500/20 to-violet-500/10 p-5">
          <GraduationCap className="h-5 w-5 text-violet-500 mb-3" />
          <span className="text-3xl font-black text-foreground tracking-tight">{asMentee.length}</span>
          <p className="text-xs text-muted-foreground mt-1">As Mentee</p>
        </motion.div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all" className="text-xs">All ({allItems.length})</TabsTrigger>
          <TabsTrigger value="mentor" className="text-xs"><UserCheck className="h-3 w-3 mr-1" /> As Mentor ({asMentor.length})</TabsTrigger>
          <TabsTrigger value="mentee" className="text-xs"><GraduationCap className="h-3 w-3 mr-1" /> As Mentee ({asMentee.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Cards - 3 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => {
          const RoleIcon = item.type === "Mentor" ? UserCheck : GraduationCap;
          return (
            <motion.div key={`${item.name}-${item.program}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
              <Card className="p-5 border-border/50 hover:shadow-md transition-shadow h-full flex flex-col">
                {/* Row 1: Role + Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <RoleIcon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="uppercase tracking-wider font-semibold text-[10px]">{item.type}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-medium gap-1 ${
                    item.status === "Active" ? "text-status-completed border-status-completed/30" : "text-muted-foreground border-border"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-status-completed" : "bg-muted-foreground"}`} />
                    {item.status}
                  </Badge>
                </div>

                {/* Row 2: Program title */}
                <h4 className="text-sm font-bold text-foreground leading-snug mb-4 flex-1">{item.program}</h4>

                {/* Row 3: Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-semibold">{getInitials(item.name)}</AvatarFallback>
                    </Avatar>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{item.start}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
