import React, { useEffect, useMemo } from "react";

import StatCard from "./components/StatCard";
import BookingTrendChart from "./components/BookingTrendChart";
import RevenueByCityChart from "./components/RevenueByCityChart";

import ComplaintSummaryTable from "./components/ComplaintSummaryTable";
import RevenueByCityTable from "./components/RevenueByCityTable";

import { useReportStore } from "../../store/reportStore";

import {
  Calendar,
  AlertCircle,
  DollarSign,
  Users,
} from "lucide-react";


export default function ReportDashboard() {


  const {
    stats: reportStats,
    fetchReports,
  } = useReportStore();



  useEffect(() => {

    fetchReports();

  }, []);

  const stats = useMemo(() => {

    if (!reportStats) return [];


    return [

      {
        title: "Total Bookings",

        value: String(reportStats.bookings?.value || 0),
percentage: reportStats.bookings?.percentage || 0,
        current: reportStats.bookings?.value || 0,

        lastWeek: reportStats.bookings?.last7Days || 0,

        icon: Calendar,

        iconBg: "bg-primary/10",

        iconColor: "text-primary",
      },


      {
        title: "Total Complaints",

        value: String(reportStats.complaints?.value || 0),
percentage: reportStats.complaints?.percentage || 0,
        current: reportStats.complaints?.value || 0,

        lastWeek: reportStats.complaints?.last7Days || 0,

        icon: AlertCircle,

        iconBg: "bg-danger/10",

        iconColor: "text-danger",
      },


      {
        title: "Total Revenue",

        value: `PKR ${(reportStats.revenue?.value || 0).toLocaleString()}`,
        percentage: reportStats.revenue?.percentage || 0,
        current: reportStats.revenue?.value || 0,

        lastWeek: reportStats.revenue?.last7Days || 0,

        icon: DollarSign,

        iconBg: "bg-success/10",

        iconColor: "text-success",
      },


      {
        title: "Resolution Rate",

        value: `${(reportStats.resolutionRate?.value || 0).toFixed(1)}%`,
        percentage: reportStats.resolutionRate?.percentage || 0,
        current: reportStats.resolutionRate?.value || 0,

        lastWeek: reportStats.resolutionRate?.last7Days || 0,

        icon: Users,

        iconBg: "bg-warning/10",

        iconColor: "text-warning",
      },


    ];


  }, [reportStats]);


  return (

    <div className="p-3 sm:p-4 md:p-6 bg-background min-h-screen w-full overflow-x-hidden">



      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">


        {stats.map((item, i) => (

          <StatCard
            key={i}
            {...item}
          />

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