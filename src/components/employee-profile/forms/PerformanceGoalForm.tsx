import { useState } from "react";
import { Target } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { name: string; category: string; weight: string; target: string } | null;
}

export const PerformanceGoalForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    name: editData?.name || "", category: editData?.category || "",
    weight: editData?.weight || "", target: editData?.target || "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.name || !form.category) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "Goal updated" : "Goal added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Goal" : "Add Goal"} description="Performance goal details" icon={Target}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Goal Name" value={form.name} onChange={v => update("name", v)} required placeholder="e.g., Implement ML fraud detection model" />
        <ProfileFormField type="select" label="Category" value={form.category} onChange={v => update("category", v)} required
          options={[{ label: "Technical", value: "Technical" }, { label: "Leadership", value: "Leadership" }, { label: "Development", value: "Development" },
            { label: "Visibility", value: "Visibility" }, { label: "Teamwork", value: "Teamwork" }]} />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="number" label="Weight (%)" value={form.weight} onChange={v => update("weight", v)} placeholder="e.g., 30" />
          <ProfileFormField type="text" label="Target" value={form.target} onChange={v => update("target", v)} placeholder="e.g., Q2 Launch" />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Goal"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
