import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "../api/auth.interceptor";
import { registerUser } from "../store/authSlice/auth.thunks";
import { clearError, setError } from "../store/authSlice/auth.slice";

function Registration() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const navigatedRef = useRef(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, registrationSuccess, registrationMessage } =
    useSelector((state) => state.auth);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      dispatch(setError("Registration link is invalid or missing token"));
      navigate("/login", { replace: true });
      return;
    }

    // FIX #1: Call correct endpoint - /auth/register with query param
    axios
      .get("/auth/register", { params: { token } })
      .then((res) => {
        const emailFromServer = res?.data?.email;
        if (emailFromServer) {
          setEmail(emailFromServer);
          setTokenValid(true); // FIX #2: Mark token as valid
        } else {
          throw new Error("Invalid registration token");
        }
      })
      .catch((e) => {
        // FIX #2: Redirect on invalid token
        const msg =
          e?.response?.data?.message || e.message || "Token validation failed";
        dispatch(setError(msg));
        navigate("/login", { replace: true });
      });
  }, [token, dispatch, navigate]);

  // Redirect after successful registration
  useEffect(() => {
    if (registrationSuccess && !navigatedRef.current) {
      navigatedRef.current = true;
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !username.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !email.trim()
    ) {
      dispatch(setError("Please fill in all fields"));
      return;
    }
    if (password !== confirmPassword) {
      dispatch(setError("Passwords do not match"));
      return;
    }
    dispatch(registerUser({ username, email, password, token }));
  };

  // Don't show form until token is validated
  if (!tokenValid) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Validating registration token...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Employee Registration
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="username"
            />

            {/* FIX #3: Added onChange handler to make email editable */}
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !email}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <Snackbar
              open={registrationSuccess}
              autoHideDuration={2000}
              message={
                registrationMessage ||
                "Registration successful! Redirecting to login..."
              }
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Registration;
