import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Shield, PiggyBank, Award, Phone, Calendar, Percent } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NominationForm } from "../forms/NominationForm";

const nominations = [
  {
    benefitType: "Life Insurance (Primary)",
    nominee: "Sarah Elizabeth Mitchell",
    relationship: "Spouse",
    share: 100,
    contact: "+1 (212) 555-0148",
    lastUpdated: "Jan 15, 2024",
    icon: Shield,
    color: "bg-primary",
    initials: "SM",
  },
  {
    benefitType: "Life Insurance (Contingent)",
    nominee: "Emma Grace Mitchell",
    relationship: "Daughter",
    share: 50,
    contact: "N/A (Minor)",
    lastUpdated: "Jan 15, 2024",
    icon: Shield,
    color: "bg-purple-500",
    initials: "EM",
  },
  {
    benefitType: "Life Insurance (Contingent)",
    nominee: "James Robert Mitchell",
    relationship: "Son",
    share: 50,
    contact: "N/A (Minor)",
    lastUpdated: "Jan 15, 2024",
    icon: Shield,
    color: "bg-blue-500",
    initials: "JM",
  },
  {
    benefitType: "401(k) (Primary)",
    nominee: "Sarah Elizabeth Mitchell",
    relationship: "Spouse",
    share: 100,
    contact: "+1 (212) 555-0148",
    lastUpdated: "Jan 15, 2024",
    icon: PiggyBank,
    color: "bg-status-completed",
    initials: "SM",
  },
  {
    benefitType: "Gratuity (Primary)",
    nominee: "Sarah Elizabeth Mitchell",
    relationship: "Spouse",
    share: 100,
    contact: "+1 (212) 555-0148",
    lastUpdated: "Jan 15, 2024",
    icon: Award,
    color: "bg-priority-medium",
    initials: "SM",
  },
];

export const NominationsPanel = () => {
  const [formOpen, setFormOpen] = useState(false);
  const benefitTypes = [...new Set(nominations.map(n => n.benefitType.split(" (")[0]))];

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Nominations"
        subtitle="Beneficiary nominations for various employee benefits"
        icon={UserCheck}
        onAdd={() => setFormOpen(true)}
        addLabel="Add Nomination"
        stats={[
          { label: "Benefits", value: benefitTypes.length },
          { label: "Nominees", value: "3" },
        ]}
      />

      {/* Grouped by Benefit Type */}
      {["Life Insurance", "401(k)", "Gratuity"].map((type, typeIndex) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: typeIndex * 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            {type === "Life Insurance" && <Shield className="h-4 w-4 text-primary" />}
            {type === "401(k)" && <PiggyBank className="h-4 w-4 text-status-completed" />}
            {type === "Gratuity" && <Award className="h-4 w-4 text-priority-medium" />}
            <h3 className="text-sm font-semibold text-foreground">{type}</h3>
          </div>

          <Card className="overflow-hidden border-border/50">
            <div className="divide-y divide-border/50">
              {nominations
                .filter(n => n.benefitType.startsWith(type))
                .map((nomination, index) => (
                  <motion.div
                    key={`${nomination.benefitType}-${nomination.nominee}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: typeIndex * 0.1 + index * 0.05 }}
                    className="p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className={`h-10 w-10 ${nomination.color}`}>
                        <AvatarFallback className="text-white text-xs font-semibold">
                          {nomination.initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {nomination.nominee}
                          </h4>
                          <Badge className="bg-secondary text-muted-foreground border-0 text-[10px]">
                            {nomination.relationship}
                          </Badge>
                          {nomination.benefitType.includes("Primary") && (
                            <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                              Primary
                            </Badge>
                          )}
                          {nomination.benefitType.includes("Contingent") && (
                            <Badge className="bg-priority-medium/10 text-priority-medium border-0 text-[10px]">
                              Contingent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {nomination.contact}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {nomination.lastUpdated}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary">
                        <Percent className="h-3 w-3 text-primary" />
                        <span className="text-sm font-bold text-foreground">{nomination.share}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </Card>
        </motion.div>
      ))}
      <NominationForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
