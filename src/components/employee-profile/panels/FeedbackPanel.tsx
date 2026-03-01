import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Minus, User, Calendar, ArrowRight } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { FeedbackForm } from "../forms/FeedbackForm";

const feedbackEntries = [
  {
    date: "Dec 10, 2024",
    type: "1:1 Check-in",
    from: "Dr. Patricia Johnson",
    fromRole: "VP, Data Science",
    summary: "Excellent progress on Q4 deliverables. ML fraud model is ahead of schedule. Discussed next steps for team expansion.",
    sentiment: "positive",
    actionItems: ["Prepare team expansion proposal", "Schedule stakeholder demo"],
  },
  {
    date: "Nov 25, 2024",
    type: "Peer Feedback",
    from: "Michael Chen",
    fromRole: "Director, Product Analytics",
    summary: "Great collaboration on product analytics integration. John's technical leadership was instrumental in bridging the gap between data science and product teams.",
    sentiment: "positive",
    actionItems: [],
  },
  {
    date: "Nov 15, 2024",
    type: "1:1 Check-in",
    from: "Dr. Patricia Johnson",
    fromRole: "VP, Data Science",
    summary: "Discussed career growth trajectory and L&D priorities for 2025. Agreed on leadership development as focus area.",
    sentiment: "neutral",
    actionItems: ["Enroll in leadership program", "Identify mentorship opportunities"],
  },
  {
    date: "Oct 30, 2024",
    type: "Project Review",
    from: "Cross-functional Stakeholders",
    fromRole: "Fraud Prevention Team",
    summary: "Fraud detection model exceeded all expectations — 35% improvement in detection rate with zero increase in false positives. Stakeholders highly impressed.",
    sentiment: "positive",
    actionItems: ["Document best practices", "Plan model v2 roadmap"],
  },
  {
    date: "Sep 20, 2024",
    type: "Skip-Level Review",
    from: "Sarah Mitchell",
    fromRole: "CTO",
    summary: "Recognized as a key contributor to the technology org. Discussed potential for broader impact through cross-team initiatives.",
    sentiment: "positive",
    actionItems: ["Lead cross-team ML guild"],
  },
];

const sentimentConfig = {
  positive: { icon: ThumbsUp, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Positive" },
  neutral: { icon: Minus, color: "text-amber-500", bg: "bg-amber-500/10", label: "Neutral" },
};

const typeColors: Record<string, string> = {
  "1:1 Check-in": "bg-primary/10 text-primary",
  "Peer Feedback": "bg-violet-500/10 text-violet-600",
  "Project Review": "bg-emerald-500/10 text-emerald-600",
  "Skip-Level Review": "bg-amber-500/10 text-amber-600",
};

export const FeedbackPanel = () => {
  const [addOpen, setAddOpen] = useState(false);
  const positiveCount = feedbackEntries.filter((f) => f.sentiment === "positive").length;
  const totalActions = feedbackEntries.reduce((s, f) => s + f.actionItems.length, 0);

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Continuous Feedback & Check-ins"
        subtitle="360° feedback, manager check-ins & action tracking"
        icon={MessageSquare}
        onAdd={() => setAddOpen(true)}
        addLabel="Add Feedback"
        stats={[
          { label: "Total Entries", value: feedbackEntries.length },
          { label: "Positive", value: `${Math.round((positiveCount / feedbackEntries.length) * 100)}%` },
          { label: "Action Items", value: totalActions },
        ]}
      />

      {/* Sentiment Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sentiment Distribution</span>
        </div>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(positiveCount / feedbackEntries.length) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-emerald-500 rounded-l-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((feedbackEntries.length - positiveCount) / feedbackEntries.length) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-amber-400 rounded-r-full"
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Positive ({positiveCount})</span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-full bg-amber-400" /> Neutral ({feedbackEntries.length - positiveCount})</span>
        </div>
      </motion.div>

      {/* Feedback Timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {feedbackEntries.map((entry, index) => {
            const config = sentimentConfig[entry.sentiment as keyof typeof sentimentConfig];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div className={`absolute left-2.5 top-4 w-4 h-4 rounded-full border-2 border-card ${config.bg} flex items-center justify-center`}>
                  <config.icon className={`h-2 w-2 ${config.color}`} />
                </div>

                <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${typeColors[entry.type] || "bg-secondary text-muted-foreground"}`}>
                          {entry.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-foreground">{entry.from}</span>
                          <span className="text-[10px] text-muted-foreground ml-1.5">{entry.fromRole}</span>
                        </div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {entry.date}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">{entry.summary}</p>

                  {entry.actionItems.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Action Items</span>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {entry.actionItems.map((item) => (
                          <span key={item} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/5 text-[10px] text-primary font-medium">
                            <ArrowRight className="h-2.5 w-2.5" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <FeedbackForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};
