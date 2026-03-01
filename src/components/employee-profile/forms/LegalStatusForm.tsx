import { useState } from "react";
import { Scale } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const LegalStatusForm = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState({
    workAuthorizationType: "citizen", workAuthorization: "US Citizen",
    visaType: "", visaExpiry: "", sponsorRequired: false, backgroundCheckStatus: "Cleared",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { toast({ title: "Legal status updated" }); onOpenChange(false); };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Edit Legal Status" description="Work authorization and legal compliance" icon={Scale}>
      <div className="space-y-6">
        <ProfileFormField type="select" label="Work Authorization Type" value={form.workAuthorizationType} onChange={v => update("workAuthorizationType", v)}
          options={[{ label: "Citizen", value: "citizen" }, { label: "Permanent Resident", value: "pr" }, { label: "Work Visa", value: "work-visa" }, { label: "Student Visa", value: "student" }]} />
        <ProfileFormField type="text" label="Authorization Details" value={form.workAuthorization} onChange={v => update("workAuthorization", v)} />
        {(form.workAuthorizationType === "work-visa" || form.workAuthorizationType === "student") && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ProfileFormField type="text" label="Visa Type" value={form.visaType} onChange={v => update("visaType", v)} placeholder="e.g., H-1B" />
              <ProfileFormField type="date" label="Visa Expiry" value={form.visaExpiry} onChange={v => update("visaExpiry", v)} />
            </div>
            <ProfileFormField type="switch" label="Sponsor Required" checked={form.sponsorRequired}
              onChange={v => setForm(p => ({ ...p, sponsorRequired: v }))} />
          </>
        )}
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
