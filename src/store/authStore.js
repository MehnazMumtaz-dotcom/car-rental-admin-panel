import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // { name, email, city } - city drives multi-tenant filtering
      token: null,

      login: (user, token) => {
        set({ user, token });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "fixitnow_auth", // localStorage key
    }
  )
);