import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { countryCodes, defaultCountry } from "@/data/countryCodes";
import { toast } from "sonner";

interface RoleOption {
  kind: "system" | "platform_custom";
  ref: string;
  label: string;
}

export function InviteUserModal({ open, onClose, onSent }: { open: boolean; onClose: () => void; onSent: () => void }) {
  const { hasPlatformRole } = useAuth();
  const isSuper = hasPlatformRole("super_admin");

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country_code: defaultCountry.dial,
    country_iso: defaultCountry.code,
    role_kind: "system" as "system" | "platform_custom",
    role_ref: "admin",
  });

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoadingRoles(true);
      const opts: RoleOption[] = [];
      if (isSuper) opts.push({ kind: "system", ref: "super_admin", label: "Super Administrator" });
      opts.push({ kind: "system", ref: "admin", label: "Administrator" });
      const { data } = await supabase
        .from("platform_custom_roles")
        .select("id, name")
        .eq("is_archived", false)
        .order("name");
      (data || []).forEach(r => opts.push({ kind: "platform_custom", ref: r.id, label: r.name }));
      setRoles(opts);
      setLoadingRoles(false);
    })();
  }, [open, isSuper]);

  const filteredCountries = useMemo(() => {
    const q = countryQuery.toLowerCase().trim();
    if (!q) return countryCodes;
    return countryCodes.filter(c =>
      c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countryQuery]);

  const selectedCountry = countryCodes.find(c => c.code === form.country_iso) || defaultCountry;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.role_ref) {
      toast.error("First name, last name, email, and role are required");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("send-platform-invitation", {
      body: {
        email: form.email.toLowerCase().trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone || null,
        country_code: form.phone ? form.country_code : null,
        role_kind: form.role_kind,
        role_ref: form.role_ref,
      },
    });
    setSubmitting(false);
    const payload = (data as any) || {};
    if (error || payload.error) {
      toast.error(payload.error || error?.message || "Failed to send invitation");
      return;
    }
    toast.success(payload.message || "Invitation sent");
    onSent();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Invite Platform User</h3>
            <p className="text-xs text-muted-foreground mt-0.5">They'll receive an email to set their password.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">First name *</label>
              <input value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} required
                className="w-full mt-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium">Last name *</label>
              <input value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} required
                className="w-full mt-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required
              className="w-full mt-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="user@company.com" />
          </div>
          <div>
            <label className="text-xs font-medium">Phone <span className="text-muted-foreground font-normal">(optional)</span></label>
            <div className="mt-1 flex gap-2">
              <div className="relative">
                <button type="button" onClick={() => setCountryOpen(!countryOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm min-w-[110px]">
                  <span>{selectedCountry.flag}</span>
                  <span className="text-xs text-muted-foreground">{selectedCountry.dial}</span>
                </button>
                {countryOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-popover border border-border rounded-lg shadow-lg z-10 max-h-72 overflow-hidden flex flex-col">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input autoFocus value={countryQuery} onChange={(e) => setCountryQuery(e.target.value)} placeholder="Search country..."
                          className="w-full pl-7 pr-2 py-1.5 text-xs bg-secondary/50 rounded border border-border focus:outline-none" />
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {filteredCountries.map(c => (
                        <button key={c.code} type="button"
                          onClick={() => { setForm(f => ({ ...f, country_iso: c.code, country_code: c.dial })); setCountryOpen(false); setCountryQuery(""); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-left">
                          <span>{c.flag}</span>
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="text-xs text-muted-foreground">{c.dial}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <input type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Phone number" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium">Role *</label>
            <select value={`${form.role_kind}:${form.role_ref}`}
              onChange={(e) => { const [kind, ref] = e.target.value.split(":"); setForm(f => ({ ...f, role_kind: kind as any, role_ref: ref })); }}
              className="w-full mt-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {loadingRoles ? <option>Loading...</option> : roles.map(r => (
                <option key={`${r.kind}:${r.ref}`} value={`${r.kind}:${r.ref}`}>{r.label}</option>
              ))}
            </select>
            {!isSuper && <p className="text-[11px] text-muted-foreground mt-1">As an Administrator, you can invite Admins and any custom role — but not Super Administrators.</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Sending..." : "Send invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
