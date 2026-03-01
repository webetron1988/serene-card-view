import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Building2, Layers, Clock, Globe, Map, Monitor } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Badge } from "@/components/ui/badge";
import { PhysicalLocationForm } from "../forms/PhysicalLocationForm";

export const PhysicalLocationPanel = () => {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PanelHeader
        title="Physical Location"
        subtitle="Office location and work arrangement details"
        icon={MapPin}
        onEdit={() => setEditOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Location Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">New York HQ</h3>
                <p className="text-xs text-muted-foreground">Tower A • 15th Floor • Desk 15-A-047</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Building2, label: "Building", value: "Tower A" },
                { icon: Layers, label: "Floor", value: "15th" },
                { icon: MapPin, label: "Desk", value: "15-A-047" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="text-center p-3 rounded-xl bg-secondary/50"
                >
                  <item.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Work Arrangement Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Work Arrangement</span>
            </div>
            <Badge className="bg-category-planning/10 text-category-planning border-0 mb-3">Hybrid</Badge>
            <p className="text-xs text-muted-foreground">3 days in office per week</p>
          </div>

          <div className="space-y-3 pt-4 mt-4 border-t border-border">
            {[
              { icon: Clock, label: "Time Zone", value: "EST (UTC-5)" },
              { icon: Globe, label: "Country", value: "United States" },
              { icon: Map, label: "Region", value: "North America" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <item.icon className="h-3 w-3" />{item.label}
                </span>
                <span className="text-xs font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <PhysicalLocationForm open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
};
