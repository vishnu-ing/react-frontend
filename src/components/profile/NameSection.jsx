import {
  Avatar,
  Button,
  Paper,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import { resolveFileUrl } from "../../utils/fileUrl";

// ===== simple regex =====
const nameRegex = /^[A-Za-z\s]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ssnFullRegex = /^\d{3}-\d{2}-\d{4}$/;

export default function NameSection({
  data,
  setDraft,
  isEditing,
  setAbsoluteError,
}) {
  const name = data.name || {};

  const update = (key, value) => {
    setDraft({
      ...data,
      name: { ...name, [key]: value },
    });
  };

  // ===== blocking handlers =====
  const handleName = (key) => (e) => {
    const val = e.target.value;

    if (!nameRegex.test(val)) {
      setAbsoluteError(true);
      update(key, val);
      return;
    }
    if (val == "") {
      setAbsoluteError(true);
      update(key, val);
      return;
    }
    setAbsoluteError(false);
    update(key, val);
  };

  const handleSSN = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);

    let formatted = digits;
    if (digits.length > 5) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(
        5
      )}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    if (!ssnFullRegex.test(formatted)) {
      setAbsoluteError(true);
      update("ssn", formatted);
      return;
    }
    if (formatted == "") {
      setAbsoluteError(true);
      update("ssn", formatted);
      return;
    }
    setAbsoluteError(false);
    update("ssn", formatted);
  };

  const handleEmail = (key) => (e) => {
    const val = e.target.value;
    if (!emailRegex.test(val)) {
      setAbsoluteError(true);
      update(key, val);
      return;
    }
    setAbsoluteError(false);
    update(key, val);
  };
  const handleDOB = (e) => {
    if (e.target.value == "") {
      setAbsoluteError(true);
      update("dob", e.target.value);
      return;
    }
    setAbsoluteError(false);
    update("dob", e.target.value);
  };
  return (
    <Paper elevation={2} sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Name
      </Typography>

      <Stack spacing={3}>
        {/* Avatar */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={resolveFileUrl(name.profilePicture)}
            sx={{ width: 80, height: 80 }}
          />

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
                  update("profilePictureFile", file);
                }}
              />
            </Button>
          )}
        </Stack>

        {/* First / Last */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="First Name"
            value={name.firstName || ""}
            disabled={!isEditing}
            onChange={handleName("firstName")}
            error={!!name.firstName && !nameRegex.test(name.firstName)}
            helperText={
              !!name.firstName && !nameRegex.test(name.firstName)
                ? "Only letters allowed"
                : ""
            }
            required
            fullWidth
          />

          <TextField
            label="Last Name"
            value={name.lastName || ""}
            disabled={!isEditing}
            onChange={handleName("lastName")}
            error={!!name.lastName && !nameRegex.test(name.lastName)}
            helperText={
              !!name.lastName && !nameRegex.test(name.lastName)
                ? "Only letters allowed"
                : ""
            }
            required
            fullWidth
          />
        </Stack>

        {/* Preferred */}
        <TextField
          label="Preferred Name"
          value={name.preferredName || ""}
          disabled={!isEditing}
          onChange={handleName("preferredName")}
          error={!!name.preferredName && !nameRegex.test(name.preferredName)}
          helperText={
            !!name.preferredName && !nameRegex.test(name.preferredName)
              ? "Only letters allowed"
              : ""
          }
          fullWidth
        />

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          value={name.email || ""}
          disabled={!isEditing}
          onChange={handleEmail("email")}
          error={!!name.email && !emailRegex.test(name.email)}
          helperText={
            !!name.email && !emailRegex.test(name.email) ? "Invalid email" : ""
          }
          fullWidth
        />

        {/* SSN / DOB */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="SSN"
            value={name.ssn || ""}
            disabled={!isEditing}
            onChange={handleSSN}
            error={!!name.ssn && !ssnFullRegex.test(name.ssn)}
            helperText={
              !!name.ssn && !ssnFullRegex.test(name.ssn)
                ? "Format: XXX-XX-XXXX"
                : ""
            }
            required
            fullWidth
          />

          <TextField
            label="DOB"
            type="date"
            value={name.dob || ""}
            disabled={!isEditing}
            onChange={(e) => handleDOB(e)}
            required
            fullWidth
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
