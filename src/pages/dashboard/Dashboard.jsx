import React, { useEffect, useState } from "react";

import StatCard from "../../components/ui/StatCard";
import BookingChart from "../../components/charts/BookingsChart";
import ComplaintChart from "../../components/charts/ComplaintChart";
import RevenueChart from "../../components/charts/RevenueChart";
import ComplaintsTable from "../../components/tables/ComplaintsTable";
import AlertsTable from "../../components/tables/AlertsTable";

import { useDashboardStore } from "../../store/DashboardStore";

const Dashboard = () => {
  const [weekRange, setWeekRange] = useState({
    start: "",
    end: "",
  });

  const {
    stats,
    bookingTrend,
    revenueTrend,
    complaintSummary,
    recentComplaints,
    slaAlerts,
    fetchDashboard,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    const today = new Date();
    const day = today.getDay();

    const diff =
      today.getDate() - day + (day === 0 ? -6 : 1);

    const firstDay = new Date(today.setDate(diff));
    const lastDay = new Date(firstDay);

    lastDay.setDate(firstDay.getDate() + 6);

    const formatDate = (date) =>
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    setWeekRange({
      start: formatDate(firstDay),
      end: formatDate(lastDay),
    });
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-textPrimary">
            Welcome back, Admin
          </h2>

          <p className="text-sm sm:text-base text-textSecondary mt-1">
            Here’s what’s happening with your business this week
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 bg-surface px-3 sm:px-4 py-2 rounded-xl shadow-card text-xs sm:text-sm text-textSecondary">
          📅 {weekRange.start} – {weekRange.end}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">

        <StatCard
          title="Active Bookings"
          value={stats?.activeBookings?.value}
          percentage={stats?.activeBookings?.percentage}
          icon="bookings"
          color="blue"
        />

        <StatCard
          title="Open Complaints"
          value={stats?.openComplaints?.value}
          percentage={stats?.openComplaints?.percentage}
          icon="complaints"
          color="red"
        />

        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenue?.value}
          percentage={stats?.totalRevenue?.percentage}
          icon="revenue"
          color="green"
        />

        <StatCard
          title="Vendor Count"
          value={stats?.vendorCount?.value}
          percentage={stats?.vendorCount?.percentage}
          icon="users"
          color="purple"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <BookingChart data={bookingTrend} />
        <ComplaintChart data={complaintSummary} />
        <RevenueChart data={revenueTrend} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <ComplaintsTable data={recentComplaints} />
        <AlertsTable data={slaAlerts} />
      </div>
    </>
  );
};

export default Dashboard;