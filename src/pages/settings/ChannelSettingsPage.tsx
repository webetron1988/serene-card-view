import { useState } from "react";
import { AlertTriangle, MessageSquare, Globe, Instagram, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ChannelConfig { enabled: boolean; }

const PLATFORM_CHANNELS = [
  { id: "web", label: "Web Chat", desc: "Embedded chat widget for websites", tag: "Core", tagColor: "bg-primary/10 text-primary", icon: MessageSquare },
  { id: "whatsapp", label: "WhatsApp", desc: "WhatsApp Business API integration", tag: "Business API", tagColor: "bg-emerald-500/10 text-emerald-600", icon: MessageSquare },
  { id: "messenger", label: "Facebook Messenger", desc: "Facebook Messenger Platform", tag: "Meta Platform", tagColor: "bg-blue-500/10 text-blue-600", icon: MessageSquare },
  { id: "instagram", label: "Instagram", desc: "Instagram Messaging API", tag: "Meta Platform", tagColor: "bg-pink-500/10 text-pink-600", icon: Instagram },
  { id: "telegram", label: "Telegram", desc: "Telegram Bot API", tag: "Open API", tagColor: "bg-sky-500/10 text-sky-600", icon: Send },
];

export default function ChannelSettingsPage() {
  const [channels, setChannels] = useState<Record<string, ChannelConfig>>({
    web: { enabled: true },
    whatsapp: { enabled: true },
    messenger: { enabled: true },
    instagram: { enabled: false },
    telegram: { enabled: true },
  });

  const toggleChannel = (id: string) => {
    setChannels(prev => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled },
    }));
    const ch = PLATFORM_CHANNELS.find(c => c.id === id);
    toast.success(`${ch?.label} ${!channels[id].enabled ? "enabled" : "disabled"} platform-wide`);
  };

  const disabledCount = Object.values(channels).filter(c => !c.enabled).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Channel Settings</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Control which messaging channels are available for bots on the platform. Disabling a channel here will
          override individual bot configurations.
        </p>
      </div>

      {disabledCount > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{disabledCount} channel{disabledCount > 1 ? "s" : ""} disabled.</span>{" "}
            Bots will not be able to use disabled channels regardless of their individual settings.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {PLATFORM_CHANNELS.map((ch) => {
          const isEnabled = channels[ch.id]?.enabled ?? false;
          const Icon = ch.icon;
          return (
            <div
              key={ch.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isEnabled ? "border-border/80 bg-card" : "border-border/40 bg-muted/20 opacity-70"
              }`}
            >
              <div className={`p-2 rounded-lg ${isEnabled ? "bg-primary/10" : "bg-muted"}`}>
                <Icon className={`w-5 h-5 ${isEnabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{ch.label}</span>
                  <Badge variant="outline" className={`text-[10px] ${ch.tagColor}`}>{ch.tag}</Badge>
                  {ch.id === "web" && isEnabled && <Badge variant="secondary" className="text-[10px]">Default</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{ch.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <Label className="text-xs text-muted-foreground">{isEnabled ? "Enabled" : "Disabled"}</Label>
                <Switch checked={isEnabled} onCheckedChange={() => toggleChannel(ch.id)} />
              </div>
            </div>
          );
        })}
      </div>

      <Separator />

      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <h4 className="text-xs font-semibold text-foreground">How Channel Settings Work</h4>
        <ul className="text-[11px] text-muted-foreground space-y-1 list-disc list-inside">
          <li>Disabling a channel here removes it from the Bot Studio channel configuration step</li>
          <li>Existing bots using a disabled channel will have that channel deactivated</li>
          <li>Web Chat is enabled by default but can be disabled if needed</li>
          <li>Individual bot channel settings are configured in the Bot Studio wizard</li>
        </ul>
      </div>
    </div>
  );
}
