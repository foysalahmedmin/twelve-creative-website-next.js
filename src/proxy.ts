import { isPageEnabled } from "@/config/features";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ACCESS_COOKIE = "tc_admin_access";
const LOGIN_PATH = "/admin/signin";
const DASHBOARD_PATH = "/admin/dashboard";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Skip system paths, assets, and the coming-soon page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/api") ||
    pathname === "/coming-soon"
  ) {
    return NextResponse.next();
  }

  // 2. Admin Authentication Logic
  if (pathname === LOGIN_PATH) {
    const hasSession = request.cookies.has(ACCESS_COOKIE);
    if (hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = DASHBOARD_PATH;
      url.search = "";
      return NextResponse.redirect(url);
    }
  } else if (pathname.startsWith("/admin")) {
    const hasSession = request.cookies.has(ACCESS_COOKIE);
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      url.search = `?callbackUrl=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
  }

  // 3. Feature Flags: Check if the current page is enabled
  const isEnabled = isPageEnabled(pathname);

  // 4. If disabled, rewrite to the coming-soon page
  if (!isEnabled) {
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.searchParams.set("from", pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
