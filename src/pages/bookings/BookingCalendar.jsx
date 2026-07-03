import React from "react";
import useBookingStore from "../../../store/bookingStore";
import BookingCard from "./BookingCard";
import BookingDrawer from "./BookingDrawer";

export default function BookingCalendar() {
  const { bookings } = useBookingStore();

  return (
    <div className="p-4">
      {/* Heading */}
      <h1 className="text-xl font-semibold mb-4">
        Booking Calendar
      </h1>

      {/* Calendar Grid (Simple Version) */}
      <div className="grid grid-cols-4 gap-3">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>

      {/* Drawer (IMPORTANT) */}
      <BookingDrawer />
    </div>
  );
}