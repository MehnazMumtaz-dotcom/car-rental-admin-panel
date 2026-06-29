import React, { useEffect, useState } from "react";
import StatCard from "../../components/ui/StatCard";
import BookingChart from "../../components/charts/BookingsChart";
import ComplaintChart from "../../components/charts/ComplaintChart";
import RevenueChart from "../../components/charts/RevenueChart";
import ComplaintsTable from "../../components/tables/ComplaintsTable";
import AlertsTable from "../../components/tables/AlertsTable";

const Dashboard = () => {
  const [weekRange, setWeekRange] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    const today = new Date();

    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

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
      <div className="
        flex flex-col gap-4
        md:flex-row md:justify-between md:items-center
        mb-6
      ">

        <div className="text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-textPrimary">
            Welcome back, Admin 
          </h2>
          <p className="text-sm sm:text-base text-textSecondary mt-1">
            Here’s what’s happening with your business this week
          </p>
        </div>

        <div className="
          flex items-center justify-center md:justify-start
          gap-2 bg-surface px-3 sm:px-4 py-2
          rounded-xl shadow-card text-xs sm:text-sm
          text-textSecondary w-full md:w-auto
        ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-primary flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
            />
          </svg>

          <span className="text-center md:text-left">
            {weekRange.start} – {weekRange.end}
          </span>
        </div>
      </div>

      <div className="
        grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
        gap-4 sm:gap-5 mb-6
      ">
        <StatCard title="Active Bookings" value={128} previousValue={100} icon="bookings" color="blue" />
        <StatCard title="Open Complaints" value={36} previousValue={40} icon="complaints" color="red" />
        <StatCard title="Total Revenue" value={1245750} previousValue={1100000} icon="revenue" color="green" />
        <StatCard title="Vendor Count" value={42} previousValue={35} icon="users" color="purple" />
      </div>

      <div className="
        grid grid-cols-1 lg:grid-cols-3
        gap-4 sm:gap-6 mb-6
      ">
        <BookingChart weekRange={weekRange} />
        <ComplaintChart weekRange={weekRange} />
        <RevenueChart weekRange={weekRange} />
      </div>

      <div className="
        grid grid-cols-1 xl:grid-cols-2
        gap-4 sm:gap-6
      ">
        <ComplaintsTable weekRange={weekRange} />
        <AlertsTable weekRange={weekRange} />
      </div>
    </>
  );
};

export default Dashboard;