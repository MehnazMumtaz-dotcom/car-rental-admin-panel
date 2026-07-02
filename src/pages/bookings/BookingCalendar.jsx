import React from "react";
import useBookingStore from "../../../store/bookingStore";
import BookingCard from "./BookingCard";
import BookingDrawer from "./BookingDrawer";

export default function BookingCalendar() {
  const { bookings } = useBookingStore();

  return (
    <div className="p-3 sm:p-4 md:p-5">

      {/* Heading */}
      <h1 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
        Booking Calendar
      </h1>

      {/* Responsive Grid */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-3 sm:gap-4
      ">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>

      {/* Drawer */}
      <BookingDrawer />
    </div>
  );
}