import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import Bookings from "../pages/bookings/BookingList";
import CustomerPage from "../pages/customers/CustomerPage";
import SubAdminPage from "../pages/subadmins/SubAdminPage";
import Config from "../pages/config/config";
import Reports from "../pages/reports/ReportsDashboard";
import SLATimers from "../pages/sla/SLATimers";
import Login from "../pages/auth/login";
import ProfileSettings from "../pages/ProfileSettings";
export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          {/* Complaint queue + live SLA countdowns are one screen per spec (doc 4.2/4.3) */}
          <Route path="complaints" element={<SLATimers />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="subadmins" element={<SubAdminPage />} />
          <Route path="config" element={<Config />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile-settings" element={<ProfileSettings />} />
          {/* Vendor module intentionally not routed yet - doc defers this to Phase 5,
              it isn't one of the Admin's 8 current modules. Files kept in
              src/pages/vendors/ for when that phase starts. */}
        </Route>
      </Route>

    </Routes>
  );
}