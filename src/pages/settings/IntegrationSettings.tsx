import { useState } from "react";
import { Save, CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "connected" | "available";
  icon: string;
  fields: { label: string; placeholder: string; value: string }[];
}

const defaultIntegrations: Integration[] = [
  { id: "salesforce", name: "Salesforce", category: "CRM", description: "Sync contacts, leads, and opportunities with Salesforce CRM.", status: "connected", icon: "☁️", fields: [{ label: "Instance URL", placeholder: "https://your-instance.salesforce.com", value: "https://talenthub.salesforce.com" }, { label: "API Token", placeholder: "Enter Salesforce API token", value: "sf_tok_••••••••" }] },
  { id: "hubspot", name: "HubSpot", category: "CRM", description: "Connect HubSpot for contact management and deal tracking.", status: "available", icon: "🟠", fields: [{ label: "API Key", placeholder: "Enter HubSpot API key", value: "" }] },
  { id: "slack", name: "Slack", category: "Communication", description: "Send notifications and alerts to Slack channels.", status: "connected", icon: "💬", fields: [{ label: "Webhook URL", placeholder: "https://hooks.slack.com/services/...", value: "https://hooks.slack.com/services/T00/B00/xxxx" }] },
  { id: "zapier", name: "Zapier", category: "Automation", description: "Connect to 5000+ apps through Zapier workflows.", status: "available", icon: "⚡", fields: [{ label: "API Key", placeholder: "Enter Zapier API key", value: "" }] },
  { id: "segment", name: "Segment", category: "Analytics", description: "Route analytics data to your preferred data warehouse.", status: "available", icon: "📊", fields: [{ label: "Write Key", placeholder: "Enter Segment write key", value: "" }] },
  { id: "zendesk", name: "Zendesk", category: "Support", description: "Create support tickets and sync customer data with Zendesk.", status: "available", icon: "🎧", fields: [{ label: "Subdomain", placeholder: "your-company.zendesk.com", value: "" }, { label: "API Token", placeholder: "Enter Zendesk API token", value: "" }] },
];

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState(defaultIntegrations);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(integrations.map(i => i.category)))];
  const filtered = filter === "all" ? integrations : integrations.filter(i => i.category === filter);

  const updateField = (integrationId: string, fieldIndex: number, value: string) => {
    setIntegrations(ints => ints.map(i => {
      if (i.id !== integrationId) return i;
      const fields = [...i.fields];
      fields[fieldIndex] = { ...fields[fieldIndex], value };
      return { ...i, fields };
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Integrations</h3>
        <p className="text-sm text-muted-foreground mt-1">Connect third-party services to extend platform capabilities.</p>
      </div>

      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === cat ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      {filtered.map((integration) => {
        const isExpanded = expandedId === integration.id;
        const isConnected = integration.status === "connected";

        return (
          <Card key={integration.id} className="overflow-hidden">
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : integration.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{integration.name}</h4>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{integration.category}</Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${isConnected ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-muted-foreground"}`}>
                      {isConnected ? <><CheckCircle2 className="w-3 h-3 mr-0.5" strokeWidth={1.5} />Connected</> : <><Circle className="w-3 h-3 mr-0.5" strokeWidth={1.5} />Available</>}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                </div>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
            </div>
            {isExpanded && (
              <CardContent className="border-t pt-5 space-y-4">
                {integration.fields.map((field, i) => (
                  <div key={field.label} className="space-y-1.5">
                    <Label className="text-xs">{field.label}</Label>
                    <Input
                      value={field.value}
                      onChange={(e) => updateField(integration.id, i, e.target.value)}
                      placeholder={field.placeholder}
                      className="text-sm font-mono"
                      type={field.label.toLowerCase().includes("token") || field.label.toLowerCase().includes("key") ? "password" : "text"}
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  {isConnected && (
                    <Button size="sm" variant="outline" onClick={() => {
                      setIntegrations(ints => ints.map(i => i.id === integration.id ? { ...i, status: "available" as const } : i));
                      toast.success(`${integration.name} disconnected`);
                    }} className="text-xs text-destructive hover:text-destructive">
                      Disconnect
                    </Button>
                  )}
                  <Button size="sm" onClick={() => {
                    setIntegrations(ints => ints.map(i => i.id === integration.id ? { ...i, status: "connected" as const } : i));
                    toast.success(`${integration.name} ${isConnected ? "updated" : "connected"} successfully`);
                  }} className="text-xs">
                    <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />{isConnected ? "Save Changes" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
