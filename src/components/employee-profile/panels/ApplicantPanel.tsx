import { motion } from "framer-motion";
import { UserSearch, Hash, Briefcase, Calendar, Globe, Users, ExternalLink, Linkedin } from "lucide-react";
import { PanelHeader } from "./PanelHeader";

const applicationData = [
  { label: "Applicant ID", value: "APP-2018-04567", icon: Hash },
  { label: "Requisition ID", value: "REQ-2018-0234", icon: Hash },
  { label: "Position Applied", value: "Data Scientist", icon: Briefcase },
  { label: "Application Date", value: "Apr 15, 2018", icon: Calendar },
  { label: "Source", value: "LinkedIn", icon: Linkedin },
  { label: "Referred By", value: "N/A", icon: Users },
];

const candidateScorecard = [
  { label: "Technical Skills", score: 92, max: 100 },
  { label: "Communication", score: 85, max: 100 },
  { label: "Culture Fit", score: 90, max: 100 },
  { label: "Leadership Potential", score: 78, max: 100 },
];

export const ApplicantPanel = () => {
  const overallScore = Math.round(
    candidateScorecard.reduce((sum, s) => sum + s.score, 0) / candidateScorecard.length
  );

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Applicant ID & Position"
        subtitle="Original application and sourcing details"
        icon={UserSearch}
        stats={[
          { label: "Days to Hire", value: "40" },
          { label: "Overall Score", value: `${overallScore}%` },
        ]}
      />

      {/* Application Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">Application</span>
                <span className="px-2 py-0.5 rounded-full bg-status-completed/10 text-status-completed text-[10px] font-semibold">Hired</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Data Scientist</h3>
              <p className="text-sm text-muted-foreground mt-1">Applied via LinkedIn • Apr 15, 2018</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-[#0A66C2]/10">
                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {applicationData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.04 }}
                className="group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{item.label}</span>
                </div>
                <p className="text-sm font-semibold text-foreground pl-5.5">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Candidate Scorecard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-foreground">Candidate Scorecard</h3>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{overallScore}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {candidateScorecard.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-semibold text-foreground">{item.score}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    item.score >= 90 ? "bg-status-completed" :
                    item.score >= 80 ? "bg-primary" :
                    "bg-priority-medium"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
