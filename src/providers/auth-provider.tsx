"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, setLoading } from "@/redux/slices/auth-slice";
import { CONSTANT } from "@/config/constant";

import { getCookie } from "cookies-next";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrate = async () => {
      dispatch(setLoading(true));
      try {
        if (typeof window !== "undefined") {
          const token = getCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN) as string | undefined;
          const userData = getCookie(CONSTANT.LOCAL_STORAGE_KEYS.USER_DATA) as string | undefined;

          if (token && userData) {
            dispatch(setCredentials({
              user: JSON.parse(decodeURIComponent(userData)),
              token: token,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to hydrate auth state:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    hydrate();
  }, [dispatch]);

  // Always render children so the app renders on the server (SSR/SEO). Auth is
  // hydrated client-side in the effect above; the server HTML and the initial
  // client render both show the unauthenticated state, so there is no
  // hydration mismatch — auth-dependent UI updates after mount.
  return <>{children}</>;
}
