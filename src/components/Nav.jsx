import { NavLink, Navigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

const Nav = () => {
  const { onboardingStatus, workAuth } = useSelector(
    (state) => state.auth.user
  );
  if (onboardingStatus !== "Approved") return <Navigate to="/onboarding" replace />;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit">
            <NavLink
              to="/profile"
              style={{ color: "white", textDecoration: "none" }}
            >
              Profile
            </NavLink>
          </Button>
          <Button color="inherit">
            <NavLink
              to="/housing/me"
              style={{ color: "white", textDecoration: "none" }}
            >
              Housing
            </NavLink>
          </Button>
          {workAuth === "F1" && (
            <Button color="inherit">
              <NavLink
                to="/visa"
                style={{ color: "white", textDecoration: "none" }}
              >
                Visa
              </NavLink>
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button style={{ color: "white", textDecoration: "none" }}>
            <NavLink
              to="/logout"
              style={{ color: "white", textDecoration: "none" }}
            >
              Log out
            </NavLink>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Nav;
