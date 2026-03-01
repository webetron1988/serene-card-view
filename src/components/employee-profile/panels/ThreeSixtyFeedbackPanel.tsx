import { motion } from "framer-motion";
import { MessageCircle, Users, UserCheck, Eye, EyeOff, Lightbulb, BarChart3 } from "lucide-react";
import { PanelHeader } from "./PanelHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const overallScores = [
  { source: "Manager", score: 4.5, icon: UserCheck, pastelBg: "bg-pastel-blue", pastelIcon: "text-pastel-blue-icon" },
  { source: "Peers", score: 4.3, icon: Users, pastelBg: "bg-pastel-teal", pastelIcon: "text-pastel-teal-icon" },
  { source: "Direct Reports", score: 4.6, icon: Users, pastelBg: "bg-pastel-purple", pastelIcon: "text-pastel-purple-icon" },
  { source: "Self", score: 4.2, icon: UserCheck, pastelBg: "bg-pastel-peach", pastelIcon: "text-pastel-peach-icon" },
];

const dimensions = [
  { name: "Communication", manager: 4.5, peers: 4.2, reports: 4.7, self: 4.0 },
  { name: "Collaboration", manager: 4.5, peers: 4.5, reports: 4.5, self: 4.3 },
  { name: "Technical Skills", manager: 4.8, peers: 4.7, reports: 4.8, self: 4.5 },
  { name: "Leadership", manager: 4.2, peers: 4.0, reports: 4.5, self: 4.0 },
  { name: "Results Orientation", manager: 4.5, peers: 4.3, reports: 4.4, self: 4.2 },
  { name: "Innovation", manager: 4.6, peers: 4.4, reports: 4.5, self: 4.3 },
  { name: "Coaching & Development", manager: 4.3, peers: 4.1, reports: 4.7, self: 3.9 },
];

const getOthersAvg = (d: typeof dimensions[0]) => ((d.manager + d.peers + d.reports) / 3);
const getAvg = (d: typeof dimensions[0]) => ((d.manager + d.peers + d.reports + d.self) / 4);

const blindSpots = dimensions
  .map(d => ({ name: d.name, gap: getOthersAvg(d) - d.self, othersAvg: getOthersAvg(d), self: d.self }))
  .filter(d => d.gap > 0.2)
  .sort((a, b) => b.gap - a.gap);

const hiddenAreas = dimensions
  .map(d => ({ name: d.name, gap: d.self - getOthersAvg(d), othersAvg: getOthersAvg(d), self: d.self }))
  .filter(d => d.gap > 0.1);

const HeatCell = ({ value, isHighest, isLowest }: { value: number; isHighest?: boolean; isLowest?: boolean }) => (
  <div className={`flex items-center justify-center h-9 w-full rounded-md text-xs font-semibold transition-colors ${
    value >= 4.6 ? "bg-pastel-blue text-pastel-blue-icon" :
    value >= 4.3 ? "bg-pastel-teal text-pastel-teal-icon" :
    value >= 4.0 ? "bg-secondary text-foreground" :
    "bg-pastel-peach text-pastel-peach-icon"
  } ${isHighest ? "ring-1 ring-primary/30" : ""} ${isLowest ? "ring-1 ring-pastel-peach-icon/30" : ""}`}>
    {value.toFixed(1)}
  </div>
);

