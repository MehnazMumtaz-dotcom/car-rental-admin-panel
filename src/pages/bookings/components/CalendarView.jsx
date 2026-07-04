import React, { useState } from "react";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { Trash2, Pencil, X, CalendarDays, AlertTriangle } from "lucide-react";

export default function CalendarView({
  filters = {},
  bookings = [],
  view = "month",
  currentDate = new Date(),
  onBookingClick,
  onDeleteBooking,
  onEditBooking
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const today = new Date();

  const getAutoStatus = (b) => {
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);

    if (today < start) return "Upcoming";
    if (today >= start && today <= end) return "Ongoing";
    return "Completed";
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getWeekDates = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    start.setDate(start.getDate() - day);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setHours(0, 0, 0, 0);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: totalDays }).map((_, i) => {
      const d = new Date(year, month, i + 1);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  };

  const days =
    view === "week"
      ? getWeekDates(currentDate)
      : getMonthDays(currentDate);

  const filteredBookings = bookings.filter((b) => {
    if (filters.vehicle && b.vehicle !== filters.vehicle) return false;
    if (filters.city && b.city !== filters.city) return false;

    if (filters.status) {
      const autoStatus = getAutoStatus(b)?.toLowerCase();
      if (autoStatus !== filters.status) return false;
    }

    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Ongoing":
        return "bg-green-200 border-green-500 text-green-800";
      case "Upcoming":
        return "bg-blue-200 border-blue-500 text-blue-800";
      case "Completed":
        return "bg-gray-200 border-gray-500 text-gray-800";
      case "Cancelled":
        return "bg-purple-200 border-purple-500 text-purple-800";
      case "Pending":
        return "bg-yellow-200 border-yellow-500 text-yellow-800";
      default:
        return "bg-blue-200 border-blue-500 text-blue-800";
    }
  };

  const isInRange = (b, dateObj) => {
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    const current = new Date(dateObj);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    return current >= start && current <= end;
  };

  const isClashing = (booking) => {
    return bookings.some(
      (b) =>
        b.id !== booking.id &&
        b.vehicle === booking.vehicle &&
        booking.startDate <= b.endDate &&
        booking.endDate >= b.startDate
    );
  };

  const getBookingsForDay = (dateObj) =>
    filteredBookings.filter((b) => isInRange(b, dateObj));

  const getDayHighlight = (dateObj) => {
    const dayBookings = getBookingsForDay(dateObj);
    if (dayBookings.length > 1) return "bg-red-700 text-white";
    if (dayBookings.length === 1) return "bg-red-200";
    return "";
  };

  const selectedDayBookings =
    selectedDate &&
    filteredBookings.filter((b) => isInRange(b, selectedDate));

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    onDeleteBooking && onDeleteBooking(deleteId);
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-3 sm:p-4 mt-4">


      <div className="grid grid-cols-7 text-[10px] sm:text-sm text-gray-500 mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border relative overflow-x-auto sm:overflow-visible">

        {days.map((dateObj, i) => {

          const col = i % 7;

          return (
            <div
              key={i}
              onClick={() => {
                setSelectedDate(dateObj);
                setShowModal(true);
              }}
              className={`h-24 sm:h-28 border p-1 text-[9px] sm:text-xs cursor-pointer relative ${getDayHighlight(dateObj)}`}
            >

              <span className="font-semibold text-[10px] sm:text-sm">
                {dateObj.getDate()}
              </span>

              {filteredBookings.map((b) => {

                const start = new Date(b.startDate);
                const end = new Date(b.endDate);
                const current = new Date(dateObj);

                start.setHours(0,0,0,0);
                end.setHours(0,0,0,0);
                current.setHours(0,0,0,0);

                const isActualStart = start.getTime() === current.getTime();

                const isRowStartContinuation =
                  col === 0 &&
                  current.getTime() > start.getTime() &&
                  current.getTime() <= end.getTime();

                if (!isActualStart && !isRowStartContinuation) return null;

                const daysRemainingInBooking =
                  Math.floor((end - current) / (1000 * 60 * 60 * 24)) + 1;

                const colsLeftInRow = 7 - col;

                const segmentLength = Math.min(
                  daysRemainingInBooking,
                  colsLeftInRow
                );

                const clash = isClashing(b);
                const status = getAutoStatus(b);

                return (
                  <div
                    key={`${b.id}-${i}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookingClick && onBookingClick(b);
                    }}
                    className={`absolute top-8 left-0 z-10 px-1 sm:px-2 py-[2px] rounded border text-[8px] sm:text-[10px] flex items-center whitespace-nowrap
                      ${clash ? "bg-red-500 text-white" : getStatusColor(status)}
                    `}
                    style={{ width: `${segmentLength * 100}%` }}
                  >
                    <span className="truncate max-w-[45px] sm:max-w-none">
                      {b.name}
                    </span>

                    <span className="flex items-center gap-1 ml-1 sm:ml-2">
                      {clash && <AlertTriangle size={10} />}
                      {clash ? "Conflict" : status}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2 sm:p-0">

          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-4 sm:p-5 w-full max-w-sm shadow-lg"
          >

            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <CalendarDays size={18} />
                {selectedDate.toDateString()}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>

            {selectedDayBookings?.length > 0 ? (
              <div className="flex flex-col gap-2">

                {selectedDayBookings.map((b) => {
                  const clash = isClashing(b);
                  const status = getAutoStatus(b);

                  return (
                    <div
                      key={b.id}
                      className={`p-2 rounded border text-xs sm:text-sm
                        ${clash ? "bg-red-200 border-red-500" : getStatusColor(status)}
                      `}
                    >
                      <div className="font-semibold flex items-center gap-1">
                        {b.name}
                        {clash && <AlertTriangle size={12} />}
                      </div>

                      <div>{b.vehicle}</div>

                      <div className="text-[10px] sm:text-xs">
                        {b.startDate} → {b.endDate}
                      </div>

                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => onEditBooking && onEditBooking(b)}
                          className="text-blue-600 text-xs flex items-center gap-1"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(b.id);
                          }}
                          className="text-red-600 text-xs flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
            ) : (
              <div className="text-gray-400 text-sm text-center flex flex-col items-center gap-2">
                <CalendarDays size={28} />
                No bookings for this date
              </div>
            )}

          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-xs mt-4 border-t pt-3">

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-200 border border-green-500 rounded-full"></span>
          <span>Ongoing</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-200 border border-blue-500 rounded-full"></span>
          <span>Upcoming</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-gray-200 border border-gray-500 rounded-full"></span>
          <span>Completed</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-200 border border-purple-500 rounded-full"></span>
          <span>Cancelled</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-200 border border-red-500 rounded-full"></span>
          <span>Conflict</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-200 border border-yellow-500 rounded-full"></span>
          <span>Pending</span>
        </div>

      </div>


      <ConfirmDialog
        open={confirmOpen}
        title="Delete Booking"
        message="Are you sure you want to delete this booking?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}