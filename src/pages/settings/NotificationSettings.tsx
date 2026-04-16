import { useState } from "react";
import { Bell, Mail, Smartphone, Save, ChevronDown, ChevronUp, Shield, Users, Building2, MessageSquare, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

interface NotificationTemplate {
  id: string;
  name: string;
  trigger: string;
  description: string;
  is_active: boolean;
  audience: string;
}

const TEMPLATES: NotificationTemplate[] = [
  // Common
  { id: "c1", name: "Account Locked", trigger: "user_account_locked", description: "Sent when account is locked due to failed login attempts", is_active: true, audience: "common" },
  { id: "c2", name: "Account Suspended", trigger: "user_account_suspended", description: "Sent when account is suspended by admin", is_active: true, audience: "common" },
  { id: "c3", name: "Password Changed", trigger: "user_password_changed", description: "Security confirmation after password change", is_active: true, audience: "common" },
  { id: "c4", name: "Security Alert", trigger: "user_security_alert", description: "Suspicious activity detected on account", is_active: true, audience: "common" },
  { id: "c5", name: "Password Expiry Warning", trigger: "user_password_expiry", description: "Password about to expire per security policy", is_active: true, audience: "common" },
  // Super Admin
  { id: "s1", name: "Tenant Created", trigger: "tenant_created", description: "New tenant organization registered", is_active: true, audience: "super_admin" },
  { id: "s2", name: "Payment Failed", trigger: "platform_payment_failed", description: "Tenant subscription payment failed", is_active: true, audience: "super_admin" },
  { id: "s3", name: "Payment Received", trigger: "platform_payment_received", description: "Subscription payment received", is_active: true, audience: "super_admin" },
  { id: "s4", name: "Security Alert", trigger: "platform_security_alert", description: "Suspicious platform activity detected", is_active: true, audience: "super_admin" },
  { id: "s5", name: "System Health Alert", trigger: "system_health_alert", description: "Service outage or critical error", is_active: true, audience: "super_admin" },
  { id: "s6", name: "Storage Limit Warning", trigger: "storage_limit_warning", description: "Tenant approaching storage quota", is_active: true, audience: "super_admin" },
  // Staff
  { id: "f1", name: "Support Ticket Assigned", trigger: "support_ticket_assigned", description: "Ticket assigned to staff member", is_active: true, audience: "staff" },
  { id: "f2", name: "Tenant Onboarding Task", trigger: "tenant_onboarding_task", description: "New tenant requires onboarding", is_active: true, audience: "staff" },
  { id: "f3", name: "Daily Platform Summary", trigger: "daily_platform_summary", description: "Daily summary of activity and revenue", is_active: false, audience: "staff" },
  // Tenant
  { id: "t1", name: "Welcome", trigger: "tenant_welcome", description: "Sent to tenant admin on organization creation", is_active: true, audience: "tenant" },
  { id: "t2", name: "Subscription Activated", trigger: "subscription_activated", description: "Tenant subscription activated", is_active: true, audience: "tenant" },
  { id: "t3", name: "Payment Receipt", trigger: "payment_receipt_tenant", description: "Payment receipt after billing", is_active: true, audience: "tenant" },
  { id: "t4", name: "Payment Failed", trigger: "payment_failed_tenant", description: "Payment failed with update instructions", is_active: true, audience: "tenant" },
  { id: "t5", name: "Maintenance Notice", trigger: "maintenance_notice_tenant", description: "Scheduled platform maintenance", is_active: true, audience: "tenant" },
  { id: "t6", name: "Feature Update", trigger: "feature_update_tenant", description: "New features available", is_active: false, audience: "tenant" },
];

const AUDIENCE_CONFIG = [
  { key: "common", label: "Common / Account", sublabel: "All Users", icon: Globe, iconColor: "text-amber-500", iconBg: "bg-amber-50", borderActive: "border-amber-200 bg-amber-50/50", description: "Account & security notifications sent to any user" },
  { key: "super_admin", label: "Platform Admin", sublabel: "Super Admin", icon: Shield, iconColor: "text-red-500", iconBg: "bg-red-50", borderActive: "border-red-200 bg-red-50/50", description: "Critical alerts for super administrators" },
  { key: "staff", label: "Platform Staff", sublabel: "Support & Ops", icon: Users, iconColor: "text-blue-500", iconBg: "bg-blue-50", borderActive: "border-blue-200 bg-blue-50/50", description: "Operational notifications for team members" },
  { key: "tenant", label: "Tenants", sublabel: "Organization Admins", icon: Building2, iconColor: "text-emerald-500", iconBg: "bg-emerald-50", borderActive: "border-emerald-200 bg-emerald-50/50", description: "Outbound notifications to tenant administrators" },
];

type ChannelTab = "email" | "whatsapp" | "sms" | "inapp";

export default function NotificationSettings() {
  const [templates, setTemplates] = useState(TEMPLATES);
  const [activeTab, setActiveTab] = useState<ChannelTab>("email");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ common: true, super_admin: false, staff: false, tenant: false });

  const toggleActive = (id: string) => {
    setTemplates(ts => ts.map(t => t.id === id ? { ...t, is_active: !t.is_active } : t));
  };

  const totalActive = templates.filter(t => t.is_active).length;
  const totalTemplates = templates.length;

  const channelTabs = [
    { key: "email" as ChannelTab, label: "Email", icon: <Mail className="w-5 h-5 text-blue-500" strokeWidth={1.5} />, active: true, status: "Active", statusVariant: "active" },
    { key: "whatsapp" as ChannelTab, label: "WhatsApp", icon: <MessageSquare className="w-5 h-5 text-green-600" strokeWidth={1.5} />, active: false, status: "Setup Required", statusVariant: "warning" },
    { key: "sms" as ChannelTab, label: "SMS", icon: <Smartphone className="w-5 h-5 text-purple-500" strokeWidth={1.5} />, active: false, status: "Coming Soon", statusVariant: "muted" },
    { key: "inapp" as ChannelTab, label: "In-App", icon: <MessageSquare className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />, active: false, status: "Coming Soon", statusVariant: "muted" },
  ];

  const statusBadgeClass: Record<string, string> = {
    active: "text-emerald-700 bg-emerald-50 border-emerald-200",
    warning: "text-amber-700 bg-amber-50 border-amber-200",
    muted: "text-muted-foreground bg-muted/50 border-border",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" strokeWidth={1.5} />
          Notifications
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure platform-level notification templates and alert preferences.
        </p>
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
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left
                ${isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : tab.active
                    ? "border-border bg-card hover:border-primary/30"
                    : "border-border bg-muted/20 opacity-60 cursor-not-allowed"
                }`}
            >
              <div className="shrink-0">{tab.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground leading-none">{tab.label}</span>
                  <Badge variant="outline" className={`text-[10px] leading-none px-1.5 py-0 ${statusBadgeClass[tab.statusVariant]}`}>
                    {tab.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-none">
                  {tab.active ? `${totalActive}/${totalTemplates} enabled` : "Not connected"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Inactive channel */}
      {activeTab !== "email" && (
        <Card>
          <CardContent className="py-10 text-center">
            <Smartphone className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm font-medium text-muted-foreground">
              {activeTab === "whatsapp" ? "WhatsApp Notifications" : activeTab === "sms" ? "SMS Notifications" : "In-App Notifications"}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1 max-w-sm mx-auto">
              {activeTab === "whatsapp"
                ? "Configure WhatsApp integration in Settings → Integrations to enable."
                : "This channel will be available in a future update."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Email Tab */}
      {activeTab === "email" && (
        <div className="space-y-3">
          {AUDIENCE_CONFIG.map((cfg) => {
            const audienceTemplates = templates.filter(t => t.audience === cfg.key);
            const activeCount = audienceTemplates.filter(t => t.is_active).length;
            const Icon = cfg.icon;
            const isOpen = openAccordions[cfg.key] ?? false;

            return (
              <Collapsible
                key={cfg.key}
                open={isOpen}
                onOpenChange={(open) => setOpenAccordions(prev => ({ ...prev, [cfg.key]: open }))}
              >
                <CollapsibleTrigger asChild>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-sm ${
                    isOpen ? cfg.borderActive : "border-border bg-card"
                  }`}>
                    <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${cfg.iconBg}`}>
                      <Icon className={`w-4 h-4 ${cfg.iconColor}`} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{cfg.label}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {activeCount}/{audienceTemplates.length}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{cfg.description}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-1 space-y-1 pl-2">
                    {audienceTemplates.map(t => (
                      <div key={t.id} className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                        </div>
                        <Switch checked={t.is_active} onCheckedChange={() => toggleActive(t.id)} />
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => toast.success("Notification settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
