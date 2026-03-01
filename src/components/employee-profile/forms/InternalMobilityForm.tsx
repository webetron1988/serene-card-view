import { useState } from "react";
import { Repeat } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const InternalMobilityForm = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState({
    openToMobility: true, preferredFunction: "", preferredLocation: "", preferredRole: "", availableFrom: "", notes: "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { toast({ title: "Mobility preferences updated" }); onOpenChange(false); };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Edit Mobility Preferences" description="Internal transfer and mobility preferences" icon={Repeat}>
      <div className="space-y-6">
        <ProfileFormField type="switch" label="Open to Internal Mobility" checked={form.openToMobility}
          onChange={v => setForm(p => ({ ...p, openToMobility: v }))} />
        <ProfileFormField type="text" label="Preferred Function/Department" value={form.preferredFunction} onChange={v => update("preferredFunction", v)} placeholder="e.g., Product, Engineering" />
        <ProfileFormField type="text" label="Preferred Location" value={form.preferredLocation} onChange={v => update("preferredLocation", v)} placeholder="e.g., London, Singapore" />
        <ProfileFormField type="text" label="Preferred Role" value={form.preferredRole} onChange={v => update("preferredRole", v)} placeholder="e.g., Head of Data" />
        <ProfileFormField type="date" label="Available From" value={form.availableFrom} onChange={v => update("availableFrom", v)} />
        <ProfileFormField type="textarea" label="Notes" value={form.notes} onChange={v => update("notes", v)} placeholder="Any additional preferences..." />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
