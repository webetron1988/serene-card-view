import { useState } from "react";
import { Award } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface AppreciationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppreciationForm = ({ open, onOpenChange }: AppreciationFormProps) => {
  const [form, setForm] = useState({
    type: "",
    from: "",
    description: "",
    date: "",
    value: "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.type || !form.description) {
      toast({ title: "Missing fields", description: "Type and description are required.", variant: "destructive" });
      return;
    }
    toast({
      title: "Appreciation submitted for approval",
      description: "Your entry will be reviewed by an admin before appearing on your profile.",
    });
    onOpenChange(false);
  };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Add Appreciation" description="Submit for admin approval" icon={Award}>
      <div className="space-y-6">
        <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/30 bg-amber-500/10">
          ⚠ Requires admin approval before publishing
        </Badge>

        <ProfileFormField
          type="select" label="Type" value={form.type} onChange={(v) => update("type", v)} required
          options={[
            { label: "Kudos", value: "Kudos" }, { label: "Thank You", value: "Thank You" },
            { label: "Spot Award", value: "Spot Award" }, { label: "Team Award", value: "Team Award" },
          ]}
        />
        <ProfileFormField type="text" label="Received From" value={form.from} onChange={(v) => update("from", v)} required placeholder="e.g., Dr. Patricia Johnson" />
        <ProfileFormField type="textarea" label="Description" value={form.description} onChange={(v) => update("description", v)} required placeholder="Describe the appreciation or achievement..." />
        <div className="grid grid-cols-2 gap-3">
          <ProfileFormField type="date" label="Date" value={form.date} onChange={(v) => update("date", v)} />
          <ProfileFormField type="text" label="Cash Value (if any)" value={form.value} onChange={(v) => update("value", v)} placeholder="$0" />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit for Approval</Button>
        </div>
      </div>
    </ProfileFormDrawer>
  );
};
