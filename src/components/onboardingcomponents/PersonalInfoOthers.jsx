import { Grid, Typography, TextField, Select, MenuItem } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

const carFields = [
    { name: 'car.make', label: 'Make' },
    { name: 'car.model', label: 'Model' },
    { name: 'car.color', label: 'Color' },
];

const PersonalInfoOthers = ({ isLocked }) => {
    const { control } = useFormContext();

    return (
        <Grid container spacing={3}>
            <Grid size={12}><Typography variant="h6">Contact & Identification</Typography></Grid>
            <Grid size={6}>
                <Controller name="cellPhone" control={control} rules={{ required: "Required" }} render={({ field, fieldState: { error } }) => (
                    <TextField {...field} label="Cell Phone" required disabled={isLocked} fullWidth error={!!error} helperText={error?.message} />
                )} />
            </Grid>
            <Grid size={6}>
                <Controller name="workPhone" control={control} render={({ field }) => (
                    <TextField {...field} label="Work Phone" disabled={isLocked} fullWidth />
                )} />
            </Grid>

            <Grid size={4}>
                <Controller name="ssn" control={control} rules={{ required: "Required" }} render={({ field, fieldState: { error } }) => (
                    <TextField {...field} label="SSN" required unique="true" disabled={isLocked} fullWidth error={!!error} helperText={error?.message} />
                )} />
            </Grid>
            <Grid size={4}>
                <Controller name="DOB" control={control} rules={{ required: "Required" }} render={({ field, fieldState: { error } }) => (
                    <TextField {...field} type="date" required label="Date of Birth" disabled={isLocked} fullWidth error={!!error} helperText={error?.message} />
                )} />
            </Grid>
            <Grid size={4}>
                <Controller name="gender" control={control} render={({ field }) => (
                    <Select {...field} fullWidth disabled={isLocked} displayEmpty>
                        <MenuItem value="I do not wish to answer">I do not wish to answer</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </Select>
                )} />
            </Grid>

            <Grid size={12}><Typography variant="h6">Car Information (Optional)</Typography></Grid>
            {carFields.map((f) => (
                <Grid size={4} key={f.name}>
                    <Controller name={f.name} control={control} render={({ field }) => (
                        <TextField {...field} label={f.label} disabled={isLocked} fullWidth />
                    )} />
                </Grid>
            ))}
        </Grid>
    );
};
export default PersonalInfoOthers;