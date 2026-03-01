import { useState } from "react";
import { Users } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface FamilyMemberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    name: string;
    relation: string;
    occupation: string;
    maidenName?: string;
    age?: number;
    gender?: string;
  } | null;
}

export const FamilyMemberForm = ({ open, onOpenChange, editData }: FamilyMemberFormProps) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    name: editData?.name || "",
    relation: editData?.relation || "",
    occupation: editData?.occupation || "",
    maidenName: editData?.maidenName || "",
    age: editData?.age?.toString() || "",
    gender: editData?.gender || "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name || !form.relation) {
      toast({ title: "Missing required fields", description: "Name and relation are required.", variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "Family member updated" : "Family member added", description: `${form.name} has been ${isEdit ? "updated" : "added"}.` });
    onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Family Member" : "Add Family Member"} description="Enter family member details" icon={Users}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Full Name" value={form.name} onChange={(v) => update("name", v)} required placeholder="e.g., Sarah Elizabeth Mitchell" />
        <ProfileFormField
          type="select" label="Relationship" value={form.relation} onChange={(v) => update("relation", v)} required
          options={[
            { label: "Spouse", value: "Spouse" }, { label: "Father", value: "Father" }, { label: "Mother", value: "Mother" },
            { label: "Son", value: "Son" }, { label: "Daughter", value: "Daughter" }, { label: "Sibling", value: "Sibling" },
          ]}
        />
        <ProfileFormField type="text" label="Occupation" value={form.occupation} onChange={(v) => update("occupation", v)} placeholder="e.g., Marketing Manager" />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="number" label="Age" value={form.age} onChange={(v) => update("age", v)} />
          <ProfileFormField
            type="select" label="Gender" value={form.gender} onChange={(v) => update("gender", v)}
            options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }, { label: "Other", value: "other" }]}
          />
        </div>
        <ProfileFormField type="text" label="Maiden Name" value={form.maidenName} onChange={(v) => update("maidenName", v)} placeholder="If applicable" />

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Member"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
