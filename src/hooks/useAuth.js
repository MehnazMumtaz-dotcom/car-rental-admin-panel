import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutStore = useAuthStore((state) => state.logout);

  const login = (userData, tokenData) => {
    setAuth(userData, tokenData);
  };

  const logout = () => {
    logoutStore();
    window.location.replace("/login"); 
  };

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated: Boolean(token),
  };
}