import React, { useState } from "react";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { Trash2, Pencil, X, CalendarDays, AlertTriangle } from "lucide-react";

const calculateDays = (start, end) => {
  if (!start || !end) return "";

  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffTime = endDate - startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return `${diffDays} days`;
};

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
        return "bg-success/15 border-success text-success";
      case "Upcoming":
        return "bg-primary/15 border-primary text-primary";
      case "Completed":
        return "bg-borderColor/60 border-borderColor text-textSecondary";
      case "Cancelled":
        return "bg-accent/15 border-accent text-accent";
      case "Pending":
        return "bg-warning/15 border-warning text-warning";
      default:
        return "bg-primary/15 border-primary text-primary";
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
        new Date(booking.startDate).setHours(0,0,0,0) <= new Date(b.endDate).setHours(0,0,0,0) &&
        new Date(booking.endDate).setHours(0,0,0,0) >= new Date(b.startDate).setHours(0,0,0,0)
    );
  };

  const getBookingsForDay = (dateObj) =>
    filteredBookings.filter((b) => isInRange(b, dateObj));

  const getDayHighlight = (dateObj) => {
    const dayBookings = getBookingsForDay(dateObj);
    if (dayBookings.some(b => isClashing(b))) return "bg-danger/5 border-danger/20";
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

  const sortedFilteredBookings = [...filteredBookings].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const bookingRowMap = {};
  
  sortedFilteredBookings.forEach((b) => {
    let assignedRow = 0;
    while (true) {
      const hasOverlap = Object.keys(bookingRowMap).some((id) => {
        const activeBooking = sortedFilteredBookings.find(sb => sb.id === Number(id));
        if (!activeBooking || bookingRowMap[id] !== assignedRow) return false;
        
        const startA = new Date(b.startDate).setHours(0,0,0,0);
        const endA = new Date(b.endDate).setHours(0,0,0,0);
        const startB = new Date(activeBooking.startDate).setHours(0,0,0,0);
        const endB = new Date(activeBooking.endDate).setHours(0,0,0,0);
        
        return startA <= endB && endA >= startB;
      });

      if (!hasOverlap) {
        bookingRowMap[b.id] = assignedRow;
        break;
      }
      assignedRow++;
    }
  });

  return (
    <div className="bg-surface border border-borderColor rounded-xl shadow-card p-3 sm:p-4 mt-4">

      <div className="grid grid-cols-7 text-[10px] sm:text-sm text-textSecondary mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border border-borderColor relative overflow-x-auto sm:overflow-visible">

        {days.map((dateObj, i) => {
          const dayBookings = getBookingsForDay(dateObj);

          return (
            <div
              key={i}
              onClick={() => {
                setSelectedDate(dateObj);
                setShowModal(true);
              }}
              className={`h-24 sm:h-28 border border-borderColor p-1 text-[9px] sm:text-xs cursor-pointer relative text-textPrimary overflow-hidden ${getDayHighlight(dateObj)}`}
            >
              <span className="font-semibold text-[10px] sm:text-sm block mb-1">
                {dateObj.getDate()}
              </span>

              {dayBookings.map((b) => {
                const start = new Date(b.startDate);
                const end = new Date(b.endDate);
                const current = new Date(dateObj);

                start.setHours(0,0,0,0);
                end.setHours(0,0,0,0);
                current.setHours(0,0,0,0);

                const isStartDay = start.getTime() === current.getTime();
                
                // Doosre cell (Second Day) ki perfect validation ke liye gap check
                const secondDayTime = start.getTime() + (24 * 60 * 60 * 1000);
                const isSecondDay = current.getTime() === secondDayTime;

                const clash = isClashing(b);
                const status = getAutoStatus(b);

                const rowIndex = bookingRowMap[b.id] ?? 0;
                const topOffset = rowIndex * 23 + 24;

                return (
                  <div
                    key={`${b.id}-${i}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookingClick && onBookingClick(b);
                    }}
                    className={`absolute left-0 right-0 z-10 px-1.5 py-[1px] text-[7.5px] sm:text-[9px] flex items-center justify-between border-y transition-all overflow-hidden
                      ${isStartDay ? "rounded-l border-l ml-0.5" : "border-l-0"}
                      ${current.getTime() === end.getTime() ? "rounded-r border-r mr-0.5" : "border-r-0"}
                      ${clash ? "bg-danger text-white border-danger font-medium" : getStatusColor(status)}
                    `}
                    style={{ 
                      top: `${topOffset}px`,
                      height: "19px"
                    }}
                  >
                    {isStartDay ? (
                      // 1. FIRST CELL: Sirf aur sirf Name show hoga
                      <div className="flex items-center w-full h-full min-w-0">
                        <span className="font-bold whitespace-nowrap text-ellipsis overflow-hidden">{b.name}</span>
                      </div>
                    ) : isSecondDay ? (
                      // 2. SECOND CELL: Days aur Status right side par fit spacing ke saath show hoga
                      <div className="flex items-center justify-between w-full h-full gap-2 min-w-0">
                        <span className="opacity-90 font-normal whitespace-nowrap text-[7px] sm:text-[8.5px]">
                          {calculateDays(b.startDate, b.endDate)}
                        </span>
                        
                        <span className="flex items-center gap-0.5 shrink-0 text-[6.5px] sm:text-[7.5px] bg-black/10 px-1.5 py-[0.5px] rounded font-black uppercase tracking-wide whitespace-nowrap ml-auto">
                          {clash && <AlertTriangle size={7} className="text-white" />}
                          {clash ? "Conflict" : status}
                        </span>
                      </div>
                    ) : null 
                    /* 3. REMAINING CELLS: Empty rahenge automatic */
                    }
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50 p-2 sm:p-0">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-borderColor text-textPrimary rounded-xl p-4 sm:p-5 w-full max-w-sm shadow-card"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <CalendarDays size={18} />
                {selectedDate.toDateString()}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-textSecondary hover:text-textPrimary">
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
                        ${clash ? "bg-danger/15 border-danger text-danger" : getStatusColor(status)}
                      `}
                    >
                      <div className="font-semibold flex items-center gap-1">
                        {b.name}
                        {clash && <AlertTriangle size={12} className="text-danger" />}
                      </div>

                      <div className="font-medium mt-0.5 text-textSecondary">{b.vehicle}</div>

                      <div className="text-[10px] sm:text-xs text-textSecondary mt-1">
                        {b.startDate} → {b.endDate}
                      </div>

                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => onEditBooking && onEditBooking(b)}
                          className="text-primary text-xs flex items-center gap-1 font-medium"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(b.id);
                          }}
                          className="text-danger text-xs flex items-center gap-1 font-medium"
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
              <div className="text-textSecondary text-sm text-center flex flex-col items-center gap-2">
                <CalendarDays size={28} />
                No bookings for this date
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-xs mt-4 border-t border-borderColor pt-3 text-textPrimary">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-success/15 border border-success rounded-full"></span>
          <span>Ongoing</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-primary/15 border border-primary rounded-full"></span>
          <span>Upcoming</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-borderColor/60 border border-borderColor rounded-full"></span>
          <span>Completed</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-accent/15 border border-accent rounded-full"></span>
          <span>Cancelled</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-danger border border-danger rounded-full"></span>
          <span>Conflict</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-warning/15 border border-warning rounded-full"></span>
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