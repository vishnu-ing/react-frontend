import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = ({ size = 48 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        py: 4,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingSpinner;
