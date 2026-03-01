import { useState } from "react";
import { Briefcase } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { company: string; title: string; from: string; to: string; location: string; highlights: string } | null;
}

export const WorkExperienceForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    company: editData?.company || "", title: editData?.title || "",
    from: editData?.from || "", to: editData?.to || "",
    location: editData?.location || "", highlights: editData?.highlights || "", current: false,
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.company || !form.title) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "Experience updated" : "Experience added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Experience" : "Add Experience"} description="Work history details" icon={Briefcase}>
      <div className="space-y-6">
        <ProfileFormField type="text" label="Job Title" value={form.title} onChange={v => update("title", v)} required placeholder="e.g., Senior Data Scientist" />
        <ProfileFormField type="text" label="Company" value={form.company} onChange={v => update("company", v)} required placeholder="e.g., Tech Corp Inc." />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="text" label="From" value={form.from} onChange={v => update("from", v)} placeholder="e.g., Jun 2018" />
          <ProfileFormField type="text" label="To" value={form.to} onChange={v => update("to", v)} placeholder="e.g., Present" />
        </div>
        <ProfileFormField type="text" label="Location" value={form.location} onChange={v => update("location", v)} placeholder="e.g., New York" />
        <ProfileFormField type="switch" label="Current Position" checked={form.current} onChange={v => setForm(p => ({ ...p, current: v }))} />
        <ProfileFormField type="textarea" label="Key Highlights" value={form.highlights} onChange={v => update("highlights", v)} placeholder="One per line..." />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Experience"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
