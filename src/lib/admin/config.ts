/**
 * Admin-side configuration. Centralises env access so the rest of the admin
 * code never reads `process.env` directly.
 */

const required = (name: string, value: string | undefined, fallback?: string): string => {
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    console.warn(`Warning: Missing env var ${name}, using empty string fallback.`);
    return "";
  }
  return value;
};

export const ADMIN_CONFIG = {
  /** Backend API base URL, server-side only. */
  apiUrl: required("API_URL", process.env.API_URL, "http://localhost:5000"),

  /** httpOnly cookie holding the JWT access token used to call the backend. */
  cookies: {
    access: "tc_admin_access",
    user: "tc_admin_user",
  },

  /** Access cookie lifetime — defaults to 1 day to mirror the backend. */
  accessCookieMaxAgeSeconds: Number(
    process.env.ADMIN_ACCESS_COOKIE_MAX_AGE_SECONDS ?? 60 * 60 * 24,
  ),

  /** Where unauthenticated users get redirected. */
  loginPath: "/admin/signin",

  /** Where users land after a successful login. */
  dashboardPath: "/admin/dashboard",
};
