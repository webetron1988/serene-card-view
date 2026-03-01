import { useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, AlertTriangle, DollarSign, ShieldCheck, Calendar, Building2 } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificationForm } from "../forms/CertificationForm";

const certifications = [
  { name: "AWS Solutions Architect - Professional", issuer: "Amazon Web Services", obtained: "Mar 2023", expiry: "Mar 2026", status: "Active", cost: "$300" },
  { name: "Google Cloud Professional Data Engineer", issuer: "Google", obtained: "Jun 2022", expiry: "Jun 2025", status: "Active", cost: "$200" },
  { name: "Certified Analytics Professional (CAP)", issuer: "INFORMS", obtained: "Jan 2021", expiry: "Jan 2027", status: "Active", cost: "$695" },
  { name: "Six Sigma Green Belt", issuer: "ASQ", obtained: "Sep 2019", expiry: "N/A", status: "Lifetime", cost: "$438" },
];

const summaryMetrics = [
  { label: "Active Certifications", value: "4", icon: CheckCircle2, accent: "from-status-completed/20 to-status-completed/10", iconColor: "text-status-completed" },
  { label: "Expiring in 6 Months", value: "0", icon: AlertTriangle, accent: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-500" },
  { label: "Total Investment", value: "$1,633", icon: DollarSign, accent: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-500" },
];

type FilterStatus = "All" | "Active" | "Lifetime";

export const LDCertificationsPanel = () => {
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [formOpen, setFormOpen] = useState(false);
  const filtered = filter === "All" ? certifications : certifications.filter(c => c.status === filter);

  return (
    <div className="space-y-6">
      <PanelHeader title="Certifications" subtitle="Professional certifications and renewal tracking" icon={Award} pastel="peach" onAdd={() => setFormOpen(true)} addLabel="Add Certification" />

      <div className="grid grid-cols-3 gap-4">
        {summaryMetrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${m.accent} p-5`}>
            <m.icon className={`h-5 w-5 ${m.iconColor} mb-3`} />
            <span className="text-3xl font-black text-foreground tracking-tight">{m.value}</span>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="All" className="text-xs">All ({certifications.length})</TabsTrigger>
          <TabsTrigger value="Active" className="text-xs"><CheckCircle2 className="h-3 w-3 mr-1" /> Active ({certifications.filter(c => c.status === "Active").length})</TabsTrigger>
          <TabsTrigger value="Lifetime" className="text-xs"><ShieldCheck className="h-3 w-3 mr-1" /> Lifetime ({certifications.filter(c => c.status === "Lifetime").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <Card className="p-5 border-border/50 hover:shadow-md transition-shadow h-full flex flex-col">
              {/* Row 1: Category + Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Award className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="uppercase tracking-wider font-semibold text-[10px]">CERTIFICATION</span>
                </div>
                <Badge variant="outline" className={`text-[10px] font-medium gap-1 ${
                  c.status === "Active" ? "text-status-completed border-status-completed/30" : "text-primary border-primary/30"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === "Active" ? "bg-status-completed" : "bg-primary"}`} />
                  {c.status}
                </Badge>
              </div>

              {/* Row 2: Title */}
              <h4 className="text-sm font-bold text-foreground leading-snug mb-3 flex-1">{c.name}</h4>

              {/* Row 3: Cost badge */}
              <div className="mb-4">
                <Badge className="bg-primary/10 text-primary border-0 text-xs font-bold">{c.cost}</Badge>
              </div>

              {/* Row 4: Expiry bar visual */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Validity</span>
                  <span className="font-bold text-foreground">{c.expiry === "N/A" ? "Lifetime" : c.expiry}</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: c.expiry === "N/A" ? "100%" : "70%" }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>

              {/* Row 5: Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{c.issuer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{c.obtained}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <CertificationForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
};
