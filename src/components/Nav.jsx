import { Link, NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const Nav = () => {
  const name = "Will";

  return (
    // <nav>
    //   {/* Do not use the regular <a> tag because <a> tag when clicked, will refresh the page */}
    //   <Link to='/'>Home</Link>
    //   <br />
    //   <Link to={`/profile/${name}`}>Profile</Link>

    //   {/* NavLink is the same as the Link component, except it automatically detects if the current url is active, if so, it will automatically attach an 'active' class to the link */}
    //   {/* <NavLink to='/'>Home</NavLink>
    //   <br />
    //   <NavLink to={`/profile/${name}`}>Profile</NavLink> */}
    // </nav>
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
