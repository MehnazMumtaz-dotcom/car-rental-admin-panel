import { useBookingStore } from "../store/bookingStore";

export default function useBookings() {

  const {
    bookings,
    fetchBookings,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingsByCity,
  } = useBookingStore();


  return {

    // data
    bookings,


    // actions
    fetchBookings,
    addBooking,
    updateBooking,
    deleteBooking,


    // filters
    getBookingsByCity,

  };
}