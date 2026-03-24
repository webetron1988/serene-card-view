import { useState } from "react";
import { Save, Brain, Plus, Star, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AIModel { id: string; provider: string; name: string; tokensPerDollar: number; isDefault: boolean; status: "active" | "inactive"; }

const INITIAL: AIModel[] = [
  { id: "m1", provider: "OpenAI", name: "GPT-4o", tokensPerDollar: 250000, isDefault: true, status: "active" },
  { id: "m2", provider: "OpenAI", name: "GPT-4o-mini", tokensPerDollar: 1500000, isDefault: false, status: "active" },
  { id: "m3", provider: "Anthropic", name: "Claude 3.5 Sonnet", tokensPerDollar: 333333, isDefault: false, status: "active" },
  { id: "m4", provider: "Google", name: "Gemini 2.0 Flash", tokensPerDollar: 2000000, isDefault: false, status: "active" },
  { id: "m5", provider: "Mistral", name: "Mistral Large", tokensPerDollar: 500000, isDefault: false, status: "inactive" },
];

export default function AIModelSettingsPage() {
  const [models, setModels] = useState<AIModel[]>(INITIAL);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [defaultFallback, setDefaultFallback] = useState("m2");
  const [globalTokenLimit, setGlobalTokenLimit] = useState("4096");
  const [costAlertThreshold, setCostAlertThreshold] = useState("1000");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModel, setNewModel] = useState({ provider: "OpenAI", name: "", tokensPerDollar: "" });

  const toggleActive = (id: string) => {
    setModels(ms => ms.map(m => m.id === id ? { ...m, status: m.status === "active" ? "inactive" : "active" } as AIModel : m));
    toast.success("Model status updated");
  };

  const setDefault = (id: string) => {
    setModels(ms => ms.map(m => ({ ...m, isDefault: m.id === id })));
    toast.success("Default model updated");
  };

  const addModel = () => {
    if (!newModel.name) return;
    const m: AIModel = { id: `m${Date.now()}`, provider: newModel.provider, name: newModel.name, tokensPerDollar: Number(newModel.tokensPerDollar) || 100000, isDefault: false, status: "active" };
    setModels([...models, m]);
    setShowAddForm(false);
    setNewModel({ provider: "OpenAI", name: "", tokensPerDollar: "" });
    toast.success("Model added successfully");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">AI Models</h3>
        <p className="text-sm text-muted-foreground mt-1">Configure AI model providers, defaults, and usage limits.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Global AI Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Fallback Model</Label>
              <Select value={defaultFallback} onValueChange={setDefaultFallback}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {models.filter(m => m.status === "active").map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Global Token Limit</Label>
              <Input type="number" value={globalTokenLimit} onChange={(e) => setGlobalTokenLimit(e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Cost Alert ($)</Label>
              <Input type="number" value={costAlertThreshold} onChange={(e) => setCostAlertThreshold(e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Global AI settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Configured Models</h4>
        <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)} className="text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />{showAddForm ? "Cancel" : "Add Model"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-dashed border-primary/30 bg-primary/5">
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Provider</Label>
                <Select value={newModel.provider} onValueChange={(v) => setNewModel(p => ({ ...p, provider: v }))}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                    <SelectItem value="Anthropic">Anthropic</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Mistral">Mistral</SelectItem>
                    <SelectItem value="Cohere">Cohere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Model Name</Label>
                <Input value={newModel.name} onChange={(e) => setNewModel(p => ({ ...p, name: e.target.value }))} placeholder="e.g. GPT-4o" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tokens per Dollar</Label>
                <Input type="number" value={newModel.tokensPerDollar} onChange={(e) => setNewModel(p => ({ ...p, tokensPerDollar: e.target.value }))} placeholder="250000" className="text-sm" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={addModel} className="text-xs"><Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />Add Model</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {models.map((model) => {
        const isExpanded = expandedId === model.id;
        return (
          <Card key={model.id} className="overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedId(isExpanded ? null : model.id)}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Brain className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{model.name}</h4>
                    <span className="text-xs text-muted-foreground">{model.provider}</span>
                    {model.isDefault && <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20"><Star className="w-3 h-3 mr-0.5" strokeWidth={1.5} />Default</Badge>}
                    <Badge variant={model.status === "active" ? "default" : "secondary"} className="text-[10px]">{model.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{model.tokensPerDollar.toLocaleString()} tokens/dollar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={model.status === "active"} onCheckedChange={() => toggleActive(model.id)} onClick={(e) => e.stopPropagation()} />
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />}
              </div>
            </div>
            {isExpanded && (
              <CardContent className="border-t pt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label className="text-xs">Tokens per Dollar</Label><Input type="number" defaultValue={model.tokensPerDollar} className="text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Max Tokens per Request</Label><Input type="number" defaultValue="4096" className="text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">API Key</Label><Input type="password" defaultValue="sk-••••••••••••" className="text-sm font-mono" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Temperature Default</Label><Input type="number" defaultValue="0.7" step="0.1" min="0" max="2" className="text-sm" /></div>
                </div>
                <div className="flex justify-end gap-2">
                  {!model.isDefault && <Button size="sm" variant="outline" onClick={() => setDefault(model.id)} className="text-xs"><Star className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />Set as Default</Button>}
                  <Button size="sm" onClick={() => toast.success(`${model.name} configuration saved`)} className="text-xs"><Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save Changes</Button>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
