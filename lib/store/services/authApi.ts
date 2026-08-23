import { baseApi } from "./baseApi";
import { setCredentials, logout, type User } from "../slices/auth-slice";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role?: string;
  avatarUrl?: string;
}

export interface BackendUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: BackendUser;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Auth", "User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const payload = (data as any)?.data || data;
          const rawUser = payload?.user;
          const token = payload?.accessToken || payload?.token;
          if (rawUser && token) {
            const user: User = {
              id: rawUser.id,
              name: rawUser.fullName || rawUser.name || rawUser.email,
              email: rawUser.email,
              role: rawUser.role,
              avatar: rawUser.avatarUrl || undefined,
            };
            dispatch(setCredentials({ user, token }));
          }
        } catch {
          // ignore rejected
        }
      },
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Auth", "User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const payload = (data as any)?.data || data;
          const rawUser = payload?.user;
          const token = payload?.accessToken || payload?.token;
          if (rawUser && token) {
            const user: User = {
              id: rawUser.id,
              name: rawUser.fullName || rawUser.name || rawUser.email,
              email: rawUser.email,
              role: rawUser.role,
              avatar: rawUser.avatarUrl || undefined,
            };
            dispatch(setCredentials({ user, token }));
          }
        } catch {
          // ignore rejected
        }
      },
    }),

    getMe: builder.query<BackendUser, void>({
      query: () => "/auth/me",
      transformResponse: (response: any) => response?.data || response,
      providesTags: ["Auth", "User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
