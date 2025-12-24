import { Button, Stack, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const MuiUpload = ({ label, onChange, fileName, disabled }) => {
  return (
    <Stack spacing={1}>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={disabled}
      >
        {label || "Upload File"}
        <input
          type="file"
          hidden
          onChange={(e) => onChange(e.target.files[0])} //send file to form hook
        />
      </Button>
      {fileName && typeof fileName === 'string' && (
        <Typography variant="caption" color="textSecondary">
          Selected: {fileName}
        </Typography>
      )}
    </Stack>
  );
};

export default MuiUpload;