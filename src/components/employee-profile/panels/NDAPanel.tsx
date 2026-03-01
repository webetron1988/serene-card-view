import { motion } from "framer-motion";
import { FileSignature, Calendar, Clock, CheckCircle2, AlertTriangle, Infinity } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const agreements = [
  {
    type: "Non-Disclosure Agreement (NDA)",
    signedDate: "Jun 15, 2018",
    effectivePeriod: "Employment + 5 Years",
    postEmployment: "5 Years",
    status: "Active",
    icon: "🔒",
  },
  {
    type: "Non-Compete Agreement",
    signedDate: "Jun 15, 2018",
    effectivePeriod: "Employment + 1 Year",
    postEmployment: "1 Year",
    status: "Active",
    icon: "⚖️",
  },
  {
    type: "Intellectual Property Agreement",
    signedDate: "Jun 15, 2018",
    effectivePeriod: "Perpetual",
    postEmployment: "Perpetual",
    status: "Active",
    icon: "💡",
  },
  {
    type: "Data Protection Agreement",
    signedDate: "Jan 1, 2020",
    effectivePeriod: "Employment",
    postEmployment: "N/A",
    status: "Active",
    icon: "🛡️",
  },
];

export const NDAPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="NDA & Non-Compete Agreements"
        subtitle="Legal agreements and contractual obligations"
        icon={FileSignature}
        stats={[
          { label: "Agreements", value: agreements.length },
          { label: "Active", value: agreements.length },
        ]}
      />

      {/* Agreements Timeline */}
      <div className="space-y-4">
        {agreements.map((agreement, index) => (
          <motion.div
            key={agreement.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="p-3 rounded-xl bg-secondary text-2xl shrink-0">
                    {agreement.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="text-sm font-semibold text-foreground">
                        {agreement.type}
                      </h4>
                      <Badge className="bg-status-completed/10 text-status-completed border-0 text-[10px] shrink-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {agreement.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Signed Date</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground">{agreement.signedDate}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Effective Period</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground">{agreement.effectivePeriod}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Post-Employment</p>
                        <div className="flex items-center gap-1 mt-1">
                          {agreement.postEmployment === "Perpetual" ? (
                            <Infinity className="h-3 w-3 text-primary" />
                          ) : agreement.postEmployment === "N/A" ? (
                            <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Clock className="h-3 w-3 text-priority-medium" />
                          )}
                          <p className={`text-xs font-medium ${
                            agreement.postEmployment === "Perpetual" ? "text-primary" : 
                            agreement.postEmployment === "N/A" ? "text-muted-foreground" : "text-foreground"
                          }`}>
                            {agreement.postEmployment}
                          </p>
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

      {/* Legal Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl bg-priority-medium/5 border border-priority-medium/20"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-priority-medium shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Important Notice</p>
            <p className="text-xs text-muted-foreground mt-1">
              These agreements remain binding according to their specified terms. The Intellectual Property Agreement 
              and NDA continue after employment termination. Please contact Legal for any questions.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
