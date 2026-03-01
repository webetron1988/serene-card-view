import { motion } from "framer-motion";
import { IdCard, Fingerprint, Wifi, Mail, Car, ShieldCheck, Network, Key } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const employerData = [
  { label: "Employee ID", value: "EMP-2018-0847", icon: IdCard, primary: true },
  { label: "Badge Number", value: "NY-0847", icon: IdCard },
  { label: "Biometric ID", value: "BIO-0847-NY", icon: Fingerprint },
  { label: "Network Username", value: "jmitchell", icon: Network },
  { label: "Email", value: "john.mitchell@company.com", icon: Mail },
  { label: "Parking Permit", value: "PKG-NY-0847", icon: Car },
];

const accessData = [
  { label: "Access Level", value: "Level 3", description: "Senior Staff", icon: ShieldCheck, color: "text-status-completed" },
  { label: "VPN Access", value: "Enabled", icon: Wifi, color: "text-status-completed" },
];

export const EmployerIDsPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Employer IDs & Access"
        subtitle="Internal identification and system access credentials"
        icon={IdCard}
        stats={[
          { label: "IDs Issued", value: "6" },
          { label: "Access Level", value: "3" },
        ]}
      />

      {/* Primary Employee ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <IdCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Primary Employee ID</p>
                  <p className="text-xl font-bold text-foreground font-mono">EMP-2018-0847</p>
                </div>
              </div>
              <Badge className="bg-status-completed/10 text-status-completed border-0">
                Active
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Badge</p>
                <p className="text-sm font-semibold text-foreground">NY-0847</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Biometric</p>
                <p className="text-sm font-semibold text-foreground">BIO-0847-NY</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Username</p>
                <p className="text-sm font-semibold text-foreground">jmitchell</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Parking</p>
                <p className="text-sm font-semibold text-foreground">PKG-NY-0847</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Email Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Corporate Email</p>
              <p className="text-sm font-medium text-foreground">john.mitchell@company.com</p>
            </div>
            <Badge className="bg-status-completed/10 text-status-completed border-0 text-[10px]">
              Verified
            </Badge>
          </div>
        </Card>
      </motion.div>

      {/* Access Level Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          Access & Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accessData.map((item, index) => (
            <Card key={item.label} className="p-4 border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-status-completed/10">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                      {item.description && (
                        <span className="text-xs text-muted-foreground">({item.description})</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-status-completed animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
