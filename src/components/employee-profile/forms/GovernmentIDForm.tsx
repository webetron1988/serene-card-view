import { useState } from "react";
import { FileText } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { label: string; value: string; expiry: string } | null;
}

export const GovernmentIDForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    idType: editData?.label || "", idNumber: editData?.value || "", expiryDate: editData?.expiry || "", country: "US",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.idType || !form.idNumber) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "ID updated" : "ID added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Government ID" : "Add Government ID"} description="Government-issued identification" icon={FileText}>
      <div className="space-y-6">
        <ProfileFormField type="select" label="ID Type" value={form.idType} onChange={v => update("idType", v)} required
          options={[{ label: "Passport", value: "Passport" }, { label: "Driver's License", value: "Drivers License" }, { label: "Social Security Number", value: "SSN" },
            { label: "National ID", value: "National ID" }, { label: "Work Permit", value: "Work Permit" }, { label: "Visa", value: "Visa" }]} />
        <ProfileFormField type="text" label="ID Number" value={form.idNumber} onChange={v => update("idNumber", v)} required placeholder="e.g., US-123456789" />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="date" label="Expiry Date" value={form.expiryDate} onChange={v => update("expiryDate", v)} />
          <ProfileFormField type="select" label="Issuing Country" value={form.country} onChange={v => update("country", v)}
            options={[{ label: "United States", value: "US" }, { label: "United Kingdom", value: "UK" }, { label: "India", value: "IN" }, { label: "Canada", value: "CA" }]} />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add ID"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
