import { create } from "zustand";
import api from "../services/api";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/notifications");
      set({ notifications: res.data || [] });
    } catch (error) {
      console.log("Fetch Notifications Error:", error);
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set({
        notifications: get().notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      });
    } catch (error) {
      console.log("Mark As Read Error:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch("/notifications/read-all");
      set({
        notifications: get().notifications.map((n) => ({ ...n, read: true })),
      });
    } catch (error) {
      console.log("Mark All As Read Error:", error);
    }
  },
}));