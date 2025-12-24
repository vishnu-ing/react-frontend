
import {
  Box,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export default function AddressSection({ data, setDraft, isEditing , setAbsoluteError}) {
  const address = data.address || {};

  const update = (key, value) => {
    setDraft({
      ...data,
      address: {
        ...address,
        [key]: value,
      },
    });
  };
  const handleError = (key,e) => {
    if (e.target.value == "") {
      setAbsoluteError(true);
      update(key, e.target.value);
      return;
    }
    setAbsoluteError(false);
    update(key, e.target.value);
  }
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Address
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Building / Apt #"
          value={address.buildingApt || ""}
          disabled={!isEditing}
          onChange={(e) => handleError("buildingApt", e)}
          fullWidth
          required
        />

        <TextField
          label="Street"
          value={address.street || ""}
          disabled={!isEditing}
          onChange={(e) => handleError("street", e)}
          fullWidth
          required
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="City"
            value={address.city || ""}
            disabled={!isEditing}
            onChange={(e) => handleError("city", e)}
            fullWidth
            required
          />

          <TextField
            label="State"
            value={address.state || ""}
            disabled={!isEditing}
            onChange={(e) => handleError("state", e)}
            fullWidth
            required
          />

          <TextField
            label="Zip Code"
            value={address.zip || ""}
            disabled={!isEditing}
            onChange={(e) => handleError("zip", e)}
            fullWidth
            required
          />
        </Stack>
      </Stack>
    </Paper>
  );
}