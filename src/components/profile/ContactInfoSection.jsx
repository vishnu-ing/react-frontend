
import { Paper, Stack, TextField, Typography } from "@mui/material";

export default function ContactInfoSection({
  data,
  setDraft,
  isEditing,
  setAbsoluteError,
}) {
  const contactInfo = data.contactInfo || {};
  const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;


  const update = (key, value) => {
    setDraft({
      ...data,
      contactInfo: {
        ...contactInfo,
        [key]: value,
      },
    });
  };

  const handlePhone = (key) => (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);

    let formatted = digits;
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } 
    
    if(isInvalidPhone(formatted)){
      setAbsoluteError(true)
      update(key, formatted);
      return;
    }
    if (key == 'cellPhone' && formatted == "") {
      setAbsoluteError(true);
      update(key, formatted);
      return;
    }
    setAbsoluteError(false)
    update(key, formatted);
  };

  const isInvalidPhone = (value) => {
    return !!value && !PHONE_REGEX.test(value);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, m: 2 }}>
      <Typography variant="h6">Contact Info</Typography>

      <Stack spacing={2}>
        <TextField
          label="Cell Phone"
          value={contactInfo.cellPhone || ""}
          disabled={!isEditing}
          onChange={handlePhone("cellPhone")}
          error={isInvalidPhone(contactInfo.cellPhone)}
          helperText={
            isInvalidPhone(contactInfo.cellPhone)
              ? "Format: XXX-XXX-XXXX"
              : ""
          }
          required
          fullWidth
        />

        <TextField
          label="Work Phone"
          value={contactInfo.workPhone || ""}
          disabled={!isEditing}
          onChange={handlePhone("workPhone")}
          error={isInvalidPhone(contactInfo.workPhone)}
          helperText={
            isInvalidPhone(contactInfo.workPhone)
              ? "Format: XXX-XXX-XXXX"
              : ""
          }
          fullWidth
        />
      </Stack>
    </Paper>
  )}
