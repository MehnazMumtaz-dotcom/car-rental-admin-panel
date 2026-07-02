import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import Button from "../ui/Button";

export default function Navbar() {
  const notifications =
    useUIStore((state) => state.notifications) || [];

  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const routeConfig = {
    "/": {
      title: "Dashboard",
      showNotification: true,
    },
    "/customers": {
      title: "Customers",
      subtitle: "Manage your customers",
      action: (
        <Button onClick={() => window.dispatchEvent(new Event("openWalkInCustomer"))}>
          + Add Walk-in Customer
        </Button>
      ),
    },
    "/complaints": {
      title: "Complaints",
      subtitle: "Track and resolve complaints",
    },
  };

  const page =
    routeConfig[location.pathname] || {
      title:
        location.pathname
          .split("/")
          .filter(Boolean)
          .pop()
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard",
      subtitle: "",
    };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6">

      <div className="flex items-center gap-2 sm:gap-4 min-w-0">

        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition flex-shrink-0 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>


      <div className="flex items-center gap-3 sm:gap-6">

        {page.action}

        {page.showNotification && (
          <div className="relative cursor-pointer flex-shrink-0">
            <Bell size={20} className="text-gray-600" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-4 px-[4px] bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
