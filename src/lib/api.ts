import { API } from "@/config/api";
import { CONSTANT } from "@/config/constant";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const api = axios.create({
  baseURL: API.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    let token;

    if (typeof window === "undefined") {
      // Server-side: Use next/headers (dynamic import to avoid bundling on client)
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN)?.value;
      } catch (error) {
        // Silent fail: possibly called during static generation or build time
      }
    } else {
      // Client-side: Use cookies-next
      token = getCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor for handling token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== "undefined") {
          const refreshToken = getCookie("twelve-creative-refresh-token");

          if (refreshToken) {
            const response = await axios.post(
              `${API.BASE_URL}/customers/refresh-token`,
              { refreshToken },
              { timeout: 10000 },
            );

            const newAccessToken = response.data.data.accessToken;
            const newRefreshToken = response.data.data.refreshToken;
            setCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN, newAccessToken);
            if (newRefreshToken) {
              setCookie("twelve-creative-refresh-token", newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect only if not already on auth pages
        if (typeof window !== "undefined") {
          deleteCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
          deleteCookie("twelve-creative-refresh-token");
          if (!window.location.pathname.startsWith("/sign-")) {
            window.location.href = "/sign-in";
          }
        }
        return Promise.reject(refreshError);
      }

      // If no refresh token exists, clear state
      if (typeof window !== "undefined") {
        deleteCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        deleteCookie("twelve-creative-refresh-token");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
