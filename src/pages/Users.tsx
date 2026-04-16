import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users, UserPlus, Search, Mail, Shield, Loader2, MoreHorizontal,
  CheckCircle2, XCircle, Clock, RefreshCw, Trash2, Copy
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { InviteUserModal } from "@/components/users/InviteUserModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface MemberRow {
  user_id: string;
  email: string;
  display_name: string | null;
  status: string;
  created_at: string;
  roles: { role: string }[];
}

interface InvitationRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role_kind: string;
  role_ref: string;
  status: string;
  email_status: string;
  email_error: string | null;
  expires_at: string;
  sent_at: string | null;
  created_at: string;
  token: string;
}

const SYSTEM_LABEL: Record<string, string> = {
  super_admin: "Super Administrator",
  admin: "Administrator",
};

function avatarColor(seed: string) {
  const palette = [
    "from-primary to-primary/60",
    "from-purple-500 to-purple-400",
    "from-emerald-500 to-emerald-400",
    "from-amber-500 to-amber-400",
    "from-rose-500 to-rose-400",
    "from-sky-500 to-sky-400",
    "from-teal-500 to-teal-400",
    "from-indigo-500 to-indigo-400",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
}

function initials(name: string | null, email: string) {
  const src = name || email;
  return src.split(/\s+|@/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join("") || "?";
}

export default function UsersPage() {
  const { hasPlatformRole } = useAuth();
  const canInvite = hasPlatformRole("super_admin") || hasPlatformRole("admin");
  const isSuper = hasPlatformRole("super_admin");

  const [tab, setTab] = useState<"members" | "invitations">("members");
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [invites, setInvites] = useState<InvitationRow[]>([]);
  const [customRoleNames, setCustomRoleNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: profiles }, { data: invitations }, { data: customRoles }] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, email, display_name, status, created_at")
        .eq("user_tier", "platform")
        .order("created_at", { ascending: false }),
      supabase
        .from("platform_invitations")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("platform_custom_roles").select("id, name"),
    ]);

    const userIds = (profiles || []).map(p => p.user_id);
    const { data: rolesData } = userIds.length
      ? await supabase.from("user_roles").select("user_id, role").in("user_id", userIds).is("tenant_id", null)
      : { data: [] as any[] };

    const rolesByUser: Record<string, { role: string }[]> = {};
    (rolesData || []).forEach((r: any) => {
      (rolesByUser[r.user_id] ||= []).push({ role: r.role });
    });

    setMembers((profiles || []).map(p => ({ ...p, roles: rolesByUser[p.user_id] || [] })) as MemberRow[]);
    setInvites((invitations || []) as InvitationRow[]);
    const map: Record<string, string> = {};
    (customRoles || []).forEach((r: any) => { map[r.id] = r.name; });
    setCustomRoleNames(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredMembers = useMemo(() =>
    members.filter(u =>
      [u.display_name || "", u.email].some(s => s.toLowerCase().includes(search.toLowerCase()))
    ), [members, search]);

  const filteredInvites = useMemo(() =>
    invites.filter(i =>
      [i.email, i.first_name || "", i.last_name || ""].some(s => s.toLowerCase().includes(search.toLowerCase()))
    ), [invites, search]);

  const stats = useMemo(() => {
    const active = members.filter(m => m.status !== "offline").length;
    const pending = invites.filter(i => i.status === "pending").length;
    return { total: members.length, active, inactive: members.length - active, pending };
  }, [members, invites]);

  const roleLabel = (kind: string, ref: string) =>
    kind === "system" ? (SYSTEM_LABEL[ref] || ref) : (customRoleNames[ref] || "Custom role");

  const resendInvite = async (inv: InvitationRow) => {
    toast.loading("Resending invitation...", { id: inv.id });
    const { data, error } = await supabase.functions.invoke("send-platform-invitation", {
      body: {
        email: inv.email,
        first_name: inv.first_name,
        last_name: inv.last_name,
        role_kind: inv.role_kind,
        role_ref: inv.role_ref,
      },
    });
    toast.dismiss(inv.id);
    const payload = (data as any) || {};
    if (error || payload.error) toast.error(payload.error || error?.message || "Failed to resend");
    else { toast.success("Invitation resent"); load(); }
  };

  const revokeInvite = async (inv: InvitationRow) => {
    const { error } = await supabase
      .from("platform_invitations")
      .update({ status: "revoked" })
      .eq("id", inv.id);
    if (error) toast.error(error.message); else { toast.success("Invitation revoked"); load(); }
  };

  const copyLink = (inv: InvitationRow) => {
    const link = `${window.location.origin}/admin/accept-invite?token=${encodeURIComponent(inv.token)}`;
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied");
  };

  return (
    <AppShell title="User Management" subtitle="Manage platform users and access">
      <div className="space-y-6">
        <PageHeader
          title="Platform Users"
          subtitle="Manage platform-tier user accounts, roles, and invitations"
          icon={Users}
          actions={canInvite ? [
            { label: "Invite User", icon: UserPlus, onClick: () => setShowInvite(true) },
          ] : []}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Users" value={String(stats.total)} icon={Users} colorClass="bg-primary/10 text-primary" />
          <StatsCard label="Active" value={String(stats.active)} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600" />
          <StatsCard label="Inactive" value={String(stats.inactive)} icon={XCircle} colorClass="bg-rose-100 text-rose-600" />
          <StatsCard label="Pending Invites" value={String(stats.pending)} icon={Mail} colorClass="bg-amber-100 text-amber-600" />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
              <button
                onClick={() => setTab("members")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "members" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Members ({stats.total})
              </button>
              <button
                onClick={() => setTab("invitations")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "invitations" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Invitations ({invites.length})
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={tab === "members" ? "Search users..." : "Search invitations..."}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-secondary/50 border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-64"
                />
              </div>
              <button onClick={load} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground"><Loader2 className="w-5 h-5 mx-auto animate-spin" /></div>
          ) : tab === "members" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Roles</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembers.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground text-sm">No platform users found.</td></tr>
                  ) : filteredMembers.map(u => (
                    <tr key={u.user_id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColor(u.email)} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                            {initials(u.display_name, u.email)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{u.display_name || u.email.split("@")[0]}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.length === 0 ? (
                            <span className="text-xs text-muted-foreground">No role</span>
                          ) : u.roles.map((r, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-medium">
                              <Shield className="w-3 h-3" />
                              {SYSTEM_LABEL[r.role] || r.role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === "available" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recipient</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Expires</th>
                    <th className="w-10 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInvites.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">No invitations yet. Send one to add a platform user.</td></tr>
                  ) : filteredInvites.map(inv => {
                    const expired = new Date(inv.expires_at) < new Date();
                    const statusColor =
                      inv.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                      inv.status === "revoked" ? "bg-rose-100 text-rose-700" :
                      expired ? "bg-amber-100 text-amber-700" :
                      "bg-sky-100 text-sky-700";
                    const statusLabel = inv.status === "pending" && expired ? "expired" : inv.status;
                    return (
                      <tr key={inv.id} className="hover:bg-secondary/30 transition-colors group">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{inv.first_name} {inv.last_name}</p>
                            <p className="text-xs text-muted-foreground">{inv.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">{roleLabel(inv.role_kind, inv.role_ref)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {inv.email_status === "sent" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600"><CheckCircle2 className="w-3 h-3" />sent</span>
                          ) : inv.email_status === "failed" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-600" title={inv.email_error || ""}><XCircle className="w-3 h-3" />failed</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="w-3 h-3" />{inv.email_status}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(inv.expires_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {inv.status === "pending" && (
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                              <button onClick={() => copyLink(inv)} title="Copy link" className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              {canInvite && (
                                <button onClick={() => resendInvite(inv)} title="Resend" className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {isSuper && (
                                <button onClick={() => revokeInvite(inv)} title="Revoke" className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-rose-600">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <InviteUserModal open={showInvite} onClose={() => setShowInvite(false)} onSent={load} />
      </div>
    </AppShell>
  );
}
