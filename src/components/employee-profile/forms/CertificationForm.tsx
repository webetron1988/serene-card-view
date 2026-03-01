import { useState } from "react";
import { Award } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { name: string; issuer: string; obtained: string; expiry: string; cost: string } | null;
}

export const CertificationForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    name: editData?.name || "", issuer: editData?.issuer || "",
    obtained: editData?.obtained || "", expiry: editData?.expiry || "", cost: editData?.cost || "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.name || !form.issuer) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "Certification updated" : "Certification added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Certification" : "Add Certification"} description="Professional certification details" icon={Award}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Certification Name" value={form.name} onChange={v => update("name", v)} required placeholder="e.g., AWS Solutions Architect" />
        <ProfileFormField type="text" label="Issuing Organization" value={form.issuer} onChange={v => update("issuer", v)} required placeholder="e.g., Amazon Web Services" />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="text" label="Date Obtained" value={form.obtained} onChange={v => update("obtained", v)} placeholder="e.g., Mar 2023" />
          <ProfileFormField type="text" label="Expiry Date" value={form.expiry} onChange={v => update("expiry", v)} placeholder="e.g., Mar 2026 or N/A" />
        </div>
        <ProfileFormField type="text" label="Cost" value={form.cost} onChange={v => update("cost", v)} placeholder="e.g., $300" />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Certification"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
