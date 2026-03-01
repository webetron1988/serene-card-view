import { useState } from "react";
import { Target } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { goal: string; category: string; targetDate: string; status: string } | null;
}

export const IDPGoalForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    goal: editData?.goal || "", category: editData?.category || "",
    targetDate: editData?.targetDate || "", status: editData?.status || "Not Started",
    budget: "", notes: "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.goal) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "IDP goal updated" : "IDP goal added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit IDP Goal" : "Add IDP Goal"} description="Individual development plan goal" icon={Target}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Goal" value={form.goal} onChange={v => update("goal", v)} required placeholder="e.g., Complete GenAI specialization" />
        <ProfileFormField type="select" label="Category" value={form.category} onChange={v => update("category", v)}
          options={[{ label: "Technical Skills", value: "Technical" }, { label: "Leadership", value: "Leadership" }, { label: "Certifications", value: "Certifications" }, { label: "Soft Skills", value: "Soft Skills" }]} />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="text" label="Target Date" value={form.targetDate} onChange={v => update("targetDate", v)} placeholder="e.g., Q4 2025" />
          <ProfileFormField type="select" label="Status" value={form.status} onChange={v => update("status", v)}
            options={[{ label: "Not Started", value: "Not Started" }, { label: "In Progress", value: "In Progress" }, { label: "Completed", value: "Completed" }]} />
        </div>
        <ProfileFormField type="text" label="Budget Required" value={form.budget} onChange={v => update("budget", v)} placeholder="e.g., $500" />
        <ProfileFormField type="textarea" label="Notes" value={form.notes} onChange={v => update("notes", v)} placeholder="Additional details..." />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Goal"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
