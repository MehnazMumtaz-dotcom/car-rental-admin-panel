import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
