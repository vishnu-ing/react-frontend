import { Grid, Typography, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

const referralFields = [
    { name: 'referral.firstName', label: 'First Name' },
    { name: 'referral.lastName', label: 'Last Name' },
    { name: 'referral.phone', label: 'Phone' },
    { name: 'referral.relationship', label: 'Relationship' },
];

const ReferralSection = ({ isLocked }) => {
    const { control, watch } = useFormContext();
    const referralValues = watch(['referral.firstName', 'referral.lastName', 'referral.phone', 'referral.relationship']);
    const isReferralStarted = referralValues.some(val => val && val.trim() !== "");
    const referralRules = isReferralStarted ? { required: "Required if providing a referral" } : {};

    return (
        <>
            <Typography variant="h6">Referral (Optional)</Typography>
            <Grid container spacing={2}>
                {referralFields.map((f) => (
                    <Grid size={6} key={f.name}>
                        <Controller
                            name={f.name}
                            control={control}
                            rules={referralRules}
                            render={({ field, fieldState: { error } }) => (
                                <TextField {...field} label={f.label} fullWidth disabled={isLocked} error={!!error} helperText={error?.message} />
                            )}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};
export default ReferralSection;