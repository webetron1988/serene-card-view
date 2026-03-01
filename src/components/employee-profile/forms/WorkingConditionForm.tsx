import { useState } from "react";
import { Accessibility } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const WorkingConditionForm = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState({
    accommodationRequired: false, accommodationType: "",
    specialEquipment: "Standing Desk, Ergonomic Chair",
    ergonomicDate: "2024-01-15", notes: "",
  });
  const handleSave = () => { toast({ title: "Working conditions updated" }); onOpenChange(false); };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Edit Working Conditions" description="Update accommodation needs and ergonomic requirements" icon={Accessibility}>
      <div className="space-y-6">
        <ProfileFormField type="switch" label="Accommodation Required" checked={form.accommodationRequired}
          onChange={v => setForm(p => ({ ...p, accommodationRequired: v }))} />
        {form.accommodationRequired && (
          <ProfileFormField type="select" label="Accommodation Type" value={form.accommodationType}
            onChange={v => setForm(p => ({ ...p, accommodationType: v }))}
            options={[{ label: "Visual", value: "visual" }, { label: "Hearing", value: "hearing" }, { label: "Mobility", value: "mobility" }, { label: "Other", value: "other" }]} />
        )}
        <ProfileFormField type="text" label="Special Equipment" value={form.specialEquipment}
          onChange={v => setForm(p => ({ ...p, specialEquipment: v }))} placeholder="e.g., Standing Desk" />
        <ProfileFormField type="date" label="Last Ergonomic Assessment" value={form.ergonomicDate}
          onChange={v => setForm(p => ({ ...p, ergonomicDate: v }))} />
        <ProfileFormField type="textarea" label="Additional Notes" value={form.notes}
          onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Any specific requirements..." />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
