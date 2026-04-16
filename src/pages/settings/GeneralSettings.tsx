import { useEffect, useState } from "react";
import { Save, Globe, Building2, ExternalLink, Info, Loader2, Link2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePlatformSetting } from "@/hooks/usePlatformSettings";

interface GeneralValue {
  app_name: string;
  support_email: string;
  logo_url: string;
  company_name: string;
  description: string;
}

export default function GeneralSettings() {
  const general = usePlatformSetting<GeneralValue>("platform_general");
  const baseUrl = usePlatformSetting<string>("platform_base_url");

  const [form, setForm] = useState<GeneralValue>({
    app_name: "",
    support_email: "",
    logo_url: "",
    company_name: "",
    description: "",
  });
  const [base, setBase] = useState("");
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [savingBase, setSavingBase] = useState(false);

  useEffect(() => {
    if (general.value) {
      setForm({
        app_name: general.value.app_name || "",
        support_email: general.value.support_email || "",
        logo_url: general.value.logo_url || "",
        company_name: general.value.company_name || "",
        description: (general.value as any).description || "",
      });
    }
  }, [general.value]);

  useEffect(() => {
    if (typeof baseUrl.value === "string") setBase(baseUrl.value);
    else if (!baseUrl.loading && !baseUrl.value) setBase(window.location.origin);
  }, [baseUrl.value, baseUrl.loading]);

  const update = (k: keyof GeneralValue, v: string) => setForm(p => ({ ...p, [k]: v }));

  const saveIdentity = async () => {
    setSavingIdentity(true);
    const { error } = await general.save(form);
    setSavingIdentity(false);
    if (error) toast.error(error.message); else toast.success("Identity saved");
  };

  const saveBase = async () => {
    let v = base.trim();
    if (v && !v.startsWith("http")) v = `https://${v}`;
    v = v.replace(/\/+$/, "");
    setSavingBase(true);
    const { error } = await baseUrl.save(v as any);
    setSavingBase(false);
    if (error) toast.error(error.message); else { setBase(v); toast.success("Base URL saved"); }
  };

  const loading = general.loading || baseUrl.loading;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">General Settings</h3>
        <p className="text-sm text-muted-foreground mt-1">Core platform identity and branding used in emails and the app.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Platform Identity
              </CardTitle>
              <CardDescription className="text-xs">App name, contact, and branding shown in invitations and emails.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">App Name</Label>
                  <Input value={form.app_name} onChange={(e) => update("app_name", e.target.value)} className="text-sm" placeholder="AchievHR" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Company / Legal Name</Label>
                  <Input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} className="text-sm" placeholder="AchievHR by inHRSight" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Support Email</Label>
                  <Input value={form.support_email} onChange={(e) => update("support_email", e.target.value)} className="text-sm" placeholder="support@yourdomain.com" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Logo URL</Label>
                  <Input value={form.logo_url} onChange={(e) => update("logo_url", e.target.value)} className="text-sm" placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Platform Description</Label>
                <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="text-sm min-h-[80px] resize-none" />
              </div>
              <div className="flex justify-end">
                <Button size="sm" disabled={savingIdentity} onClick={saveIdentity} className="text-xs">
                  {savingIdentity ? <Loader2 className="w-3.5 h-3.5 me-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />}
                  {savingIdentity ? "Saving..." : "Save Identity"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Link2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                Platform Base URL
              </CardTitle>
              <CardDescription className="text-xs">The public URL used to build invitation and password reset links sent in emails.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Base URL</Label>
                <div className="relative">
                  <Input value={base} onChange={(e) => setBase(e.target.value)} className="text-sm pe-8" placeholder="https://app.yourdomain.com" />
                  <ExternalLink className="absolute end-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-[11px] text-muted-foreground flex items-start gap-1 mt-1">
                  <Info className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={1.5} />
                  Used as the prefix for <code className="text-foreground">/admin/accept-invite</code> and <code className="text-foreground">/admin/reset-password</code> links in outgoing emails.
                </p>
              </div>
              <div className="flex justify-end">
                <Button size="sm" disabled={savingBase} onClick={saveBase} className="text-xs">
                  {savingBase ? <Loader2 className="w-3.5 h-3.5 me-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />}
                  {savingBase ? "Saving..." : "Save Base URL"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
