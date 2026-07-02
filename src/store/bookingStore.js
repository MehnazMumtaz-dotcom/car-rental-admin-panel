import { create } from "zustand";

const useBookingStore = create((set) => ({
  // ✅ BOOKINGS DATA (FIXED STRUCTURE)
  bookings: [
    {
      id: 1,
      title: "Ali - Corolla",
      customerName: "Ali",
      carName: "Toyota Corolla",
      startDate: "2026-07-03",
      endDate: "2026-07-05",
      start: 3,
      end: 5,
      status: "ongoing",
    },
    {
      id: 2,
      title: "Sara - Civic",
      customerName: "Sara",
      carName: "Honda Civic",
      startDate: "2026-07-05",
      endDate: "2026-07-07",
      start: 5,
      end: 7,
      status: "upcoming",
    },
    {
      id: 3,
      title: "Ahmed - Alto",
      customerName: "Ahmed",
      carName: "Suzuki Alto",
      startDate: "2026-07-05",
      endDate: "2026-07-06",
      start: 5,
      end: 6,
      status: "conflict",
    },
  ],

  // ✅ SELECTED BOOKING
  selectedBooking: null,

  // ✅ DRAWER STATE
  isDrawerOpen: false,

  // ✅ ACTIONS

  // 👉 Open Drawer
  openDrawer: (booking) =>
    set({
      selectedBooking: booking,
      isDrawerOpen: true,
    }),

  // 👉 Close Drawer
  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      selectedBooking: null,
    }),

  // 👉 Delete Booking (NEW 🔥)
  deleteBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),

  // 👉 Update Booking (for future Phase 4)
  updateBooking: (updatedBooking) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === updatedBooking.id ? updatedBooking : b
      ),
    })),

  // 👉 Add Booking (future use)
  addBooking: (newBooking) =>
    set((state) => ({
      bookings: [...state.bookings, newBooking],
    })),

  // 👉 Replace all bookings (API ready)
  setBookings: (data) =>
    set({
      bookings: data,
    }),
}));

export default useBookingStore;