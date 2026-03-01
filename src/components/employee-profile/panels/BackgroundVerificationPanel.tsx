import { motion } from "framer-motion";
import { Search, CheckCircle2, Calendar, Building2, ShieldCheck } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const checks = [
  {
    type: "Criminal Background (Annual)",
    agency: "Sterling",
    date: "Jan 15, 2024",
    result: "Clear",
    validUntil: "Jan 15, 2025",
    resultType: "success" as const,
    icon: "🔍",
  },
  {
    type: "Criminal Background (Pre-Employment)",
    agency: "Sterling",
    date: "Jun 1, 2018",
    result: "Clear",
    validUntil: "N/A",
    resultType: "success" as const,
    icon: "🔍",
  },
  {
    type: "Employment Verification",
    agency: "Sterling",
    date: "Jun 1, 2018",
    result: "Verified",
    validUntil: "N/A",
    resultType: "success" as const,
    icon: "💼",
  },
  {
    type: "Education Verification",
    agency: "Sterling",
    date: "Jun 1, 2018",
    result: "Verified",
    validUntil: "N/A",
    resultType: "success" as const,
    icon: "🎓",
  },
  {
    type: "Credit Check",
    agency: "Sterling",
    date: "Jun 1, 2018",
    result: "Satisfactory",
    validUntil: "N/A",
    resultType: "success" as const,
    icon: "💳",
  },
];

const resultStyles = {
  success: "bg-status-completed/10 text-status-completed",
};

export const BackgroundVerificationPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Background Verification"
        subtitle="Pre-employment and ongoing background screening"
        icon={Search}
        stats={[
          { label: "Checks", value: checks.length },
          { label: "Cleared", value: checks.length },
        ]}
      />

      <div className="space-y-3">
        {checks.map((check, index) => (
          <motion.div
            key={check.type}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-sm transition-all">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary text-2xl shrink-0">
                    {check.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="text-sm font-semibold text-foreground">{check.type}</h4>
                      <Badge className={`border-0 text-[10px] shrink-0 ${resultStyles[check.resultType]}`}>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {check.result}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Agency</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground">{check.agency}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Conducted</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground">{check.date}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Valid Until</p>
                        <div className="flex items-center gap-1 mt-1">
                          <ShieldCheck className="h-3 w-3 text-primary" />
                          <p className="text-xs font-medium text-foreground">{check.validUntil}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Verification Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl bg-status-completed/5 border border-status-completed/20"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-status-completed shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">All background checks cleared</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Last annual screening completed Jan 15, 2024. Next due Jan 15, 2025.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
