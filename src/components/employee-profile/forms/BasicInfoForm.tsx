import { useState } from "react";
import { User } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface BasicInfoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BasicInfoForm = ({ open, onOpenChange }: BasicInfoFormProps) => {
  const [form, setForm] = useState({
    firstName: "John",
    middleName: "David",
    lastName: "Mitchell",
    preferredName: "John",
    arabicName: "جون ديفيد ميتشل",
    pronouns: "he-him",
    dob: "1987-03-15",
    birthCity: "Boston",
    birthState: "MA",
    birthCountry: "US",
    maritalStatus: "married",
    spouseName: "Sarah Elizabeth Mitchell",
    marriageDate: "2015-06-20",
    nationality: "US",
    citizenshipType: "citizen",
    passportNumber: "US-123456789",
    passportExpiry: "2030-01",
    religion: "Christianity",
    denomination: "Protestant",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    toast({ title: "Basic information updated", description: "Changes saved successfully." });
    onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Edit Basic Information" description="Update personal identity details" icon={User}>
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Full Name</h3>
          <div className="grid grid-cols-3 gap-3">
            <ProfileFormField type="text" label="First Name" value={form.firstName} onChange={(v) => update("firstName", v)} required />
            <ProfileFormField type="text" label="Middle Name" value={form.middleName} onChange={(v) => update("middleName", v)} />
            <ProfileFormField type="text" label="Last Name" value={form.lastName} onChange={(v) => update("lastName", v)} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="text" label="Preferred Name" value={form.preferredName} onChange={(v) => update("preferredName", v)} />
          <ProfileFormField type="text" label="Name (Arabic)" value={form.arabicName} onChange={(v) => update("arabicName", v)} />
        </div>

        <ProfileFormField
          type="select" label="Pronouns" value={form.pronouns} onChange={(v) => update("pronouns", v)}
          options={[{ label: "He/Him", value: "he-him" }, { label: "She/Her", value: "she-her" }, { label: "They/Them", value: "they-them" }, { label: "Other", value: "other" }]}
        />

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Birth Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField type="date" label="Date of Birth" value={form.dob} onChange={(v) => update("dob", v)} required />
            <ProfileFormField type="text" label="City" value={form.birthCity} onChange={(v) => update("birthCity", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField type="text" label="State" value={form.birthState} onChange={(v) => update("birthState", v)} />
            <ProfileFormField
              type="select" label="Country" value={form.birthCountry} onChange={(v) => update("birthCountry", v)}
              options={[{ label: "United States", value: "US" }, { label: "United Kingdom", value: "UK" }, { label: "Canada", value: "CA" }, { label: "India", value: "IN" }]}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Marital Status</h3>
          <ProfileFormField
            type="select" label="Status" value={form.maritalStatus} onChange={(v) => update("maritalStatus", v)}
            options={[{ label: "Single", value: "single" }, { label: "Married", value: "married" }, { label: "Divorced", value: "divorced" }, { label: "Widowed", value: "widowed" }]}
          />
          {form.maritalStatus === "married" && (
            <div className="grid grid-cols-2 gap-3">
              <ProfileFormField type="text" label="Spouse Name" value={form.spouseName} onChange={(v) => update("spouseName", v)} />
              <ProfileFormField type="date" label="Marriage Date" value={form.marriageDate} onChange={(v) => update("marriageDate", v)} />
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Nationality & Documents</h3>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField
              type="select" label="Nationality" value={form.nationality} onChange={(v) => update("nationality", v)}
              options={[{ label: "United States", value: "US" }, { label: "United Kingdom", value: "UK" }, { label: "Canada", value: "CA" }, { label: "India", value: "IN" }]}
            />
            <ProfileFormField
              type="select" label="Citizenship Type" value={form.citizenshipType} onChange={(v) => update("citizenshipType", v)}
              options={[{ label: "Citizen", value: "citizen" }, { label: "Permanent Resident", value: "pr" }, { label: "Work Visa", value: "work-visa" }]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField type="text" label="Passport Number" value={form.passportNumber} onChange={(v) => update("passportNumber", v)} />
            <ProfileFormField type="text" label="Passport Expiry" value={form.passportExpiry} onChange={(v) => update("passportExpiry", v)} />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Religion</h3>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField type="text" label="Religion" value={form.religion} onChange={(v) => update("religion", v)} />
            <ProfileFormField type="text" label="Denomination" value={form.denomination} onChange={(v) => update("denomination", v)} />
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
