import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Droplet, Ruler, Eye, AlertTriangle, Heart, Stethoscope, Calendar, Scale, CheckCircle2, XCircle } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { PhysicalHealthForm } from "../forms/PhysicalHealthForm";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const PhysicalHealthPanel = () => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PanelHeader 
        title="Physical Attributes & Health" 
        subtitle="Medical information and physical characteristics"
        icon={Stethoscope}
        onEdit={() => setEditOpen(true)}
      />
      
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-5">
        {/* Health Stats */}
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="relative bg-gradient-to-br from-red-500/10 via-card to-card border border-red-500/20 rounded-2xl p-4 text-center">
            <Droplet className="h-5 w-5 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-foreground">O+</p>
            <p className="text-[10px] text-muted-foreground mt-1">Blood Group</p>
            <span className="inline-flex items-center mt-2 px-2 py-0.5 bg-status-completed/10 text-status-completed text-[9px] font-medium rounded-full">🩸 Donor</span>
          </div>
          <div className="relative bg-gradient-to-br from-status-completed/10 via-card to-card border border-status-completed/20 rounded-2xl p-4 text-center">
            <Scale className="h-5 w-5 text-status-completed mx-auto mb-2" />
            <p className="text-2xl font-black text-foreground">24.4</p>
            <p className="text-[10px] text-muted-foreground mt-1">BMI Index</p>
            <span className="inline-flex items-center mt-2 px-2 py-0.5 bg-status-completed/10 text-status-completed text-[9px] font-medium rounded-full">✓ Normal</span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <Ruler className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-black text-foreground">5'11"</p>
            <p className="text-[10px] text-muted-foreground mt-1">Height</p>
            <p className="text-[9px] text-muted-foreground/70 mt-1">180 cm</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <Activity className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-black text-foreground">175</p>
            <p className="text-[10px] text-muted-foreground mt-1">Weight (lbs)</p>
            <p className="text-[9px] text-muted-foreground/70 mt-1">79 kg</p>
          </div>
        </motion.div>

        {/* Medical Fitness */}
        <motion.div variants={item} className="bg-gradient-to-r from-status-completed/5 via-card to-card border border-status-completed/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-status-completed/10 rounded-xl">
                <Heart className="h-5 w-5 text-status-completed" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Medical Fitness Status</p>
                <p className="text-xs text-muted-foreground">Last checkup: Nov 10, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-status-completed/10 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-status-completed" />
              <span className="text-sm font-bold text-status-completed">Fit for Work</span>
            </div>
          </div>
        </motion.div>

        {/* Vision & Alerts */}
        <div className="grid sm:grid-cols-2 gap-4">
          <motion.div variants={item} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vision</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Status</span><span className="text-sm font-medium text-foreground">Corrected</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Type</span><span className="text-sm font-medium text-foreground">Contact Lenses</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Color Blindness</span><div className="flex items-center gap-1.5 text-status-completed"><CheckCircle2 className="h-3.5 w-3.5" /><span className="text-sm font-medium">None</span></div></div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-destructive/10 rounded-lg"><AlertTriangle className="h-4 w-4 text-destructive" /></div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Medical Alerts</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Allergies</p>
                <span className="inline-flex items-center px-3 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded-lg border border-destructive/20">⚠️ Penicillin</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border"><span className="text-sm text-muted-foreground">Chronic Conditions</span><div className="flex items-center gap-1.5 text-status-completed"><CheckCircle2 className="h-3.5 w-3.5" /><span className="text-sm font-medium">None</span></div></div>
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Physical Disability</span><div className="flex items-center gap-1.5 text-status-completed"><CheckCircle2 className="h-3.5 w-3.5" /><span className="text-sm font-medium">None</span></div></div>
            </div>
          </motion.div>
        </div>

        {/* Identification Marks */}
        <motion.div variants={item} className="bg-secondary/30 border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Identification Marks</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground">Mole on right cheek</span>
            <span className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground">Scar on left forearm</span>
          </div>
        </motion.div>
      </motion.div>

      <PhysicalHealthForm open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
