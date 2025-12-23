import { Stack, Typography, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import MuiUpload from "../MuiUpload";

const DriverLicense = ({ isLocked }) => {
    const { control, watch } = useFormContext();
    const hasLicense = watch("hasLicense");

    return (
        <Stack spacing={1}>
            <Typography>Do you have a driver's license?</Typography>
            <Controller
                name="hasLicense"
                control={control}
                render={({ field }) => (
                    <RadioGroup {...field} row>
                        <FormControlLabel value="Yes" control={<Radio disabled={isLocked} />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio disabled={isLocked} />} label="No" />
                    </RadioGroup>
                )}
            />
            {hasLicense === "Yes" && (
                <Stack spacing={2} sx={{ p: 2, bgcolor: 'aliceblue', borderRadius: 2 }}>
                    <Controller name="licenseNum" control={control} render={({ field }) => (
                        <TextField {...field} label="License Number" fullWidth disabled={isLocked} />
                    )} />
                    <Controller name="licenseExp" control={control} render={({ field }) => (
                        <TextField {...field} type="date" label="Expiration Date" InputLabelProps={{ shrink: true }} fullWidth disabled={isLocked} />
                    )} />
                    <Controller
                        name="driverLicense"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <MuiUpload label="Upload License Copy" disabled={isLocked} onChange={onChange} fileName={value?.name || value} />
                        )}
                    />
                </Stack>
            )}
        </Stack>
    );
};

export default DriverLicense;