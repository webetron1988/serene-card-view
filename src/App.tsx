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
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/workforce/employees" element={<EmployeeDirectory />} />
          <Route path="/org/chart" element={<OrgChart />} />
          <Route path="/org/units" element={<OrgUnits />} />
          <Route path="/org/positions" element={<Positions />} />
          <Route path="/org/locations" element={<Locations />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/master-data" element={<MasterData />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/license" element={<License />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="/settings" element={<SettingsPage />}>
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
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
