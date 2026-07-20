import axios from "axios";
import { useAuthStore } from "../store/authStore";

let isRedirectingToLogin = false;

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const authorization = error.config?.headers?.Authorization;

    console.error("API Error:", error.response?.data || error.message);

    if (status === 401 && authorization && !isRedirectingToLogin) {
      isRedirectingToLogin = true;

      const { logout } = useAuthStore.getState();
      logout();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.replace("/login");
      }

      setTimeout(() => {
        isRedirectingToLogin = false;
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default api;