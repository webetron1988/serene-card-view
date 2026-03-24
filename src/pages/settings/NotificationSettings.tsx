import { useState } from "react";
import { Save, BellRing } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const alertRules = [
  { id: "tenant_signup", label: "New Tenant Signup", description: "When a new tenant registers on the platform", email: true, slack: true, inApp: true },
  { id: "payment_failed", label: "Payment Failed", description: "When a subscription payment fails", email: true, slack: true, inApp: true },
  { id: "usage_threshold", label: "Usage Threshold Reached", description: "When a tenant reaches 80% of their plan limits", email: true, slack: false, inApp: true },
  { id: "security_alert", label: "Security Alert", description: "Failed login attempts, suspicious activity", email: true, slack: true, inApp: true },
  { id: "system_downtime", label: "System Downtime", description: "When a service goes down or errors spike", email: true, slack: true, inApp: true },
  { id: "bot_published", label: "Bot Published", description: "When a tenant publishes a new bot to production", email: false, slack: false, inApp: true },
  { id: "marketplace_submission", label: "Marketplace Submission", description: "When a new bot is submitted for marketplace review", email: true, slack: true, inApp: true },
  { id: "tenant_churn_risk", label: "Churn Risk Alert", description: "When a tenant shows signs of disengagement", email: true, slack: false, inApp: true },
];

export default function NotificationSettings() {
  const [rules, setRules] = useState(alertRules);
  const [slackWebhook, setSlackWebhook] = useState("https://hooks.slack.com/services/T00/B00/xxxx");
  const [digestEnabled, setDigestEnabled] = useState(true);

  const toggleRule = (id: string, channel: "email" | "slack" | "inApp") => {
    setRules(rs => rs.map(r => r.id === id ? { ...r, [channel]: !r[channel] } : r));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Notifications</h3>
        <p className="text-sm text-muted-foreground mt-1">Configure how and when platform administrators receive alerts.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BellRing className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Slack Webhook URL</Label>
            <Input value={slackWebhook} onChange={(e) => setSlackWebhook(e.target.value)} className="text-sm font-mono" placeholder="https://hooks.slack.com/services/..." />
            <p className="text-[10px] text-muted-foreground">Used for sending alert notifications to your Slack channel.</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily Digest Email</p>
              <p className="text-xs text-muted-foreground mt-0.5">Receive a daily summary of all platform activity.</p>
            </div>
            <Switch checked={digestEnabled} onCheckedChange={setDigestEnabled} />
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Notification channels saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">Alert Rules</CardTitle>
          <CardDescription className="text-xs">Choose which events trigger notifications and through which channels.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr,80px,80px,80px] gap-2 px-4 py-2.5 bg-muted/50 border-b text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Event</span>
              <span className="text-center">Email</span>
              <span className="text-center">Slack</span>
              <span className="text-center">In-App</span>
            </div>
            {rules.map((rule, i) => (
              <div key={rule.id} className={`grid grid-cols-[1fr,80px,80px,80px] gap-2 px-4 py-3 items-center ${i < rules.length - 1 ? "border-b" : ""}`}>
                <div>
                  <p className="text-sm font-medium">{rule.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>
                </div>
                <div className="flex justify-center">
                  <Switch checked={rule.email} onCheckedChange={() => toggleRule(rule.id, "email")} className="scale-90" />
                </div>
                <div className="flex justify-center">
                  <Switch checked={rule.slack} onCheckedChange={() => toggleRule(rule.id, "slack")} className="scale-90" />
                </div>
                <div className="flex justify-center">
                  <Switch checked={rule.inApp} onCheckedChange={() => toggleRule(rule.id, "inApp")} className="scale-90" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={() => toast.success("Alert rules saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
