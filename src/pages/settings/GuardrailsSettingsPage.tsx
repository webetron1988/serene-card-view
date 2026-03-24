import { useState } from "react";
import { Save, ShieldAlert, Plus, Trash2, ChevronDown, ChevronUp, AlertTriangle, Ban, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Rule { id: number; name: string; type: string; severity: string; description: string; enabled: boolean; action: string; }

const defaultRules: Rule[] = [
  { id: 1, name: "Profanity Filter", type: "content", severity: "high", description: "Block messages containing profane or offensive language.", enabled: true, action: "block" },
  { id: 2, name: "PII Detection", type: "privacy", severity: "critical", description: "Detect and redact personal identifiable information like SSN, credit cards.", enabled: true, action: "redact" },
  { id: 3, name: "Prompt Injection Guard", type: "security", severity: "critical", description: "Prevent prompt injection attacks in user inputs.", enabled: true, action: "block" },
  { id: 4, name: "Spam Detection", type: "content", severity: "medium", description: "Detect and flag repetitive or spam-like messages.", enabled: false, action: "flag" },
  { id: 5, name: "Topic Boundary", type: "scope", severity: "low", description: "Keep conversations within the configured topic scope.", enabled: true, action: "redirect" },
];

const severityConfig: Record<string, { icon: typeof AlertTriangle; className: string }> = {
  critical: { icon: Ban, className: "text-red-600 bg-red-50 border-red-200" },
  high: { icon: AlertTriangle, className: "text-orange-600 bg-orange-50 border-orange-200" },
  medium: { icon: Info, className: "text-amber-600 bg-amber-50 border-amber-200" },
  low: { icon: Info, className: "text-blue-600 bg-blue-50 border-blue-200" },
};

export default function GuardrailsSettingsPage() {
  const [rules, setRules] = useState(defaultRules);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState<Partial<Rule>>({ name: "", type: "content", severity: "medium", description: "", action: "block" });
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [logRetention, setLogRetention] = useState("90");

  const toggleRule = (id: number) => { setRules(rs => rs.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)); toast.success("Rule status updated"); };
  const deleteRule = (id: number) => { setRules(rs => rs.filter(r => r.id !== id)); toast.success("Rule deleted"); };
  const addRule = () => { if (!newRule.name) return; setRules([...rules, { id: Date.now(), ...newRule, enabled: true } as Rule]); setShowAddForm(false); setNewRule({ name: "", type: "content", severity: "medium", description: "", action: "block" }); toast.success("Rule created"); };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Guardrails & Moderation</h3>
        <p className="text-sm text-muted-foreground mt-1">Configure content moderation rules and safety guardrails for AI conversations.</p>
      </div>

      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-sm font-medium flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />Global Moderation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Enable Guardrails</p><p className="text-xs text-muted-foreground mt-0.5">Master toggle for all content moderation rules.</p></div><Switch checked={globalEnabled} onCheckedChange={setGlobalEnabled} /></div>
          <Separator />
          <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><Label className="text-xs">Moderation Log Retention (days)</Label><Input type="number" value={logRetention} onChange={(e) => setLogRetention(e.target.value)} className="text-sm" /></div></div>
          <div className="flex justify-end"><Button size="sm" onClick={() => toast.success("Global moderation settings saved")} className="text-xs"><Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes</Button></div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Moderation Rules ({rules.length})</h4>
        <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)} className="text-xs"><Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />{showAddForm ? "Cancel" : "Add Rule"}</Button>
      </div>

      {showAddForm && (
        <Card className="border-dashed border-primary/30 bg-primary/5">
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Rule Name</Label><Input value={newRule.name} onChange={(e) => setNewRule(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Hate Speech Filter" className="text-sm" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Type</Label><Select value={newRule.type} onValueChange={(v) => setNewRule(p => ({ ...p, type: v }))}><SelectTrigger className="text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="content">Content</SelectItem><SelectItem value="privacy">Privacy</SelectItem><SelectItem value="security">Security</SelectItem><SelectItem value="scope">Scope</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">Severity</Label><Select value={newRule.severity} onValueChange={(v) => setNewRule(p => ({ ...p, severity: v }))}><SelectTrigger className="text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">Action</Label><Select value={newRule.action} onValueChange={(v) => setNewRule(p => ({ ...p, action: v }))}><SelectTrigger className="text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="block">Block Message</SelectItem><SelectItem value="redact">Redact Content</SelectItem><SelectItem value="flag">Flag for Review</SelectItem><SelectItem value="redirect">Redirect Topic</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Description</Label><Textarea value={newRule.description} onChange={(e) => setNewRule(p => ({ ...p, description: e.target.value }))} placeholder="Describe what this rule does..." className="text-sm min-h-[60px] resize-none" /></div>
            <div className="flex justify-end"><Button size="sm" onClick={addRule} className="text-xs"><Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />Create Rule</Button></div>
          </CardContent>
        </Card>
      )}

      {rules.map((rule) => {
        const sev = severityConfig[rule.severity] || severityConfig.medium;
        const SevIcon = sev.icon;
        const isExpanded = expandedId === rule.id;
        return (
          <Card key={rule.id} className={`overflow-hidden transition-opacity ${!rule.enabled ? "opacity-60" : ""}`}>
            <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedId(isExpanded ? null : rule.id)}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} onClick={(e) => e.stopPropagation()} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium truncate">{rule.name}</h4>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${sev.className}`}><SevIcon className="w-3 h-3 mr-0.5" strokeWidth={1.5} />{rule.severity}</Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{rule.type}</Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{rule.action}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{rule.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <button onClick={(e) => { e.stopPropagation(); deleteRule(rule.id); }} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"><Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
              </div>
            </div>
            {isExpanded && (
              <CardContent className="border-t pt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label className="text-xs">Rule Name</Label><Input defaultValue={rule.name} className="text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Action on Trigger</Label><Select defaultValue={rule.action}><SelectTrigger className="text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="block">Block Message</SelectItem><SelectItem value="redact">Redact Content</SelectItem><SelectItem value="flag">Flag for Review</SelectItem><SelectItem value="redirect">Redirect Topic</SelectItem></SelectContent></Select></div>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Custom Keywords (comma-separated)</Label><Textarea placeholder="Enter keywords to match against..." className="text-sm min-h-[60px] resize-none" /></div>
                <div className="flex justify-end"><Button size="sm" onClick={() => toast.success(`${rule.name} updated`)} className="text-xs"><Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes</Button></div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
