import { Stack, Typography, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import MuiUpload from "../MuiUpload";
import { useS3Upload } from '../../hooks/uses3Upload';

const DriverLicense = ({ isLocked }) => {
    const { control, watch } = useFormContext();
    const hasLicense = watch("driverlicense.hasLicense");

    return (
        <Stack spacing={1}>
            <Typography>Do you have a driver's license?</Typography>
            <Controller
                name="driverlicense.hasLicense"
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
                    <Controller name="driverlicense.number" control={control} render={({ field }) => (
                        <TextField {...field} label="License Number" fullWidth disabled={isLocked} />
                    )} />
                    <Controller name="driverlicense.expirationDate" control={control} render={({ field }) => (
                        <TextField {...field} type="date" label="Expiration Date" InputLabelProps={{ shrink: true }} fullWidth disabled={isLocked} />
                    )} />
                    <Controller
                        name="driverlicense.fileUrl"
                        control={control}
                        render={({ field: { onChange, value } }) =>{ 
                            const { handleUpload, isUploading } = useS3Upload(onChange);
                            return ( 
                                <MuiUpload label="Upload License Copy" disabled={isLocked || isUploading} onChange={handleUpload} fileName={typeof value === 'string' ? value.split('/').pop() : ""} />
                            )}
                        }
                    />
                </Stack>
            )}
        </Stack>
    );
};

export default DriverLicense;