import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ComplaintList from "../pages/complaints/ComplaintList";

import Bookings from "../pages/bookings/BookingList";
import CustomerPage from "../pages/customers/CustomerPage";
import SubAdmins from "../pages/subadmins/SubAdminList";
import Config from "../pages/config/config";
import Reports from "../pages/reports/ReportsDashboard";
import Vendors from "../pages/vendors/VendorList";

import Login from "../pages/auth/login";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashboardLayout />}>

        <Route index element={<Dashboard />} />
        <Route path="complaints" element={<ComplaintList />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="customers" element={<CustomerPage />} />
        <Route path="subadmins" element={<SubAdmins />} />
        <Route path="config" element={<Config />} />
        <Route path="reports" element={<Reports />} />
        <Route path="vendors" element={<Vendors />} />

      </Route>

    </Routes>
  );
}