import { Button, Stack } from "@mui/material";

export default function ActionButtons({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  loading,
  disableSave,
}) {
  if (!isEditing) {
    return (
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="outlined" onClick={onEdit}>
          Edit
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button onClick={onCancel} disabled={loading}>
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={onSave}
        disabled={loading || disableSave}
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </Stack>
  );
}
