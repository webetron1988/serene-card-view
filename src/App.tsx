import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireTenantAccess } from "@/components/auth/RequireTenantAccess";

import AdminLogin from "@/pages/admin/AdminLogin";
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
import PermissionMatrix from "@/pages/roles/PermissionMatrix";
import RolesAccess from "@/pages/roles/RolesAccess";

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
import { TenantShell } from "@/components/layout/TenantShell";

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Platform configuration and preferences">
      <SettingsLayout />
    </AppShell>
  );
}

const Admin = (el: React.ReactNode) => <RequireAuth>{el}</RequireAuth>;

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Root */}
            <Route path="/" element={<Navigate to="/app/admin/dashboard" replace />} />

            {/* ─── Platform Admin (/app/admin/*) ─── */}
            <Route path="/app/admin/login" element={<AdminLogin />} />
            <Route path="/app/admin" element={<Navigate to="/app/admin/dashboard" replace />} />
            <Route path="/app/admin/dashboard" element={Admin(<Dashboard />)} />
            <Route path="/app/admin/profile" element={Admin(<MyProfile />)} />
            <Route path="/app/admin/users" element={Admin(<Users />)} />
            <Route path="/app/admin/roles" element={<Navigate to="/app/admin/roles/permissions" replace />} />
            <Route path="/app/admin/roles/permissions" element={Admin(<PermissionMatrix />)} />
            <Route path="/app/admin/roles/list" element={Admin(<RolesAccess />)} />
            <Route path="/app/admin/workforce/employees" element={Admin(<EmployeeDirectory />)} />
            <Route path="/app/admin/org/chart" element={Admin(<OrgChart />)} />
            <Route path="/app/admin/org/units" element={Admin(<OrgUnits />)} />
            <Route path="/app/admin/org/positions" element={Admin(<Positions />)} />
            <Route path="/app/admin/org/locations" element={Admin(<Locations />)} />
            <Route path="/app/admin/marketplace" element={Admin(<Marketplace />)} />
            <Route path="/app/admin/master-data" element={Admin(<MasterData />)} />
            <Route path="/app/admin/tenants" element={Admin(<Tenants />)} />
            <Route path="/app/admin/license" element={Admin(<License />)} />
            <Route path="/app/admin/audit" element={Admin(<AuditLog />)} />
            <Route path="/app/admin/packages" element={Admin(<Packages />)} />
            <Route path="/app/admin/settings" element={Admin(<SettingsPage />)}>
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

            {/* ─── Tenant ───
                Generic tenant login (email-based tenant resolution).
                TODO (later): Add custom-domain detection — when a tenant has a verified
                custom domain, hostname lookup will render their branded login here. */}
            <Route path="/tenant/login" element={<TenantLogin />} />
            <Route
              path="/tenant/:tenantCode"
              element={
                <RequireTenantAccess>
                  <TenantShell />
                </RequireTenantAccess>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<TenantDashboard />} />
            </Route>

            {/* ─── Legacy redirects (preserve old bookmarks) ─── */}
            <Route path="/login" element={<Navigate to="/app/admin/login" replace />} />
            <Route path="/admin/login" element={<Navigate to="/app/admin/login" replace />} />
            <Route path="/admin" element={<Navigate to="/app/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Navigate to="/app/admin/dashboard" replace />} />
            <Route path="/admin/profile" element={<Navigate to="/app/admin/profile" replace />} />
            <Route path="/admin/users" element={<Navigate to="/app/admin/users" replace />} />
            <Route path="/admin/roles" element={<Navigate to="/app/admin/roles" replace />} />
            <Route path="/admin/workforce/*" element={<Navigate to="/app/admin/workforce/employees" replace />} />
            <Route path="/admin/org/*" element={<Navigate to="/app/admin/org/chart" replace />} />
            <Route path="/admin/marketplace" element={<Navigate to="/app/admin/marketplace" replace />} />
            <Route path="/admin/master-data" element={<Navigate to="/app/admin/master-data" replace />} />
            <Route path="/admin/tenants" element={<Navigate to="/app/admin/tenants" replace />} />
            <Route path="/admin/license" element={<Navigate to="/app/admin/license" replace />} />
            <Route path="/admin/audit" element={<Navigate to="/app/admin/audit" replace />} />
            <Route path="/admin/packages" element={<Navigate to="/app/admin/packages" replace />} />
            <Route path="/admin/settings/*" element={<Navigate to="/app/admin/settings" replace />} />
            <Route path="/dashboard" element={<Navigate to="/app/admin/dashboard" replace />} />
            <Route path="/users" element={<Navigate to="/app/admin/users" replace />} />
            <Route path="/roles" element={<Navigate to="/app/admin/roles" replace />} />
            <Route path="/packages" element={<Navigate to="/app/admin/packages" replace />} />
            <Route path="/tenants" element={<Navigate to="/app/admin/tenants" replace />} />
            <Route path="/settings/*" element={<Navigate to="/app/admin/settings" replace />} />
            <Route path="/marketplace" element={<Navigate to="/app/admin/marketplace" replace />} />
            <Route path="/master-data" element={<Navigate to="/app/admin/master-data" replace />} />
            <Route path="/license" element={<Navigate to="/app/admin/license" replace />} />
            <Route path="/audit" element={<Navigate to="/app/admin/audit" replace />} />
            <Route path="/profile" element={<Navigate to="/app/admin/profile" replace />} />
            <Route path="/workforce/*" element={<Navigate to="/app/admin/workforce/employees" replace />} />
            <Route path="/org/*" element={<Navigate to="/app/admin/org/chart" replace />} />
            <Route path="/tenant" element={<Navigate to="/tenant/login" replace />} />
            <Route path="/tenant/:tenantCode/login" element={<Navigate to="/tenant/login" replace />} />

            <Route path="*" element={<Navigate to="/app/admin/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
