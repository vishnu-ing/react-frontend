//Auth Thunk Code goes here

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/auth.interceptor";

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login", { username, password });
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Network error";
      return rejectWithValue(message);
    }
  }
);
