import { useState } from "react";
import { Save, Globe, Clock, Building2, ExternalLink, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function GeneralSettings() {
  const [form, setForm] = useState({
    platformName: "TalentHub Platform",
    platformUrl: "https://app.talenthub.com",
    supportEmail: "support@talenthub.com",
    description: "Enterprise-grade HR platform for managing workforce, organization, and talent.",
    defaultLanguage: "en",
    timezone: "UTC",
    currency: "USD",
    maintenanceMode: false,
    signupsEnabled: true,
    trialDays: "14",
    maxTenantsPerAccount: "5",
  });

  const update = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">General</h3>
        <p className="text-sm text-muted-foreground mt-1">Core platform identity, regional defaults and operational controls.</p>
      </div>

      {/* Platform Identity */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Platform Identity
          </CardTitle>
          <CardDescription className="text-xs">Basic information about your platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Platform Name</Label>
              <Input value={form.platformName} onChange={(e) => update("platformName", e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Platform URL</Label>
              <div className="relative">
                <Input value={form.platformUrl} onChange={(e) => update("platformUrl", e.target.value)} className="text-sm pe-8" />
                <ExternalLink className="absolute end-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              </div>
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
            <Button size="sm" onClick={() => toast.success("Identity settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regional & Currency Defaults */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Regional & Currency Defaults
          </CardTitle>
          <CardDescription className="text-xs">Language, timezone and currency for the platform</CardDescription>
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
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Berlin">Berlin</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
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
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="AED">AED (د.إ)</SelectItem>
                  <SelectItem value="SGD">SGD (S$)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">Used across billing, plans, and reports</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Regional settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save
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
          <CardDescription className="text-xs">Operational switches and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-foreground">Open Registration</p>
              <p className="text-xs text-muted-foreground mt-0.5">Allow new users to sign up from the login page</p>
            </div>
            <Switch checked={form.signupsEnabled} onCheckedChange={(v) => update("signupsEnabled", v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-foreground">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">Show maintenance page to all non-admin users</p>
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
              <Label className="text-xs">Max Tenants per Account</Label>
              <Input type="number" value={form.maxTenantsPerAccount} onChange={(e) => update("maxTenantsPerAccount", e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Platform controls saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