export const ThreeSixtyFeedbackPanel = () => {
  const overallAvg = (overallScores.reduce((a, c) => a + c.score, 0) / overallScores.length).toFixed(1);

  return (
    <div className="space-y-6">
      <PanelHeader
        title="360° Feedback Summary"
        subtitle="Multi-source feedback with blind spot analysis & perception gaps"
        icon={MessageCircle}
        pastel="rose"
        stats={[
          { label: "Overall 360°", value: overallAvg },
          { label: "Respondents", value: 12 },
          { label: "Response Rate", value: "100%" },
        ]}
      />

      {/* Source Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {overallScores.map((s, i) => (
          <motion.div key={s.source} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-4 border-border/50 text-center hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl ${s.pastelBg} mx-auto mb-3 flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.pastelIcon}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.score}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.source}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Heatmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card className="border-border/50 overflow-hidden h-full">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-pastel-blue">
                  <BarChart3 className="h-4 w-4 text-pastel-blue-icon" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Dimension Scores</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground py-2 pr-4 w-36">Dimension</th>
                      <th className="text-center text-[10px] uppercase tracking-wider text-muted-foreground py-2 px-1.5">Mgr</th>
                      <th className="text-center text-[10px] uppercase tracking-wider text-muted-foreground py-2 px-1.5">Peers</th>
                      <th className="text-center text-[10px] uppercase tracking-wider text-muted-foreground py-2 px-1.5">Reports</th>
                      <th className="text-center text-[10px] uppercase tracking-wider text-muted-foreground py-2 px-1.5">Self</th>
                      <th className="text-center text-[10px] uppercase tracking-wider text-foreground font-bold py-2 px-1.5">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dimensions.map((d, i) => {
                      const values = [d.manager, d.peers, d.reports, d.self];
                      const max = Math.max(...values);
                      const min = Math.min(...values);
                      return (
                        <motion.tr key={d.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.04 }} className="border-b border-border/20">
                          <td className="py-1.5 pr-4"><span className="text-sm text-foreground">{d.name}</span></td>
                          <td className="py-1 px-1"><HeatCell value={d.manager} isHighest={d.manager === max} isLowest={d.manager === min} /></td>
                          <td className="py-1 px-1"><HeatCell value={d.peers} isHighest={d.peers === max} isLowest={d.peers === min} /></td>
                          <td className="py-1 px-1"><HeatCell value={d.reports} isHighest={d.reports === max} isLowest={d.reports === min} /></td>
                          <td className="py-1 px-1"><HeatCell value={d.self} isHighest={d.self === max} isLowest={d.self === min} /></td>
                          <td className="py-1 px-1">
                            <div className="flex items-center justify-center h-9 w-full rounded-md bg-foreground/5 text-xs font-bold text-foreground">
                              {getAvg(d).toFixed(1)}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-5 py-2.5 bg-secondary/20 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Last Assessment: Sep 2024</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-pastel-blue" /> ≥4.6</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-pastel-teal" /> ≥4.3</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-secondary" /> ≥4.0</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-pastel-peach" /> &lt;4.0</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Blind Spot Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-5 border-border/50 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-pastel-peach">
                <Lightbulb className="h-4 w-4 text-pastel-peach-icon" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Perception Insights</h3>
            </div>

            {/* Hidden Strengths */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-3">
                <Eye className="h-3.5 w-3.5 text-pastel-blue-icon" />
                <p className="text-xs font-semibold text-foreground">Hidden Strengths</p>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">Others rate you higher than you rate yourself</p>
              <div className="space-y-2">
                {blindSpots.map((b, i) => (
                  <motion.div key={b.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.08 }}
                    className="p-2.5 rounded-lg bg-pastel-blue/50 border border-pastel-blue"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{b.name}</span>
                      <Badge className="bg-pastel-blue text-pastel-blue-icon border-0 text-[9px]">+{b.gap.toFixed(1)}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <span>Self: {b.self}</span>
                      <span>Others: {b.othersAvg.toFixed(1)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Overestimation areas */}
            {hiddenAreas.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <EyeOff className="h-3.5 w-3.5 text-pastel-peach-icon" />
                  <p className="text-xs font-semibold text-foreground">Awareness Areas</p>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">You rate higher than others rate you</p>
                <div className="space-y-2">
                  {hiddenAreas.map((h) => (
                    <div key={h.name} className="p-2.5 rounded-lg bg-pastel-peach/50 border border-pastel-peach">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{h.name}</span>
                        <Badge className="bg-pastel-peach text-pastel-peach-icon border-0 text-[9px]">-{h.gap.toFixed(1)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
