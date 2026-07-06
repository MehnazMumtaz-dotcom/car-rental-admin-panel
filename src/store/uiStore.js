import { create } from "zustand";

export const useUIStore = create((set) => ({
  sidebarOpen: true,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (value) => set({ sidebarOpen: value }),

  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  theme: localStorage.getItem("theme") || "system",

  setTheme: (theme) => {
    const root = document.documentElement;

    root.classList.remove("dark");

    if (window.__themeListener) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", window.__themeListener);
      window.__themeListener = null;
    }

    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } 
    else if (theme === "light") {
      localStorage.setItem("theme", "light");
    } 
    else {
      const media = window.matchMedia("(prefers-color-scheme: dark)");

      const applySystemTheme = () => {
        root.classList.toggle("dark", media.matches);
      };

      applySystemTheme();

      media.addEventListener("change", applySystemTheme);
      window.__themeListener = applySystemTheme;

      localStorage.setItem("theme", "system");
    }

    set({ theme });
  }
}));