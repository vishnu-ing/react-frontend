import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import OnboardingApplication from "./pages/OnboardingApplication";
import AuthGuard from "./guards/AuthGuard";
import Layout from "./components/Layout";
import PersonalProfile from "./pages/PersonalProfile";
import Logout from "./pages/Logout";
import Registration from "./pages/Registration";
import Starter from "./components/Starter";
import HousingDetails from "./components/HousingDetails/HousingDetails";
import FacilityReportsPage from "./components/FacilityReports/FacilityReports";
import FacilityReportDetail from "./components/FacilityReportDetail/FacilityReportDetail";
import RegistrationGuard from "./guards/RegistrationGuard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected routes */}
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/personal-info" element={<PersonalProfile />} />
            <Route path="/onboarding" element={<OnboardingApplication />} />
            <Route path="/" element={<Starter />}></Route>
            <Route path="/housing/:userId" element={<HousingDetails />}></Route>
            <Route
              path="/facility-reports"
              element={<FacilityReportsPage />}
            ></Route>
            <Route
              path="/facility-reports/:reportId"
              element={<FacilityReportDetail />}
            ></Route>
          </Route>
        </Route>

        {/* Protected routes */}
        <Route element={<RegistrationGuard />}>
          <Route path="/registration/:token" element={<Registration />} />
        </Route>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 - redirect to home or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
