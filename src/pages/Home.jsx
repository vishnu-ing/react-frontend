import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome, {user?.username}! </h1>
        <div className="user-info">
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Onboarding Status:</strong> {user?.onboardingStatus}
          </p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
