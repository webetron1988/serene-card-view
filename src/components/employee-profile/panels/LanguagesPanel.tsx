import { useState } from "react";
import { motion } from "framer-motion";
import { Languages, Palette, Dumbbell, Sparkles, HandHeart, Check, Pencil, Trash2 } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LanguageForm } from "../forms/LanguageForm";
import { VolunteerForm } from "../forms/VolunteerForm";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const languages = [
  { language: "English", proficiency: "Native", level: 100, skills: { read: true, write: true, speak: true } },
  { language: "Spanish", proficiency: "Fluent", level: 85, skills: { read: true, write: true, speak: true } },
  { language: "French", proficiency: "Intermediate", level: 50, skills: { read: true, write: false, speak: false } },
];

const hobbiesData = {
  hobbies: ["Photography", "Hiking", "Chess", "Reading"],
  sports: ["Tennis", "Running", "Swimming"],
  talents: ["Public Speaking", "Data Storytelling", "Piano"],
};

const volunteerActivities = [
  { activity: "Data Science Mentoring", org: "Code.org", role: "Volunteer Mentor", hours: 40, period: "2024" },
  { activity: "STEM Education", org: "Local High School", role: "Guest Speaker", hours: 8, period: "2024" },
  { activity: "Hackathon Judge", org: "NYU", role: "Judge", hours: 16, period: "2023-2024" },
];

const languageStats = [
  { label: "Languages", value: 3 },
  { label: "Volunteer Hours", value: 88 },
  { label: "VTO Used", value: "24/40" },
];

export const LanguagesPanel = () => {
  const [langFormOpen, setLangFormOpen] = useState(false);
  const [langEditData, setLangEditData] = useState<any>(null);
  const [volFormOpen, setVolFormOpen] = useState(false);
  const [volEditData, setVolEditData] = useState<any>(null);

  const openAddLang = () => { setLangEditData(null); setLangFormOpen(true); };
  const openEditLang = (lang: any) => { setLangEditData({ language: lang.language, proficiency: lang.proficiency, read: lang.skills.read, write: lang.skills.write, speak: lang.skills.speak }); setLangFormOpen(true); };
  const openAddVol = () => { setVolEditData(null); setVolFormOpen(true); };
  const openEditVol = (vol: any) => { setVolEditData(vol); setVolFormOpen(true); };

  return (
    <div className="space-y-6">
      <PanelHeader 
        title="Languages, Hobbies & Volunteering" 
        subtitle="Skills, interests, and community involvement"
        icon={Languages}
        stats={languageStats}
        onEdit={() => setLangFormOpen(true)}
      />
      
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* Languages */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Languages className="h-3.5 w-3.5" />Language Proficiency</p>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={openAddLang}><span className="text-sm">+</span> Add Language</Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {languages.map((lang, index) => (
              <motion.div key={lang.language} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + index * 0.05 }}
                className={`group/card relative overflow-hidden bg-card border rounded-xl p-4 ${lang.proficiency === "Native" ? "border-primary/30 bg-gradient-to-br from-primary/5 to-card" : "border-border"}`}>
                {lang.proficiency === "Native" && (
                  <div className="absolute top-2 right-2"><span className="px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-semibold rounded-full">Native</span></div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-1" style={{ right: lang.proficiency === "Native" ? "60px" : "8px" }}>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditLang(lang)}><Pencil className="h-3 w-3 text-muted-foreground" /></Button>
                </div>
                <p className="text-lg font-bold text-foreground mb-1">{lang.language}</p>
                <p className="text-xs text-muted-foreground mb-3">{lang.proficiency}</p>
                <Progress value={lang.level} className="h-1.5 mb-3" />
                <div className="flex items-center gap-3 text-[10px]">
                  <span className={`flex items-center gap-1 ${lang.skills.read ? "text-status-completed" : "text-muted-foreground/50"}`}><Check className="h-3 w-3" /> Read</span>
                  <span className={`flex items-center gap-1 ${lang.skills.write ? "text-status-completed" : "text-muted-foreground/50"}`}><Check className="h-3 w-3" /> Write</span>
                  <span className={`flex items-center gap-1 ${lang.skills.speak ? "text-status-completed" : "text-muted-foreground/50"}`}><Check className="h-3 w-3" /> Speak</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hobbies, Sports & Talents */}
        <motion.div variants={item} className="grid sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-secondary rounded-lg"><Palette className="h-3.5 w-3.5 text-muted-foreground" /></div>
              <p className="text-xs font-medium text-muted-foreground">Hobbies</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hobbiesData.hobbies.map((hobby) => (
                <span key={hobby} className="px-2.5 py-1 bg-secondary/50 text-foreground text-xs rounded-lg">{hobby}</span>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-primary/10 rounded-lg"><Dumbbell className="h-3.5 w-3.5 text-primary" /></div>
              <p className="text-xs font-medium text-muted-foreground">Sports</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hobbiesData.sports.map((sport) => (
                <span key={sport} className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-lg border border-primary/20">{sport}</span>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-category-strategy/10 rounded-lg"><Sparkles className="h-3.5 w-3.5 text-category-strategy" /></div>
              <p className="text-xs font-medium text-muted-foreground">Talents</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hobbiesData.talents.map((talent) => (
                <span key={talent} className="px-2.5 py-1 bg-category-strategy/10 text-category-strategy text-xs rounded-lg border border-category-strategy/20">{talent}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Volunteering */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2"><HandHeart className="h-3.5 w-3.5" />Social Service & Voluntary Activity</p>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={openAddVol}><span className="text-sm">+</span> Add Activity</Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {volunteerActivities.map((activity, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + index * 0.05 }}
                className="group/card bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all relative">
                <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditVol(activity)}><Pencil className="h-3 w-3 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><Trash2 className="h-3 w-3 text-muted-foreground" /></Button>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">{activity.hours}h</span>
                  <span className="text-[10px] text-muted-foreground">{activity.period}</span>
                </div>
                <p className="font-semibold text-sm text-foreground mb-1">{activity.activity}</p>
                <p className="text-xs text-muted-foreground">{activity.org}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">{activity.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <LanguageForm open={langFormOpen} onOpenChange={setLangFormOpen} editData={langEditData} />
      <VolunteerForm open={volFormOpen} onOpenChange={setVolFormOpen} editData={volEditData} />
    </div>
  );
};
