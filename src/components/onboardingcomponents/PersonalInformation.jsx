import { Stack, Typography, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

const nameFields = [
    { name: 'firstName', label: 'First Name', required: true },
    { name: 'lastName', label: 'Last Name', required: true },
    { name: 'middleName', label: 'Middle Name' },
    { name: 'preferredName', label: 'Preferred Name' },
];

const PersonalInformation = ({ isLocked }) => {
    const { control } = useFormContext();

    return (
        <Stack spacing={2} flex={1}>
            <Typography variant="h6">Personal Information</Typography>
            {nameFields.map((f) => (
                <Controller
                    key={f.name}
                    name={f.name}
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label={f.label} required={f.required} disabled={isLocked} fullWidth />
                    )}
                />
            ))}
        </Stack>
    );
};

export default PersonalInformation;