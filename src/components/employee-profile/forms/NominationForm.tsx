import { useState } from "react";
import { UserCheck } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { benefitType: string; nominee: string; relationship: string; share: string; contact: string } | null;
}

export const NominationForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    benefitType: editData?.benefitType || "", nomineeType: "Primary",
    nominee: editData?.nominee || "", relationship: editData?.relationship || "",
    share: editData?.share || "", contact: editData?.contact || "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.benefitType || !form.nominee) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "Nomination updated" : "Nomination added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Nomination" : "Add Nomination"} description="Beneficiary nomination for benefits" icon={UserCheck}>
      <div className="space-y-6">
        <ProfileFormField type="select" label="Benefit Type" value={form.benefitType} onChange={v => update("benefitType", v)} required
          options={[{ label: "Life Insurance", value: "Life Insurance" }, { label: "401(k)", value: "401(k)" }, { label: "Gratuity", value: "Gratuity" }, { label: "Pension", value: "Pension" }]} />
        <ProfileFormField type="select" label="Nominee Type" value={form.nomineeType} onChange={v => update("nomineeType", v)}
          options={[{ label: "Primary", value: "Primary" }, { label: "Contingent", value: "Contingent" }]} />
        <ProfileFormField type="text" label="Nominee Name" value={form.nominee} onChange={v => update("nominee", v)} required placeholder="e.g., Sarah Elizabeth Mitchell" />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="select" label="Relationship" value={form.relationship} onChange={v => update("relationship", v)}
            options={[{ label: "Spouse", value: "Spouse" }, { label: "Son", value: "Son" }, { label: "Daughter", value: "Daughter" }, { label: "Parent", value: "Parent" }, { label: "Sibling", value: "Sibling" }]} />
          <ProfileFormField type="number" label="Share (%)" value={form.share} onChange={v => update("share", v)} placeholder="e.g., 100" />
        </div>
        <ProfileFormField type="tel" label="Contact Number" value={form.contact} onChange={v => update("contact", v)} placeholder="e.g., +1 (212) 555-0148" />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Nomination"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
