import { motion } from "framer-motion";
import { Gift, DollarSign, Calendar, Briefcase, TrendingUp, Home, Award, CheckCircle2 } from "lucide-react";
import { PanelHeader } from "./PanelHeader";

const compensationBreakdown = [
  { label: "Base Salary", value: "$95,000", percentage: 86, icon: DollarSign },
  { label: "Signing Bonus", value: "$10,000", percentage: 9, icon: Award },
  { label: "Relocation Assistance", value: "$5,000", percentage: 5, icon: Home },
];

const offerMeta = [
  { label: "Offer Date", value: "May 25, 2018", icon: Calendar },
  { label: "Offer Accepted", value: "May 28, 2018", icon: CheckCircle2 },
  { label: "Offered Position", value: "Data Scientist", icon: Briefcase },
  { label: "Offered Grade", value: "Level 5", icon: TrendingUp },
  { label: "Start Date", value: "Jun 15, 2018", icon: Calendar },
];

export const OfferDetailsPanel = () => {
  const totalComp = 110000;

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Offer Details"
        subtitle="Compensation package and offer acceptance"
        icon={Gift}
        stats={[
          { label: "Total Package", value: "$110K" },
          { label: "Response Time", value: "3 Days" },
        ]}
      />

      {/* Offer Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-status-completed/5 via-transparent to-primary/5" />
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-status-completed/10">
              <CheckCircle2 className="h-5 w-5 text-status-completed" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-status-completed">Offer Accepted</h3>
              <p className="text-[11px] text-muted-foreground">Accepted within 3 days of offer</p>
            </div>
          </div>

          {/* Total Compensation */}
          <div className="text-center mb-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Total Compensation Package</p>
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-4xl font-bold text-foreground"
            >
              $110,000
            </motion.p>
          </div>

          {/* Compensation Bars */}
          <div className="space-y-3">
            {compensationBreakdown.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{item.value}</span>
                    <span className="text-[10px] text-muted-foreground">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.4 + index * 0.15, duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      index === 0 ? "bg-primary" :
                      index === 1 ? "bg-status-completed" :
                      "bg-priority-medium"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Offer Details Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Offer Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {offerMeta.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.04 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-semibold text-foreground pl-5.5">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
