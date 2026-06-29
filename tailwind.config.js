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
        primary: "#2563eb",
        primaryHover: "#1d4ed8",

        /* ✅ USE VARIABLES */
        surface: "var(--surface)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        borderColor: "var(--border-color)",

        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
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