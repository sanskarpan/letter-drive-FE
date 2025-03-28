import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialized auth state from local storage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found in localStorage');
          setLoading(false);
          return;
        }
        
        // Checking here if token is expired locally
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            console.log('Token expired locally');
            localStorage.removeItem('token');
            setLoading(false);
            return;
          }
          
          // Validatating token with backend
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/check`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.isAuthenticated) {
            console.log('Token validated with backend');
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            console.log('Token rejected by backend');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error decoding or validating token:', error);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Function to handle login (from token in URL)
  const handleLogin = (token) => {
    console.log('Handling login with token');
    
    try {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Decode token to get user information
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      
      // Update auth state
      setUser(decoded);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };
  
  // Function to handle logout
  const handleLogout = async () => {
    try {
      console.log('Logging out user');
      
      // First clear local auth state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      
      // Then call the backend logout endpoint
      const token = localStorage.getItem('token');
      if (token) {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      console.log('Logout successful');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return true;
    }
  };
  
  const value = {
    user,
    isAuthenticated,
    loading,
    handleLogin,
    handleLogout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;