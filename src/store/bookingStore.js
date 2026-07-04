import { useState } from "react";

export const useBookingStore = () => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => {
    setBookings(prev => [...prev, booking]);
  };

  return {
    bookings,
    addBooking,
  };
};