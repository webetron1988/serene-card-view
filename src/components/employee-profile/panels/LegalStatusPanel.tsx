import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, Calendar, ShieldCheck, XCircle } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { LegalStatusForm } from "../forms/LegalStatusForm";

const legalItems = [
  { label: "Criminal Conviction", value: "No", clear: true },
  { label: "Pending Criminal Cases", value: "No", clear: true },
  { label: "Civil Litigation", value: "No", clear: true },
  { label: "Bankruptcy Filed", value: "No", clear: true },
];

export const LegalStatusPanel = () => {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Legal Status (Convicted by Law)"
        subtitle="Self-declaration and legal compliance records"
        icon={Scale}
        onEdit={() => setEditOpen(true)}
      />

      {/* Legal Status Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border-border/50">
          <div className="grid grid-cols-2 gap-px bg-border/30">
            {legalItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.06 }}
                className="p-5 bg-card hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${item.clear ? "bg-status-completed/10" : "bg-priority-high/10"}`}>
                    {item.clear ? (
                      <CheckCircle2 className="h-4 w-4 text-status-completed" />
                    ) : (
                      <XCircle className="h-4 w-4 text-priority-high" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Dates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden border-border/50">
          <div className="divide-y divide-border/50">
            <div className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Declaration Date</span>
              </div>
              <span className="text-sm font-medium text-foreground">Jun 15, 2018</span>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last Verification</span>
              </div>
              <span className="text-sm font-medium text-foreground">Jan 15, 2024</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* All Clear Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-xl bg-status-completed/5 border border-status-completed/20"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-status-completed shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Clean legal record</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              No adverse legal findings on record. Self-declaration verified Jan 15, 2024.
            </p>
          </div>
        </div>
      </motion.div>
      <LegalStatusForm open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
