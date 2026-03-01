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
import Settings from "@/pages/settings/Settings";

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
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
