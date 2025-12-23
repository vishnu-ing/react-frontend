import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCredentials } from "../store/authSlice/auth.slice";
import { useState } from "react";

function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  // On mount, check localStorage and rehydrate Redux state
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

  if (isChecking && !isAuthenticated) {
    // Still checking auth state, don't render anything yet
    return null;
  }

  if (!isAuthenticated) {
    // Fallback: check localStorage for token
    const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}

export default AuthGuard;
