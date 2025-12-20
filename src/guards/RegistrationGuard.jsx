import { Navigate, Outlet, useParams } from "react-router-dom";
import { RegistrationAuth } from "../api/authService";

//      Must Implement Registration Authorization
function RegistrationGuard({ children }) {
  const {token} = useParams();
  const validRegistration = RegistrationAuth.validateRegistrationToken("token");
  if(!validRegistration){
   return <Navigate to="/login" replace />;
  }
  return <Outlet />
}

export default RegistrationGuard;
