import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import { useAuthStore } from "./authStore";

const notifyBookingUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("bookingUpdated"));
  }
};

const normalizeBookingPayload = (booking = {}) => {
  const customerId = booking.customerId ? Number(booking.customerId) : null;
  const source = booking.source || (customerId ? "ONLINE" : "WALK_IN");
  const companyId = Number(
    booking.companyId ?? useAuthStore.getState().getCompanyId()
  );

  return {
    customerName: booking.customerName || booking.name || null,
    customerId,
    companyId,
    vehicleId: Number(booking.vehicleId),
    phone: booking.phone || null,
    cnic: booking.cnic || null,
    city: booking.city || "",
    startDate: booking.startDate,
    endDate: booking.endDate,
    pickupTime: booking.pickupTime || null,
    dropTime: booking.dropTime || booking.dropoffTime || null,
    totalPrice: Number(booking.totalPrice || booking.price || 0),
    dailyRate: Number(booking.dailyRate || booking.price || 0),
    advance: Number(booking.advance) || 0,
    discount: Number(booking.discount) || 0,
    notes: booking.notes || null,
    forceOverride: Boolean(booking.forceOverride || booking.isOverride),
    source,
  };
};

export const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],

      fetchBookings: async () => {
        try {
          const res = await api.get("/bookings");
          set({ bookings: res.data });
        } catch (error) {
          console.error(
            "Fetch bookings error:",
            error.response?.data || error.message
          );
        }
      },

      getBookingsByCity: (city) => {
        if (!city) return get().bookings;

        return get().bookings.filter((b) => b.city === city);
      },

      addBooking: async (booking) => {
        try {
          const payload = normalizeBookingPayload(booking);
          const res = await api.post("/bookings", payload);
          const data = res.data;

          set((state) => ({
            bookings: [data, ...state.bookings],
          }));
          notifyBookingUpdate();
          return data;
        } catch (error) {
          console.error(
            "Create booking error:",
            error.response?.data || error.message
          );
          throw error;
        }
      },

      updateBooking: async (booking) => {
        try {
          const payload = normalizeBookingPayload(booking);
          const res = await api.patch(`/bookings/${booking.id}`, payload);
          const updated = res.data;

          set((state) => ({
            bookings: state.bookings.map((b) => (b.id === updated.id ? updated : b)),
          }));
          notifyBookingUpdate();
          return updated;
        } catch (error) {
          console.error(
            "Update booking error:",
            error.response?.data || error.message
          );
          throw error;
        }
      },

      overrideBooking: async (booking) => {
        try {
          const payload = normalizeBookingPayload({
            ...booking,
            forceOverride: true,
            isOverride: true,
          });
          const res = await api.post("/bookings/override", payload);
          const data = res.data;

          set((state) => ({
            bookings: [data, ...state.bookings.filter((b) => b.id !== data.id)],
          }));
          notifyBookingUpdate();
          return data;
        } catch (error) {
          console.error(
            "Override booking error:",
            error.response?.data || error.message
          );
          throw error;
        }
      },

      deleteBooking: async (id) => {
        try {
          await api.delete(`/bookings/${id}`);
          set((state) => ({
            bookings: state.bookings.filter((b) => b.id !== id),
          }));
          notifyBookingUpdate();
        } catch (error) {
          console.error(
            "Delete error:",
            error.response?.data || error.message
          );
          throw error;
        }
      },
    }),
    {
      name: "fixitnow_bookings",
    }
  )
);
