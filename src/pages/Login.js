import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Typography, Button, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

const Login = () => {
  const { isAuthenticated, handleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [processingLogin, setProcessingLogin] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle login from Google OAuth redirect
  useEffect(() => {
    const handleTokenLogin = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (token) {
        try {
          console.log("Token received in URL, logging in");
          setProcessingLogin(true);
          
          // Clear the token from URL immediately
          window.history.replaceState({}, document.title, '/login');
          
          // Handle the login
          const success = handleLogin(token);
          
          if (success) {
            console.log("Login successful, redirecting to dashboard");
            // Force a hard navigation to dashboard
            window.location.href = '/dashboard';
          } else {
            setError("Failed to process login token");
            setProcessingLogin(false);
          }
        } catch (err) {
          console.error("Error processing login:", err);
          setError("An error occurred during login");
          setProcessingLogin(false);
        }
      }
    };
    
    handleTokenLogin();
  }, [location.search, handleLogin]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !processingLogin) {
      console.log("User already authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, processingLogin]);
  
  const handleGoogleLogin = () => {
    setProcessingLogin(true);
    setError(null);
    // Direct to Google auth
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };
  
  if (processingLogin) {
    return <Loading message="Signing you in..." />;
  }
  
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
        elevation={4}
        sx={{
          p: 5,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Letter Drive
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Sign in with your Google account to start creating and saving letters
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<GoogleIcon />}
          fullWidth
          onClick={handleGoogleLogin}
          sx={{ py: 1.5 }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;