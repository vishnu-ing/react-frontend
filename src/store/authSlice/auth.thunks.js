//Auth Thunk Code goes here

import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:5000/api";

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      return data; // Returns { token, user, message }
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);