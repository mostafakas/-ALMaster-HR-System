import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export interface AuthedUser {
  userId: string;
}

/**
 * Extracts and verifies the auth token from a request.
 * Accepts either:
 *  - Authorization: Bearer <token>  (used by the RTK Query client via localStorage)
 *  - the `almaster_token` httpOnly cookie (set by /api/auth/login and /api/auth/register)
 *
 * Returns the decoded payload on success, or null if missing/invalid.
 * This does NOT throw — callers should check for null and return a 401 themselves
 * via `unauthorizedResponse()` so every route can log/customize its own message.
 */
export function getAuthedUser(req: Request): AuthedUser | null {
  let token: string | null = null;

  const authHeader = req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }

  if (!token) {
    // Fall back to the httpOnly cookie set at login/register time.
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)almaster_token=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  if (!token) return null;

  const decoded = verifyToken(token) as { userId: string } | null;
  if (!decoded || !decoded.userId) return null;

  return { userId: decoded.userId };
}

/**
 * Shorthand for route handlers: returns the authed user, or writes a 401
 * NextResponse to `res` (caller must `return` it) if unauthenticated.
 *
 * Usage:
 *   const auth = getAuthedUser(request);
 *   if (!auth) return unauthorizedResponse();
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized — please sign in again." },
    { status: 401 }
  );
}
