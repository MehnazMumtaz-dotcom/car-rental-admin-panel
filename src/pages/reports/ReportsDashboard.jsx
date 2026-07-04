import React, { useEffect, useState } from "react";
import StatCard from "./components/StatCard";
import BookingTrendChart from "./components/BookingTrendChart";
import RevenueByCityChart from "./components/RevenueByCityChart";

// ✅ NEW IMPORTS
import ComplaintSummaryTable from "./components/ComplaintSummaryTable";
import RevenueByCityTable from "./components/RevenueByCityTable";

import {
  Calendar,
  AlertCircle,
  DollarSign,
  Users,
} from "lucide-react";

export default function ReportDashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const data = [
      {
        title: "Total Bookings",
        value: "128",
        current: 128,
        lastWeek: 100,
        icon: Calendar,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      },
      {
        title: "Total Complaints",
        value: "52",
        current: 52,
        lastWeek: 58,
        icon: AlertCircle,
        iconBg: "bg-danger/10",
        iconColor: "text-danger",
      },
      {
        title: "Total Revenue",
        value: "PKR 1,245,750",
        current: 1245750,
        lastWeek: 1098000,
        icon: DollarSign,
        iconBg: "bg-success/10",
        iconColor: "text-success",
      },
      {
        title: "Resolution Rate",
        value: "76.9%",
        current: 76.9,
        lastWeek: 70.8,
        icon: Users,
        iconBg: "bg-warning/10",
        iconColor: "text-warning",
      },
    ];

    setStats(data);
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-background min-h-screen w-full overflow-x-hidden">

      {/* ✅ STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>

      {/* ✅ CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6">
        <BookingTrendChart />
        <RevenueByCityChart />
      </div>

      {/* ✅ TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6">
        <ComplaintSummaryTable />
        <RevenueByCityTable />
      </div>

    </div>
  );
}