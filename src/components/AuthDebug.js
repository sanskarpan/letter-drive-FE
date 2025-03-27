// client/src/components/AuthDebug.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Button, Paper, Grid, Divider } from '@mui/material';
import { jwtDecode } from 'jwt-decode';


const AuthDebug = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [localToken, setLocalToken] = useState(localStorage.getItem('token') || 'No token found');
  
  const refreshInfo = () => {
    setLocalToken(localStorage.getItem('token') || 'No token found');
  };
  
  const decodeToken = () => {
    try {
      if (localToken && localToken !== 'No token found') {
        const decoded = jwtDecode(localToken);
        return JSON.stringify(decoded, null, 2);
      }
      return 'No valid token to decode';
    } catch (error) {
      return `Error decoding: ${error.message}`;
    }
  };
  
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Auth Debug Information
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={refreshInfo} 
          sx={{ mb: 2 }}
        >
          Refresh Info
        </Button>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">Auth Context State:</Typography>
            <Box component="pre" sx={{ 
              bgcolor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1,
              overflowX: 'auto'
            }}>
              {`isAuthenticated: ${isAuthenticated}
loading: ${loading}
user: ${user ? JSON.stringify(user, null, 2) : 'null'}`}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">Token in localStorage:</Typography>
            <Box component="pre" sx={{ 
              bgcolor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1, 
              overflowX: 'auto',
              maxHeight: '100px'
            }}>
              {localToken}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold">Decoded Token:</Typography>
            <Box component="pre" sx={{ 
              bgcolor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1,
              overflowX: 'auto'
            }}>
              {decodeToken()}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AuthDebug;