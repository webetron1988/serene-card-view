import { motion } from "framer-motion";
import { Award, Calendar, Hash, Building2, CheckCircle2, Clock, Infinity } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const certifications = [
  {
    name: "AWS Solutions Architect - Professional",
    issuer: "Amazon Web Services",
    id: "AWS-PSA-12345",
    obtained: "Mar 2023",
    expiry: "Mar 2026",
    status: "Active",
    logo: "🔶",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    name: "Google Cloud Professional Data Engineer",
    issuer: "Google",
    id: "GCP-PDE-67890",
    obtained: "Jun 2022",
    expiry: "Jun 2025",
    status: "Active",
    logo: "🔵",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    name: "Certified Analytics Professional (CAP)",
    issuer: "INFORMS",
    id: "CAP-2021-4567",
    obtained: "Jan 2021",
    expiry: "Jan 2027",
    status: "Active",
    logo: "📊",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    name: "Six Sigma Green Belt",
    issuer: "ASQ",
    id: "SSGB-2019-8901",
    obtained: "Sep 2019",
    expiry: "N/A",
    status: "Lifetime",
    logo: "🎯",
    color: "bg-green-500/10 text-green-600",
  },
];

export const CertificationsPanel = () => {
  const activeCerts = certifications.filter(c => c.status === "Active").length;
  const lifetimeCerts = certifications.filter(c => c.status === "Lifetime").length;

  return (
    <div className="space-y-6">
      <PanelHeader
        title="License, Certification & Accreditation"
        subtitle="Professional certifications and credentials"
        icon={Award}
        stats={[
          { label: "Active", value: activeCerts },
          { label: "Lifetime", value: lifetimeCerts },
        ]}
      />

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all hover:shadow-md group">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className={`p-3 rounded-xl text-2xl ${cert.color.split(" ")[0]}`}>
                    {cert.logo}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {cert.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{cert.issuer}</span>
                        </div>
                      </div>
                      <Badge className={`shrink-0 border-0 text-[10px] ${
                        cert.status === "Active" 
                          ? "bg-status-completed/10 text-status-completed" 
                          : "bg-primary/10 text-primary"
                      }`}>
                        {cert.status === "Lifetime" && <Infinity className="h-3 w-3 mr-1" />}
                        {cert.status === "Active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {cert.status}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">ID</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Hash className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs font-mono font-medium text-foreground truncate">{cert.id}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Obtained</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs font-medium text-foreground">{cert.obtained}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Expiry</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {cert.expiry === "N/A" ? (
                              <Infinity className="h-3 w-3 text-primary" />
                            ) : (
                              <Clock className="h-3 w-3 text-muted-foreground" />
                            )}
                            <p className={`text-xs font-medium ${cert.expiry === "N/A" ? "text-primary" : "text-foreground"}`}>
                              {cert.expiry}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
