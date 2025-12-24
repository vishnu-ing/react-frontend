import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Popover,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../store/authSlice/auth.thunks';
import { clearError } from '../store/authSlice/auth.slice';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameAnchor, setUsernameAnchor] = useState(null);
  const [passwordAnchor, setPasswordAnchor] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const validateUsername = (value) => {
    if (value.length === 0) return '';
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return 'Special characters are not allowed. Username must be alphanumeric (letters and numbers only)';
    }
    if (value.length < 6) return 'Username must be at least 6 characters';
    if (value.length > 12) return 'Username must be at most 12 characters';
    return '';
  };

  const validatePassword = (value) => {
    if (value.length === 0) return '';
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
    if (!/[A-Z]/.test(value))
      return 'Password must contain an uppercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain a number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return 'Password must contain a special character';
    }
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
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
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.onboardingStatus === 'Approved') {
        navigate('/personal-info');
      } else {
        navigate('/onboarding');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    if (usernameError || passwordError) {
      return;
    }

    dispatch(loginUser({ username, password }));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Employee Login
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
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              disableAutoFocus
              disableEnforceFocus
              sx={{ pointerEvents: 'none' }}
            >
              <Alert severity="error" sx={{ m: 1, minWidth: 250 }}>
                {usernameError}
              </Alert>
            </Popover>

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              margin="normal"
              required
              disabled={loading}
              autoComplete="current-password"
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
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              disableAutoFocus
              disableEnforceFocus
              sx={{ pointerEvents: 'none' }}
            >
              <Alert severity="error" sx={{ m: 1, minWidth: 250 }}>
                {passwordError}
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
                loading || Boolean(usernameError) || Boolean(passwordError)
              }
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
