import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // AC2: Basic validation (non-empty fields)
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // AC1: Call backend login endpoint
      const data = await authService.login(username, password);

      // AC3: Store token and user data
      authService.setToken(data.token);
      authService.setUser(data.user);

      // AC3: Redirect based on onboarding status
      if (data.user.onboardingStatus === "Approved") {
        navigate("/personal-info");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      // AC4: Display error message
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Employee Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="test-credentials">
          <p>Test credentials:</p>
          <p>
            <strong>Username:</strong> hr1
          </p>
          <p>
            <strong>Password:</strong> password
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
