import { Button, Stack } from "@mui/material";

export default function ActionButtons({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  loading,
  disableSave,   // 👈 NEW
}) {
  if (!isEditing) {
    return (
      <Button variant="outlined" onClick={onEdit}>
        Edit
      </Button>
    );
  }

  return (
    <Stack direction="row" spacing={2}>
      <Button onClick={onCancel} disabled={loading}>
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={onSave}
        disabled={loading || disableSave}   // 👈 KEY LINE
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </Stack>
  );
}
