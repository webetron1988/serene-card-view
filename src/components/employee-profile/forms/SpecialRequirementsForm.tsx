import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const SpecialRequirementsForm = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState({
    dietaryRestrictions: "", travelRestrictions: "", equipmentNeeds: "",
    workSchedulePreference: "", accessibilityNeeds: "", notes: "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { toast({ title: "Special requirements updated" }); onOpenChange(false); };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Edit Special Requirements" description="Personal accommodations and preferences" icon={ClipboardList}>
      <div className="space-y-6">
        <ProfileFormField type="textarea" label="Dietary Restrictions" value={form.dietaryRestrictions} onChange={v => update("dietaryRestrictions", v)} placeholder="e.g., Vegetarian, Gluten-free" />
        <ProfileFormField type="textarea" label="Travel Restrictions" value={form.travelRestrictions} onChange={v => update("travelRestrictions", v)} placeholder="e.g., Cannot travel to certain countries" />
        <ProfileFormField type="textarea" label="Equipment Needs" value={form.equipmentNeeds} onChange={v => update("equipmentNeeds", v)} placeholder="e.g., Dual monitors, Ergonomic keyboard" />
        <ProfileFormField type="text" label="Work Schedule Preference" value={form.workSchedulePreference} onChange={v => update("workSchedulePreference", v)} placeholder="e.g., Flexible hours, Early start" />
        <ProfileFormField type="textarea" label="Accessibility Needs" value={form.accessibilityNeeds} onChange={v => update("accessibilityNeeds", v)} placeholder="e.g., Screen reader, Wheelchair access" />
        <ProfileFormField type="textarea" label="Additional Notes" value={form.notes} onChange={v => update("notes", v)} placeholder="Any other special requirements..." />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
