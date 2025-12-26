
import {
  Paper,
  Typography,
  Stack,
  TextField,
  Box,
  Button,
} from "@mui/material";

const EMPTY_CONTACT = {
  firstName: "First Name",
  middleName: "Middle Name",
  lastName: "Last Name",
  phone: "000-000-0000",
  email: "user@domain.com",
  relationship: "Relationship",
};
const nameRegex = /^[A-Za-z\s]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;
export default function EmergencyContactsSection({
  data,
  setDraft,
  isEditing,
  setAbsoluteError,
}) {
  const contacts =
    data.emergencyContacts && data.emergencyContacts.length > 0
      ? data.emergencyContacts
      : [EMPTY_CONTACT];

  const updateContact = (idx, key, value) => {
    const updated = [...contacts];
    updated[idx] = {
      ...updated[idx],
      [key]: value,
    };

    setDraft({
      ...data,
      emergencyContacts: updated,
    });
  };

  const addContact = () => {
    setDraft({
      ...data,
      emergencyContacts: [...contacts, { ...EMPTY_CONTACT }],
    });
  };

  const removeContact = (idx) => {
    if (contacts.length === 1) return;

    setDraft({
      ...data,
      emergencyContacts: contacts.filter((_, i) => i !== idx),
    });
  };

  const handleName = (idx, key, e) => {
    const val = e;
    if (!nameRegex.test(val)) {
      setAbsoluteError(true);
      updateContact(idx, key, val);
      return;
    }
    if (val == "") {
      setAbsoluteError(true);
      updateContact(idx,key, val);
      return;
    }
    setAbsoluteError(false);
    updateContact(idx, key, val);
  };

  const handlePhone = (idx, str, value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    let formatted = digits;
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(
        6
      )}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }

    if (isInvalidPhone(formatted)) {
      setAbsoluteError(true);
      updateContact(idx, str, formatted);
      return;
    }
    if (formatted == '') {
      setAbsoluteError(true);
      updateContact(idx, str, formatted);
      return;
    }
    setAbsoluteError(false);
    updateContact(idx, str, formatted);
  };

  const isInvalidPhone = (value) => {
    return !!value && !PHONE_REGEX.test(value);
  };

  const handleEmail = (idx, str, value) => {
    const val = value;
    if (!emailRegex.test(val)) {
      setAbsoluteError(true);
       updateContact(idx, str,val)
      return;
    }
    if (val == '') {
      setAbsoluteError(true);
       updateContact(idx, str,val)
      return;
    }
    setAbsoluteError(false);
    updateContact(idx, str,val)
  };
  const handleRelationship = (idx, str,val) => {
     if (val == '') {
      setAbsoluteError(true);
       updateContact(idx, str,val)
      return;
    }
    setAbsoluteError(false);
    updateContact(idx, str,val)
  }
  return (
    <Paper elevation={2} sx={{ p: 3, m: 2 }}>
      <Typography variant="h6">Emergency Contacts</Typography>

      <Stack spacing={3}>
        {contacts.map((c, idx) => {
          return (
            <Box
              key={idx}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                p: 2,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle2">Contact {idx + 1}</Typography>

                <Button
                  size="small"
                  color="error"
                  disabled={!isEditing || contacts.length === 1}
                  onClick={() => removeContact(idx)}
                >
                  Delete
                </Button>
              </Stack>

              <Stack spacing={2} mt={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="First Name"
                    value={c.firstName}
                    disabled={!isEditing}
                    required
                    onChange={(e) =>
                      handleName(idx, "firstName", e.target.value)
                    }
                    error={!!c.firstName && !nameRegex.test(c.firstName)}
                    helperText={
                      !!c.firstName && !nameRegex.test(c.firstName)
                        ? "Only letters allowed"
                        : ""
                    }
                    fullWidth
                  />

                  <TextField
                    label="Middle Name"
                    value={c.middleName}
                    disabled={!isEditing}
           
                    onChange={(e) =>
                      handleName(idx, "middleName", e.target.value)
                    }
                    error={!!c.middleName && !nameRegex.test(c.middleName)}
                    helperText={
                      !!c.middleName && !nameRegex.test(c.middleName)
                        ? "Only letters allowed"
                        : ""
                    }
                    fullWidth
                  />

                  <TextField
                    label="Last Name"
                    value={c.lastName}
                    disabled={!isEditing}
                    required
                    onChange={(e) =>
                      handleName(idx, "lastName", e.target.value)
                    }
                    error={!!c.lastName && !nameRegex.test(c.lastName)}
                    helperText={
                      !!c.lastName && !nameRegex.test(c.lastName)
                        ? "Only letters allowed"
                        : ""
                    }
                    fullWidth
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Phone"
                    value={c.phone}
                    disabled={!isEditing}
                    required
                    onChange={(e) => handlePhone(idx, "phone", e.target.value)}
                    error={isInvalidPhone(c.phone)}
                    helperText={
                      isInvalidPhone(c.phone) ? "Format: XXX-XXX-XXXX" : ""
                    }
                    fullWidth
                  />

                  <TextField
                    label="Email"
                    value={c.email}
                    disabled={!isEditing}
                    required
                    onChange={(e) => handleEmail(idx, "email", e.target.value)}
                    error={!!c.email && !emailRegex.test(c.email)}
                    helperText={
                      !!c.email && !emailRegex.test(c.email)
                        ? "Invalid email"
                        : ""
                    }
                    fullWidth
                  />
                </Stack>

                <TextField
                  label="Relationship"
                  value={c.relationship}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleRelationship(idx, "relationship", e.target.value)
                  }
                  required
                  fullWidth
                />
              </Stack>
            </Box>
          );
        })}

        <Button variant="outlined" onClick={addContact} disabled={!isEditing}>
          + Add Emergency Contact
        </Button>
      </Stack>
    </Paper>
  )
}