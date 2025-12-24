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



export default function VisaDocumentsSection({
  data,
  setDraft,
  isEditing,
  
}) {
  const docs =
    data.visaDocuments && data.visaDocuments.length > 0
      ? data.visaDocuments
      : [EMPTY_VISA_DOCUMENT];

  const updateDoc = (idx, key, value) => {
    const updated = [...docs];
    updated[idx] = {
      ...updated[idx],
      [key]: value,
    };

    setDraft({
      ...data,
      visaDocuments: updated,
    });
  };


  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6">Visa Documents</Typography>

      <Stack spacing={3}>
        {docs.map((doc, idx) => (
          <Box
            key={doc._id || idx}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              p: 2,
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2">
                Document {idx + 1}
              </Typography>
            </Stack>

            <Stack spacing={2} mt={2}>
              {/* Type + Dates */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  
                  label="Document Type"
                  value={doc.type || ""}
                  disabled
                  onChange={(e) =>
                    updateDoc(idx, "type", e.target.value)
                  }
                  fullWidth
                />

                <TextField
                  label="Start Date"
                  type="date"
                  value={doc.startDate || ""}
                  disabled
                  onChange={(e) =>
                    updateDoc(idx, "startDate", e.target.value)
                  }
                  
                  fullWidth
                />

                <TextField
                  label="End Date"
                  type="date"
                  value={doc.endDate || ""}
                  disabled
                  onChange={(e) =>
                    updateDoc(idx, "endDate", e.target.value)
                  }
                  
                  fullWidth
                />
              </Stack>

              {/* File */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
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

                {doc.fileUrl && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      href={resolveFileUrl(doc.fileUrl)}
                      target="_blank"
                    >
                      Open
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      href={resolveFileUrl(doc.fileUrl)}
                      download
                    >
                      Download
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
