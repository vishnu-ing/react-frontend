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
  Popover,
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

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [usernameAnchor, setUsernameAnchor] = useState(null);
  const [passwordAnchor, setPasswordAnchor] = useState(null);
  const [confirmPasswordAnchor, setConfirmPasswordAnchor] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, registrationSuccess, registrationMessage } =
    useSelector((state) => state.auth);

  const validateUsername = (value) => {
    if (value.length === 0) return "";
    if (value.length < 6) return "Username must be at least 6 characters";
    if (value.length > 12) return "Username must be at most 12 characters";
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return "Username must be alphanumeric (letters and numbers only)";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (value.length === 0) return "";
    if (!/[a-z]/.test(value)) return "Password must contain a lowercase letter";
    if (!/[A-Z]/.test(value))
      return "Password must contain an uppercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain a number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Password must contain a special character";
    }
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateConfirmPassword = (value, passwordValue) => {
    if (value.length === 0) return "";
    if (value !== passwordValue) return "Passwords do not match";
    return "";
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    const element = e.currentTarget;

    setUsername(value);

    const error = validateUsername(value);
    setUsernameError(error);

    if (error && !usernameAnchor) {
      setUsernameAnchor(element);
    } else if (!error) {
      setUsernameAnchor(null);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const element = e.currentTarget;

    setPassword(value);

    const error = validatePassword(value);
    setPasswordError(error);

    if (error && !passwordAnchor) {
      setPasswordAnchor(element);
    } else if (!error) {
      setPasswordAnchor(null);
    }

    // Also revalidate confirm password
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(confirmPassword, value);
      setConfirmPasswordError(confirmError);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    const element = e.currentTarget;

    setConfirmPassword(value);

    const error = validateConfirmPassword(value, password);
    setConfirmPasswordError(error);

    if (error && !confirmPasswordAnchor) {
      setConfirmPasswordAnchor(element);
    } else if (!error) {
      setConfirmPasswordAnchor(null);
    }
  };

  useEffect(() => {
    if (!token) {
      dispatch(setError("Registration link is invalid or missing token"));
      navigate("/login", { replace: true });
      return;
    }

    axios
      .get("/auth/register", { params: { token } })
      .then((res) => {
        const emailFromServer = res?.data?.email;
        if (emailFromServer) {
          setEmail(emailFromServer);
          setTokenValid(true);
        } else {
          throw new Error("Invalid registration token");
        }
      })
      .catch((e) => {
        const msg =
          e?.response?.data?.message || e.message || "Token validation failed";
        dispatch(setError(msg));
        navigate("/login", { replace: true });
      });
  }, [token, dispatch, navigate]);

  useEffect(() => {
    if (registrationSuccess && !navigatedRef.current) {
      navigatedRef.current = true;
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, navigate]);

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

    if (usernameError || passwordError || confirmPasswordError) {
      dispatch(setError("Please fix validation errors before submitting"));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(setError("Passwords do not match"));
      return;
    }
    dispatch(registerUser({ username, email, password, token }));
  };

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
              onChange={handleUsernameChange}
              margin="normal"
              required
              disabled={loading}
              autoComplete="username"
              error={Boolean(usernameError)}
            />

            <Popover
              open={Boolean(usernameAnchor && usernameError)}
              anchorEl={usernameAnchor}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              disableAutoFocus
              disableEnforceFocus
              sx={{ pointerEvents: "none" }}
            >
              <Alert severity="error" sx={{ m: 1, minWidth: 250 }}>
                {usernameError}
              </Alert>
            </Popover>

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
              onChange={handlePasswordChange}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
              error={Boolean(passwordError)}
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

            <Popover
              open={Boolean(passwordAnchor && passwordError)}
              anchorEl={passwordAnchor}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              disableAutoFocus
              disableEnforceFocus
              sx={{ pointerEvents: "none" }}
            >
              <Alert severity="error" sx={{ m: 1, minWidth: 250 }}>
                {passwordError}
              </Alert>
            </Popover>

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
              error={Boolean(confirmPasswordError)}
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

            <Popover
              open={Boolean(confirmPasswordAnchor && confirmPasswordError)}
              anchorEl={confirmPasswordAnchor}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              disableAutoFocus
              disableEnforceFocus
              sx={{ pointerEvents: "none" }}
            >
              <Alert severity="error" sx={{ m: 1, minWidth: 250 }}>
                {confirmPasswordError}
              </Alert>
            </Popover>

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
              disabled={
                loading ||
                !email ||
                Boolean(usernameError) ||
                Boolean(passwordError) ||
                Boolean(confirmPasswordError)
              }
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
