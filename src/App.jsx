import React from "react";
import AppRoutes from "./routes/AppRoutes";
import ThemeInitializer from "./ThemeInitializer";

export default function App() {
  return (
    <>
      <ThemeInitializer />
      <AppRoutes />
    </>
  );
}