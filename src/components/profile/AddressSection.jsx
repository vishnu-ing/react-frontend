
import {
  Box,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export default function AddressSection({ data, setDraft, isEditing }) {
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
          onChange={(e) => update("buildingApt", e.target.value)}
          fullWidth
        />

        <TextField
          label="Street"
          value={address.street || ""}
          disabled={!isEditing}
          onChange={(e) => update("street", e.target.value)}
          fullWidth
          required
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="City"
            value={address.city || ""}
            disabled={!isEditing}
            onChange={(e) => update("city", e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="State"
            value={address.state || ""}
            disabled={!isEditing}
            onChange={(e) => update("state", e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Zip Code"
            value={address.zip || ""}
            disabled={!isEditing}
            onChange={(e) => update("zip", e.target.value)}
            fullWidth
            required
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
