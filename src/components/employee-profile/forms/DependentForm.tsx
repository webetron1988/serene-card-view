import { useState } from "react";
import { Users } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { name: string; relationship: string; dob: string; gender: string; passport: string } | null;
}

export const DependentForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    name: editData?.name || "", relationship: editData?.relationship || "",
    dob: editData?.dob || "", gender: editData?.gender || "", passport: editData?.passport || "",
    medicalCoverage: true, dentalCoverage: true,
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.name || !form.relationship) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "Dependent updated" : "Dependent added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Dependent" : "Add Dependent"} description="Dependent details for benefits coverage" icon={Users}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Full Name" value={form.name} onChange={v => update("name", v)} required placeholder="e.g., Emma Grace Mitchell" />
        <ProfileFormField type="select" label="Relationship" value={form.relationship} onChange={v => update("relationship", v)} required
          options={[{ label: "Spouse", value: "Spouse" }, { label: "Son", value: "Son" }, { label: "Daughter", value: "Daughter" }, { label: "Parent", value: "Parent" }]} />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="date" label="Date of Birth" value={form.dob} onChange={v => update("dob", v)} />
          <ProfileFormField type="select" label="Gender" value={form.gender} onChange={v => update("gender", v)}
            options={[{ label: "Male", value: "M" }, { label: "Female", value: "F" }]} />
        </div>
        <ProfileFormField type="text" label="Passport Number" value={form.passport} onChange={v => update("passport", v)} placeholder="e.g., US-111222333" />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="switch" label="Medical Coverage" checked={form.medicalCoverage} onChange={v => setForm(p => ({ ...p, medicalCoverage: v }))} />
          <ProfileFormField type="switch" label="Dental Coverage" checked={form.dentalCoverage} onChange={v => setForm(p => ({ ...p, dentalCoverage: v }))} />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Dependent"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
