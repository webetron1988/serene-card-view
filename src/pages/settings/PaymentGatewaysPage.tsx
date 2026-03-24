import { useState } from "react";
import { Save, CreditCard, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Gateway { id: string; name: string; status: "connected" | "configured" | "not_configured"; mode: "live" | "test"; icon: string; description: string; apiKey: string; secretKey: string; webhookUrl: string; }

const defaultGateways: Gateway[] = [
  { id: "stripe", name: "Stripe", status: "connected", mode: "live", icon: "💳", description: "Accept credit cards, debit cards, and digital wallets worldwide.", apiKey: "pk_live_••••••••4242", secretKey: "sk_live_••••••••8888", webhookUrl: "https://api.talenthub.com/webhooks/stripe" },
  { id: "razorpay", name: "Razorpay", status: "configured", mode: "test", icon: "🇮🇳", description: "Payment gateway optimized for India with UPI, cards, and net banking.", apiKey: "rzp_test_••••••••1234", secretKey: "••••••••••••", webhookUrl: "https://api.talenthub.com/webhooks/razorpay" },
  { id: "paypal", name: "PayPal", status: "not_configured", mode: "test", icon: "🅿️", description: "Global payments with PayPal, Venmo, and Pay Later options.", apiKey: "", secretKey: "", webhookUrl: "https://api.talenthub.com/webhooks/paypal" },
];

const statusConfig = {
  connected: { label: "Connected", icon: CheckCircle2, className: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  configured: { label: "Configured", icon: AlertCircle, className: "text-amber-600 bg-amber-50 border-amber-200" },
  not_configured: { label: "Not Configured", icon: Circle, className: "text-muted-foreground bg-muted/50 border-border" },
};

export default function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState(defaultGateways);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [autoRetry, setAutoRetry] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState("3");

  const updateGateway = (id: string, updates: Partial<Gateway>) => { setGateways(gws => gws.map(g => g.id === id ? { ...g, ...updates } : g)); };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Payment Gateways</h3>
        <p className="text-sm text-muted-foreground mt-1">Configure payment processors and billing settings.</p>
      </div>

      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-sm font-medium flex items-center gap-2"><CreditCard className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />Billing Defaults</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><Label className="text-xs">Failed Payment Retries</Label><Input type="number" value={retryAttempts} onChange={(e) => setRetryAttempts(e.target.value)} className="text-sm" /></div></div>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><div><p className="text-sm">Automatic Tax Collection</p><p className="text-xs text-muted-foreground mt-0.5">Automatically calculate and collect applicable taxes.</p></div><Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} /></div>
            <div className="flex items-center justify-between"><div><p className="text-sm">Auto-Retry Failed Payments</p><p className="text-xs text-muted-foreground mt-0.5">Automatically retry failed subscription charges.</p></div><Switch checked={autoRetry} onCheckedChange={setAutoRetry} /></div>
          </div>
          <div className="flex justify-end"><Button size="sm" onClick={() => toast.success("Billing defaults saved")} className="text-xs"><Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes</Button></div>
        </CardContent>
      </Card>

      {gateways.map((gw) => {
        const status = statusConfig[gw.status];
        const StatusIcon = status.icon;
        const isExpanded = expandedId === gw.id;
        return (
          <Card key={gw.id} className="overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedId(isExpanded ? null : gw.id)}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{gw.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground">{gw.name}</h4>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${status.className}`}><StatusIcon className="w-3 h-3 mr-1" strokeWidth={1.5} />{status.label}</Badge>
                    {gw.status !== "not_configured" && <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${gw.mode === "live" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"}`}>{gw.mode === "live" ? "Live" : "Test"} Mode</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{gw.description}</p>
                </div>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
            </div>
            {isExpanded && (
              <CardContent className="border-t pt-5 space-y-4">
                <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Live Mode</p><p className="text-xs text-muted-foreground">Switch between test and live credentials.</p></div><Switch checked={gw.mode === "live"} onCheckedChange={(v) => updateGateway(gw.id, { mode: v ? "live" : "test" })} /></div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label className="text-xs">API Key / Publishable Key</Label><Input value={gw.apiKey} onChange={(e) => updateGateway(gw.id, { apiKey: e.target.value })} className="text-sm font-mono" placeholder="Enter API key" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Secret Key</Label><Input type="password" value={gw.secretKey} onChange={(e) => updateGateway(gw.id, { secretKey: e.target.value })} className="text-sm font-mono" placeholder="Enter secret key" /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Webhook URL</Label><div className="flex gap-2"><Input value={gw.webhookUrl} readOnly className="text-sm font-mono bg-muted/30 flex-1" /><Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(gw.webhookUrl); toast.success("Webhook URL copied"); }} className="text-xs">Copy</Button></div></div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" className="text-xs"><ExternalLink className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />View Dashboard</Button>
                  <Button size="sm" onClick={() => { updateGateway(gw.id, { status: "connected" }); toast.success(`${gw.name} configuration saved`); }} className="text-xs"><Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save & Connect</Button>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
