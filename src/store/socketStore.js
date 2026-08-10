import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./authStore";
import { useNotificationStore } from "./notificationStore";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_API_URL;

export const useSocketStore = create((set, get) => ({
  socket: null,
  connected: false,

  connectSocket: () => {
    if (get().socket) return;

    const token = useAuthStore.getState().token;

    if (!token) {
      console.log("⛔ Socket connect nahi hoga — token missing hai");
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      set({ connected: true });
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      set({ connected: false });
    });

    socket.on("complaint-escalated", (payload) => {
      console.log("🚨 Live event: complaint-escalated", payload);
      useNotificationStore.getState().fetchNotifications();
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, connected: false });
    }
  },
}));