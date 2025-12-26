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
  absoluteError,
}) {
  if (!isEditing) {
    return (
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
          Edit
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="center">
      <Button startIcon={<CloseIcon />} onClick={onCancel} disabled={loading}>
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
      
    </Stack>
    {absoluteError && <h1 style = {{display:'flex', flexDirection:'row', justifyContent:'center'}}>Fix Input Errors / Required Inputs</h1>}
    </>
    
  );
}
