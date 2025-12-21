import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCredentials } from "../store/authSlice/auth.slice";

function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

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
  }, [dispatch, isAuthenticated]);

  // Check authentication from Redux store
  if (!isAuthenticated) {
    // Also check localStorage as fallback
    const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet/>;
}

export default AuthGuard;
