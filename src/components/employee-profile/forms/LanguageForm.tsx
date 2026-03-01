import { useState } from "react";
import { Languages } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface LanguageFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: { language: string; proficiency: string; read: boolean; write: boolean; speak: boolean } | null;
}

export const LanguageForm = ({ open, onOpenChange, editData }: LanguageFormProps) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    language: editData?.language || "",
    proficiency: editData?.proficiency || "",
    read: editData?.read ?? true,
    write: editData?.write ?? true,
    speak: editData?.speak ?? true,
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.language || !form.proficiency) {
      toast({ title: "Missing fields", description: "Language and proficiency are required.", variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "Language updated" : "Language added", description: `${form.language} proficiency saved.` });
    onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Language" : "Add Language"} description="Language proficiency details" icon={Languages}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Language" value={form.language} onChange={(v) => update("language", v)} required placeholder="e.g., Spanish" />
        <ProfileFormField
          type="select" label="Proficiency" value={form.proficiency} onChange={(v) => update("proficiency", v)} required
          options={[
            { label: "Native", value: "Native" }, { label: "Fluent", value: "Fluent" },
            { label: "Intermediate", value: "Intermediate" }, { label: "Basic", value: "Basic" },
          ]}
        />
        <div className="grid grid-cols-3 gap-3">
          <ProfileFormField type="switch" label="Can Read" checked={form.read} onChange={(v) => setForm(prev => ({ ...prev, read: v }))} />
          <ProfileFormField type="switch" label="Can Write" checked={form.write} onChange={(v) => setForm(prev => ({ ...prev, write: v }))} />
          <ProfileFormField type="switch" label="Can Speak" checked={form.speak} onChange={(v) => setForm(prev => ({ ...prev, speak: v }))} />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Language"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
