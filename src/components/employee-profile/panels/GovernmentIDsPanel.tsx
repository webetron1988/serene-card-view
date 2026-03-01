import { useState } from "react";
import { motion } from "framer-motion";
import { Flag, Globe, FileText, Calendar, Car, Shield, AlertCircle } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GovernmentIDForm } from "../forms/GovernmentIDForm";

const homeCountryData = [
  { label: "Social Security Number", value: "XXX-XX-4789", icon: Shield, masked: true },
  { label: "Passport Number", value: "US-123456789", icon: FileText },
  { label: "Passport Expiry", value: "Jan 15, 2030", icon: Calendar, status: "valid" },
  { label: "Driver's License", value: "NY-DL-12345678", icon: Car },
  { label: "DL Expiry", value: "Mar 15, 2027", icon: Calendar, status: "valid" },
];

const employmentCountryData = [
  { label: "Work Permit / Visa", value: "N/A (US Citizen)", icon: FileText },
  { label: "Visa Type", value: "-", icon: Shield },
  { label: "Visa Expiry", value: "-", icon: Calendar },
  { label: "Local ID (Emirates ID, etc.)", value: "-", icon: FileText },
];

export const GovernmentIDsPanel = () => {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Government IDs"
        subtitle="Home & Employment Country identification documents"
        icon={FileText}
        onAdd={() => setFormOpen(true)}
        addLabel="Add ID"
        stats={[
          { label: "Documents", value: "5" },
          { label: "Valid", value: "5" },
        ]}
      />

      {/* Home Country Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Flag className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Home Country (USA)</h3>
          <Badge className="bg-status-completed/10 text-status-completed border-0 text-[10px]">
            Primary
          </Badge>
        </div>

        <Card className="overflow-hidden border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30">
            {homeCountryData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card p-4 hover:bg-secondary/30 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  {item.status === "valid" && (
                    <Badge className="bg-status-completed/10 text-status-completed border-0 text-[9px]">
                      Valid
                    </Badge>
                  )}
                </div>
                <p className={`mt-2 text-sm font-semibold text-foreground ${item.masked ? "font-mono" : ""}`}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Employment Country Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-category-planning/10">
            <Globe className="h-4 w-4 text-category-planning" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Employment Country (If Different)</h3>
          <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">
            N/A
          </Badge>
        </div>

        <Card className="overflow-hidden border-border/50 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30">
            {employmentCountryData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-card/50 p-4"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-muted-foreground/50" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10"
      >
        <AlertCircle className="h-4 w-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          All government IDs are verified and up-to-date. Next renewal: <span className="font-medium text-foreground">Driver's License (Mar 2027)</span>
        </p>
      </motion.div>
      <GovernmentIDForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
