import { useState } from "react";
import { Building2 } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { bank: string; accountNumber: string; routingNumber: string; accountType: string; split: string } | null;
}

export const BankAccountForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    bank: editData?.bank || "", accountNumber: editData?.accountNumber || "",
    routingNumber: editData?.routingNumber || "", accountType: editData?.accountType || "",
    split: editData?.split || "", isPrimary: false,
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.bank || !form.accountNumber) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "Bank account updated" : "Bank account added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Bank Account" : "Add Bank Account"} description="Payroll deposit account details" icon={Building2}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Bank Name" value={form.bank} onChange={v => update("bank", v)} required placeholder="e.g., Chase Bank" />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="text" label="Account Number" value={form.accountNumber} onChange={v => update("accountNumber", v)} required placeholder="e.g., ****4567" />
          <ProfileFormField type="text" label="Routing Number" value={form.routingNumber} onChange={v => update("routingNumber", v)} placeholder="e.g., 021000021" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="select" label="Account Type" value={form.accountType} onChange={v => update("accountType", v)}
            options={[{ label: "Checking", value: "Checking" }, { label: "Savings", value: "Savings" }]} />
          <ProfileFormField type="number" label="Split %" value={form.split} onChange={v => update("split", v)} placeholder="e.g., 80" />
        </div>
        <ProfileFormField type="switch" label="Primary Account" checked={form.isPrimary} onChange={v => setForm(p => ({ ...p, isPrimary: v }))} />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Account"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
