import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/auth.slice";
import userReducer from "./userSlice/user.slice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
