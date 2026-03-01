import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean; onOpenChange: (open: boolean) => void;
  editData?: { degree: string; field: string; institution: string; yearFrom: string; yearTo: string; gpa: string; honors: string; thesis: string } | null;
}

export const EducationForm = ({ open, onOpenChange, editData }: Props) => {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    degree: editData?.degree || "", field: editData?.field || "", institution: editData?.institution || "",
    yearFrom: editData?.yearFrom || "", yearTo: editData?.yearTo || "", gpa: editData?.gpa || "",
    honors: editData?.honors || "", thesis: editData?.thesis || "",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.degree || !form.institution) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: isEdit ? "Education updated" : "Education added" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title={isEdit ? "Edit Education" : "Add Education"} description="Academic qualification details" icon={GraduationCap}>
      <div className="space-y-6">
        <ProfileFormField type="select" label="Degree" value={form.degree} onChange={v => update("degree", v)} required
          options={[{ label: "Ph.D.", value: "Ph.D." }, { label: "Master of Science (M.S.)", value: "M.S." }, { label: "Master of Business Administration (MBA)", value: "MBA" },
            { label: "Bachelor of Science (B.S.)", value: "B.S." }, { label: "Bachelor of Arts (B.A.)", value: "B.A." }, { label: "Associate Degree", value: "Associate" }]} />
        <ProfileFormField type="text" label="Field of Study" value={form.field} onChange={v => update("field", v)} required placeholder="e.g., Data Science" />
        <ProfileFormField type="text" label="Institution" value={form.institution} onChange={v => update("institution", v)} required placeholder="e.g., Stanford University" />
        <div className="grid grid-cols-3 gap-3">
          <ProfileFormField type="text" label="Year From" value={form.yearFrom} onChange={v => update("yearFrom", v)} placeholder="e.g., 2013" />
          <ProfileFormField type="text" label="Year To" value={form.yearTo} onChange={v => update("yearTo", v)} placeholder="e.g., 2015" />
          <ProfileFormField type="text" label="GPA" value={form.gpa} onChange={v => update("gpa", v)} placeholder="e.g., 3.9/4.0" />
        </div>
        <ProfileFormField type="text" label="Honors" value={form.honors} onChange={v => update("honors", v)} placeholder="e.g., Magna Cum Laude" />
        <ProfileFormField type="textarea" label="Thesis/Dissertation" value={form.thesis} onChange={v => update("thesis", v)} placeholder="Title of research work..." />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Add Education"}</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
