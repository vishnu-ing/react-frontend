import { Outlet, Navigate } from 'react-router-dom';

const AuthGuard = () => {
  const isLoggedIn = true;

  return isLoggedIn ? <Outlet /> : <Navigate to='/' />;
};

export default AuthGuard;
