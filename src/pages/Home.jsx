import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { logout } from "../store/authSlice/auth.slice";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.userName}! 🎉
          </Typography>

          <Stack spacing={2} sx={{ mt: 3 }}>
            <Box>
              <Typography variant="body1">
                <strong>Role:</strong> {user?.role}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                <strong>Email:</strong> {user?.email}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                <strong>Onboarding Status:</strong> {user?.onboardingStatus}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ mt: 4 }}
          >
            Logout
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home;
