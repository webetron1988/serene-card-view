import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const FeedbackForm = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState({ type: "", to: "", subject: "", message: "", date: "" });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => {
    if (!form.type || !form.message) { toast({ title: "Missing fields", variant: "destructive" }); return; }
    toast({ title: "Feedback submitted" }); onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Add Feedback" description="Submit a check-in or feedback note" icon={MessageCircle}>
      <div className="space-y-6">
        <ProfileFormField type="select" label="Type" value={form.type} onChange={v => update("type", v)} required
          options={[{ label: "Check-in", value: "Check-in" }, { label: "Peer Feedback", value: "Peer Feedback" }, { label: "Self Assessment", value: "Self Assessment" }]} />
        <ProfileFormField type="text" label="Regarding" value={form.to} onChange={v => update("to", v)} placeholder="e.g., Dr. Patricia Johnson" />
        <ProfileFormField type="text" label="Subject" value={form.subject} onChange={v => update("subject", v)} placeholder="e.g., Quarterly review discussion" />
        <ProfileFormField type="textarea" label="Feedback Details" value={form.message} onChange={v => update("message", v)} required placeholder="Describe the feedback..." />
        <ProfileFormField type="date" label="Date" value={form.date} onChange={v => update("date", v)} />
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Submit Feedback</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
