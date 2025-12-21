import {
  Paper,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import { resolveFileUrl } from "../../utils/fileUrl";

export default function DriverLicenseSection({  driverLicense }) {
  
  if (!driverLicense?.fileUrl) return null;

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Driver License
      </Typography>

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
    </Paper>
  );
}
