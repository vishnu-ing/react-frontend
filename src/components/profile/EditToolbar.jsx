import { Stack, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

export default function EditToolbar({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  loading,
  disabled,
  absoluteError
}) {
  if (!isEditing) {
    return (
      <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
        Edit
      </Button>
    );
  }

  return (
    <Stack direction="row" spacing={2}>
      <Button
        startIcon={<CloseIcon />}
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={onSave}
        disabled={loading || disabled || absoluteError}
      >
        Save
      </Button>
      {absoluteError && <h1>Fix input errors / required inputs</h1>}
    </Stack>
  );
}
