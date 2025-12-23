import { Box, Typography, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

const Feedback = () => {
    const { control } = useFormContext();

    return (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'whitesmoke', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: 'darkred', mb: 1 }}>
                HR Feedback
            </Typography>
            <Controller
                name="feedback"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Comments from HR"
                        multiline
                        rows={4}
                        fullWidth
                        disabled={true} 
                        variant="outlined"
                        sx={{ 
                            bgcolor: 'white',
                            "& .MuiInputBase-input.Mui-disabled": {
                                color: 'black',
                                WebkitTextFillColor: 'black'
                            }
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default Feedback;