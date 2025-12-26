import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import OnboardingApplication from './pages/OnboardingApplication';
import AuthGuard from './guards/AuthGuard';
import { authService } from './api/authService';
import './App.css';
import VisaStatus from "./pages/VisaStatus";
import Layout from './components/Layout';
import PersonalProfile from './pages/PersonalProfile';
import Logout from './pages/Logout';
import Registration from './pages/Registration';
import FacilityReports from './components/FacilityReports/FacilityReports';
import FacilityReportDetail from './components/FacilityReportDetail/FacilityReportDetail';
import HousingDetails from './components/HousingDetails/HousingDetails';

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
            <Route path="/facility-reports" element={<FacilityReports />} />
            <Route
              path="/facility-reports/:reportId"
              element={<FacilityReportDetail />}
            />
            <Route path="/housing/me" element={<HousingDetails />} />
            <Route path="/visa" element={<VisaStatus />} />
          </Route>
        </Route>

        {/* Public registration route */}
        <Route path="/register" element={<Registration />} />
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 - redirect to home or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
