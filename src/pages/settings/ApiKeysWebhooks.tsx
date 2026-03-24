import { useState } from "react";
import { Save, Key, Webhook, Plus, Copy, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ApiKey {
  id: string; name: string; key: string; createdAt: string; lastUsed: string; status: "active" | "revoked";
}

interface WebhookEndpoint {
  id: string; url: string; events: string[]; status: "active" | "inactive"; lastDelivery: string; successRate: number;
}

const defaultKeys: ApiKey[] = [
  { id: "k1", name: "Production API Key", key: "thub_live_sk_4f8b2c1d9e7a6b3c5d8f1e2a", createdAt: "2025-12-01", lastUsed: "2026-03-08", status: "active" },
  { id: "k2", name: "Development API Key", key: "thub_test_sk_7c3d1e9f2b5a8c4d6e1f3a7b", createdAt: "2026-01-15", lastUsed: "2026-03-07", status: "active" },
  { id: "k3", name: "Legacy Integration", key: "thub_live_sk_1a2b3c4d5e6f7g8h9i0j1k2l", createdAt: "2025-06-10", lastUsed: "2025-11-20", status: "revoked" },
];

const defaultWebhooks: WebhookEndpoint[] = [
  { id: "w1", url: "https://api.example.com/webhooks/talenthub", events: ["employee.created", "leave.approved", "payroll.processed"], status: "active", lastDelivery: "2 min ago", successRate: 99.8 },
  { id: "w2", url: "https://crm.acme.com/hooks/hr", events: ["employee.onboarded", "employee.offboarded"], status: "active", lastDelivery: "15 min ago", successRate: 97.2 },
];

export default function ApiKeysWebhooks() {
  const [keys, setKeys] = useState(defaultKeys);
  const [webhooks, setWebhooks] = useState(defaultWebhooks);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [showAddKey, setShowAddKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: "", events: "employee.created" });

  const createKey = () => {
    if (!newKeyName) return;
    const key: ApiKey = { id: `k${Date.now()}`, name: newKeyName, key: `thub_live_sk_${Math.random().toString(36).slice(2, 26)}`, createdAt: new Date().toISOString().split("T")[0], lastUsed: "Never", status: "active" };
    setKeys([key, ...keys]);
    setNewKeyName("");
    setShowAddKey(false);
    toast.success("API key created");
  };

  const revokeKey = (id: string) => {
    setKeys(ks => ks.map(k => k.id === id ? { ...k, status: "revoked" as const } : k));
    toast.success("API key revoked");
  };

  const createWebhook = () => {
    if (!newWebhook.url) return;
    const wh: WebhookEndpoint = { id: `w${Date.now()}`, url: newWebhook.url, events: [newWebhook.events], status: "active", lastDelivery: "Never", successRate: 0 };
    setWebhooks([...webhooks, wh]);
    setNewWebhook({ url: "", events: "employee.created" });
    setShowAddWebhook(false);
    toast.success("Webhook endpoint created");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">API Keys & Webhooks</h3>
        <p className="text-sm text-muted-foreground mt-1">Manage platform API keys and configure webhook endpoints.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                API Keys
              </CardTitle>
              <CardDescription className="text-xs mt-1">Manage API keys for programmatic platform access.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAddKey(!showAddKey)} className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />{showAddKey ? "Cancel" : "Create Key"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {showAddKey && (
            <div className="flex gap-2 p-3 bg-primary/5 rounded-lg border border-dashed border-primary/30 mb-2">
              <Input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Key name (e.g. Production API)" className="text-sm flex-1" onKeyDown={(e) => e.key === "Enter" && createKey()} />
              <Button size="sm" onClick={createKey} className="text-xs">Create</Button>
            </div>
          )}
          {keys.map((key) => (
            <div key={key.id} className={`flex items-center justify-between p-3 rounded-lg border transition-opacity ${key.status === "revoked" ? "opacity-50 bg-muted/20" : "bg-card"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{key.name}</p>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${key.status === "active" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-muted-foreground"}`}>
                    {key.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs font-mono text-muted-foreground">
                    {showKeyId === key.id ? key.key : `${key.key.slice(0, 16)}${"•".repeat(12)}`}
                  </code>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Created {key.createdAt} · Last used {key.lastUsed}</p>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <button onClick={() => setShowKeyId(showKeyId === key.id ? null : key.id)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
                  {showKeyId === key.id ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(key.key); toast.success("Key copied"); }} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
                  <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                {key.status === "active" && (
                  <button onClick={() => revokeKey(key.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Webhook className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Webhook Endpoints
              </CardTitle>
              <CardDescription className="text-xs mt-1">Configure endpoints to receive platform events in real-time.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAddWebhook(!showAddWebhook)} className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />{showAddWebhook ? "Cancel" : "Add Endpoint"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {showAddWebhook && (
            <div className="space-y-3 p-3 bg-primary/5 rounded-lg border border-dashed border-primary/30 mb-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Endpoint URL</Label>
                <Input value={newWebhook.url} onChange={(e) => setNewWebhook(p => ({ ...p, url: e.target.value }))} placeholder="https://your-server.com/webhooks" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Events</Label>
                <Select value={newWebhook.events} onValueChange={(v) => setNewWebhook(p => ({ ...p, events: v }))}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee.created">employee.created</SelectItem>
                    <SelectItem value="employee.onboarded">employee.onboarded</SelectItem>
                    <SelectItem value="leave.approved">leave.approved</SelectItem>
                    <SelectItem value="payroll.processed">payroll.processed</SelectItem>
                    <SelectItem value="employee.offboarded">employee.offboarded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={createWebhook} className="text-xs">Add Endpoint</Button>
              </div>
            </div>
          )}
          {webhooks.map((wh) => (
            <div key={wh.id} className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <code className="text-xs font-mono text-foreground">{wh.url}</code>
                  <div className="flex items-center gap-2 mt-1.5">
                    {wh.events.map(e => (
                      <Badge key={e} variant="outline" className="text-[10px] px-1.5 py-0">{e}</Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5">Last delivery: {wh.lastDelivery} · Success rate: {wh.successRate}%</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Switch checked={wh.status === "active"} onCheckedChange={(v) => setWebhooks(ws => ws.map(w => w.id === wh.id ? { ...w, status: v ? "active" : "inactive" } : w))} />
                  <button onClick={() => toast.info("Test webhook sent")} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
                    <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
