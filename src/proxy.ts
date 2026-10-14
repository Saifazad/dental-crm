import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE_NAME } from "@/lib/auth";

// Public auth routes that don't require authentication
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isRootOrDashboard = pathname === "/" || pathname.startsWith("/dashboard");

  // 1. If user is already authenticated and visits /login or /register, redirect to dashboard /
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If user is NOT authenticated and visits protected dashboard routes, redirect to /login
  if (!token && isRootOrDashboard) {
    const loginUrl = new URL("/login", request.url);
    // Keep returnUrl if needed
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets (.svg, .png, .jpg, .ico, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
