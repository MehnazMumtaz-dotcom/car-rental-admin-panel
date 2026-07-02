/** @type {import('tailwindcss').Config} */
export default {
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

        // ⚫ SIDEBAR (Dark Theme)
        secondary: "#0f172a",
        secondaryLight: "#1e293b",

        // ⚪ BACKGROUNDS
        background: "#f1f5f9",
        surface: "#ffffff",

        // 📝 TEXT COLORS
        textPrimary: "#0f172a",
        textSecondary: "#64748b",

        // 🚦 STATUS COLORS
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",

        // 🧊 BORDER / UI
        borderColor: "#e2e8f0",
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