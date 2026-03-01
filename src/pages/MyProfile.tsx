import { useState } from "react";
import {
  User, Mail, Phone, MapPin, Calendar, Edit2, Camera,
  Shield, Key, Bell, Moon, Globe, LogOut, ChevronRight
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/shared/StatusBadge";

const tabs = ["Profile", "Security", "Notifications", "Preferences"];

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [editing, setEditing] = useState(false);

  return (
    <AppShell title="My Profile" subtitle="Manage your account">
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Profile hero card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-purple-500/10 relative">
            <button className="absolute bottom-3 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-card/80 backdrop-blur-sm text-xs font-medium text-foreground rounded-lg border border-border hover:bg-card transition-colors">
              <Camera className="w-3.5 h-3.5" />
              Change cover
            </button>
          </div>

          {/* Avatar + info */}
          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-card shadow-lg">
                  A
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div className="mb-1 flex items-center gap-2">
                <StatusBadge status="active" />
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground text-xs font-medium rounded-lg hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Admin User</h2>
              <p className="text-sm text-muted-foreground">Platform Super Admin · TalentHub</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> admin@talenthub.com</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +1 (555) 000-0001</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> New York, USA</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm rounded-xl p-1.5 border border-border/50">
          <div className="flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "Profile" && (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: "Admin User" },
                  { label: "Email Address", value: "admin@talenthub.com" },
                  { label: "Phone Number", value: "+1 (555) 000-0001" },
                  { label: "Location", value: "New York, USA" },
                  { label: "Timezone", value: "UTC-5 (Eastern)" },
                  { label: "Language", value: "English (US)" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                    {editing ? (
                      <input
                        defaultValue={f.value}
                        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : (
                      <p className="text-sm text-foreground py-2">{f.value}</p>
                    )}
                  </div>
                ))}
              </div>
              {editing && (
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Save Changes</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Security" && (
          <div className="space-y-4">
            {[
              { icon: Key, title: "Change Password", desc: "Last changed 30 days ago", action: "Update" },
              { icon: Shield, title: "Two-Factor Authentication", desc: "TOTP authenticator enabled", action: "Manage", badge: "Active" },
              { icon: Globe, title: "Active Sessions", desc: "2 active sessions across devices", action: "View All" },
            ].map(s => (
              <div key={s.title} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                      {s.badge && <StatusBadge status="active" label={s.badge} />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                  {s.action} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {[
              { label: "Email notifications", desc: "Receive activity emails", enabled: true },
              { label: "In-app notifications", desc: "Show desktop alerts", enabled: true },
              { label: "Approval requests", desc: "Notify when action needed", enabled: true },
              { label: "System updates", desc: "Platform maintenance alerts", enabled: false },
              { label: "Weekly digest", desc: "Summary every Monday", enabled: true },
            ].map(n => (
              <div key={n.label} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{n.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                </div>
                <div
                  className={`relative w-10 h-6 rounded-full cursor-pointer transition-colors ${n.enabled ? "bg-primary" : "bg-border"}`}
                  role="switch"
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${n.enabled ? "translate-x-5" : "translate-x-1"}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Preferences" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {[
                { icon: Moon, label: "Dark Mode", desc: "Switch to dark theme", value: "Off" },
                { icon: Globe, label: "Language", desc: "Interface language", value: "English (US)" },
                { icon: Globe, label: "Date Format", desc: "How dates are displayed", value: "MM/DD/YYYY" },
              ].map(p => (
                <div key={p.label} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <p.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{p.value}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center gap-3 px-5 py-4 bg-card border border-rose-200 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign out of TalentHub</span>
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
