import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";

function Logout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
    const handleConfirm = () => {
        authService.removeToken();
        return navigate('/login')
    }
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Warning
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to log out?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Logout;
