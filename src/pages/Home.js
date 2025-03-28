import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box, Paper, Grid } from '@mui/material';
import { DescriptionOutlined, CloudUploadOutlined, SecurityOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Box sx={{ mt: 8, mb: 8 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          p: 6,
          mb: 6,
          backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          borderRadius: 2,
        }}
        elevation={3}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Create Letters with Ease
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Write, edit, and save your letters directly to Google Drive
        </Typography>
        
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to={isAuthenticated ? "/dashboard" : "/login"}
          sx={{ fontSize: 16, fontWeight: 'bold', py: 1.5, px: 4 }}
        >
          {isAuthenticated ? "Go to Dashboard" : "Get Started"}
        </Button>
      </Paper>
      
      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Key Features
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
            elevation={2}
          >
            <DescriptionOutlined sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h3" gutterBottom>
              Simple Text Editor
            </Typography>
            <Typography>
              Create and edit letters with our easy-to-use text editor with formatting options.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
            elevation={2}
          >
            <CloudUploadOutlined sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h3" gutterBottom>
              Google Drive Integration
            </Typography>
            <Typography>
              Save your letters directly to your Google Drive for easy access anywhere.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
            elevation={2}
          >
            <SecurityOutlined sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h3" gutterBottom>
              Secure Authentication
            </Typography>
            <Typography>
              Login securely with your Google account for seamless integration.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;