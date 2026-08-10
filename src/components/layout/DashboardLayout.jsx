import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useUIStore } from "../../store/uiStore";
import { useSocketStore } from "../../store/socketStore";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const { sidebarOpen } = useUIStore();
  const connectSocket = useSocketStore((s) => s.connectSocket);
  const disconnectSocket = useSocketStore((s) => s.disconnectSocket);

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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