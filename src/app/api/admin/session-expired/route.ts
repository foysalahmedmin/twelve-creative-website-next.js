/**
 * Clears the admin session cookies and redirects to the login page.
 *
 * `apiFetch` redirects here when the backend returns 401 for an authenticated
 * admin call. Cookie mutation is not allowed during an RSC/layout render, so
 * the deletion has to happen in a Route Handler (which the proxy skips for
 * `/api/*`). Without this, the stale cookie would survive and the proxy would
 * bounce the user from `/admin/signin` back to the dashboard in a loop.
 */

import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_CONFIG } from "@/lib/admin/config";

export function GET(request: NextRequest) {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") ?? "";

  const url = request.nextUrl.clone();
  url.pathname = ADMIN_CONFIG.loginPath;
  url.search =
    callbackUrl && callbackUrl.startsWith("/admin")
      ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "";

  const res = NextResponse.redirect(url);
  res.cookies.delete(ADMIN_CONFIG.cookies.access);
  res.cookies.delete(ADMIN_CONFIG.cookies.user);
  return res;
}
