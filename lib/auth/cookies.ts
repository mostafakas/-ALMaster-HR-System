export const AUTH_COOKIE_NAME = "almaster_token";

/**
 * Builds a Set-Cookie header value for the auth token.
 * httpOnly -> not readable by client-side JS (mitigates token theft via XSS).
 * sameSite=lax -> sent on top-level navigations, blocked on cross-site POSTs (CSRF mitigation).
 * secure -> only sent over HTTPS in production.
 *
 * This is issued ALONGSIDE the existing JSON { accessToken } response (the
 * frontend still stores that token in Redux/localStorage for the
 * Authorization header used by RTK Query) so nothing in the client breaks.
 * The cookie exists so that (a) middleware can do a cheap presence check to
 * redirect unauthenticated page loads, and (b) API routes have a second,
 * harder-to-steal way to authenticate.
 */
export function buildAuthCookie(token: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const parts = [
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function buildClearAuthCookie() {
  const parts = [
    `${AUTH_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}
