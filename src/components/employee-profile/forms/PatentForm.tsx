import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PatentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    title: string;
    filingDate: string;
    status: string;
    patentNumber: string | null;
    reward: string;
    description: string;
  } | null;
}

export const PatentForm = ({ open, onOpenChange, editData }: PatentFormProps) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    filingDate: editData?.filingDate || "",
    status: editData?.status || "Pending",
    patentNumber: editData?.patentNumber || "",
    reward: editData?.reward || "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.title || !form.description) {
      toast({ title: "Missing fields", description: "Title and description are required.", variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "Patent updated" : "Patent added", description: `${form.title} saved successfully.` });
    onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Patent" : "Add Patent"} description="Patent and intellectual property details" icon={Lightbulb}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Title" value={form.title} onChange={(v) => update("title", v)} required placeholder="e.g., ML-Based Fraud Detection System" />
        <ProfileFormField type="textarea" label="Description" value={form.description} onChange={(v) => update("description", v)} required placeholder="Brief description of the innovation..." />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="text" label="Filing Date" value={form.filingDate} onChange={(v) => update("filingDate", v)} placeholder="e.g., Jan 2023" />
          <ProfileFormField
            type="select" label="Status" value={form.status} onChange={(v) => update("status", v)}
            options={[{ label: "Pending", value: "Pending" }, { label: "Granted", value: "Granted" }, { label: "Rejected", value: "Rejected" }]}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="text" label="Patent Number" value={form.patentNumber} onChange={(v) => update("patentNumber", v)} placeholder="e.g., US-2023-12345" />
          <ProfileFormField type="text" label="Reward Amount" value={form.reward} onChange={(v) => update("reward", v)} placeholder="e.g., $10,000" />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Patent"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
