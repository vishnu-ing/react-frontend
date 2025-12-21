import { Stack, TextField, Typography } from "@mui/material";

export default function EmploymentSection({ data, errors = {} ,isEditing, onChange }) {
  return (
    <>
      <Typography variant="h6"  sx= {{color:'black'}}>Employment</Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Is Citizen"
          value={data.isCitizen}
          disabled={!isEditing}
          fullWidth
          
          onChange={(e) => onChange("isCitizen", e.target.value)}
        />
        <TextField
          label="Visa Title"
          value={data.kind || ""}
          disabled={!isEditing}
          fullWidth
          onChange={(e) => onChange("kind", e.target.value)}
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Start Date"
          value={data.startDate}
          disabled={!isEditing}
          fullWidth
          error={!!errors.startDate}
          helperText={errors.startDate}
          onChange={(e) => onChange("startDate", e.target.value)}
        />
        <TextField
          label="End Date"
          value={data.endDate}
          disabled={!isEditing}
          fullWidth
          error={!!errors.endDate}
          helperText={errors.endDate}
          onChange={(e) => onChange("endDate", e.target.value)}
        />
      </Stack>
    </>
  );
}


