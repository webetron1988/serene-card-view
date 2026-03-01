import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, UserPlus, Search, Filter, MoreHorizontal, Mail,
  Shield, ChevronDown, Download, Upload, CheckCircle2, XCircle
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatsCard } from "@/components/shared/StatsCard";

const users = [
  { id: 1, name: "Sarah Chen", email: "sarah.chen@talenthub.com", role: "HR Director", dept: "Human Resources", status: "active", mfa: true, lastLogin: "2m ago", avatar: "SC", avatarColor: "from-primary to-primary/60" },
  { id: 2, name: "Mark Johnson", email: "mark.j@talenthub.com", role: "HR Manager", dept: "Talent Acquisition", status: "active", mfa: true, lastLogin: "1h ago", avatar: "MJ", avatarColor: "from-purple-500 to-purple-400" },
  { id: 3, name: "Priya Patel", email: "priya.p@talenthub.com", role: "Employee", dept: "Engineering", status: "active", mfa: false, lastLogin: "3h ago", avatar: "PP", avatarColor: "from-emerald-500 to-emerald-400" },
  { id: 4, name: "Tom Williams", email: "tom.w@talenthub.com", role: "Department Head", dept: "Product", status: "active", mfa: true, lastLogin: "1d ago", avatar: "TW", avatarColor: "from-amber-500 to-amber-400" },
  { id: 5, name: "Lisa Park", email: "lisa.park@talenthub.com", role: "Team Lead", dept: "Marketing", status: "inactive", mfa: false, lastLogin: "7d ago", avatar: "LP", avatarColor: "from-rose-500 to-rose-400" },
  { id: 6, name: "James Brown", email: "james.b@talenthub.com", role: "Finance Liaison", dept: "Finance", status: "active", mfa: true, lastLogin: "2d ago", avatar: "JB", avatarColor: "from-sky-500 to-sky-400" },
  { id: 7, name: "Ana Garcia", email: "ana.g@talenthub.com", role: "Auditor", dept: "Compliance", status: "active", mfa: true, lastLogin: "4h ago", avatar: "AG", avatarColor: "from-teal-500 to-teal-400" },
  { id: 8, name: "David Kim", email: "david.k@talenthub.com", role: "IT Admin", dept: "Technology", status: "active", mfa: true, lastLogin: "30m ago", avatar: "DK", avatarColor: "from-indigo-500 to-indigo-400" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRow = (id: number) =>
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);

  return (
    <AppShell title="User Management" subtitle="Manage platform users and access">
      <div className="space-y-6">
        <PageHeader
          title="Users"
          subtitle="Manage user accounts, roles, and access permissions"
          icon={Users}
          actions={[
            { label: "Export", variant: "secondary", icon: Download, onClick: () => {} },
            { label: "Invite User", icon: UserPlus, onClick: () => setShowInviteModal(true) },
          ]}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Users" value="1,284" icon={Users} colorClass="bg-primary/10 text-primary" trend="+8 this week" trendUp />
          <StatsCard label="Active" value="1,247" icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600" />
          <StatsCard label="Inactive" value="37" icon={XCircle} colorClass="bg-rose-100 text-rose-600" />
          <StatsCard label="Pending Invite" value="12" icon={Mail} colorClass="bg-amber-100 text-amber-600" />
        </div>

        {/* Table card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-secondary/50 border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex items-center gap-2">
              {selectedRows.length > 0 && (
                <span className="text-xs text-primary font-medium">{selectedRows.length} selected</span>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Filter
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border"
                      onChange={e => setSelectedRows(e.target.checked ? users.map(u => u.id) : [])}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">MFA</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Last Active</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={() => toggleRow(user.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.avatarColor} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-sm text-foreground">
                        <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.dept}</td>
                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-3">
                      {user.mfa
                        ? <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" />Enabled</span>
                        : <span className="flex items-center gap-1 text-xs text-muted-foreground"><XCircle className="w-3.5 h-3.5" />Off</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filtered.length} of {users.length} users</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">Previous</button>
              <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground">1</button>
              <button className="px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">2</button>
              <button className="px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">Next</button>
            </div>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-base font-semibold text-foreground mb-1">Invite New User</h3>
              <p className="text-xs text-muted-foreground mb-5">They'll receive an email invitation to join TalentHub</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
                  <input type="email" placeholder="colleague@company.com" className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Role</label>
                  <select className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>HR Director</option>
                    <option>HR Manager</option>
                    <option>Department Head</option>
                    <option>Team Lead</option>
                    <option>Employee</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
                  <button className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Send Invite</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
