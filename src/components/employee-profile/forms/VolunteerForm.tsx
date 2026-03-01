import { useState } from "react";
import { HandHeart } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface VolunteerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: { activity: string; org: string; role: string; hours: number; period: string } | null;
}

export const VolunteerForm = ({ open, onOpenChange, editData }: VolunteerFormProps) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    activity: editData?.activity || "",
    org: editData?.org || "",
    role: editData?.role || "",
    hours: editData?.hours?.toString() || "",
    period: editData?.period || "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.activity || !form.org) {
      toast({ title: "Missing fields", description: "Activity and organization are required.", variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "Activity updated" : "Activity added", description: `${form.activity} saved.` });
    onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Volunteer Activity" : "Add Volunteer Activity"} description="Community service and volunteering" icon={HandHeart}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Activity" value={form.activity} onChange={(v) => update("activity", v)} required placeholder="e.g., Data Science Mentoring" />
        <ProfileFormField type="text" label="Organization" value={form.org} onChange={(v) => update("org", v)} required placeholder="e.g., Code.org" />
        <div className="grid grid-cols-3 gap-3">
          <ProfileFormField type="text" label="Role" value={form.role} onChange={(v) => update("role", v)} placeholder="e.g., Volunteer Mentor" />
          <ProfileFormField type="number" label="Hours" value={form.hours} onChange={(v) => update("hours", v)} />
          <ProfileFormField type="text" label="Period" value={form.period} onChange={(v) => update("period", v)} placeholder="e.g., 2024" />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Activity"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
