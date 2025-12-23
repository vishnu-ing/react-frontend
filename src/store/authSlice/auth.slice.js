//Auth slice code goes here

import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./auth.thunks";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationSuccess: false,
  registrationMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    // Set credentials from localStorage (for page refresh)
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Set error manually
    setError: (state, action) => {
      state.error = action.payload || null;
    },
    // Clear registration status
    clearRegistration: (state) => {
      state.registrationSuccess = false;
      state.registrationMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login fulfilled
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Persist to localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      // Login rejected
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })
      // Register pending
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
        state.registrationMessage = null;
      })
      // Register fulfilled
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.registrationSuccess = true;
        state.registrationMessage = action.payload?.message || "Registered";
      })
      // Register rejected
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
        state.registrationSuccess = false;
      });
  },
});

export const { logout, setCredentials, clearError, setError, clearRegistration } = authSlice.actions;
export default authSlice.reducer;
