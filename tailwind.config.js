/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🔵 PRIMARY (Main Brand Color)
        primary: "#2563eb",
        primaryHover: "#1d4ed8",

        // ⚫ SIDEBAR (Always Dark)
        secondary: "#0f172a",
        secondaryLight: "#1e293b",

        // ⚪ BACKGROUNDS - now theme-aware via CSS variables (see index.css)
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",

        // 📝 TEXT COLORS - theme-aware
        textPrimary: "rgb(var(--color-text-primary) / <alpha-value>)",
        textSecondary: "rgb(var(--color-text-secondary) / <alpha-value>)",

        // 🚦 STATUS COLORS
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",

        // 🟣 ACCENT (4th tone used for stat cards / hybrid options)
        accent: "#7c3aed",
        accentLight: "#a78bfa",

        // 🧊 BORDER / UI - theme-aware
        borderColor: "rgb(var(--color-border) / <alpha-value>)",
      },

      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.1)",
      },

      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [],
};