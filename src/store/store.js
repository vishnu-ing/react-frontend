import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
