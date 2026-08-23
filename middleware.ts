import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEV_ROUTES = [
  "/human-resources",
  "/project-management",
  "/finances-management",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDevMode =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ENABLE_ALL_SYSTEMS === "true";

  if (!isDevMode) {
    // In production, redirect root to CRM
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL("/client-relations-management", request.url),
      );
    }

    // In production, block direct access to development-only systems
    const isDevRoute = DEV_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isDevRoute) {
      return NextResponse.redirect(
        new URL("/client-relations-management", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png
     * - static files with extensions (e.g. .svg, .png, .jpg)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
