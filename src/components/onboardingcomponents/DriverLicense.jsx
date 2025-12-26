import { Stack, Typography, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import MuiUpload from "../MuiUpload";
import { useState } from 'react';
import { uploadDriverLicense } from "../../api/axiosCustom";

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
                    <Controller name="driverlicense.number" control={control} render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="License Number" required fullWidth disabled={isLocked} error={!!error} helperText={error?.message} />
                    )} />
                    <Controller name="driverlicense.expirationDate" control={control} render={({ field, fieldState: { error } }) => (
                        <TextField {...field} type="date" label="Expiration Date" required fullWidth disabled={isLocked} error={!!error} helperText={error?.message} />
                    )} />
                    <Controller
                        name="driverlicense.fileUrl"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                            const [isUploading, setIsUploading] = useState(false);

                            const handleUpload = async (file) => {
                                if (!file) return;
                                setIsUploading(true);
                                try {
                                    const resp = await uploadDriverLicense(file);
                                    // try common response shapes; fallback to raw response
                                    const uploaded = resp?.data?.fileUrl || resp?.data?.path || resp?.data || resp;
                                    onChange(uploaded);
                                } catch (err) {
                                    console.error('Driver license upload failed', err);
                                    alert('Failed to upload driver license.');
                                } finally {
                                    setIsUploading(false);
                                }
                            };

                            return (
                                <MuiUpload
                                    label="Upload License Copy"
                                    disabled={isLocked || isUploading}
                                    onChange={handleUpload}
                                    fileName={typeof value === 'string' ? value.split('/').pop() : ""}
                                />
                            );
                        }}
                    />
                </Stack>
            )}
        </Stack>
    );
};

export default DriverLicense;