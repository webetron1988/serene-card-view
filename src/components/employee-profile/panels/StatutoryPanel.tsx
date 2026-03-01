import { motion } from "framer-motion";
import { FileCheck, CheckCircle2, AlertCircle, Building2, Users, Shield } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statutoryData = [
  { label: "Tax ID / SSN", value: "XXX-XX-4789", icon: Shield, masked: true },
  { label: "W-4 Status", value: "Married Filing Jointly", icon: Users },
  { label: "Allowances", value: "3", icon: FileCheck },
  { label: "State Tax", value: "New York", icon: Building2 },
];

const verificationData = [
  { label: "I-9 Verified", value: "Yes", date: "Jun 15, 2018", status: "verified" },
  { label: "E-Verify", value: "Verified", date: null, status: "verified" },
];

export const StatutoryPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Statutory Registration"
        subtitle="Tax registration and compliance verification"
        icon={FileCheck}
      />

      {/* Tax Information Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30">
            {statutoryData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-card p-5 hover:bg-secondary/30 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
                <p className={`text-sm font-semibold text-foreground ${item.masked ? "font-mono" : ""}`}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Verification Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          Employment Verification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verificationData.map((item, index) => (
            <Card key={item.label} className="p-4 border-status-completed/30 bg-status-completed/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-status-completed/10">
                    <CheckCircle2 className="h-4 w-4 text-status-completed" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    {item.date && (
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    )}
                  </div>
                </div>
                <Badge className="bg-status-completed/10 text-status-completed border-0">
                  {item.value}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Compliance Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-status-completed/5 border border-status-completed/20"
      >
        <div className="p-2 rounded-full bg-status-completed/10">
          <CheckCircle2 className="h-5 w-5 text-status-completed" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Fully Compliant</p>
          <p className="text-xs text-muted-foreground">All statutory registrations and verifications are up-to-date</p>
        </div>
        <Badge className="bg-status-completed text-white border-0">
          100%
        </Badge>
      </motion.div>
    </div>
  );
};
