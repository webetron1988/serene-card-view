import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Clock, User, Star, CheckCircle2, Flag } from "lucide-react";
import { PanelHeader } from "./PanelHeader";

const milestones = [
  { day: "Day 1", label: "Probation Start", date: "Jun 15, 2018", status: "completed" },
  { day: "Day 30", label: "First Check-in", date: "Jul 15, 2018", status: "completed" },
  { day: "Day 60", label: "Mid-Point Review", date: "Aug 15, 2018", status: "completed" },
  { day: "Day 90", label: "Confirmed", date: "Sep 15, 2018", status: "completed" },
];

const probationDetails = [
  { label: "Probation Period", value: "90 Days", icon: Clock },
  { label: "Probation Start", value: "Jun 15, 2018", icon: Calendar },
  { label: "Probation End", value: "Sep 15, 2018", icon: Calendar },
  { label: "Extended", value: "No", icon: Flag },
  { label: "Confirmation Date", value: "Sep 15, 2018", icon: CheckCircle2 },
  { label: "Confirmed By", value: "Robert Williams", icon: User },
];

export const ProbationPanel = () => {
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Probation & Confirmation"
        subtitle="Probation period tracking and confirmation status"
        icon={ShieldCheck}
        stats={[
          { label: "Duration", value: "90 Days" },
          { label: "Rating", value: "Exceeds" },
        ]}
      />

      {/* Confirmation Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-status-completed/20 bg-card"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-status-completed/5 via-transparent to-transparent" />
        <div className="relative p-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="p-3 rounded-2xl bg-status-completed/10"
            >
              <ShieldCheck className="h-7 w-7 text-status-completed" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Employment Confirmed</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-status-completed/10 text-status-completed text-[10px] font-semibold">
                  Exceeds Expectations
                </span>
                <span className="text-[11px] text-muted-foreground">• Sep 15, 2018</span>
              </div>
            </div>
          </div>

          {/* Milestone Timeline (Horizontal) */}
          <div className="relative">
            {/* Connector Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="absolute top-5 left-0 h-0.5 bg-status-completed"
            />

            <div className="relative flex justify-between">
              {milestones.map((m, index) => (
                <motion.div
                  key={m.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.15 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.15, type: "spring" }}
                    className="w-10 h-10 rounded-full bg-status-completed flex items-center justify-center shadow-sm z-10"
                  >
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </motion.div>
                  <span className="text-[11px] font-semibold text-foreground mt-2">{m.day}</span>
                  <span className="text-[10px] text-muted-foreground">{m.label}</span>
                  <span className="text-[9px] text-muted-foreground/70">{m.date}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Details Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Probation Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {probationDetails.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + index * 0.04 }}
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
