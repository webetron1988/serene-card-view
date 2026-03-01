import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CreditCard, CheckCircle2, PiggyBank } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BankAccountForm } from "../forms/BankAccountForm";

const bankAccounts = [
  {
    type: "Primary",
    accountType: "Checking",
    bank: "Chase Bank",
    accountNumber: "****4567",
    routingNumber: "021000021",
    split: 80,
    status: "Active",
    isPrimary: true,
  },
  {
    type: "Secondary",
    accountType: "Savings",
    bank: "Chase Bank",
    accountNumber: "****8901",
    routingNumber: "021000021",
    split: 20,
    status: "Active",
    isPrimary: false,
  },
];

export const BankAccountPanel = () => {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Bank Account Details"
        subtitle="Payroll deposit accounts and split configuration"
        icon={Building2}
        onAdd={() => setFormOpen(true)}
        addLabel="Add Account"
        stats={[
          { label: "Accounts", value: "2" },
          { label: "Active", value: "2" },
        ]}
      />

      {/* Bank Account Cards */}
      <div className="space-y-4">
        {bankAccounts.map((account, index) => (
          <motion.div
            key={account.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className={`overflow-hidden border-border/50 ${account.isPrimary ? "border-primary/30" : ""}`}>
              <div className={`p-5 ${account.isPrimary ? "bg-gradient-to-r from-primary/5 to-transparent" : ""}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${account.isPrimary ? "bg-primary/10" : "bg-secondary"}`}>
                      {account.isPrimary ? (
                        <CreditCard className="h-5 w-5 text-primary" />
                      ) : (
                        <PiggyBank className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{account.type}</h4>
                        <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">
                          {account.accountType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{account.bank}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-status-completed/10 text-status-completed border-0 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {account.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Account Number</p>
                    <p className="text-sm font-mono font-semibold text-foreground">{account.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Routing Number</p>
                    <p className="text-sm font-mono font-semibold text-foreground">{account.routingNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Split %</p>
                    <p className="text-sm font-semibold text-foreground">{account.split}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-status-completed" />
                      <p className="text-sm font-semibold text-foreground">{account.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <BankAccountForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
