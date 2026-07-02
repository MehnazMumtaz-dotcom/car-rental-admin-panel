import React from "react";
import useBookingStore from "../../../store/bookingStore";

export default function BookingCard({ booking }) {
  const { openDrawer } = useBookingStore(); // ✅ ADD THIS

  // ✅ STATUS COLORS
  const getStatusStyles = () => {
    switch (booking.status) {
      case "ongoing":
        return "bg-green-100 text-green-700 border-green-300";
      case "upcoming":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "conflict":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div
      onClick={() => openDrawer(booking)} // ✅ VERY IMPORTANT
      className={`text-xs px-2 py-1 rounded-md border truncate cursor-pointer hover:shadow-sm transition ${getStatusStyles()}`}
      title={booking.title}
    >
      {booking.title}
    </div>
  );
}