import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../api/authService";
import { parseJwt } from "../utils/jwt";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const Nav = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const payload = parseJwt(token);
      if (payload && (payload.userId || payload.id || payload.sub)) {
        setUserId(payload.userId || payload.id || payload.sub);
      }
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit">
            <NavLink
              to="/home"
              style={{ color: "black", textDecoration: "none" }}
            >
              Home
            </NavLink>
          </Button>
          <Button color="inherit">
            <NavLink
              to="/personal-info"
              style={{ color: "black", textDecoration: "none" }}
            >
              Profile
            </NavLink>
          </Button>
          <Button color="inherit">
            <NavLink
              to="/onboarding"
              style={{ color: "black", textDecoration: "none" }}
            >
              Onboarding
            </NavLink>
          </Button>
          <Button color="inherit" disabled={!userId}>
            <NavLink
              to="/housing/me"
              style={{ color: "black", textDecoration: "none" }}
            >
              Housing
              </NavLink>
          </Button>
          <Button color="inherit">
            <NavLink
              to="/visa"
              style={{ color: "black", textDecoration: "none" }}
            >
              Visa
            </NavLink>
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button style={{ color: "black", textDecoration: "none" }}>
            <NavLink
              to="/logout"
              style={{ color: "black", textDecoration: "none" }}
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
