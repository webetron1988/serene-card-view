import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Trophy, ThumbsUp, DollarSign, Calendar, Sparkles } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { AppreciationForm } from "../forms/AppreciationForm";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const majorAwards = [
  { title: "Innovation Excellence Award", date: "November 2024", awardedBy: "CTO", description: "Recognized for developing breakthrough ML-based fraud detection system saving $2M annually.", cashAward: "$5,000", icon: "🏆" },
  { title: "Star Performer Q4 2023", date: "December 2023", awardedBy: "CEO", description: "Outstanding contribution to enterprise data strategy and team leadership.", cashAward: "$3,000", icon: "🌟" },
];

const recentAppreciations = [
  { date: "Dec 10, 2024", type: "Kudos", from: "Dr. Patricia Johnson", description: "Excellent board presentation on ML initiatives", icon: "👏" },
  { date: "Nov 15, 2024", type: "Thank You", from: "Michael Chen", description: "Great collaboration on product analytics", icon: "🙏" },
  { date: "Jun 2024", type: "Award", from: "VP, Data Science", description: "Team Player Award", value: "$1,000", icon: "🏅" },
  { date: "Sep 2022", type: "Spot Award", from: "Manager", description: "Project Excellence", value: "$500", icon: "⭐" },
];

const appreciationStats = [
  { label: "Appreciations", value: 24 },
  { label: "Awards Won", value: 12 },
  { label: "Cash Rewards", value: "$24.5K" },
];

export const AppreciationsPanel = () => {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PanelHeader 
        title="Appreciation & Achievements" 
        subtitle="Recognition, awards, and accomplishments"
        icon={Award}
        stats={appreciationStats}
        onAdd={() => setAddOpen(true)}
        addLabel="Add Appreciation"
      />

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* Summary */}
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 rounded-2xl p-4 text-center">
            <ThumbsUp className="h-5 w-5 text-primary mx-auto mb-2" /><p className="text-2xl font-black text-foreground">24</p><p className="text-[10px] text-muted-foreground">Appreciations</p>
          </div>
          <div className="bg-gradient-to-br from-category-strategy/10 via-card to-card border border-category-strategy/20 rounded-2xl p-4 text-center">
            <Trophy className="h-5 w-5 text-category-strategy mx-auto mb-2" /><p className="text-2xl font-black text-foreground">12</p><p className="text-[10px] text-muted-foreground">Awards Won</p>
          </div>
          <div className="bg-gradient-to-br from-category-talent/10 via-card to-card border border-category-talent/20 rounded-2xl p-4 text-center">
            <Sparkles className="h-5 w-5 text-category-talent mx-auto mb-2" /><p className="text-2xl font-black text-foreground">2</p><p className="text-[10px] text-muted-foreground">Patents</p>
          </div>
          <div className="bg-gradient-to-br from-status-completed/10 via-card to-card border border-status-completed/20 rounded-2xl p-4 text-center">
            <DollarSign className="h-5 w-5 text-status-completed mx-auto mb-2" /><p className="text-2xl font-black text-foreground">$24.5K</p><p className="text-[10px] text-muted-foreground">Cash Awards</p>
          </div>
        </motion.div>

        {/* Major Awards */}
        <motion.div variants={item}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><Trophy className="h-3.5 w-3.5" />Major Awards</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {majorAwards.map((award, index) => (
              <motion.div key={award.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + index * 0.1 }}
                className="relative overflow-hidden bg-gradient-to-br from-category-strategy/5 via-card to-card border border-category-strategy/20 rounded-xl p-5">
                <div className="absolute top-3 right-3 text-2xl">{award.icon}</div>
                <div className="pr-10">
                  <p className="text-xs text-muted-foreground mb-1">{award.date}</p>
                  <h4 className="font-bold text-foreground mb-1">{award.title}</h4>
                  <p className="text-[10px] text-muted-foreground mb-3">Awarded by {award.awardedBy}</p>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{award.description}</p>
                  <span className="inline-flex items-center px-3 py-1 bg-status-completed/10 text-status-completed text-sm font-bold rounded-lg">{award.cashAward}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Appreciations Timeline */}
        <motion.div variants={item}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />Recent Appreciations</p>
          <div className="space-y-2">
            {recentAppreciations.map((appreciation, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }}
                className="group flex items-center gap-4 p-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="text-xl">{appreciation.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-[9px] font-medium rounded">{appreciation.type}</span>
                    <span className="text-[10px] text-muted-foreground">{appreciation.date}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{appreciation.description}</p>
                  <p className="text-[10px] text-muted-foreground">From: {appreciation.from}</p>
                </div>
                {appreciation.value && (
                  <span className="px-2.5 py-1 bg-status-completed/10 text-status-completed text-xs font-bold rounded-lg shrink-0">{appreciation.value}</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <AppreciationForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};
