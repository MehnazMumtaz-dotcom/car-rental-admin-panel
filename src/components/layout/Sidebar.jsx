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
    setSidebarOpen, // ✅ NEW
    theme,
    setTheme,
    isMobile,
  } = useUIStore();

  const location = useLocation();
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  // ✅ FIX 1: App load pe mobile sidebar closed
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // ✅ FIX 2: Route change pe auto close
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location]);

  // outside click profile close
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

  // ✅ FIX 3: Click pe close
  const handleItemClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/" },
    { icon: AlertCircle, text: "Complaints", path: "/complaints" },
    { icon: Calendar, text: "Booking Calendar", path: "/bookings" },
    { icon: Users, text: "Customers", path: "/customers" },
    { icon: UserCog, text: "Sub Admins", path: "/admins" },
    { icon: Settings, text: "Config Panel", path: "/config" },
    { icon: BarChart3, text: "Reports", path: "/reports" },
    { icon: Timer, text: "SLA Timers", path: "/sla" },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)} // ✅ FIX
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
        {/* LOGO */}
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
              onClick={toggleSidebar} // ✅ desktop pe toggle sahi hai
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

        {/* MENU */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

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

        {/* PROFILE */}
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
            <div className="absolute bottom-full left-2 right-2 mb-2 bg-white text-black rounded-xl shadow-xl p-4 z-50">
              <div className="mb-3">
                <p className="font-semibold text-sm">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "admin@email.com"}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">Appearance</p>

                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 py-1 rounded ${
                      theme === "light" ? "bg-white shadow" : ""
                    }`}
                  >
                    <Sun size={14} />
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 py-1 rounded ${
                      theme === "dark" ? "bg-white shadow" : ""
                    }`}
                  >
                    <Moon size={14} />
                  </button>

                  <button
                    onClick={() => setTheme("system")}
                    className={`flex-1 py-1 rounded ${
                      theme === "system" ? "bg-white shadow" : ""
                    }`}
                  >
                    <Monitor size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 rounded-lg text-sm"
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