import {
  Paper,
  Typography,
  Stack,
  TextField,
  Chip,
  Button,
  Box,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import { resolveFileUrl } from "../../utils/fileUrl";
export default function VisaDocumentsSection({ visaDocuments = [] }) {
  if (!visaDocuments.length) return null;

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Visa Documents
      </Typography>

      <Stack spacing={3}>
        {visaDocuments.map((doc, idx) => (
          <Box
            key={idx}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              p: 2,
            }}
          >
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Document Type"
                  value={doc.type}
                  disabled
                  fullWidth
                />

                <TextField
                  label="Start Date"
                  value={doc.startDate}
                  disabled
                  fullWidth
                />

                <TextField
                  label="End Date"
                  value={doc.endDate}
                  disabled
                  fullWidth
                />
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                

                <Stack direction="row" spacing={2}>
                  {/* Open */}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    href={resolveFileUrl(doc.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </Button>

                  {/* Download */}
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    href={resolveFileUrl(doc.fileUrl)}
                    download
                  >
                    Download
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
