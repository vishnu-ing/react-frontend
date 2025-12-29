import { Stack, Typography, RadioGroup, FormControlLabel, Radio, Select, MenuItem, TextField, InputLabel, FormControl, FormHelperText } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { useState } from 'react';
import MuiUpload from "../MuiUpload";
import { uploadVisaDocument } from '../../api/axiosCustom';

const CitizenStatus = ({ isLocked }) => {
    const { control, watch } = useFormContext();
    const isCitizen = watch("isCitizen");
    const workAuth = watch("workAuth");
    const visaStart = watch("visaStart");
    const [isUploadingOpt, setIsUploadingOpt] = useState(false);
    return (
        <Stack spacing={3}>
            {/* citizenship status*/}
            <Stack spacing={1}>
                <Typography variant="subtitle1">Are you a citizen or permanent resident of the U.S?</Typography>
                <Controller
                    name="isCitizen"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup {...field} row required>
                            <FormControlLabel value="Yes" control={<Radio disabled={isLocked} />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio disabled={isLocked} />} label="No" />
                        </RadioGroup>
                    )}
                />
            </Stack>

            {isCitizen === "Yes" && (
                <Controller
                    name="citizenType"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error}> 
                            <InputLabel>Choose your status</InputLabel>
                            <Select 
                                {...field} 
                                label="Choose your status" 
                                disabled={isLocked} 
                                required 
                            >
                                <MenuItem value="Green Card">Green Card</MenuItem>
                                <MenuItem value="Citizen">Citizen</MenuItem>
                            </Select>
                            <FormHelperText>{error?.message}</FormHelperText>
                        </FormControl>
                    )}
                />
            )}

            {/*visa */}
            {isCitizen === "No" && (
                <Stack spacing={2} sx={{ pl: 2, borderLeft: '2px solid #ddd' }}>
                    <FormControl fullWidth>
                        <InputLabel>What is your work authorization?</InputLabel>
                        <Controller
                            name="workAuth"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="What is your work authorization?" disabled={isLocked} required >
                                    <MenuItem value="H1-B">H1-B</MenuItem>
                                    <MenuItem value="L2">L2</MenuItem>
                                    <MenuItem value="F1">F1(CPT/OPT)</MenuItem>
                                    <MenuItem value="H4">H4</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                    {workAuth === "F1" && (
                        <Controller
                            name="optReceipt"
                            control={control}
                            render={({ field: { onChange, value } }) => {
                                const handleUpload = async (file) => {
                                    if (!file) return;
                                    setIsUploadingOpt(true);
                                    try {
                                        const res = await uploadVisaDocument(file, 'OPT Receipt', visaStart || '', '');
                                        const fileUrl = res?.data?.fileUrl;
                                        if (fileUrl) onChange(fileUrl);
                                    } catch (err) {
                                        console.error('OPT upload failed', err);
                                    } finally {
                                        setIsUploadingOpt(false);
                                    }
                                };

                                return (
                                    <MuiUpload
                                        label="Upload OPT Receipt"
                                        disabled={isLocked || isUploadingOpt}
                                        onChange={handleUpload}
                                        fileName={typeof value === 'string' ? value.split('/').pop() : ""}
                                    />
                                )}
                            }
                        />
                    )}

                    {/*Other Visa Title */}
                    {workAuth === "Other" && (
                        <Controller
                            name="visaTitle"
                            control={control}
                            render={({ field }) => (
                                <TextField 
                                    {...field} 
                                    label="Specify Visa Title" 
                                    fullWidth 
                                    disabled={isLocked} 
                                />
                            )}
                        />
                    )}
                    <Stack direction="row" spacing={2}>
                        <Controller
                            name="visaStart"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Start Date"
                                    type="date"
                                    fullWidth
                                    disabled={isLocked}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />
                        <Controller
                            name="visaEnd"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (!value || !visaStart) return true;
                                    return new Date(value) >= new Date(visaStart) || "End date cannot be before Start date";
                                }
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label="End Date"
                                    type="date"
                                    fullWidth
                                    disabled={isLocked}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!error}
                                    helperText={error?.message}
                                />
                            )}
                        />
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
};

export default CitizenStatus;