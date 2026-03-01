import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, FileCheck, FileClock, ExternalLink, Zap, Pencil } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Button } from "@/components/ui/button";
import { PatentForm } from "../forms/PatentForm";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const patents = [
  { title: "ML-Based Fraud Detection System", type: "Patent", filingDate: "Jan 2023", status: "Granted", patentNumber: "US-2023-12345", reward: "$10,000", description: "Machine learning system for real-time fraud detection in financial transactions" },
  { title: "Real-Time Data Pipeline Optimization", type: "Patent", filingDate: "Jun 2024", status: "Pending", patentNumber: null, reward: "$2,500", description: "Novel approach to optimizing data pipeline throughput using adaptive algorithms" },
];

const patentStats = [
  { label: "Granted", value: 1 },
  { label: "Pending", value: 1 },
  { label: "Total Rewards", value: "$12.5K" },
];

export const PatentsPanel = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const openAdd = () => { setEditData(null); setFormOpen(true); };
  const openEdit = (patent: any) => { setEditData(patent); setFormOpen(true); };

  return (
    <div className="space-y-6">
      <PanelHeader 
        title="Innovation, Patents & IP" 
        subtitle="Intellectual property and innovation contributions"
        icon={Lightbulb}
        stats={patentStats}
        onAdd={openAdd}
        addLabel="Add Patent"
      />

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* Summary */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-status-completed/10 via-card to-card border border-status-completed/20 rounded-2xl p-4 text-center">
            <FileCheck className="h-5 w-5 text-status-completed mx-auto mb-2" /><p className="text-2xl font-black text-foreground">1</p><p className="text-[10px] text-muted-foreground">Granted</p>
          </div>
          <div className="bg-gradient-to-br from-category-strategy/10 via-card to-card border border-category-strategy/20 rounded-2xl p-4 text-center">
            <FileClock className="h-5 w-5 text-category-strategy mx-auto mb-2" /><p className="text-2xl font-black text-foreground">1</p><p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 rounded-2xl p-4 text-center">
            <Zap className="h-5 w-5 text-primary mx-auto mb-2" /><p className="text-2xl font-black text-foreground">$12.5K</p><p className="text-[10px] text-muted-foreground">Total Rewards</p>
          </div>
        </motion.div>

        {/* Patent Cards */}
        <motion.div variants={item}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><Lightbulb className="h-3.5 w-3.5" />Patent Portfolio</p>
          <div className="space-y-3">
            {patents.map((patent, index) => (
              <motion.div key={patent.title} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + index * 0.1 }}
                className={`group/card relative overflow-hidden bg-card border rounded-xl p-5 hover:shadow-md transition-all ${patent.status === "Granted" ? "border-status-completed/30" : "border-category-strategy/30"}`}>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(patent)}>
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${patent.status === "Granted" ? "bg-status-completed/10 text-status-completed" : "bg-category-strategy/10 text-category-strategy"}`}>
                    {patent.status === "Granted" ? "✓ Granted" : "⏳ Pending"}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${patent.status === "Granted" ? "bg-status-completed/10" : "bg-category-strategy/10"}`}>
                    <Lightbulb className={`h-6 w-6 ${patent.status === "Granted" ? "text-status-completed" : "text-category-strategy"}`} />
                  </div>
                  <div className="flex-1 pr-24">
                    <h4 className="font-bold text-foreground mb-1 group-hover/card:text-primary transition-colors">{patent.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{patent.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <span className="text-muted-foreground">Filed: <span className="text-foreground font-medium">{patent.filingDate}</span></span>
                      {patent.patentNumber && (
                        <a href="#" className="flex items-center gap-1 text-primary hover:underline">{patent.patentNumber}<ExternalLink className="h-3 w-3" /></a>
                      )}
                      <span className="px-2.5 py-1 bg-status-completed/10 text-status-completed font-bold rounded-lg">{patent.reward}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Innovation Summary */}
        <motion.div variants={item} className="bg-gradient-to-r from-primary/5 via-card to-card border border-primary/20 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl"><Zap className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm font-semibold text-foreground">Innovation Contributor</p>
              <p className="text-xs text-muted-foreground">Active participant in the company's innovation program</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <PatentForm open={formOpen} onOpenChange={setFormOpen} editData={editData} />
    </div>
  );
};
