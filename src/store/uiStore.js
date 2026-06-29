import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  sidebarOpen: true,
  isMobile: false,

  theme: localStorage.getItem("theme") || "system",

  setIsMobile: (value) => {
    set({
      isMobile: value,
      sidebarOpen: value ? false : true,
    });
  },

  toggleSidebar: () => {
    const { sidebarOpen } = get();
    set({ sidebarOpen: !sidebarOpen });
  },

  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),

  handleRouteChange: () => {
    const { isMobile } = get();
    if (isMobile) {
      set({ sidebarOpen: false });
    }
  },
setTheme: (theme) => {
  const root = document.documentElement;

  root.classList.remove("dark");

  if (window.__themeListener) {
    window.matchMedia("(prefers-color-scheme: dark)")
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