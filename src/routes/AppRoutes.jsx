import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ComplaintList from "../pages/complaints/ComplaintList";
import Bookings from "../pages/bookings/BookingList";
import CustomerPage from "../pages/customers/CustomerPage";
import SubAdminPage from "../pages/subadmins/SubAdminPage";
import Config from "../pages/config/config";
import Reports from "../pages/reports/ReportsDashboard";
import Vendors from "../pages/vendors/VendorList";
import SLATimers from "../pages/sla/SLATimers";
import Login from "../pages/auth/login";
import ProfileSettings from "../pages/ProfileSettings";
export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="complaints" element={<ComplaintList />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="customers" element={<CustomerPage />} />
        <Route path="subadmins" element={<SubAdminPage />} />
        <Route path="sla-timers" element={<SLATimers />} />
        <Route path="config" element={<Config />} />
        <Route path="reports" element={<Reports />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="profile-settings" element={<ProfileSettings />} />

      </Route>

    </Routes>
  );
}