import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import OnboardingApplication from "./pages/OnboardingApplication";
import AuthGuard from "./guards/AuthGuard";
import { authService } from "./api/authService";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/personal-info"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/onboarding"
          element={
            <AuthGuard>
              <OnboardingApplication />
            </AuthGuard>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 - redirect to home or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
