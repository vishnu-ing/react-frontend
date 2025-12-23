import { Stack, Typography, RadioGroup, FormControlLabel, Radio, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import MuiUpload from "../MuiUpload";
import { useS3Upload } from '../../hooks/uses3Upload';

const CitizenStatus = ({ isLocked }) => {
    const { control, watch } = useFormContext();
    const isCitizen = watch("isCitizen");
    const workAuth = watch("workAuth");
    const visaStart = watch("visaStart");
    return (
        <Stack spacing={3}>
            {/* citizenship status*/}
            <Stack spacing={1}>
                <Typography variant="subtitle1">Are you a citizen or permanent resident of the U.S?</Typography>
                <Controller
                    name="isCitizen"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup {...field} row>
                            <FormControlLabel value="Yes" control={<Radio disabled={isLocked} />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio disabled={isLocked} />} label="No" />
                        </RadioGroup>
                    )}
                />
            </Stack>

            {isCitizen === "Yes" && (
                <FormControl fullWidth>
                    <InputLabel>Choose your status</InputLabel>
                    <Controller
                        name="citizenType"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} label="Choose your status" disabled={isLocked} >
                                <MenuItem value="Green Card">Green Card</MenuItem>
                                <MenuItem value="Citizen">Citizen</MenuItem>
                            </Select>
                        )}
                    />
                </FormControl>
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
                                <Select {...field} label="What is your work authorization?" disabled={isLocked}>
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
                                const {handleUpload, isUploading} = useS3Upload(onChange);
                                return (
                                    <MuiUpload 
                                        label="Upload OPT Receipt" 
                                        disabled={isLocked || isUploading} 
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
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="End Date"
                                    type="date"
                                    fullWidth
                                    disabled={isLocked}
                                    InputLabelProps={{ shrink: true }}
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