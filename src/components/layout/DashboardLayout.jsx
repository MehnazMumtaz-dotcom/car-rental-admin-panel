import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useUIStore } from "../../store/uiStore";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300
        ${sidebarOpen ? "md:ml-56" : "md:ml-20"}`}
      >
        <Navbar />
        <main
          className="
            flex-1 
            min-w-0 
            overflow-y-auto 
            overflow-x-hidden 
            p-4 sm:p-6

            /* hide scrollbar (cross-browser) */
            scrollbar-hide
          "
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;