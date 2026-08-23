import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import type { 
  BaseQueryFn, 
  FetchArgs, 
  FetchBaseQueryError 
} from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/auth-slice";
import type { RootState } from "../store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as RootState).auth.token;
    if (!token && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("almaster_auth");
        if (stored) {
          const parsed = JSON.parse(stored);
          token = parsed.token || null;
        }
      } catch {
        // ignore
      }
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

/**
 * Custom base query wrapper to handle global errors like 401 Unauthorized.
 */
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;

    // Do not force-redirect on login or register requests
    const url = typeof args === "string" ? args : args.url;
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthEndpoint) {
      api.dispatch(logout());
      
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && !currentPath.startsWith("/forgot-password") && !currentPath.startsWith("/reset-password")) {
          window.location.href = "/login";
        }
      }
    }
  }

  return result;
};

/**
 * Enhanced base query with automatic retry logic.
 */
export const baseQueryWithRetry = retry(baseQueryWithErrorHandling, {
  maxRetries: 2,
});
