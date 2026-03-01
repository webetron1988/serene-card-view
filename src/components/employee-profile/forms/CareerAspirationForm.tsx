import { useState } from "react";
import { Compass } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const CareerAspirationForm = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState({
    targetRole: "", targetTimeline: "", readiness: "", geographicPreference: "",
    functionalInterest: "", notes: "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { toast({ title: "Career aspirations updated" }); onOpenChange(false); };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Edit Career Aspirations" description="Update your career goals and preferences" icon={Compass}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Target Role" value={form.targetRole} onChange={v => update("targetRole", v)} placeholder="e.g., Director, ML Engineering" />
        <ProfileFormField type="select" label="Timeline" value={form.targetTimeline} onChange={v => update("targetTimeline", v)}
          options={[{ label: "0-1 Years", value: "0-1" }, { label: "1-2 Years", value: "1-2" }, { label: "2-3 Years", value: "2-3" }, { label: "3-5 Years", value: "3-5" }]} />
        <ProfileFormField type="select" label="Readiness" value={form.readiness} onChange={v => update("readiness", v)}
          options={[{ label: "Ready Now", value: "ready" }, { label: "Ready in 1 Year", value: "1yr" }, { label: "Ready in 2+ Years", value: "2yr" }]} />
        <ProfileFormField type="text" label="Geographic Preference" value={form.geographicPreference} onChange={v => update("geographicPreference", v)} placeholder="e.g., Open to relocation" />
        <ProfileFormField type="text" label="Functional Interest" value={form.functionalInterest} onChange={v => update("functionalInterest", v)} placeholder="e.g., AI/ML, Product" />
        <ProfileFormField type="textarea" label="Additional Notes" value={form.notes} onChange={v => update("notes", v)} placeholder="Any career development notes..." />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
