import { Stack, Typography, Box } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import MuiUpload from "../MuiUpload";
import { useS3Upload } from '../../hooks/uses3Upload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfilePicture = ({ isLocked }) => {
    const { control } = useFormContext();

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle2">Profile Picture</Typography>
            <Controller
                name="profilePicture"
                control={control}
                render={({ field: { onChange, value } }) => {
                    const {handleUpload, isUploading} = useS3Upload(onChange);

                    const getImgSrc = () => {
                        if (typeof value === 'string') return value;
                        if (value instanceof File) return URL.createObjectURL(value);
                        return "";
                    };

                    return(
                        <Stack spacing={2} alignItems="center">
                            {value ? (
                                <Box
                                    component="img"
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        borderRadius: '50%', 
                                        objectFit: 'cover', 
                                        border: '1px solid #ccc' 
                                    }}
                                    src={getImgSrc()}
                                    alt="Profile Preview"
                                />
                            ) : (
                                <AccountCircleIcon 
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        color: '#bdbdbd' 
                                    }} 
                                />
                            )}
                            <MuiUpload
                                label="Upload Avatar"
                                disabled={isLocked}
                                onChange={handleUpload}
                                fileName={typeof value === 'string' ? value.split('/').pop() : ""}
                            />
                        </Stack>
                    );
                }}
            />
        </Stack>
    );
};

export default ProfilePicture;