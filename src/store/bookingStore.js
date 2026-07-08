import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultBookings = [
  {
    id: 1,
    name: "Ali Raza",
    vehicle: "Corolla",
    city: "Lahore",
    startDate: "2026-07-01",
    endDate: "2026-07-04",
    pickupTime: "10:00",
    dropoffTime: "18:00",
    phone: "03001234567",
    cnic: "35202-1234567-1",
    price: 15000,
    advance: 5000,
    remaining: 10000,
    paymentMethod: "Cash",
    status: "Upcoming",
    notes: "",
  },
  {
    id: 2,
    name: "Sara Khan",
    vehicle: "Sportage",
    city: "Multan",
    startDate: "2026-08-05",
    endDate: "2026-08-08",
    pickupTime: "09:30",
    dropoffTime: "18:30",
    phone: "03451234567",
    cnic: "36102-7654321-5",
    price: 25000,
    advance: 10000,
    remaining: 15000,
    paymentMethod: "Bank Transfer",
    status: "Upcoming",
    notes: "Outstation booking",
  },
];

export const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: defaultBookings,

      // Multi-tenant: only bookings belonging to the admin's own city
      getBookingsByCity: (city) => {
        if (!city) return get().bookings;
        return get().bookings.filter((b) => b.city === city);
      },

      addBooking: (booking) => {
        set((state) => ({ bookings: [...state.bookings, booking] }));
      },

      updateBooking: (updatedBooking) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === updatedBooking.id ? updatedBooking : b
          ),
        }));
      },

      deleteBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.filter((b) => b.id !== id),
        }));
      },
    }),
    {
      name: "fixitnow_bookings",
    }
  )
);