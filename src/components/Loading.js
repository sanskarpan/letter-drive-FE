// client/src/components/Loading.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;