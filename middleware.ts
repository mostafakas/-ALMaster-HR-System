import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/cookies";

// Every dashboard module requires a signed-in session. Previously only
// client-relations-management was wrapped client-side in <AuthGuard>, and
// this middleware unconditionally called NextResponse.next() for everything
// — i.e. it did nothing. That meant /human-resources/*, /project-management/*
// and /finances-management/* rendered fully for anyone, logged in or not.
//
// NOTE: this is a cheap *presence* check on the httpOnly cookie, not a full
// signature/expiry verification — middleware here intentionally stays fast
// and framework-agnostic. The actual authorization decision (token
// signature + expiry) is enforced server-side on every API route via
// lib/auth/require-auth.ts, which is the real security boundary. This
// middleware exists purely to stop an unauthenticated browser from ever
// rendering the dashboard shell in the first place.
const PROTECTED_PREFIXES = [
  "/human-resources",
  "/project-management",
  "/finances-management",
  "/client-relations-management",
];

// The root "/" is the module-selector screen (SystemSelector) — it's an
// exact match, not a prefix, since we don't want to accidentally swallow
// unrelated top-level routes.
const PROTECTED_EXACT = ["/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    PROTECTED_EXACT.includes(pathname) ||
    PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));

  if (isProtected) {
    const hasCookie = request.cookies.has(AUTH_COOKIE_NAME);
    const hasAuthHeader = request.headers.get("Authorization");
    if (!hasCookie && !hasAuthHeader) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes — these enforce their own auth via require-auth.ts)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png
     * - static files with extensions (e.g. .svg, .png, .jpg)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
