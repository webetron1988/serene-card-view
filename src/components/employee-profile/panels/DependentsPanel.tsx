import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, FileText, Stethoscope, Calendar, User } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DependentForm } from "../forms/DependentForm";

const dependents = [
  {
    name: "Sarah Elizabeth Mitchell",
    relationship: "Spouse",
    dob: "Jul 22, 1988",
    age: 36,
    gender: "F",
    passport: "US-987654321",
    visaStatus: "N/A",
    medical: true,
    dental: true,
    initials: "SM",
    color: "bg-pink-500",
  },
  {
    name: "Emma Grace Mitchell",
    relationship: "Daughter",
    dob: "Mar 10, 2018",
    age: 6,
    gender: "F",
    passport: "US-111222333",
    visaStatus: "N/A",
    medical: true,
    dental: true,
    initials: "EM",
    color: "bg-purple-500",
  },
  {
    name: "James Robert Mitchell",
    relationship: "Son",
    dob: "Nov 5, 2020",
    age: 4,
    gender: "M",
    passport: "US-444555666",
    visaStatus: "N/A",
    medical: true,
    dental: true,
    initials: "JM",
    color: "bg-blue-500",
  },
];

export const DependentsPanel = () => {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Dependents Details"
        subtitle="Family members covered under employee benefits"
        icon={Users}
        onAdd={() => setFormOpen(true)}
        addLabel="Add Dependent"
      />

      {/* Dependents Cards */}
      <div className="space-y-4">
        {dependents.map((dependent, index) => (
          <motion.div
            key={dependent.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className={`h-12 w-12 ${dependent.color}`}>
                    <AvatarFallback className="text-white font-semibold text-sm">
                      {dependent.initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{dependent.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                            {dependent.relationship}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{dependent.age} years old</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {dependent.medical && (
                          <Badge className="bg-status-completed/10 text-status-completed border-0 text-[10px]">
                            <Stethoscope className="h-3 w-3 mr-1" />
                            Medical
                          </Badge>
                        )}
                        {dependent.dental && (
                          <Badge className="bg-category-planning/10 text-category-planning border-0 text-[10px]">
                            <Heart className="h-3 w-3 mr-1" />
                            Dental
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Date of Birth</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground">{dependent.dob}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Gender</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground">{dependent.gender === "F" ? "Female" : "Male"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Passport</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs font-mono font-medium text-foreground">{dependent.passport}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Visa Status</p>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5">{dependent.visaStatus}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Coverage</p>
                        <p className="text-xs font-medium text-status-completed mt-0.5">Full Benefits</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50"
      >
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">3</p>
            <p className="text-[10px] text-muted-foreground">Total Dependents</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-status-completed">3</p>
            <p className="text-[10px] text-muted-foreground">Covered Under Benefits</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Last Updated</p>
          <p className="text-xs font-medium text-foreground">Jan 15, 2024</p>
        </div>
      </motion.div>
      <DependentForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
