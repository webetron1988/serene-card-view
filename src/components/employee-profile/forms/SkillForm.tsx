import { useState } from "react";
import { Zap } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { name: string; level: string } | null;
}

export const SkillForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    name: editData?.name || "", level: editData?.level || "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.name || !form.level) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "Skill updated" : "Skill added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Skill" : "Add Skill"} description="Skill proficiency details" icon={Zap}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Skill Name" value={form.name} onChange={v => update("name", v)} required placeholder="e.g., Machine Learning" />
        <ProfileFormField type="select" label="Proficiency Level" value={form.level} onChange={v => update("level", v)} required
          options={[{ label: "Expert", value: "Expert" }, { label: "Advanced", value: "Advanced" }, { label: "Intermediate", value: "Intermediate" }, { label: "Beginner", value: "Beginner" }]} />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Skill"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
