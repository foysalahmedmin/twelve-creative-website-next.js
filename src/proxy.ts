import { isPageEnabled } from "@/config/features";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip system paths, assets, and the coming-soon page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/api") ||
    pathname === "/coming-soon"
  ) {
    return NextResponse.next();
  }

  // 2. Check if the current page is enabled in the features config
  const isEnabled = isPageEnabled(pathname);

  // 3. If disabled, rewrite to the coming-soon page
  if (!isEnabled) {
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.searchParams.set("from", pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Optionally, you can limit which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
