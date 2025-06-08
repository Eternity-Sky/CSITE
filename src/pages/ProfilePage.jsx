import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDatabase } from '../contexts/DatabaseContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import CheckIn from '../components/CheckIn';
import CheckInRanking from '../components/CheckInRanking';

function ProfilePage() {
  const { user, signOut } = useAuth();
  const { sql } = useDatabase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('Fetching user data for ID:', user.id);
      const result = await sql`
        SELECT 
          u.id,
          u.email,
          u.created_at,
          COUNT(ci.id) as total_check_ins,
          MAX(ci.check_in_date) as last_check_in
        FROM users u
        LEFT JOIN check_ins ci ON u.id = ci.user_id
        WHERE u.id = ${user.id}
        GROUP BY u.id, u.email, u.created_at
      `;

      if (result && result.length > 0) {
        setUserData(result[0]);
      }
    } catch (error) {
      console.error('获取用户数据失败:', error);
      setError('获取用户数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              个人资料
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                邮箱: {userData?.email}
              </Typography>
              <Typography variant="body1">
                注册时间: {new Date(userData?.created_at).toLocaleDateString('zh-CN')}
              </Typography>
              <Typography variant="body1">
                总打卡次数: {userData?.total_check_ins || 0}
              </Typography>
              <Typography variant="body1">
                最后打卡: {userData?.last_check_in ? new Date(userData.last_check_in).toLocaleDateString('zh-CN') : '暂无'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={signOut}
              fullWidth
            >
              退出登录
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <CheckIn onCheckInSuccess={fetchUserData} />
          <Box sx={{ mt: 3 }}>
            <CheckInRanking />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfilePage;