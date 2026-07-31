import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RequirePermission({ permission }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (user?.role === "ADMIN") {
    return <Outlet />;
  }

  const userPermissions = Array.isArray(user?.permissions)
    ? user.permissions
    : [];

  const hasAccess = userPermissions.includes(permission);

  if (!hasAccess) {
    return <Navigate to="/403" replace state={{ from: location }} />;
  }

  return <Outlet />;
}