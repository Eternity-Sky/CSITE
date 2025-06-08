import React from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

function ProtectedRoute({ element }) {
  const { user, loading } = useDatabase();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return user ? element : <Navigate to="/login" />;
}

export default ProtectedRoute;