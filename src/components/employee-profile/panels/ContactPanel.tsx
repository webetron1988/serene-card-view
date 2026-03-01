import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, AlertCircle, Globe, Linkedin, Github, Twitter, ExternalLink, Copy, MessageCircle } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { ContactForm } from "../forms/ContactForm";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const socialLinks = [
  { platform: "LinkedIn", url: "linkedin.com/in/johnmitchell", icon: Linkedin, color: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20" },
  { platform: "GitHub", url: "github.com/jmitchell", icon: Github, color: "bg-foreground/10 text-foreground border-foreground/20" },
  { platform: "Website", url: "johnmitchell.com", icon: Globe, color: "bg-primary/10 text-primary border-primary/20" },
  { platform: "Twitter/X", url: "@jmitchell_data", icon: Twitter, color: "bg-foreground/10 text-foreground border-foreground/20" },
];

export const ContactPanel = () => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PanelHeader 
        title="Contact Information & Social Media" 
        subtitle="Phone numbers, addresses, and social profiles"
        icon={Phone}
        onEdit={() => setEditOpen(true)}
      />
      
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* Quick Contact Cards */}
        <motion.div variants={item} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="group relative overflow-hidden bg-gradient-to-br from-status-completed/5 via-card to-card border border-status-completed/20 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-status-completed/10 rounded-lg"><Phone className="h-4 w-4 text-status-completed" /></div>
              <div className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5 text-status-completed" /><span className="text-[9px] text-status-completed font-medium">WhatsApp</span></div>
            </div>
            <p className="text-[10px] text-muted-foreground mb-1">Mobile</p>
            <p className="text-sm font-bold text-foreground">+1 (212) 555-0147</p>
          </div>
          <div className="group relative overflow-hidden bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-lg"><Mail className="h-4 w-4 text-primary" /></div>
              <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-medium rounded">Work</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-1">Work Email</p>
            <p className="text-sm font-bold text-foreground truncate">john.mitchell@company.com</p>
          </div>
          <div className="group relative overflow-hidden bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-secondary rounded-lg"><Mail className="h-4 w-4 text-muted-foreground" /></div>
              <span className="px-1.5 py-0.5 bg-secondary text-muted-foreground text-[9px] font-medium rounded">Personal</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-1">Personal Email</p>
            <p className="text-sm font-bold text-foreground truncate">john.mitchell@gmail.com</p>
          </div>
        </motion.div>

        {/* Work Phone & Emergency */}
        <motion.div variants={item} className="grid sm:grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg"><Phone className="h-4 w-4 text-muted-foreground" /></div>
              <div>
                <p className="text-[10px] text-muted-foreground">Work Phone</p>
                <p className="text-sm font-semibold text-foreground">+1 (212) 555-0100</p>
                <p className="text-[10px] text-muted-foreground">Ext. 847</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-destructive/5 via-card to-card border border-destructive/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg"><AlertCircle className="h-4 w-4 text-destructive" /></div>
              <div>
                <p className="text-[10px] text-destructive font-medium uppercase tracking-wider">Emergency Contact</p>
                <p className="text-sm font-semibold text-foreground">Sarah Mitchell</p>
                <p className="text-xs text-muted-foreground">+1 (212) 555-0148</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Addresses */}
        <motion.div variants={item}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />Addresses</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2"><span className="px-2 py-0.5 bg-secondary text-muted-foreground text-[9px] font-medium rounded">Permanent</span></div>
              <p className="text-sm text-foreground leading-relaxed">123 Main Street, Apt 4B<br /><span className="text-muted-foreground">New York, NY 10001</span></p>
            </div>
            <div className="bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2"><span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-medium rounded">Current</span></div>
              <p className="text-sm text-foreground leading-relaxed">456 Park Avenue, Suite 12A<br /><span className="text-muted-foreground">New York, NY 10022</span></p>
            </div>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div variants={item}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><Globe className="h-3.5 w-3.5" />Social Media Profiles</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {socialLinks.map((link, index) => (
              <motion.a key={link.platform} href={`https://${link.url}`} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + index * 0.05 }}
                className={`group flex flex-col items-center gap-2 p-4 border rounded-xl hover:shadow-md transition-all ${link.color}`}>
                <link.icon className="h-6 w-6" />
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">{link.platform}</p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-full">{link.url}</p>
                </div>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <ContactForm open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
