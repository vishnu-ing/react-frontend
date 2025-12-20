import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../api/authService";

function AuthGuard({ children }) {
  // AC5: Check for token existence
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // AC5: Redirect to login if no token
    return <Navigate to="/login" replace />;
  }

  return <Outlet/>;
}

export default AuthGuard;
