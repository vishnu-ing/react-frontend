import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice/auth.slice";
import LoadingSpinner from "../components/LoadingSpinner";

function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr && !isAuthenticated) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ token, user }));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsChecking(false);
  }, [dispatch, isAuthenticated]);

  if (isChecking) return <LoadingSpinner />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children ? children : <Outlet />;
}

export default AuthGuard;
