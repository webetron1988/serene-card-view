import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import MyProfile from "@/pages/MyProfile";
import Users from "@/pages/Users";
import Roles from "@/pages/Roles";
import EmployeeDirectory from "@/pages/workforce/EmployeeDirectory";
import OrgChart from "@/pages/org/OrgChart";
import OrgUnits from "@/pages/org/OrgUnits";
import Positions from "@/pages/org/Positions";
import Locations from "@/pages/org/Locations";
import Marketplace from "@/pages/marketplace/Marketplace";
import MasterData from "@/pages/MasterData";
import Tenants from "@/pages/Tenants";
import License from "@/pages/License";
import AuditLog from "@/pages/AuditLog";
import Packages from "@/pages/Packages";

// Settings
import { AppShell } from "@/components/layout/AppShell";
import SettingsLayout from "@/pages/settings/SettingsLayout";
import GeneralSettings from "@/pages/settings/GeneralSettings";
import RegistrationSettings from "@/pages/settings/RegistrationSettings";
import RolesPermissionsPage from "@/pages/settings/RolesPermissionsPage";
import DepartmentsPage from "@/pages/settings/DepartmentsPage";
import BotCategoriesPage from "@/pages/settings/BotCategoriesPage";
import BrandingLocalization from "@/pages/settings/BrandingLocalization";
import SecuritySettingsPage from "@/pages/settings/SecuritySettingsPage";
import PaymentGatewaysPage from "@/pages/settings/PaymentGatewaysPage";
import AIModelSettingsPage from "@/pages/settings/AIModelSettingsPage";
import GuardrailsSettingsPage from "@/pages/settings/GuardrailsSettingsPage";
import ApiKeysWebhooks from "@/pages/settings/ApiKeysWebhooks";
import EmailSettings from "@/pages/settings/EmailSettings";
import NotificationSettings from "@/pages/settings/NotificationSettings";
import IntegrationSettings from "@/pages/settings/IntegrationSettings";
import ChannelSettingsPage from "@/pages/settings/ChannelSettingsPage";
import PolicyGovernancePage from "@/pages/settings/PolicyGovernancePage";
import DocumentVaultPage from "@/pages/settings/DocumentVaultPage";

// Tenant
import TenantLogin from "@/pages/tenant/TenantLogin";
import TenantDashboard from "@/pages/tenant/TenantDashboard";

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Platform configuration and preferences">
      <SettingsLayout />
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <BrowserRouter>
        <Routes>
          {/* Platform Admin Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

          {/* ─── Platform Admin Routes (/admin/*) ─── */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/profile" element={<MyProfile />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/workforce/employees" element={<EmployeeDirectory />} />
          <Route path="/admin/org/chart" element={<OrgChart />} />
          <Route path="/admin/org/units" element={<OrgUnits />} />
          <Route path="/admin/org/positions" element={<Positions />} />
          <Route path="/admin/org/locations" element={<Locations />} />
          <Route path="/admin/marketplace" element={<Marketplace />} />
          <Route path="/admin/master-data" element={<MasterData />} />
          <Route path="/admin/tenants" element={<Tenants />} />
          <Route path="/admin/license" element={<License />} />
          <Route path="/admin/audit" element={<AuditLog />} />
          <Route path="/admin/packages" element={<Packages />} />
          <Route path="/admin/settings" element={<SettingsPage />}>
            <Route index element={<GeneralSettings />} />
            <Route path="registration" element={<RegistrationSettings />} />
            <Route path="roles" element={<RolesPermissionsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="bot-categories" element={<BotCategoriesPage />} />
            <Route path="branding" element={<BrandingLocalization />} />
            <Route path="security" element={<SecuritySettingsPage />} />
            <Route path="payments" element={<PaymentGatewaysPage />} />
            <Route path="ai-models" element={<AIModelSettingsPage />} />
            <Route path="guardrails" element={<GuardrailsSettingsPage />} />
            <Route path="api-keys" element={<ApiKeysWebhooks />} />
            <Route path="email" element={<EmailSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="integrations" element={<IntegrationSettings />} />
            <Route path="channels" element={<ChannelSettingsPage />} />
            <Route path="policy" element={<PolicyGovernancePage />} />
            <Route path="document-vault" element={<DocumentVaultPage />} />
          </Route>

          {/* ─── Tenant Routes (/tenant/*) ─── */}
          <Route path="/tenant/login" element={<TenantLogin />} />
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />

          {/* Legacy redirects — keep old paths working */}
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/users" element={<Navigate to="/admin/users" replace />} />
          <Route path="/roles" element={<Navigate to="/admin/roles" replace />} />
          <Route path="/packages" element={<Navigate to="/admin/packages" replace />} />
          <Route path="/tenants" element={<Navigate to="/admin/tenants" replace />} />
          <Route path="/settings/*" element={<Navigate to="/admin/settings" replace />} />
          <Route path="/marketplace" element={<Navigate to="/admin/marketplace" replace />} />
          <Route path="/master-data" element={<Navigate to="/admin/master-data" replace />} />
          <Route path="/license" element={<Navigate to="/admin/license" replace />} />
          <Route path="/audit" element={<Navigate to="/admin/audit" replace />} />
          <Route path="/profile" element={<Navigate to="/admin/profile" replace />} />
          <Route path="/workforce/*" element={<Navigate to="/admin/workforce/employees" replace />} />
          <Route path="/org/*" element={<Navigate to="/admin/org/chart" replace />} />

          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
