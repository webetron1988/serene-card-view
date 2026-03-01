import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PhysicalHealthFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PhysicalHealthForm = ({ open, onOpenChange }: PhysicalHealthFormProps) => {
  const [form, setForm] = useState({
    bloodGroup: "O+",
    height: "180",
    heightUnit: "cm",
    weight: "79",
    weightUnit: "kg",
    bmi: "24.4",
    visionStatus: "corrected",
    visionType: "contact-lenses",
    colorBlindness: "none",
    allergies: "Penicillin",
    chronicConditions: "",
    physicalDisability: "none",
    identificationMarks: "Mole on right cheek, Scar on left forearm",
    isDonor: "yes",
    lastCheckup: "2024-11-10",
    fitnessStatus: "fit",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    toast({ title: "Physical & health info updated", description: "Changes saved successfully." });
    onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Edit Physical & Health Info" description="Update medical and physical details" icon={Stethoscope}>
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Vital Metrics</h3>
          <div className="grid grid-cols-3 gap-3">
            <ProfileFormField
              type="select" label="Blood Group" value={form.bloodGroup} onChange={(v) => update("bloodGroup", v)} required
              options={["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(v => ({ label: v, value: v }))}
            />
            <ProfileFormField type="number" label="Height (cm)" value={form.height} onChange={(v) => update("height", v)} />
            <ProfileFormField type="number" label="Weight (kg)" value={form.weight} onChange={(v) => update("weight", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField type="switch" label="Blood Donor" checked={form.isDonor === "yes"} onChange={(v) => update("isDonor", v ? "yes" : "no")} />
            <ProfileFormField type="date" label="Last Medical Checkup" value={form.lastCheckup} onChange={(v) => update("lastCheckup", v)} />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Vision</h3>
          <div className="grid grid-cols-3 gap-3">
            <ProfileFormField
              type="select" label="Vision Status" value={form.visionStatus} onChange={(v) => update("visionStatus", v)}
              options={[{ label: "Normal", value: "normal" }, { label: "Corrected", value: "corrected" }]}
            />
            <ProfileFormField
              type="select" label="Correction Type" value={form.visionType} onChange={(v) => update("visionType", v)}
              options={[{ label: "Glasses", value: "glasses" }, { label: "Contact Lenses", value: "contact-lenses" }, { label: "None", value: "none" }]}
            />
            <ProfileFormField
              type="select" label="Color Blindness" value={form.colorBlindness} onChange={(v) => update("colorBlindness", v)}
              options={[{ label: "None", value: "none" }, { label: "Partial", value: "partial" }, { label: "Full", value: "full" }]}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Medical Alerts</h3>
          <ProfileFormField type="textarea" label="Allergies" value={form.allergies} onChange={(v) => update("allergies", v)} placeholder="List any known allergies..." />
          <ProfileFormField type="textarea" label="Chronic Conditions" value={form.chronicConditions} onChange={(v) => update("chronicConditions", v)} placeholder="List any chronic conditions..." />
          <ProfileFormField
            type="select" label="Physical Disability" value={form.physicalDisability} onChange={(v) => update("physicalDisability", v)}
            options={[{ label: "None", value: "none" }, { label: "Visual", value: "visual" }, { label: "Hearing", value: "hearing" }, { label: "Mobility", value: "mobility" }, { label: "Other", value: "other" }]}
          />
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Identification Marks</h3>
          <ProfileFormField type="textarea" label="Marks (comma separated)" value={form.identificationMarks} onChange={(v) => update("identificationMarks", v)} placeholder="e.g., Mole on right cheek" />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
