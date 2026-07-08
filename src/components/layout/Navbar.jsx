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
      title: "Dashboard Overview",
      showNotification: true,
    },
    "/customers": {
      title: "Customers Directory",
      subtitle: "Manage customer profiles, history, and records.",
      action: (
        <Button onClick={() => window.dispatchEvent(new Event("openWalkInCustomer"))}>
          + Add Walk-in Customer
        </Button>
      ),
    },
    "/complaints": {
      title: "Complaints & SLA Timers",
      subtitle: "Track, assign, resolve tickets and monitor live SLA deadlines.",
    },
    "/bookings": {
      title: "Booking Calendar",
      subtitle: "View, schedule, and organize vehicle reservations.",
    },
    "/subadmins": {
      title: "Sub Admins Management",
      subtitle: "Control team access permissions and manage system roles.",
    },
    "/config": {
      title: "Configuration Panel",
      subtitle: "Adjust your system preferences, pricing, and master settings.",
    },
    "/reports": {
      title: "Analytics & Reports",
      subtitle: "Generate and download financial and analytical data insights.",
    },
    "/profile-settings": {
      title: "Profile Settings",
      subtitle: "Update your password, account details, and security preferences.",
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
      subtitle: "Manage your panel details here.",
    };

  return (
    <header className="h-16 bg-surface border-b border-borderColor flex items-center justify-between px-3 sm:px-6">

      <div className="flex items-center gap-2 sm:gap-4 min-w-0">

        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-background transition flex-shrink-0 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-textPrimary truncate">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-xs text-textSecondary truncate mt-0.5">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">

        {page.action}

        {page.showNotification && (
          <div className="relative cursor-pointer flex-shrink-0">
            <Bell size={20} className="text-textSecondary" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-4 px-[4px] bg-danger text-white text-[9px] flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        )}

      </div>
    </header>
  );
}