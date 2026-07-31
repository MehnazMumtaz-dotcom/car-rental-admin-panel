import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import RequirePermission from "./RequirePermission";
import Dashboard from "../pages/dashboard/Dashboard";
import Bookings from "../pages/bookings/BookingList";
import CustomerPage from "../pages/customers/CustomerPage";
import SubAdminPage from "../pages/subadmins/SubAdminPage";
import Config from "../pages/config/config";
import Reports from "../pages/reports/ReportsDashboard";
import SLATimers from "../pages/sla/SLATimers";
import Login from "../pages/auth/login";
import ProfileSettings from "../pages/ProfileSettings";
import Forbidden from "../pages/errors/Forbidden";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>

          <Route path="403" element={<Forbidden />} />

          {/* Dashboard ab sab logged-in users (ADMIN + SUB_ADMIN) ke liye open hai,
              kisi permission ki zaroorat nahi */}
          <Route index element={<Dashboard />} />

          <Route element={<RequirePermission permission="complaints" />}>
            <Route path="complaints" element={<SLATimers />} />
          </Route>

          <Route element={<RequirePermission permission="bookingCalendar" />}>
            <Route path="bookings" element={<Bookings />} />
          </Route>

          <Route element={<RequirePermission permission="customers" />}>
            <Route path="customers" element={<CustomerPage />} />
          </Route>

          <Route element={<RequirePermission permission="subAdmins" />}>
            <Route path="subadmins" element={<SubAdminPage />} />
          </Route>

          <Route element={<RequirePermission permission="configPanel" />}>
            <Route path="config" element={<Config />} />
          </Route>

          <Route element={<RequirePermission permission="reports" />}>
            <Route path="reports" element={<Reports />} />
          </Route>

          <Route path="profile-settings" element={<ProfileSettings />} />

        </Route>
      </Route>

    </Routes>
  );
}