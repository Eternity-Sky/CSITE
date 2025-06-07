import React from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { useSupabase } from '../contexts/SupabaseContext';

function ProfilePage() {
  const { user, loading } = useSupabase();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          正在加载...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="warning">未登录，请先登录！</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          个人中心
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            邮箱: {user.email}
          </Typography>
          <Typography variant="body1">
            用户ID: {user.id}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProfilePage;