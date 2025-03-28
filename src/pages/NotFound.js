import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <SadIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Page Not Found
        </Typography>
        <Typography paragraph color="text.secondary">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;