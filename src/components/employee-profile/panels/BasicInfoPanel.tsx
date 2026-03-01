import { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, MapPin, Heart, Flag, BookOpen, FileText, Globe, Sparkles } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { BasicInfoForm } from "../forms/BasicInfoForm";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const BasicInfoPanel = () => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PanelHeader 
        title="Basic Information" 
        subtitle="Core personal details and identity information"
        icon={User}
        onEdit={() => setEditOpen(true)}
      />
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-5"
      >
        {/* Name Card - Featured */}
        <motion.div variants={item} className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 rounded-2xl p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Full Legal Name</p>
                <h3 className="text-xl font-bold text-foreground">John David Mitchell</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-card/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border">
                  <p className="text-[9px] text-muted-foreground">Preferred</p>
                  <p className="text-sm font-semibold text-foreground">John</p>
                </div>
                <div className="bg-card/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border">
                  <p className="text-[9px] text-muted-foreground">Arabic</p>
                  <p className="text-sm font-semibold text-foreground" dir="rtl">جون ديفيد ميتشل</p>
                </div>
                <div className="bg-card/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border">
                  <p className="text-[9px] text-muted-foreground">Pronouns</p>
                  <p className="text-sm font-semibold text-foreground">He/Him</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Identity Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Birth Info */}
          <motion.div variants={item} className="group bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Birth Details</p>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-lg font-bold text-foreground">March 15, 1987</p>
                <p className="text-xs text-muted-foreground">37 Years Old</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Boston, MA, USA</span>
              </div>
            </div>
          </motion.div>

          {/* Marital Status */}
          <motion.div variants={item} className="group bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                <Heart className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Marital Status</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 bg-status-completed/10 text-status-completed text-[10px] font-medium rounded-full">
                  Married
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">Sarah Elizabeth Mitchell</p>
              <p className="text-xs text-muted-foreground">Since Jun 20, 2015</p>
            </div>
          </motion.div>

          {/* Nationality */}
          <motion.div variants={item} className="group bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                <Flag className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Nationality</p>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-foreground">United States</p>
              <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                Citizen
              </span>
            </div>
          </motion.div>
        </div>

        {/* Documents Row */}
        <motion.div variants={item} className="grid sm:grid-cols-2 gap-4">
          {/* Passport */}
          <div className="relative overflow-hidden bg-gradient-to-r from-card via-card to-secondary/30 border border-border rounded-xl p-4">
            <div className="absolute top-2 right-2">
              <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center">
                <span className="text-[8px] font-bold text-muted-foreground">USA</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Passport</p>
                <p className="text-sm font-bold text-foreground font-mono tracking-wide">US-123456789</p>
                <p className="text-xs text-muted-foreground mt-1">Expires: Jan 2030</p>
              </div>
            </div>
          </div>

          {/* Religion */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Religion</p>
                <p className="text-sm font-bold text-foreground">Christianity</p>
                <p className="text-xs text-muted-foreground">Protestant</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <BasicInfoForm open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
