import { useState } from "react";
import { Save, Scale, FileCheck, Clock, Shield, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PolicyGovernancePage() {
  const [complianceFrameworks, setComplianceFrameworks] = useState({
    gdpr: true,
    soc2: true,
    iso27001: false,
    hipaa: false,
    ccpa: true,
    pciDss: false,
  });

  const [consentSettings, setConsentSettings] = useState({
    requireExplicitConsent: true,
    consentExpiryDays: "365",
    doubleOptIn: true,
    consentVersioning: true,
    cookieBannerEnabled: true,
    cookieBannerPosition: "bottom",
  });

  const [retentionPolicies, setRetentionPolicies] = useState({
    employeeDataRetention: "2555",
    candidateDataRetention: "365",
    auditLogRetention: "730",
    backupRetention: "365",
    deletedAccountGracePeriod: "30",
    autoArchiveInactive: true,
    autoArchiveDays: "180",
  });

  const [governanceSettings, setGovernanceSettings] = useState({
    changeApprovalRequired: true,
    approvalLevels: "2",
    escalationTimeHours: "48",
    policyReviewCycleDays: "90",
    mandatoryTraining: true,
    trainingCompletionDays: "30",
    whistleblowerProtection: true,
    conflictOfInterestDeclaration: true,
    codeOfConductVersion: "2.1",
    codeOfConductLastUpdated: "2026-01-15",
  });

  const [auditTrailPolicy, setAuditTrailPolicy] = useState({
    immutableAuditLog: true,
    tamperDetection: true,
    auditLogExportFormat: "json",
    regulatoryReportingEnabled: false,
    reportingFrequency: "quarterly",
    externalAuditorAccess: false,
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Policy & Governance</h3>
        <p className="text-sm text-muted-foreground mt-1">Compliance frameworks, consent management, data retention, and organizational governance policies.</p>
      </div>

      {/* Compliance Frameworks */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Scale className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Compliance Frameworks
          </CardTitle>
          <CardDescription className="text-xs">Enable compliance controls for applicable regulatory frameworks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: "gdpr", label: "GDPR", desc: "General Data Protection Regulation (EU)" },
            { key: "soc2", label: "SOC 2 Type II", desc: "Service Organization Control — security, availability, confidentiality" },
            { key: "iso27001", label: "ISO 27001", desc: "Information Security Management System" },
            { key: "hipaa", label: "HIPAA", desc: "Health Insurance Portability and Accountability Act (US)" },
            { key: "ccpa", label: "CCPA", desc: "California Consumer Privacy Act" },
            { key: "pciDss", label: "PCI DSS", desc: "Payment Card Industry Data Security Standard" },
          ].map((fw) => (
            <div key={fw.key} className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{fw.label}</p>
                  {complianceFrameworks[fw.key as keyof typeof complianceFrameworks] && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-emerald-600 bg-emerald-50 border-emerald-200">Active</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{fw.desc}</p>
              </div>
              <Switch checked={complianceFrameworks[fw.key as keyof typeof complianceFrameworks]} onCheckedChange={(v) => setComplianceFrameworks(s => ({ ...s, [fw.key]: v }))} />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => toast.success("Compliance frameworks saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consent Management */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Consent Management
          </CardTitle>
          <CardDescription className="text-xs">Configure user consent collection, versioning, and cookie preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "requireExplicitConsent", label: "Require Explicit Consent", desc: "Users must actively opt-in to data processing." },
            { key: "doubleOptIn", label: "Double Opt-In", desc: "Require email confirmation for consent actions." },
            { key: "consentVersioning", label: "Consent Versioning", desc: "Track changes to consent policies and re-request when updated." },
            { key: "cookieBannerEnabled", label: "Cookie Consent Banner", desc: "Show cookie consent banner to new visitors." },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch checked={consentSettings[item.key as keyof typeof consentSettings] as boolean} onCheckedChange={(v) => setConsentSettings(s => ({ ...s, [item.key]: v }))} />
            </div>
          ))}
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Consent Expiry (days)</Label>
              <Input type="number" value={consentSettings.consentExpiryDays} onChange={(e) => setConsentSettings(s => ({ ...s, consentExpiryDays: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Cookie Banner Position</Label>
              <Select value={consentSettings.cookieBannerPosition} onValueChange={(v) => setConsentSettings(s => ({ ...s, cookieBannerPosition: v }))}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom">Bottom Banner</SelectItem>
                  <SelectItem value="top">Top Banner</SelectItem>
                  <SelectItem value="modal">Center Modal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Consent settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention Policies */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Data Retention Policies
          </CardTitle>
          <CardDescription className="text-xs">Define how long different categories of data are retained before archival or deletion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "employeeDataRetention", label: "Employee Data (days)" },
              { key: "candidateDataRetention", label: "Candidate Data (days)" },
              { key: "auditLogRetention", label: "Audit Logs (days)" },
              { key: "backupRetention", label: "Backups (days)" },
              { key: "deletedAccountGracePeriod", label: "Deleted Account Grace (days)" },
            ].map((item) => (
              <div key={item.key} className="space-y-1.5">
                <Label className="text-xs">{item.label}</Label>
                <Input type="number" value={retentionPolicies[item.key as keyof typeof retentionPolicies] as string} onChange={(e) => setRetentionPolicies(s => ({ ...s, [item.key]: e.target.value }))} className="text-sm" />
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-Archive Inactive Records</p>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically archive records after a period of inactivity.</p>
            </div>
            <Switch checked={retentionPolicies.autoArchiveInactive} onCheckedChange={(v) => setRetentionPolicies(s => ({ ...s, autoArchiveInactive: v }))} />
          </div>
          {retentionPolicies.autoArchiveInactive && (
            <div className="space-y-1.5 w-48">
              <Label className="text-xs">Archive After (days)</Label>
              <Input type="number" value={retentionPolicies.autoArchiveDays} onChange={(e) => setRetentionPolicies(s => ({ ...s, autoArchiveDays: e.target.value }))} className="text-sm" />
            </div>
          )}
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Retention policies saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organizational Governance */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Organizational Governance
          </CardTitle>
          <CardDescription className="text-xs">Change management, approval workflows, and corporate governance controls.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "changeApprovalRequired", label: "Change Approval Required", desc: "Require approval for configuration changes." },
            { key: "mandatoryTraining", label: "Mandatory Compliance Training", desc: "Require staff to complete compliance training." },
            { key: "whistleblowerProtection", label: "Whistleblower Protection", desc: "Enable anonymous reporting channel." },
            { key: "conflictOfInterestDeclaration", label: "Conflict of Interest Declaration", desc: "Require periodic conflict of interest declarations." },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch checked={governanceSettings[item.key as keyof typeof governanceSettings] as boolean} onCheckedChange={(v) => setGovernanceSettings(s => ({ ...s, [item.key]: v }))} />
            </div>
          ))}
          <Separator />
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Approval Levels</Label>
              <Input type="number" value={governanceSettings.approvalLevels} onChange={(e) => setGovernanceSettings(s => ({ ...s, approvalLevels: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Escalation Time (hours)</Label>
              <Input type="number" value={governanceSettings.escalationTimeHours} onChange={(e) => setGovernanceSettings(s => ({ ...s, escalationTimeHours: e.target.value }))} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Policy Review Cycle (days)</Label>
              <Input type="number" value={governanceSettings.policyReviewCycleDays} onChange={(e) => setGovernanceSettings(s => ({ ...s, policyReviewCycleDays: e.target.value }))} className="text-sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Governance settings saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail Policy */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            Audit Trail & Reporting
          </CardTitle>
          <CardDescription className="text-xs">Audit log integrity, regulatory reporting, and external auditor access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "immutableAuditLog", label: "Immutable Audit Log", desc: "Prevent modification or deletion of audit log entries." },
            { key: "tamperDetection", label: "Tamper Detection", desc: "Detect and alert on unauthorized audit log modifications." },
            { key: "regulatoryReportingEnabled", label: "Regulatory Reporting", desc: "Generate periodic compliance reports automatically." },
            { key: "externalAuditorAccess", label: "External Auditor Access", desc: "Allow read-only access for external audit firms." },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch checked={auditTrailPolicy[item.key as keyof typeof auditTrailPolicy] as boolean} onCheckedChange={(v) => setAuditTrailPolicy(s => ({ ...s, [item.key]: v }))} />
            </div>
          ))}
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Export Format</Label>
              <Select value={auditTrailPolicy.auditLogExportFormat} onValueChange={(v) => setAuditTrailPolicy(s => ({ ...s, auditLogExportFormat: v }))}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reporting Frequency</Label>
              <Select value={auditTrailPolicy.reportingFrequency} onValueChange={(v) => setAuditTrailPolicy(s => ({ ...s, reportingFrequency: v }))}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success("Audit trail policy saved")} className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}