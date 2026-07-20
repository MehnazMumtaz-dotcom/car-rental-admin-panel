import { BOOKING_STATUS_COLORS } from "./bookingStatus";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toCalendarDate = (value) => {
  if (!value) return null;

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};

const getStoredBookingStatus = (booking) =>
  String(booking?.status || "ACTIVE").toUpperCase();

const hasConflictFlag = (booking) =>
  Boolean(
    booking?.isOverride ||
      booking?.forceOverride ||
      booking?.hasConflict ||
      booking?.isConflict ||
      booking?.conflict
  );

const getVehicleName = (booking) =>
  booking?.vehicle?.name || booking?.vehicleName || booking?.vehicle || "Vehicle unavailable";

const getCustomerName = (booking) =>
  booking?.customer?.name || booking?.customerName || booking?.name || "Walk-in customer";

const formatDate = (value) => {
  const date = toCalendarDate(value);

  if (!date) return "N/A";

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getWeekDates = (date) => {
  const start = toCalendarDate(date) || toCalendarDate(new Date());
  start.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

const getMonthDates = (date) => {
  const current = toCalendarDate(date) || toCalendarDate(new Date());
  const firstOfMonth = new Date(current.getFullYear(), current.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
};

const isInRange = (booking, day) => {
  const start = toCalendarDate(booking?.startDate);
  const end = toCalendarDate(booking?.endDate);

  return Boolean(start && end && day >= start && day <= end);
};

const isSameVehicle = (left, right) => {
  const leftId = Number(left?.vehicleId);
  const rightId = Number(right?.vehicleId);

  if (Number.isFinite(leftId) && leftId > 0 && Number.isFinite(rightId) && rightId > 0) {
    return leftId === rightId;
  }

  const leftName = getVehicleName(left);
  const rightName = getVehicleName(right);

  return leftName !== "Vehicle unavailable" && leftName === rightName;
};

const isClashing = (booking, bookings) => {
  if (getStoredBookingStatus(booking) !== "ACTIVE") return false;

  const start = toCalendarDate(booking?.startDate);
  const end = toCalendarDate(booking?.endDate);

  if (!start || !end) return false;

  return bookings.some((other) => {
    if (!other || String(other.id) === String(booking.id)) return false;
    if (getStoredBookingStatus(other) !== "ACTIVE" || !isSameVehicle(booking, other)) return false;

    const otherStart = toCalendarDate(other.startDate);
    const otherEnd = toCalendarDate(other.endDate);

    return Boolean(otherStart && otherEnd && start <= otherEnd && end >= otherStart);
  });
};

const getBookingDisplayStatus = (booking, bookings, today) => {
  if (hasConflictFlag(booking) || isClashing(booking, bookings)) {
    return "Conflict";
  }

  const start = toCalendarDate(booking?.startDate);
  const end = toCalendarDate(booking?.endDate);

  if (!start || !end || !today) return "Confirmed";

  if (start > today) return "Upcoming";
  if (end < today) return "Completed";
  if (today >= start && today <= end) return "Ongoing";

  return "Confirmed";
};

const getStatusStyle = (status) => ({
  backgroundColor: BOOKING_STATUS_COLORS[status],
  borderColor: BOOKING_STATUS_COLORS[status],
  color: status === "Completed" ? "#1E293B" : "#FFFFFF",
});

export default function CalendarView({
  filters = {},
  bookings = [],
  view = "month",
  currentDate = new Date(),
  onBookingClick,
}) {
  const selectedDate = toCalendarDate(currentDate) || toCalendarDate(new Date());
  const today = toCalendarDate(new Date());
  const days = view === "week" ? getWeekDates(selectedDate) : getMonthDates(selectedDate);
  const safeBookings = Array.isArray(bookings) ? bookings.filter(Boolean) : [];

  const filteredBookings = safeBookings.filter((booking) => {
    const vehicleName = getVehicleName(booking);

    if (filters.city && booking.city !== filters.city) return false;
    if (filters.vehicle && vehicleName !== filters.vehicle) return false;

    return (
      !filters.status ||
      getBookingDisplayStatus(booking, safeBookings, today) === filters.status
    );
  });

  return (
    <div className="bg-surface border border-borderColor rounded-xl shadow-card p-3 sm:p-4 mt-4">
      <div className="grid grid-cols-7 text-[10px] sm:text-sm text-textSecondary mb-2">
        {DAY_NAMES.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border border-borderColor">
        {days.map((day) => {
          const dayBookings = filteredBookings
            .filter((booking) => isInRange(booking, day))
            .sort((left, right) => {
              const leftDate = toCalendarDate(left.startDate)?.getTime() || 0;
              const rightDate = toCalendarDate(right.startDate)?.getTime() || 0;
              return leftDate - rightDate;
            });
          const isOutsideCurrentMonth = view === "month" && day.getMonth() !== selectedDate.getMonth();
          const hasClash = dayBookings.some(
            (booking) => getBookingDisplayStatus(booking, safeBookings, today) === "Conflict"
          );

          return (
            <div
              key={day.toISOString()}
              className={`min-h-28 sm:min-h-32 border border-borderColor p-1 text-textPrimary cursor-pointer ${
                isOutsideCurrentMonth ? "bg-background/60 text-textSecondary" : ""
              } ${hasClash ? "bg-danger/5" : ""}`}
            >
              <span className="font-semibold text-[10px] sm:text-sm block mb-1">
                {day.getDate()}
              </span>

              <div className="space-y-1 max-h-24 overflow-y-auto pr-0.5">
                {dayBookings.map((booking) => {
                  const status = getBookingDisplayStatus(booking, safeBookings, today);
                  const clash = status === "Conflict";
                  const title = [
                    getVehicleName(booking),
                    getCustomerName(booking),
                    `${formatDate(booking.startDate)} – ${formatDate(booking.endDate)}`,
                    status,
                  ]
                    .filter(Boolean)
                    .join(" | ");

                  return (
                    <button
                      key={`${booking.id || "booking"}-${day.toISOString()}`}
                      type="button"
                      title={title}
                      onClick={(event) => {
                        event.stopPropagation();
                        onBookingClick?.({ ...booking, hasConflict: clash });
                      }}
                      className="w-full border rounded px-1 py-0.5 text-left text-[8px] sm:text-[10px] leading-tight transition-opacity hover:opacity-80"
                      style={getStatusStyle(status)}
                    >
                      <span className="block truncate font-semibold">
                        {getCustomerName(booking)} · {getVehicleName(booking)}
                      </span>
                      <span className="block truncate opacity-90">
                        {status}
                      </span>
                      <span className="block truncate opacity-80">
                        {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
