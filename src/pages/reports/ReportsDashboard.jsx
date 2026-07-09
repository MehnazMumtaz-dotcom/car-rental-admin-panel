import React, { useMemo } from "react";
import StatCard from "./components/StatCard";
import BookingTrendChart from "./components/BookingTrendChart";
import RevenueByCityChart from "./components/RevenueByCityChart";

import ComplaintSummaryTable from "./components/ComplaintSummaryTable";
import RevenueByCityTable from "./components/RevenueByCityTable";

import { useBookingStore } from "../../store/bookingStore";
import { useSLAStore, getComplaintStatus } from "../../store/SLAStore";
import { useAuthStore } from "../../store/authStore";

import {
  Calendar,
  AlertCircle,
  DollarSign,
  Users,
} from "lucide-react";

export default function ReportDashboard() {
  const adminCity = useAuthStore((s) => s.user?.city);
  const bookings = useBookingStore((s) => s.bookings);
  const complaints = useSLAStore((s) => s.complaints);

  const cityBookings = useMemo(
    () => bookings.filter((b) => !adminCity || b.city === adminCity),
    [bookings, adminCity]
  );

  const cityComplaints = useMemo(
    () => complaints.filter((c) => !adminCity || c.city === adminCity),
    [complaints, adminCity]
  );

  const stats = useMemo(() => {
    const totalRevenue = cityBookings.reduce(
      (sum, b) => sum + (Number(b.price) || 0),
      0
    );

    const totalComplaints = cityComplaints.length;
    const resolvedComplaints = cityComplaints.filter((c) => c.resolved).length;
    const resolutionRate =
      totalComplaints === 0 ? 0 : (resolvedComplaints / totalComplaints) * 100;

    return [
      {
        title: "Total Bookings",
        value: String(cityBookings.length),
        current: cityBookings.length,
        lastWeek: cityBookings.length, 
        icon: Calendar,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      },
      {
        title: "Total Complaints",
        value: String(totalComplaints),
        current: totalComplaints,
        lastWeek: totalComplaints,
        icon: AlertCircle,
        iconBg: "bg-danger/10",
        iconColor: "text-danger",
      },
      {
        title: "Total Revenue",
        value: `PKR ${totalRevenue.toLocaleString()}`,
        current: totalRevenue,
        lastWeek: totalRevenue,
        icon: DollarSign,
        iconBg: "bg-success/10",
        iconColor: "text-success",
      },
      {
        title: "Resolution Rate",
        value: `${resolutionRate.toFixed(1)}%`,
        current: resolutionRate,
        lastWeek: resolutionRate,
        icon: Users,
        iconBg: "bg-warning/10",
        iconColor: "text-warning",
      },
    ];
  }, [cityBookings, cityComplaints]);

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-background min-h-screen w-full overflow-x-hidden">

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6">
        <BookingTrendChart />
        <RevenueByCityChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6">
        <ComplaintSummaryTable />
        <RevenueByCityTable />
      </div>

    </div>
  );
}