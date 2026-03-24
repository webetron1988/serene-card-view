import { useState } from "react";
import { Save, Palette, Upload, Type, Globe, Image } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const themeColors = [
  { label: "Primary", variable: "--primary", value: "#6366f1" },
  { label: "Secondary", variable: "--secondary", value: "#f1f5f9" },
  { label: "Accent", variable: "--accent", value: "#8b5cf6" },
  { label: "Destructive", variable: "--destructive", value: "#ef4444" },
  { label: "Success", variable: "--success", value: "#10b981" },
  { label: "Warning", variable: "--warning", value: "#f59e0b" },
];

export default function BrandingLocalization() {
  const [colors, setColors] = useState(themeColors);
  const [font, setFont] = useState("inter");
  const [darkMode, setDarkMode] = useState(true);
  const [customCss, setCustomCss] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Branding & Localization</h3>
        <p className="text-sm text-muted-foreground mt-1">Customize colors, logos, typography and regional formatting.</p>
      </div>

      {/* Logo & Identity */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Image className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Logo & Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-xs">Platform Logo</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground">Drop logo here or click to upload</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">PNG, SVG recommended · Max 2MB</p>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs">Favicon</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground">Drop favicon here or click to upload</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">ICO, PNG · 32×32 or 64×64</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Logo settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Colors */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Theme Colors
          </CardTitle>
          <CardDescription className="text-xs">Customize the platform color palette</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {colors.map((color, i) => (
              <div key={color.label} className="space-y-1.5">
                <Label className="text-xs">{color.label}</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color.value}
                    onChange={(e) => {
                      const updated = [...colors];
                      updated[i] = { ...color, value: e.target.value };
                      setColors(updated);
                    }}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <Input
                    value={color.value}
                    onChange={(e) => {
                      const updated = [...colors];
                      updated[i] = { ...color, value: e.target.value };
                      setColors(updated);
                    }}
                    className="text-sm font-mono flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Theme colors saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Typography & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Primary Font</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="geist">Geist Sans</SelectItem>
                  <SelectItem value="dm-sans">DM Sans</SelectItem>
                  <SelectItem value="plus-jakarta">Plus Jakarta Sans</SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode Support</p>
                <p className="text-xs text-muted-foreground mt-0.5">Enable dark mode toggle for users</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Custom CSS</p>
                <p className="text-xs text-muted-foreground mt-0.5">Allow custom CSS overrides</p>
              </div>
              <Switch checked={customCss} onCheckedChange={setCustomCss} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Typography saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Localization
          </CardTitle>
          <CardDescription className="text-xs">Date, number and regional format preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Date Format</Label>
              <Select defaultValue="mdy">
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Number Format</Label>
              <Select defaultValue="us">
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">1,234.56</SelectItem>
                  <SelectItem value="eu">1.234,56</SelectItem>
                  <SelectItem value="in">1,23,456.78</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Localization saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 me-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
