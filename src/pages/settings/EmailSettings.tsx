import { useState } from "react";
import { Save, Send, Server, FileText, Pencil } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const emailTemplates = [
  { id: "welcome", name: "Welcome Email", description: "Sent when a new tenant registers", lastEdited: "Mar 5, 2026", status: "active" },
  { id: "invite", name: "Team Invitation", description: "Sent when a team member is invited", lastEdited: "Feb 28, 2026", status: "active" },
  { id: "reset", name: "Password Reset", description: "Sent when a user requests a password reset", lastEdited: "Jan 15, 2026", status: "active" },
  { id: "invoice", name: "Invoice Receipt", description: "Sent after successful payment", lastEdited: "Mar 1, 2026", status: "active" },
  { id: "suspension", name: "Account Suspension", description: "Sent when a tenant account is suspended", lastEdited: "Feb 10, 2026", status: "active" },
  { id: "usage", name: "Usage Alert", description: "Sent when a tenant approaches usage limits", lastEdited: "Feb 20, 2026", status: "draft" },
];

export default function EmailSettings() {
  const [smtp, setSmtp] = useState({
    host: "smtp.sendgrid.net",
    port: "587",
    username: "apikey",
    password: "SG.••••••••••••",
    encryption: "tls",
    fromName: "TalentHub Platform",
    fromEmail: "noreply@talenthub.com",
    replyTo: "support@talenthub.com",
  });
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Email & SMTP</h3>
        <p className="text-sm text-muted-foreground mt-1">Configure email delivery and manage transactional email templates.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Server className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            SMTP Configuration
          </CardTitle>
          <CardDescription className="text-xs">Configure your email delivery service provider.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs">SMTP Host</Label>
              <Input value={smtp.host} onChange={(e) => setSmtp(s => ({ ...s, host: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Port</Label>
              <Input value={smtp.port} onChange={(e) => setSmtp(s => ({ ...s, port: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Username</Label>
              <Input value={smtp.username} onChange={(e) => setSmtp(s => ({ ...s, username: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Password</Label>
              <Input type="password" value={smtp.password} onChange={(e) => setSmtp(s => ({ ...s, password: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Encryption</Label>
              <Select value={smtp.encryption} onValueChange={(v) => setSmtp(s => ({ ...s, encryption: v }))}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">From Name</Label>
              <Input value={smtp.fromName} onChange={(e) => setSmtp(s => ({ ...s, fromName: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">From Email</Label>
              <Input value={smtp.fromEmail} onChange={(e) => setSmtp(s => ({ ...s, fromEmail: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reply-To</Label>
              <Input value={smtp.replyTo} onChange={(e) => setSmtp(s => ({ ...s, replyTo: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="flex justify-between">
            <Button size="sm" variant="outline" onClick={() => toast.success("Test email sent")} className="text-xs">
              <Send className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Send Test Email
            </Button>
            <Button size="sm" onClick={() => toast.success("SMTP configuration saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Email Templates
          </CardTitle>
          <CardDescription className="text-xs">Manage transactional email templates sent by the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {emailTemplates.map((template) => (
            <div key={template.id}>
              <div className="flex items-center justify-between py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{template.name}</p>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${template.status === "active" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"}`}>
                      {template.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">Last edited: {template.lastEdited}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setEditingTemplate(editingTemplate === template.id ? null : template.id)} className="text-xs">
                  <Pencil className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />Edit
                </Button>
              </div>
              {editingTemplate === template.id && (
                <div className="pb-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Subject Line</Label>
                    <Input defaultValue={`${template.name} - TalentHub`} className="text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Template Body (HTML)</Label>
                    <Textarea defaultValue={`<h1>${template.name}</h1>\n<p>${template.description}</p>\n<p>{{variable}}</p>`} className="text-sm font-mono min-h-[120px] resize-none" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.info("Preview sent")} className="text-xs">
                      <Send className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />Send Preview
                    </Button>
                    <Button size="sm" onClick={() => { setEditingTemplate(null); toast.success(`${template.name} template saved`); }} className="text-xs">
                      <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Template
                    </Button>
                  </div>
                </div>
              )}
              {template.id !== emailTemplates[emailTemplates.length - 1].id && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
