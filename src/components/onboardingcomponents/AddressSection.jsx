import { Grid, TextField, Typography } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

const addressFields = [
    { name: 'address.buildingApt', label: 'Building/Apt #', size: 6 },
    { name: 'address.street', label: 'Street Name', required: true, size: 6 },
    { name: 'address.city', label: 'City', required: true, size: 4 },
    { name: 'address.state', label: 'State', required: true, size: 4 },
    { name: 'address.zip', label: 'Zip', required: true, size: 4 },
];

const AddressSection = ({ isLocked }) => {
    const { control } = useFormContext();
    return (
        <Grid container spacing={2}>
            <Grid size={12}><Typography variant="h6">Address</Typography></Grid>
            {addressFields.map((f) => (
                <Grid size={f.size} key={f.name}>
                    <Controller
                        name={f.name}
                        control={control}
                        rules={f.required ? { required: "Required" } : {}}
                        render={({ field, fieldState: { error } }) => (
                            <TextField {...field} label={f.label} fullWidth disabled={isLocked} error={!!error} helperText={error?.message} />
                        )}
                    />
                </Grid>
            ))}
        </Grid>
    );
};
export default AddressSection;