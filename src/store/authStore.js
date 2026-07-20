import { create } from "zustand";
import { persist } from "zustand/middleware";

const normalizeUser = (user) => ({
  ...user,
  companyId: user?.companyId || user?.company_id || null,
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: (user, token) => {
        set({
          user: normalizeUser(user),
          token,
          isAuthenticated: !!token,
          hasHydrated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setAuth: (user, token) => {
        set({
          user: normalizeUser(user),
          token,
          isAuthenticated: !!token,
          hasHydrated: true,
        });
      },

      setHasHydrated: () => {
        set((state) => ({
          hasHydrated: true,
          isAuthenticated: !!state.token,
        }));
      },

      getCompanyId: () => {
        return get().user?.companyId || null;
      },

      getToken: () => {
        return get().token;
      },

      isLoggedIn: () => {
        return !!get().token;
      },

      reset: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

    }),
    {
      name: "fixitnow_auth",

      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),

      version: 1,

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    }
  )
);

if (typeof window !== "undefined") {
  window.authStore = useAuthStore;
}
