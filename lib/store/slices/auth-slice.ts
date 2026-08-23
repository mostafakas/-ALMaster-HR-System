import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("almaster_auth");
          if (stored) {
            const parsed = JSON.parse(stored);
            state.user = parsed.user ?? null;
            state.token = parsed.token ?? null;
            state.isAuthenticated = !!parsed.token;
          }
        } catch {
          // ignore corrupted storage
        }
      }
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("almaster_auth", JSON.stringify({ user, token }));
        } catch {
          // ignore
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("almaster_auth");
        } catch {
          // ignore
        }
      }
    },
  },
});

export const { initializeAuth, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
