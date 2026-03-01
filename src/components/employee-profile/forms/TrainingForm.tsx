import { useState } from "react";
import { BookOpen } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { name: string; type: string; provider: string; date: string; hours: string } | null;
}

export const TrainingForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    name: editData?.name || "", type: editData?.type || "", provider: editData?.provider || "",
    date: editData?.date || "", hours: editData?.hours || "", status: "Completed",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.name || !form.provider) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "Training updated" : "Training added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Training" : "Add External Training"} description="Training program details" icon={BookOpen}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Training Name" value={form.name} onChange={v => update("name", v)} required placeholder="e.g., Advanced Machine Learning" />
        <ProfileFormField type="select" label="Type" value={form.type} onChange={v => update("type", v)}
          options={[{ label: "Technical", value: "Technical" }, { label: "Leadership", value: "Leadership" }, { label: "Certification", value: "Certification" }, { label: "Soft Skills", value: "Soft Skills" }]} />
        <ProfileFormField type="text" label="Provider" value={form.provider} onChange={v => update("provider", v)} required placeholder="e.g., Coursera" />
        <div className="grid grid-cols-3 gap-3">
          <ProfileFormField type="text" label="Date" value={form.date} onChange={v => update("date", v)} placeholder="e.g., Nov 2024" />
          <ProfileFormField type="number" label="Hours" value={form.hours} onChange={v => update("hours", v)} placeholder="e.g., 40" />
          <ProfileFormField type="select" label="Status" value={form.status} onChange={v => update("status", v)}
            options={[{ label: "Completed", value: "Completed" }, { label: "In Progress", value: "In Progress" }]} />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Training"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
