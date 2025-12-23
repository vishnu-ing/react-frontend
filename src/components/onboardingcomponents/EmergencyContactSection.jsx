import { Stack, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';

const EmergencyContactSection = ({ isLocked }) => {
    const { control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
            control, 
            name: "emergencyContacts",
            rules: {
                validate: (fieldValue) => {
                    return fieldValue.length > 0 || "At least one emergency contact is required";
                }
            }
        });

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Emergency Contacts</Typography>
                {errors.emergencyContacts?.root && (
                    <Typography color="error" variant="caption">
                        {errors.emergencyContacts.root.message}
                    </Typography>
                )}
            </Stack>
            {fields.map((item, index) => (
                <Stack key={item.id} spacing={2} sx={{ p: 2, bgcolor: 'whitesmoke', borderRadius: 2 }}>
                    <Typography variant="subtitle2">Contact #{index + 1}</Typography>
                    <Grid container spacing={2}>
                        {['firstName', 'lastName', 'phone', 'relationship'].map((subField) => (
                            <Grid size={6} key={subField}>
                                <Controller
                                    name={`emergencyContacts.${index}.${subField}`}
                                    control={control}
                                    rules={{ required: "Required" }}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField {...field} label={subField.charAt(0).toUpperCase() + subField.slice(1)} fullWidth disabled={isLocked} error={!!error} helperText={error?.message} />
                                    )}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {!isLocked && (
                    <Button color="error" onClick={() => remove(index)} sx={{ alignSelf: 'flex-start' }}>
                        Remove Contact
                    </Button>
                    )}
                </Stack>
            ))}
            {!isLocked && (
                <Button variant="outlined" onClick={() => append({ firstName: "", lastName: "", phone: "", relationship: "" })}>Add Emergency Contact</Button>
            )}
        </Stack>
    );
};
export default EmergencyContactSection;