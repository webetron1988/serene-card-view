import { motion } from "framer-motion";
import { TrendingUp, ArrowUp, Calendar, DollarSign, Clock, Award } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const promotions = [
  {
    date: "Mar 10, 2022",
    fromPosition: "Data Scientist II",
    toPosition: "Senior Data Scientist",
    fromGrade: "L6",
    toGrade: "L7",
    salaryChange: "+13.3%",
    reason: "Exceptional performance & leadership in ML platform migration",
    approvedBy: "Dr. Patricia Johnson",
    keyAchievement: "Led $12M fraud detection system",
    timeInPrevRole: "2 years",
  },
  {
    date: "Apr 1, 2020",
    fromPosition: "Data Scientist",
    toPosition: "Data Scientist II",
    fromGrade: "L5",
    toGrade: "L6",
    salaryChange: "+10.6%",
    reason: "Consistent high performance & customer analytics platform delivery",
    approvedBy: "Robert Williams",
    keyAchievement: "Built customer churn prediction model",
    timeInPrevRole: "2 years",
  },
  {
    date: "Jun 15, 2018",
    fromPosition: "External Hire",
    toPosition: "Data Scientist",
    fromGrade: "—",
    toGrade: "L5",
    salaryChange: "New Hire",
    reason: "Hired from Tech Corp Inc. based on strong technical assessment",
    approvedBy: "Robert Williams",
    keyAchievement: "Joined the organization",
    timeInPrevRole: "—",
  },
];

// Already in descending order (latest first)

export const PromotionHistoryPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Promotion History"
        subtitle="Career advancement milestones & growth trajectory"
        icon={TrendingUp}
        pastel="green"
        stats={[
          { label: "Total Promotions", value: 2 },
          { label: "Avg Gap", value: "2 Yrs" },
          { label: "Current Tenure", value: "2.75 Yrs" },
        ]}
      />

      {/* Growth Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Promotions", value: "2", sub: "since joining", pastelBg: "bg-pastel-blue", pastelIcon: "text-pastel-blue-icon", icon: ArrowUp },
          { label: "Avg Interval", value: "2 Yrs", sub: "between promotions", pastelBg: "bg-pastel-teal", pastelIcon: "text-pastel-teal-icon", icon: Clock },
          { label: "Grade Growth", value: "L5 → L7", sub: "3 grades in 6.5 years", pastelBg: "bg-pastel-purple", pastelIcon: "text-pastel-purple-icon", icon: Award },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-4 border-border/50 text-center">
              <div className={`w-9 h-9 rounded-lg ${m.pastelBg} mx-auto mb-2 flex items-center justify-center`}>
                <m.icon className={`h-5 w-5 ${m.pastelIcon}`} />
              </div>
              <p className="text-lg font-bold text-foreground">{m.value}</p>
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
              <p className="text-[9px] text-muted-foreground/60">{m.sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Descending Timeline — latest at top */}
      <Card className="p-5 border-border/50">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 rounded-lg bg-pastel-green">
            <TrendingUp className="h-4 w-4 text-pastel-green-icon" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Growth Timeline</h3>
          <span className="text-[9px] text-muted-foreground">(latest → oldest)</span>
        </div>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-category-planning to-border" />

          <div className="space-y-0">
            {promotions.map((p, i) => (
              <motion.div
                key={p.date}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                className="relative pl-14 pb-6 last:pb-0"
              >
                <div className={`absolute left-2.5 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  i === 0 ? "border-primary bg-primary/20" : "border-muted-foreground/30 bg-card"
                }`}>
                  {i === 0 && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>

                <div className="absolute left-[42px] top-0">
                  <Badge className={`text-[9px] border-0 px-1.5 ${
                    i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}>{p.toGrade}</Badge>
                </div>

                <div className="ml-6 p-4 rounded-xl border border-border/40 bg-card hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.toPosition}</p>
                      {p.fromGrade !== "—" && (
                        <p className="text-[10px] text-muted-foreground">from {p.fromPosition}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{p.date}
                      </p>
                      {p.salaryChange !== "New Hire" && (
                        <p className="text-xs font-semibold text-pastel-green-icon flex items-center gap-1 justify-end">
                          <DollarSign className="h-3 w-3" />{p.salaryChange}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.reason}</p>
                  {p.timeInPrevRole !== "—" && (
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/30 text-[10px] text-muted-foreground">
                      <span>Time in prev role: {p.timeInPrevRole}</span>
                      <span>Approved by: {p.approvedBy}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
