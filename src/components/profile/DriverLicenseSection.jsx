import { Paper, Typography, Stack, Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import { resolveFileUrl } from "../../utils/fileUrl";

export default function DriverLicenseSection({
  driverLicense,
  isEditing,
  data,
  setDraft,
}) {
  const driverData = data.driverlicense || {};

  if (!driverLicense?.fileUrl) return null;

  const update = (key, value) => {
    setDraft({
      ...data,
      driverlicense: { ...driverData, [key]: value },
    });
    
  };

  return (
    <Paper elevation={2} sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Driver License
      </Typography>

      {isEditing && (
        <Button component="label" variant="outlined">
          Upload
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              // keep the File object so parent can upload it on Save
              update("fileUrl", file);
            }}
          />
        </Button>
      )}

      {driverLicense?.fileUrl && (
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            href={resolveFileUrl(driverLicense.fileUrl)}
            target="_blank"
            rel="noreferrer"
          >
            Open
          </Button>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            href={resolveFileUrl(driverLicense.fileUrl)}
            download
          >
            Download
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
