import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;