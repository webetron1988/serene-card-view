import { useState } from "react";
import { MapPin } from "lucide-react";
import { ProfileFormDrawer } from "./ProfileFormDrawer";
import { ProfileFormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const PhysicalLocationForm = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState({
    office: "New York HQ", building: "Tower A", floor: "15th", desk: "15-A-047",
    workArrangement: "hybrid", officeDays: "3", timeZone: "EST (UTC-5)", country: "US", region: "North America",
  });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = () => { toast({ title: "Location updated" }); onOpenChange(false); };

  return (
    <ProfileFormDrawer open={open} onOpenChange={onOpenChange} title="Edit Physical Location" description="Update office location and work arrangement" icon={MapPin}>
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Office Location</h3>
          <ProfileFormField type="text" label="Office" value={form.office} onChange={v => update("office", v)} />
          <div className="grid grid-cols-3 gap-3">
            <ProfileFormField type="text" label="Building" value={form.building} onChange={v => update("building", v)} />
            <ProfileFormField type="text" label="Floor" value={form.floor} onChange={v => update("floor", v)} />
            <ProfileFormField type="text" label="Desk" value={form.desk} onChange={v => update("desk", v)} />
          </div>
        </div>
        <div className="border-t border-border pt-4 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Work Arrangement</h3>
          <div className="grid grid-cols-2 gap-3">
            <ProfileFormField type="select" label="Arrangement" value={form.workArrangement} onChange={v => update("workArrangement", v)}
              options={[{ label: "On-Site", value: "onsite" }, { label: "Hybrid", value: "hybrid" }, { label: "Remote", value: "remote" }]} />
            <ProfileFormField type="number" label="Office Days/Week" value={form.officeDays} onChange={v => update("officeDays", v)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <ProfileFormField type="text" label="Time Zone" value={form.timeZone} onChange={v => update("timeZone", v)} />
            <ProfileFormField type="select" label="Country" value={form.country} onChange={v => update("country", v)}
              options={[{ label: "United States", value: "US" }, { label: "United Kingdom", value: "UK" }, { label: "India", value: "IN" }]} />
            <ProfileFormField type="text" label="Region" value={form.region} onChange={v => update("region", v)} />
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
