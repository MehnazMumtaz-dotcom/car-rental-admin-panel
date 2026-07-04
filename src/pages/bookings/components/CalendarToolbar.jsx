import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarToolbar({
  onFilter,
  onViewChange,
  onDateChange,
  onOpenForm,
  currentDate,
  view
}) {

  const [filters, setFilters] = useState({
    city: "",
    vehicle: "",
    status: "",
  });

  const changeDate = (type) => {
    if (!currentDate) return;

    const baseDate = new Date(currentDate.getTime());
    let newDate = new Date(baseDate);

    if (type === "prev") {
      if (view === "week") {
        newDate.setDate(baseDate.getDate() - 7);
      } else {
        newDate.setMonth(baseDate.getMonth() - 1);
      }
    }

    if (type === "next") {
      if (view === "week") {
        newDate.setDate(baseDate.getDate() + 7);
      } else {
        newDate.setMonth(baseDate.getMonth() + 1);
      }
    }

    if (type === "today") {
      newDate = new Date();
    }

    onDateChange?.(newDate);
  };

  const handleView = (val) => {
    onViewChange?.(val);
  };

  const handleFilter = (key, value) => {
    const normalizedValue =
      key === "status"
        ? value.trim().toLowerCase()
        : value;

    const updated = {
      ...filters,
      [key]: normalizedValue,
    };

    setFilters(updated);
    onFilter?.(updated);
  };

  const reset = () => {
    const empty = { city: "", vehicle: "", status: "" };
    setFilters(empty);
    onFilter?.(empty);
  };

  const monthYear = currentDate
    ? currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2 px-2 sm:px-0">
        <button
          onClick={onOpenForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm w-full sm:w-auto"
        >
          + New Booking
        </button>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white px-3 sm:px-5 py-3 rounded-lg shadow-sm">
        <div className="flex items-center justify-between sm:justify-start gap-2">

          <button
            onClick={() => changeDate("prev")}
            className="p-2 border rounded"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => changeDate("today")}
            className="px-3 py-1 border rounded text-xs sm:text-sm"
          >
            Today
          </button>

          <button
            onClick={() => changeDate("next")}
            className="p-2 border rounded"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">

          <h2 className="text-base sm:text-lg font-semibold text-center sm:text-left">
            {monthYear}
          </h2>

          <select
            value={view}
            onChange={(e) => handleView(e.target.value)}
            className="border px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm"
          >
            <option value="month">Monthly</option>
            <option value="week">Weekly</option>
          </select>

          <select
            value={filters.city}
            onChange={(e) => handleFilter("city", e.target.value)}
            className="border px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm"
          >
            <option value="">All Cities</option>
            <option>Lahore</option>
            <option>Karachi</option>
            <option>Islamabad</option>
            <option>Multan</option>
          </select>

          <select
            value={filters.vehicle}
            onChange={(e) => handleFilter("vehicle", e.target.value)}
            className="border px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm"
          >
            <option value="">All Vehicles</option>
            <option>Corolla</option>
            <option>Swift</option>
            <option>Alto</option>
            <option>Honda City</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilter("status", e.target.value)}
            className="border px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>

          <button
            onClick={reset}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}