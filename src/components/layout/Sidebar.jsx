import {
  LayoutDashboard,
  AlertCircle,
  Calendar,
  Users,
  UserCog,
  Settings,
  BarChart3,
  Timer,
  LogOut,
  Sun,
  Moon,
  Monitor,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  User,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/car-logo.png";
import { useUIStore } from "../../store/uiStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    theme,
    setTheme,
  } = useUIStore();

  const location = useLocation();
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setOpenProfile(false);
    navigate("/login", { replace: true });
  };

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/" },
    { icon: AlertCircle, text: "Complaints", path: "/complaints" },
    { icon: Calendar, text: "Booking Calendar", path: "/bookings" },
    { icon: Users, text: "Customers", path: "/customers" },
    { icon: UserCog, text: "Sub Admins", path: "/subadmins" },
    { icon: Settings, text: "Config Panel", path: "/config" },
    { icon: BarChart3, text: "Reports", path: "/reports" },
    { icon: Timer, text: "SLA Timers", path: "/sla-timers" },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-secondary text-white flex flex-col z-50
        transition-all duration-300
        ${
          sidebarOpen
            ? "w-56 translate-x-0"
            : "w-20 -translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-secondaryLight">
          <div
            className={`flex items-center ${
              sidebarOpen ? "gap-2" : "justify-center w-full"
            }`}
          >
            <img
              src={logo}
              alt="logo"
              className={`w-10 h-10 ${!sidebarOpen ? "mx-auto" : ""}`}
            />

            {sidebarOpen && (
              <div>
                <h1 className="text-sm font-semibold">Car Rental</h1>
                <p className="text-xs text-textSecondary">Admin Panel</p>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-secondaryLight"
            >
              {sidebarOpen ? (
                <ChevronsLeft size={18} />
              ) : (
                <ChevronsRight size={18} />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            const active = item.path === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(item.path);

            return (
              <SidebarItem
                key={item.path}
                icon={<Icon size={18} />}
                text={item.text}
                path={item.path}
                open={sidebarOpen}
                active={active}
                onClick={handleItemClick}
              />
            );
          })}
        </nav>
        <div
          ref={profileRef}
          className="relative border-t border-secondaryLight p-3"
        >
          <div
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:bg-secondaryLight p-2 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>

              {sidebarOpen && (
                <div className="text-sm">
                  <p className="font-medium">{user?.name || "Admin"}</p>
                  <p className="text-xs text-textSecondary truncate w-32">
                    {user?.email || "admin@email.com"}
                  </p>
                </div>
              )}
            </div>

            {sidebarOpen && (
              <ChevronUp
                size={16}
                className={`transition ${
                  openProfile ? "rotate-180" : ""
                }`}
              />
            )}
          </div>

          {openProfile && (
            <div className="absolute bottom-full left-2 right-2 mb-2 bg-white text-black rounded-xl shadow-xl p-2 z-50 flex flex-col gap-1">
              
              <Link
                to="/profile-settings"
                onClick={() => setOpenProfile(false)}
                className="w-full flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 rounded-lg text-sm transition"
              >
                <User size={16} />
                Profile Settings
              </Link>

              {/* Separator */}
              <hr className="border-gray-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 rounded-lg text-sm transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon, text, path, open, active, onClick }) {
  return (
    <Link to={path} onClick={onClick}>
      <div
        className={`flex items-center ${
          open ? "gap-3 justify-start" : "justify-center"
        } px-3 py-2 rounded-lg
        ${
          active
            ? "bg-primary text-white"
            : "hover:bg-secondaryLight text-white"
        }`}
      >
        {icon}
        {open && <span>{text}</span>}
      </div>
    </Link>
  );
}