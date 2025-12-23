import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import { resolveFileUrl } from "../../utils/fileUrl";

const VISA_TYPES = [
  "OPT Receipt",
  "EAD Card",
  "I-20",
  "I-94",
  "I-983",
  "Other",
];

export default function VisaDocumentsSection({
  visaDocuments = [],
  data,
  setDraft,
  isEditing,
  setAbsoluteError,
}) {
  if (!visaDocuments.length) return null;

  // ===== update helper (index-aware) =====
  const updateDoc = (idx, key, value) => {
    const updated = [...visaDocuments];
    updated[idx] = {
      ...updated[idx],
      [key]: value,
    };

    setDraft({
      ...data,
      visaDocuments: updated,
    });
  };

  // ===== handlers =====
  const handleType = (idx) => (e) => {
    const val = e.target.value;
    if (!typeRegex.test(val)) {
      setAbsoluteError(true);
      updateDoc(idx, "type", val);
      return;
    }
    setAbsoluteError(false);
    updateDoc(idx, "type", val);
  };

  const handleDate = (idx, key) => (e) => {
    setAbsoluteError(false);
    updateDoc(idx, key, e.target.value);
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Visa Documents
      </Typography>

      <Stack spacing={3}>
        {visaDocuments.map((doc, idx) => (
          <Box
            key={doc._id || idx}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              p: 2,
            }}
          >
            <Stack spacing={2}>
              {/* ===== Editable fields ===== */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  label="Document Type"
                  value={doc.type || ""}
                  disabled={!isEditing}
                  onChange={(e) => updateDoc(idx, "type", e.target.value)}
                  fullWidth
                >
                  {VISA_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Start Date"
                  type="date"
                  value={doc.startDate || ""}
                  disabled={!isEditing}
                  onChange={handleDate(idx, "startDate")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                <TextField
                  label="End Date"
                  type="date"
                  value={doc.endDate || ""}
                  disabled={!isEditing}
                  onChange={handleDate(idx, "endDate")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>

              {/* ===== File upload + actions ===== */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                {isEditing && (
                  <Button component="label" variant="outlined">
                    Upload
                    <input
                      hidden
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        updateDoc(idx, "fileUrl", file); 
                      }}
                    />
                  </Button>
                )}

                <Stack direction="row" spacing={2}>
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
