import { useState } from "react";
import { Bell, Mail, Smartphone, Save, ChevronDown, ChevronUp, Shield, Users, Building2, MessageSquare, Globe, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

const WhatsAppIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface NotificationTemplate {
  id: string;
  name: string;
  trigger: string;
  description: string;
  isActive: boolean;
  triggerStatus: "active" | "coming_soon" | "managed";
  audience: string;
}

const defaultTemplates: NotificationTemplate[] = [
  // Common
  { id: "user_account_locked", name: "Account Locked", trigger: "user_account_locked", description: "Sent when account is locked due to failed login attempts", isActive: true, triggerStatus: "active", audience: "common" },
  { id: "user_account_suspended", name: "Account Suspended", trigger: "user_account_suspended", description: "Sent when account is suspended by an administrator", isActive: true, triggerStatus: "active", audience: "common" },
  { id: "user_account_reactivated", name: "Account Reactivated", trigger: "user_account_reactivated", description: "Sent when a previously suspended account is reactivated", isActive: true, triggerStatus: "active", audience: "common" },
  { id: "user_password_changed", name: "Password Changed", trigger: "user_password_changed", description: "Security confirmation when password is changed", isActive: true, triggerStatus: "active", audience: "common" },
  { id: "user_security_alert", name: "Security Alert", trigger: "user_security_alert", description: "Unusual IP or location detected on account", isActive: true, triggerStatus: "active", audience: "common" },
  { id: "user_password_reset", name: "Password Reset", trigger: "user_password_reset", description: "Secure reset link when password reset is requested", isActive: true, triggerStatus: "managed", audience: "common" },
  // Platform Admin
  { id: "tenant_created", name: "Tenant Created", trigger: "tenant_created", description: "New tenant organization registered on the platform", isActive: true, triggerStatus: "active", audience: "super_admin" },
  { id: "tenant_suspended", name: "Tenant Suspended", trigger: "tenant_suspended", description: "Tenant account suspended by a super admin", isActive: true, triggerStatus: "active", audience: "super_admin" },
  { id: "platform_payment_failed", name: "Payment Failed", trigger: "platform_payment_failed", description: "Tenant's subscription payment failed to process", isActive: true, triggerStatus: "active", audience: "super_admin" },
  { id: "platform_payment_received", name: "Payment Received", trigger: "platform_payment_received", description: "Subscription payment successfully received", isActive: true, triggerStatus: "active", audience: "super_admin" },
  { id: "subscription_expiring", name: "Subscription Expiring", trigger: "subscription_expiring", description: "Tenant's subscription about to expire (7 days)", isActive: true, triggerStatus: "active", audience: "super_admin" },
  { id: "platform_security_alert", name: "Platform Security Alert", trigger: "platform_security_alert", description: "Suspicious activity or unauthorized access attempts", isActive: true, triggerStatus: "active", audience: "super_admin" },
  { id: "system_health_alert", name: "System Health Alert", trigger: "system_health_alert", description: "Critical system events — outages, database errors", isActive: true, triggerStatus: "active", audience: "super_admin" },
  { id: "storage_limit_warning", name: "Storage Limit Warning", trigger: "storage_limit_warning", description: "Tenant approaching storage quota limit", isActive: true, triggerStatus: "coming_soon", audience: "super_admin" },
  // Staff
  { id: "staff_account_created", name: "Staff Account Created", trigger: "staff_account_created", description: "New platform staff member account created", isActive: true, triggerStatus: "active", audience: "staff" },
  { id: "support_ticket_assigned", name: "Ticket Assigned", trigger: "support_ticket_assigned", description: "Support ticket assigned to a staff member", isActive: true, triggerStatus: "coming_soon", audience: "staff" },
  { id: "tenant_onboarding_task", name: "Onboarding Task", trigger: "tenant_onboarding_task", description: "New tenant requires onboarding assistance", isActive: true, triggerStatus: "coming_soon", audience: "staff" },
  { id: "daily_platform_summary", name: "Daily Summary", trigger: "daily_platform_summary", description: "Daily summary of platform activity and metrics", isActive: false, triggerStatus: "coming_soon", audience: "staff" },
  // Tenant
  { id: "tenant_welcome", name: "Welcome Email", trigger: "tenant_welcome", description: "Sent to tenant admin when organization is created", isActive: true, triggerStatus: "active", audience: "tenant" },
  { id: "subscription_activated", name: "Subscription Activated", trigger: "subscription_activated", description: "Tenant subscription is activated", isActive: true, triggerStatus: "active", audience: "tenant" },
  { id: "subscription_renewed", name: "Subscription Renewed", trigger: "subscription_renewed", description: "Tenant subscription is renewed", isActive: true, triggerStatus: "active", audience: "tenant" },
  { id: "payment_receipt_tenant", name: "Payment Receipt", trigger: "payment_receipt_tenant", description: "Receipt sent after successful billing", isActive: true, triggerStatus: "active", audience: "tenant" },
  { id: "payment_failed_tenant", name: "Payment Failed", trigger: "payment_failed_tenant", description: "Payment failed — update payment method instructions", isActive: true, triggerStatus: "active", audience: "tenant" },
  { id: "feature_update_tenant", name: "Feature Update", trigger: "feature_update_tenant", description: "New features available on the platform", isActive: false, triggerStatus: "coming_soon", audience: "tenant" },
  { id: "maintenance_notice_tenant", name: "Maintenance Notice", trigger: "maintenance_notice_tenant", description: "Scheduled platform maintenance notification", isActive: true, triggerStatus: "active", audience: "tenant" },
];

const AUDIENCE_CONFIG = [
  { key: "common", label: "Common / Account", sublabel: "All Users", icon: Globe, iconColor: "text-amber-500", iconBg: "bg-amber-50", badgeColor: "text-amber-600 bg-amber-50 border-amber-200", borderActive: "border-amber-200 bg-amber-50/50", description: "Account & security notifications sent to any user" },
  { key: "super_admin", label: "Platform Admin", sublabel: "Super Admin", icon: Shield, iconColor: "text-red-500", iconBg: "bg-red-50", badgeColor: "text-red-600 bg-red-50 border-red-200", borderActive: "border-red-200 bg-red-50/50", description: "Critical alerts for super administrators" },
  { key: "staff", label: "Platform Staff", sublabel: "Support & Operations", icon: Users, iconColor: "text-blue-500", iconBg: "bg-blue-50", badgeColor: "text-blue-600 bg-blue-50 border-blue-200", borderActive: "border-blue-200 bg-blue-50/50", description: "Operational notifications for team members" },
  { key: "tenant", label: "Tenants", sublabel: "Organization Admins", icon: Building2, iconColor: "text-emerald-500", iconBg: "bg-emerald-50", badgeColor: "text-emerald-600 bg-emerald-50 border-emerald-200", borderActive: "border-emerald-200 bg-emerald-50/50", description: "Outbound notifications to tenant administrators" },
];

type ChannelTab = "email" | "whatsapp" | "sms" | "inapp";

export default function NotificationSettings() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [activeTab, setActiveTab] = useState<ChannelTab>("email");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ common: true, super_admin: false, staff: false, tenant: false });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Record<string, { subject: string }>>({});

  const toggleActive = (id: string) => {
    const t = templates.find(x => x.id === id);
    if (!t) return;
    if (t.triggerStatus === "coming_soon") { toast.info("This notification will be available in a future update"); return; }
    if (t.triggerStatus === "managed") { toast.info("This notification is managed by the authentication system"); return; }
    setTemplates(ts => ts.map(x => x.id === id ? { ...x, isActive: !x.isActive } : x));
  };

  const totalActive = templates.filter(t => t.isActive).length;
  const totalTemplates = templates.length;

  const channelTabs = [
    { key: "email" as ChannelTab, label: "Email", icon: <Mail className="w-5 h-5 text-blue-500" strokeWidth={1.5} />, active: true, status: "Active", statusVariant: "active" },
    { key: "whatsapp" as ChannelTab, label: "WhatsApp", icon: <WhatsAppIcon className="w-5 h-5 text-green-600" />, active: false, status: "Setup Required", statusVariant: "warning" },
    { key: "sms" as ChannelTab, label: "SMS", icon: <Smartphone className="w-5 h-5 text-purple-500" strokeWidth={1.5} />, active: false, status: "Coming Soon", statusVariant: "muted" },
    { key: "inapp" as ChannelTab, label: "In-App", icon: <MessageSquare className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />, active: false, status: "Coming Soon", statusVariant: "muted" },
  ];

  const statusBadgeClass: Record<string, string> = {
    active: "text-emerald-700 bg-emerald-50 border-emerald-200",
    warning: "text-amber-700 bg-amber-50 border-amber-200",
    muted: "text-muted-foreground bg-muted/50 border-border",
  };

  const groupedByAudience = AUDIENCE_CONFIG.reduce<Record<string, NotificationTemplate[]>>((acc, cfg) => {
    acc[cfg.key] = templates.filter(t => t.audience === cfg.key);
    return acc;
  }, {});

  const getTriggerStatusBadge = (t: NotificationTemplate) => {
    if (t.triggerStatus === "coming_soon") return <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-600 bg-amber-50 border-amber-200 gap-0.5"><Clock className="w-2.5 h-2.5" />Coming Soon</Badge>;
    if (t.triggerStatus === "managed") return <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-blue-600 bg-blue-50 border-blue-200">Auth Managed</Badge>;
    return null;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" strokeWidth={1.5} />
          Notifications
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Configure platform-level notification templates and alert preferences.</p>
      </div>

      {/* Channel Tabs */}
      <div className="grid grid-cols-4 gap-3">
        {channelTabs.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => tab.active && setActiveTab(tab.key)}
              disabled={!tab.active}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${isSelected ? "border-primary bg-primary/5 shadow-sm" : tab.active ? "border-border bg-card hover:border-primary/30" : "border-border bg-muted/20 opacity-60 cursor-not-allowed"}`}
            >
              <div className="shrink-0">{tab.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground leading-none">{tab.label}</span>
                  <Badge variant="outline" className={`text-[10px] leading-none px-1.5 py-0 ${statusBadgeClass[tab.statusVariant]}`}>{tab.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-none">{tab.active ? `${totalActive}/${totalTemplates} enabled` : "Not connected"}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Inactive channel message */}
      {(activeTab === "whatsapp" || activeTab === "sms" || activeTab === "inapp") && (
        <Card>
          <CardContent className="py-10 text-center">
            {activeTab === "whatsapp" && <WhatsAppIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />}
            {activeTab === "sms" && <Smartphone className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1.5} />}
            {activeTab === "inapp" && <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1.5} />}
            <p className="text-sm font-medium text-muted-foreground">
              {activeTab === "whatsapp" ? "WhatsApp Notifications" : activeTab === "sms" ? "SMS Notifications" : "In-App Notifications"}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1 max-w-sm mx-auto">
              {activeTab === "whatsapp" ? "Configure WhatsApp integration in Settings → Integrations to enable WhatsApp notifications." : "This channel will be available in a future update."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Email Tab Content */}
      {activeTab === "email" && (
        <div className="space-y-3">
          {AUDIENCE_CONFIG.map((cfg) => {
            const audienceTemplates = groupedByAudience[cfg.key] || [];
            const activeCount = audienceTemplates.filter(t => t.isActive).length;
            const Icon = cfg.icon;
            const isOpen = openAccordions[cfg.key] ?? false;

            return (
              <Collapsible key={cfg.key} open={isOpen} onOpenChange={(open) => setOpenAccordions(prev => ({ ...prev, [cfg.key]: open }))}>
                <CollapsibleTrigger asChild>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-sm ${isOpen ? cfg.borderActive : "border-border bg-card"}`}>
                    <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${cfg.iconBg}`}>
                      <Icon className={`w-4 h-4 ${cfg.iconColor}`} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{cfg.label}</span>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${cfg.badgeColor}`}>{cfg.sublabel}</Badge>
                        <span className="text-[10px] text-muted-foreground">{activeCount}/{audienceTemplates.length} active</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{cfg.description}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 border rounded-xl overflow-hidden">
                    {audienceTemplates.map((t, i) => (
                      <div key={t.id}>
                        <div className={`flex items-center gap-3 px-4 py-3 ${i < audienceTemplates.length - 1 ? "border-b" : ""}`}>
                          <Switch checked={t.isActive} onCheckedChange={() => toggleActive(t.id)} className="scale-90 shrink-0" />
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{t.name}</p>
                              {getTriggerStatusBadge(t)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                          </div>
                          <button onClick={() => setExpandedId(expandedId === t.id ? null : t.id)} className="text-muted-foreground">
                            {expandedId === t.id ? <ChevronUp className="w-4 h-4" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4" strokeWidth={1.5} />}
                          </button>
                        </div>
                        {expandedId === t.id && (
                          <div className="px-4 pb-4 pt-1 border-b space-y-3 bg-muted/20">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Subject Line</Label>
                              <Input
                                value={editState[t.id]?.subject ?? `${t.name} — AchievHR`}
                                onChange={(e) => setEditState(prev => ({ ...prev, [t.id]: { subject: e.target.value } }))}
                                className="text-sm"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] text-muted-foreground">Trigger: <code className="font-mono bg-muted px-1 py-0.5 rounded">{t.trigger}</code></p>
                              <Button size="sm" onClick={() => toast.success(`${t.name} template saved`)} className="text-xs">
                                <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}