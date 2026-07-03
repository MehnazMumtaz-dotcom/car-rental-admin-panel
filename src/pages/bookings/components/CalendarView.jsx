import React, { useMemo } from "react";

// ✅ NEW IMPORT (Phase 3)
import BookingCard from "./BookingCard";

// helper: get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// helper: first day of month (0 = Sun)
const getFirstDay = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export default function CalendarView({ currentDate, view }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDay(year, month);

    const days = [];

    // empty slots before month start
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // actual dates
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [year, month]);

  // WEEKLY VIEW
  const weeklyDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push(d.getDate());
    }
    return week;
  }, [currentDate]);

  // ✅ PHASE 3 — DUMMY BOOKINGS DATA
  const bookings = [
    {
      id: 1,
      title: "Ali - Corolla",
      start: 3,
      end: 5,
      status: "ongoing",
    },
    {
      id: 2,
      title: "Sara - Civic",
      start: 5,
      end: 7,
      status: "upcoming",
    },
    {
      id: 3,
      title: "Ahmed - Alto",
      start: 5,
      end: 6,
      status: "conflict",
    },
  ];

  // ✅ PHASE 3 — HELPER FUNCTION
  const getBookingsForDay = (day) => {
    if (!day) return [];

    return bookings.filter(
      (b) => day >= b.start && day <= b.end
    );
  };

  return (
    <div>
      {/* Days Header */}
      <div className="grid grid-cols-7 border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-3 text-sm font-medium text-gray-500 text-center border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* MONTH VIEW */}
      {view === "monthly" && (
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className="h-28 border-r border-b p-2 text-sm text-gray-700 overflow-hidden"
            >
              {/* EXISTING */}
              {day && <span className="font-medium">{day}</span>}

              {/* ✅ PHASE 3 ADDITION */}
              <div className="mt-1 space-y-1">
                {getBookingsForDay(day).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WEEK VIEW */}
      {view === "weekly" && (
        <div className="grid grid-cols-7">
          {weeklyDays.map((day, index) => (
            <div
              key={index}
              className="h-32 border-r border-b p-2 text-sm text-gray-700 overflow-hidden"
            >
              {/* EXISTING */}
              <span className="font-medium">{day}</span>

              {/* ✅ PHASE 3 ADDITION */}
              <div className="mt-1 space-y-1">
                {getBookingsForDay(day).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}