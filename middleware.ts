import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEV_ROUTES = [
  "/human-resources",
  "/project-management",
  "/finances-management",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // All systems are now enabled in production
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
