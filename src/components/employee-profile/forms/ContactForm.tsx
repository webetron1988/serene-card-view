import { useState } from "react";
import { Phone } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContactForm = ({ open, onOpenChange }: ContactFormProps) => {
  const [form, setForm] = useState({
    mobile: "+1 (212) 555-0147",
    workPhone: "+1 (212) 555-0100",
    workExt: "847",
    workEmail: "john.mitchell@company.com",
    personalEmail: "john.mitchell@gmail.com",
    emergencyName: "Sarah Mitchell",
    emergencyPhone: "+1 (212) 555-0148",
    emergencyRelation: "Spouse",
    permanentAddress1: "123 Main Street, Apt 4B",
    permanentCity: "New York",
    permanentState: "NY",
    permanentZip: "10001",
    currentAddress1: "456 Park Avenue, Suite 12A",
    currentCity: "New York",
    currentState: "NY",
    currentZip: "10022",
    linkedin: "linkedin.com/in/johnmitchell",
    github: "github.com/jmitchell",
    website: "johnmitchell.com",
    twitter: "@jmitchell_data",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    toast({ title: "Contact information updated", description: "Changes saved successfully." });
    onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Edit Contact Information" description="Update phone, email, address and social profiles" icon={Phone}>
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Phone Numbers</h3>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField type="tel" label="Mobile" value={form.mobile} onChange={(v) => update("mobile", v)} required />
            <ProfileFormField type="tel" label="Work Phone" value={form.workPhone} onChange={(v) => update("workPhone", v)} />
          </div>
          <ProfileFormField type="text" label="Work Extension" value={form.workExt} onChange={(v) => update("workExt", v)} />
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Email Addresses</h3>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField type="email" label="Work Email" value={form.workEmail} onChange={(v) => update("workEmail", v)} required />
            <ProfileFormField type="email" label="Personal Email" value={form.personalEmail} onChange={(v) => update("personalEmail", v)} />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Emergency Contact</h3>
          <div className="grid grid-cols-3 gap-3">
            <ProfileFormField type="text" label="Name" value={form.emergencyName} onChange={(v) => update("emergencyName", v)} required />
            <ProfileFormField type="tel" label="Phone" value={form.emergencyPhone} onChange={(v) => update("emergencyPhone", v)} required />
            <ProfileFormField type="text" label="Relationship" value={form.emergencyRelation} onChange={(v) => update("emergencyRelation", v)} />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Permanent Address</h3>
          <ProfileFormField type="text" label="Address Line" value={form.permanentAddress1} onChange={(v) => update("permanentAddress1", v)} />
          <div className="grid grid-cols-3 gap-3">
            <ProfileFormField type="text" label="City" value={form.permanentCity} onChange={(v) => update("permanentCity", v)} />
            <ProfileFormField type="text" label="State" value={form.permanentState} onChange={(v) => update("permanentState", v)} />
            <ProfileFormField type="text" label="ZIP Code" value={form.permanentZip} onChange={(v) => update("permanentZip", v)} />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Current Address</h3>
          <ProfileFormField type="text" label="Address Line" value={form.currentAddress1} onChange={(v) => update("currentAddress1", v)} />
          <div className="grid grid-cols-3 gap-3">
            <ProfileFormField type="text" label="City" value={form.currentCity} onChange={(v) => update("currentCity", v)} />
            <ProfileFormField type="text" label="State" value={form.currentState} onChange={(v) => update("currentState", v)} />
            <ProfileFormField type="text" label="ZIP Code" value={form.currentZip} onChange={(v) => update("currentZip", v)} />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Social Profiles</h3>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField type="text" label="LinkedIn" value={form.linkedin} onChange={(v) => update("linkedin", v)} placeholder="linkedin.com/in/..." />
            <ProfileFormField type="text" label="GitHub" value={form.github} onChange={(v) => update("github", v)} placeholder="github.com/..." />
            <ProfileFormField type="text" label="Website" value={form.website} onChange={(v) => update("website", v)} placeholder="yoursite.com" />
            <ProfileFormField type="text" label="Twitter/X" value={form.twitter} onChange={(v) => update("twitter", v)} placeholder="@handle" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
