import { useState } from "react";
import { Save, Globe, Clock, Building2, ExternalLink, DollarSign, Info, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "AED", symbol: "د.إ" },
  { code: "SGD", symbol: "S$" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
];

export default function GeneralSettings() {
  const [form, setForm] = useState({
    platformName: "AchievHR Platform",
    platformUrl: "app.achievhr.com",
    supportEmail: "support@achievhr.com",
    description: "Enterprise-grade HR platform for managing workforce, organization, talent, and employee lifecycle.",
    defaultLanguage: "en",
    timezone: "UTC",
    currency: "USD",
    maintenanceMode: false,
    signupsEnabled: true,
    trialDays: "14",
    maxTenantsPerAccount: "100",
  });
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [savingRegional, setSavingRegional] = useState(false);
  const [savingControls, setSavingControls] = useState(false);

  const update = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  const simulateSave = async (setter: (v: boolean) => void, msg: string) => {
    setter(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success(msg);
    setter(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">General Settings</h3>
        <p className="text-sm text-muted-foreground mt-1">Core platform identity and configuration.</p>
      </div>

      {/* Platform Identity */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Platform Identity
          </CardTitle>
          <CardDescription className="text-xs">Your platform's name, URL, and contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Platform Name</Label>
              <Input value={form.platformName} onChange={(e) => update("platformName", e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Platform Base URL</Label>
              <div className="relative">
                <Input value={form.platformUrl} onChange={(e) => update("platformUrl", e.target.value)} className="text-sm pe-8" placeholder="app.yourdomain.com" />
                <ExternalLink className="absolute end-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-start gap-1 mt-1">
                <Info className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={1.5} />
                This hostname is used as the CNAME target when tenants configure custom domains.
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Support Email</Label>
            <Input value={form.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Platform Description</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="text-sm min-h-[80px] resize-none" />
          </div>
          <div className="flex justify-end">
            <Button size="sm" disabled={savingIdentity} onClick={() => simulateSave(setSavingIdentity, "Identity settings saved")} className="text-xs">
              {savingIdentity ? <Loader2 className="w-3.5 h-3.5 me-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />}{savingIdentity ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regional & Currency */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Regional & Currency Defaults
          </CardTitle>
          <CardDescription className="text-xs">Default language, timezone, and currency for the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Default Language</Label>
              <Select value={form.defaultLanguage} onValueChange={(v) => update("defaultLanguage", v)}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Default Timezone</Label>
              <Select value={form.timezone} onValueChange={(v) => update("timezone", v)}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">US Eastern</SelectItem>
                  <SelectItem value="America/Chicago">US Central</SelectItem>
                  <SelectItem value="America/Los_Angeles">US Pacific</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                  <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                  <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Default Currency
              </Label>
              <Select value={form.currency} onValueChange={v => update("currency", v)}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" disabled={savingRegional} onClick={() => simulateSave(setSavingRegional, "Regional settings saved")} className="text-xs">
              {savingRegional ? <Loader2 className="w-3.5 h-3.5 me-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />}{savingRegional ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Controls */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Platform Controls
          </CardTitle>
          <CardDescription className="text-xs">Registration, maintenance mode, and tenant limits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-foreground">Open Registration</p>
              <p className="text-xs text-muted-foreground mt-0.5">Allow users to self-register on the platform.</p>
            </div>
            <Switch checked={form.signupsEnabled} onCheckedChange={(v) => update("signupsEnabled", v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-foreground">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">Temporarily take the platform offline for maintenance.</p>
            </div>
            <Switch checked={form.maintenanceMode} onCheckedChange={(v) => update("maintenanceMode", v)} />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Trial Period (days)</Label>
              <Input type="number" value={form.trialDays} onChange={(e) => update("trialDays", e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max Tenants</Label>
              <Input type="number" value={form.maxTenantsPerAccount} onChange={(e) => update("maxTenantsPerAccount", e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" disabled={savingControls} onClick={() => simulateSave(setSavingControls, "Platform controls saved")} className="text-xs">
              {savingControls ? <Loader2 className="w-3.5 h-3.5 me-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />}{savingControls ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
