import { useState } from "react";
import { motion } from "framer-motion";
import { Users, User, Heart, Baby, Briefcase, Pencil, Trash2 } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FamilyMemberForm } from "../forms/FamilyMemberForm";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

const familyMembers = [
  { name: "Robert James Mitchell", relation: "Father", occupation: "Retired Engineer", initials: "RJ", color: "bg-primary/10 text-primary", borderColor: "border-primary/20" },
  { name: "Elizabeth Anne Mitchell", relation: "Mother", maidenName: "Thompson", occupation: "Teacher, Retired", initials: "EA", color: "bg-category-talent/10 text-category-talent", borderColor: "border-category-talent/20" },
];

const spouse = { name: "Sarah Elizabeth Mitchell", relation: "Spouse", occupation: "Marketing Manager", marriedSince: "Jun 20, 2015", initials: "SE" };

const children = [
  { name: "Emma Grace", age: 6, initials: "EG", gender: "daughter" },
  { name: "James Robert", age: 4, initials: "JR", gender: "son" },
];

const familyStats = [
  { label: "Dependents", value: 4 },
  { label: "Children", value: 2 },
  { label: "Years Married", value: 9 },
];

export const FamilyPanel = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const openAdd = () => { setEditData(null); setFormOpen(true); };
  const openEdit = (data: any) => { setEditData(data); setFormOpen(true); };

  return (
    <div className="space-y-6">
      <PanelHeader 
        title="Family Details" 
        subtitle="Family members and dependents information"
        icon={Users}
        stats={familyStats}
        onAdd={openAdd}
        addLabel="Add Member"
      />
      
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* Spouse */}
        <motion.div variants={item} className="group/card relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 rounded-2xl p-5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <Heart className="absolute top-4 right-4 h-5 w-5 text-primary/30" />
          <div className="absolute top-4 right-12 opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit({ name: spouse.name, relation: spouse.relation, occupation: spouse.occupation })}>
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>
          <div className="relative flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">{spouse.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full uppercase tracking-wider">{spouse.relation}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{spouse.name}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{spouse.occupation}</span>
                <span>•</span>
                <span>Married since {spouse.marriedSince}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Children */}
        <motion.div variants={item}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><Baby className="h-3.5 w-3.5" />Children ({children.length})</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {children.map((child) => (
              <div key={child.name} className="group/card flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all">
                <Avatar className="h-12 w-12 border border-border group-hover/card:border-primary/30 transition-colors">
                  <AvatarFallback className="bg-primary/5 text-primary text-sm font-bold">{child.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{child.name}</p>
                  <p className="text-xs text-muted-foreground">{child.age} years old • {child.gender}</p>
                </div>
                <div className="opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit({ name: child.name, relation: child.gender === "daughter" ? "Daughter" : "Son", occupation: "", age: child.age, gender: child.gender === "daughter" ? "female" : "male" })}>
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="h-3 w-3 text-muted-foreground" /></Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Parents */}
        <motion.div variants={item}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><User className="h-3.5 w-3.5" />Parents</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {familyMembers.map((member) => (
              <div key={member.name} className={`group/card flex items-center gap-3 p-4 bg-card border rounded-xl hover:shadow-sm transition-all ${member.borderColor}`}>
                <Avatar className={`h-12 w-12 border ${member.borderColor}`}>
                  <AvatarFallback className={`${member.color} text-sm font-bold`}>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`px-1.5 py-0.5 ${member.color} text-[9px] font-medium rounded`}>{member.relation}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.occupation}</p>
                  {member.maidenName && <p className="text-[10px] text-muted-foreground/70">née {member.maidenName}</p>}
                </div>
                <div className="opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit({ name: member.name, relation: member.relation, occupation: member.occupation, maidenName: member.maidenName })}>
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <FamilyMemberForm open={formOpen} onOpenChange={setFormOpen} editData={editData} />
    </div>
  );
};
