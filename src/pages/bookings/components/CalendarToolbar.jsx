import React, { useMemo } from "react";
import BookingCard from "./BookingCard";

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

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

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [year, month]);

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

  const bookings = [
    { id: 1, title: "Ali - Corolla", start: 3, end: 5, status: "ongoing" },
    { id: 2, title: "Sara - Civic", start: 5, end: 7, status: "upcoming" },
    { id: 3, title: "Ahmed - Alto", start: 5, end: 6, status: "conflict" },
  ];

  const getBookingsForDay = (day) => {
    if (!day) return [];
    return bookings.filter((b) => day >= b.start && day <= b.end);
  };

  return (
    <div className="w-full overflow-x-auto">
      
      {/* Days Header */}
      <div className="grid grid-cols-7 min-w-[700px] border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 sm:p-3 text-xs sm:text-sm text-center text-gray-500 border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* MONTH VIEW */}
      {view === "monthly" && (
        <div className="grid grid-cols-7 min-w-[700px]">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className="
                h-24 sm:h-28 
                border-r border-b 
                p-1 sm:p-2 
                text-xs sm:text-sm 
                overflow-y-auto
              "
            >
              {day && <span className="font-medium">{day}</span>}

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
        <div className="grid grid-cols-7 min-w-[700px]">
          {weeklyDays.map((day, index) => (
            <div
              key={index}
              className="
                h-24 sm:h-32 
                border-r border-b 
                p-1 sm:p-2 
                text-xs sm:text-sm 
                overflow-y-auto
              "
            >
              <span className="font-medium">{day}</span>

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