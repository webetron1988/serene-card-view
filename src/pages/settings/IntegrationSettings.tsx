import { useState } from "react";
import { Save, CheckCircle2, Circle, ChevronDown, ChevronUp, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
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
  fields: { key: string; label: string; placeholder: string; value: string; sensitive: boolean }[];
  isVerified?: boolean;
}

const defaultIntegrations: Integration[] = [
  {
    id: "slack", name: "Slack", category: "Communication", description: "Send notifications and alerts to Slack channels.",
    status: "connected", icon: "💬", isVerified: true,
    fields: [{ key: "webhook_url", label: "Webhook URL", placeholder: "https://hooks.slack.com/services/...", value: "https://hooks.slack.com/services/T00/B00/xxxx", sensitive: true }],
  },
  {
    id: "teams", name: "Microsoft Teams", category: "Communication", description: "Connect Teams for notifications and HR workflows.",
    status: "available", icon: "💼",
    fields: [
      { key: "tenant_id", label: "Tenant ID", placeholder: "Azure AD Tenant ID", value: "", sensitive: false },
      { key: "client_id", label: "Client ID", placeholder: "App Client ID", value: "", sensitive: false },
    ],
  },
  {
    id: "whatsapp", name: "WhatsApp Business", category: "Communication", description: "Send notifications and reminders via WhatsApp.",
    status: "available", icon: "📱",
    fields: [{ key: "api_token", label: "API Token", placeholder: "WhatsApp Business API token", value: "", sensitive: true }],
  },
  {
    id: "bamboohr", name: "BambooHR", category: "HRIS", description: "Sync employee data from BambooHR.",
    status: "available", icon: "🌿",
    fields: [
      { key: "subdomain", label: "Subdomain", placeholder: "your-company.bamboohr.com", value: "", sensitive: false },
      { key: "api_key", label: "API Key", placeholder: "Enter BambooHR API key", value: "", sensitive: true },
    ],
  },
  {
    id: "workday", name: "Workday", category: "HRIS", description: "Enterprise HCM integration with Workday.",
    status: "available", icon: "🏢",
    fields: [
      { key: "tenant_url", label: "Tenant URL", placeholder: "https://impl.workday.com/tenant", value: "", sensitive: false },
      { key: "client_id", label: "Client ID", placeholder: "Enter Client ID", value: "", sensitive: true },
      { key: "client_secret", label: "Client Secret", placeholder: "Enter Client Secret", value: "", sensitive: true },
    ],
  },
  {
    id: "greenhouse", name: "Greenhouse", category: "ATS", description: "Integrate applicant tracking and recruitment pipeline.",
    status: "available", icon: "🌱",
    fields: [{ key: "api_key", label: "API Key", placeholder: "Enter Greenhouse API key", value: "", sensitive: true }],
  },
  {
    id: "google_workspace", name: "Google Workspace", category: "Productivity", description: "Calendar, Drive, and SSO integration.",
    status: "available", icon: "📁",
    fields: [{ key: "service_account", label: "Service Account Key (JSON)", placeholder: "Paste service account JSON", value: "", sensitive: true }],
  },
  {
    id: "azure_ad", name: "Azure AD / Entra", category: "Identity", description: "Enterprise SSO and directory sync.",
    status: "available", icon: "🔐",
    fields: [
      { key: "tenant_id", label: "Tenant ID", placeholder: "Azure AD Tenant ID", value: "", sensitive: false },
      { key: "client_id", label: "Application ID", placeholder: "App Registration ID", value: "", sensitive: false },
      { key: "client_secret", label: "Client Secret", placeholder: "Enter Client Secret", value: "", sensitive: true },
    ],
  },
  {
    id: "zapier", name: "Zapier", category: "Automation", description: "Connect to 5000+ apps through Zapier workflows.",
    status: "available", icon: "⚡",
    fields: [{ key: "api_key", label: "API Key", placeholder: "Enter Zapier API key", value: "", sensitive: true }],
  },
];

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState(defaultIntegrations);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  const categories = ["all", ...Array.from(new Set(integrations.map(i => i.category)))];
  const filtered = filter === "all" ? integrations : integrations.filter(i => i.category === filter);

  const updateField = (integrationId: string, fieldKey: string, value: string) => {
    setIntegrations(ints => ints.map(i => {
      if (i.id !== integrationId) return i;
      const fields = i.fields.map(f => f.key === fieldKey ? { ...f, value } : f);
      return { ...i, fields };
    }));
  };

  const handleSave = async (integration: Integration) => {
    setSavingId(integration.id);
    await new Promise(r => setTimeout(r, 800));
    setIntegrations(ints => ints.map(i =>
      i.id === integration.id ? { ...i, status: "connected" as const, isVerified: true } : i
    ));
    toast.success(`${integration.name} connected successfully`);
    setSavingId(null);
  };

  const handleDisconnect = (integration: Integration) => {
    setIntegrations(ints => ints.map(i =>
      i.id === integration.id ? { ...i, status: "available" as const, isVerified: false } : i
    ));
    toast.success(`${integration.name} disconnected`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Integrations</h3>
        <p className="text-sm text-muted-foreground mt-1">Connect third-party services to extend platform capabilities. Credentials are encrypted at rest.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
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
                    {isConnected && integration.isVerified && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-emerald-600 bg-emerald-50 border-emerald-200 gap-0.5">
                        <ShieldCheck className="w-3 h-3" strokeWidth={1.5} />Verified
                      </Badge>
                    )}
                    {isConnected && !integration.isVerified && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-600 bg-amber-50 border-amber-200 gap-0.5">
                        <AlertTriangle className="w-3 h-3" strokeWidth={1.5} />Unverified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                </div>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
            </div>
            {isExpanded && (
              <div className="border-t px-6 py-5 space-y-4">
                {integration.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label className="text-xs">{field.label}</Label>
                    <Input
                      value={field.value}
                      onChange={(e) => updateField(integration.id, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="text-sm font-mono"
                      type={field.sensitive ? "password" : "text"}
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  {isConnected && (
                    <Button size="sm" variant="outline" onClick={() => handleDisconnect(integration)} className="text-xs text-destructive hover:text-destructive">
                      Disconnect
                    </Button>
                  )}
                  <Button size="sm" disabled={savingId === integration.id} onClick={() => handleSave(integration)} className="text-xs">
                    {savingId === integration.id ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                    )}
                    {savingId === integration.id ? "Saving..." : isConnected ? "Save Changes" : "Save & Connect"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
