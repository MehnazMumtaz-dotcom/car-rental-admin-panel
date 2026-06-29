import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useUIStore } from "../../store/uiStore";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

     <Sidebar />

      <div
        className={`flex flex-col flex-1 transition-all duration-300
        ${sidebarOpen ? "md:ml-56" : "md:ml-20"} ml-0 w-full`}
      >
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">

          {children || <Outlet />}

        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;