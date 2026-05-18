import { NextRequest, NextResponse } from "next/server";

/**
 * Gate every `/admin/*` request that isn't `/admin/login` behind an auth cookie.
 *
 * This runs on the edge so we only check cookie presence — full JWT verification
 * happens server-side in the admin layout via `requireAdminSession()`.
 */

const ACCESS_COOKIE = "tc_admin_access";
const LOGIN_PATH = "/admin/login";
const DASHBOARD_PATH = "/admin/dashboard";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasSession = req.cookies.has(ACCESS_COOKIE);

  if (pathname === LOGIN_PATH) {
    // If already logged in, bounce to dashboard instead of re-showing login.
    if (hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = DASHBOARD_PATH;
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      url.search = `?callbackUrl=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
