import { Stack, Typography, Box } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import MuiUpload from "../MuiUpload";

const ProfilePicture = ({ isLocked }) => {
    const { control } = useFormContext();

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle2">Profile Picture</Typography>
            <Controller
                name="profilePicture"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Stack spacing={2} alignItems="center">
                        {value && (
                            <Box
                                component="img"
                                sx={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '1px solid white' }}
                                src={typeof value === 'string' ? value : (value instanceof File ? URL.createObjectURL(value) : "")}
                                alt="Profile Preview"
                            />
                        )}
                        <MuiUpload
                            label="Upload Avatar"
                            disabled={isLocked}
                            onChange={onChange}
                            fileName={typeof value === 'object' ? value?.name : value}
                        />
                    </Stack>
                )}
            />
        </Stack>
    );
};

export default ProfilePicture;