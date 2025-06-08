import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

function CheckIn() {
  const { user } = useAuth(); // 使用 useAuth 获取 user
  const { sql } = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [checkInStats, setCheckInStats] = useState({
    total: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: null,
    recentCheckIns: []
  });

  // 获取打卡统计信息
  const fetchCheckInStats = async () => {
    console.log('fetchCheckInStats: User object:', user);
    if (!user || !user.id) {
      console.log('fetchCheckInStats: User not available or user.id is missing, returning.');
      return;
    }
    
    try {
      console.log('fetchCheckInStats: Fetching stats for user ID:', user.id);
      // 获取总打卡次数和最后打卡日期
      const basicStats = await sql`
        SELECT 
          COUNT(*) as total_check_ins,
          MAX(check_in_date) as last_check_in
        FROM check_ins
        WHERE user_id = ${user.id}
      `;

      // 获取连续打卡天数
      const streakStats = await sql`
        WITH dates AS (
          SELECT 
            check_in_date,
            ROW_NUMBER() OVER (ORDER BY check_in_date DESC) as rn
          FROM check_ins
          WHERE user_id = ${user.id}
        ),
        date_gaps AS (
          SELECT 
            check_in_date,
            rn,
            check_in_date - (rn || ' days')::interval as gap
          FROM dates
        ),
        streaks AS (
          SELECT 
            gap,
            COUNT(*) as streak_length
          FROM date_gaps
          GROUP BY gap
        )
        SELECT 
          MAX(streak_length) as longest_streak,
          (
            SELECT streak_length
            FROM streaks
            WHERE gap = (
              SELECT gap
              FROM date_gaps
              WHERE rn = 1
            )
          ) as current_streak
        FROM streaks
      `;

      // 获取最近7天的打卡记录
      const recentCheckIns = await sql`
        SELECT check_in_date
        FROM check_ins
        WHERE user_id = ${user.id}
        ORDER BY check_in_date DESC
        LIMIT 7
      `;

      setCheckInStats({
        total: basicStats[0].total_check_ins || 0,
        currentStreak: streakStats[0].current_streak || 0,
        longestStreak: streakStats[0].longest_streak || 0,
        lastCheckIn: basicStats[0].last_check_in,
        recentCheckIns: recentCheckIns.map(ci => ci.check_in_date)
      });
      console.log('fetchCheckInStats: Successfully fetched stats:', checkInStats);
    } catch (error) {
      console.error('获取打卡统计失败:', error);
      setError('获取打卡统计失败，请稍后重试');
    }
  };

  useEffect(() => {
    fetchCheckInStats();
  }, [user]);

  // 执行打卡
  const handleCheckIn = async () => {
    console.log('handleCheckIn: Button clicked.');
    console.log('handleCheckIn: Current user object:', user);
    if (!user || !user.id) {
      console.log('handleCheckIn: User not available or user.id is missing, cannot check in.');
      setError('用户未登录或用户信息不完整，无法打卡。');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('handleCheckIn: Attempting SQL INSERT for user ID:', user.id);
      await sql`
        INSERT INTO check_ins (user_id, check_in_date)
        VALUES (${user.id}, CURRENT_DATE)
        ON CONFLICT (user_id, check_in_date) DO NOTHING
      `;
      console.log('handleCheckIn: SQL INSERT successful.');
      
      setSuccess(true);
      console.log('handleCheckIn: Calling fetchCheckInStats after successful check-in.');
      fetchCheckInStats();
    } catch (error) {
      console.error('打卡失败:', error);
      setError('打卡失败，请稍后重试');
    } finally {
      setLoading(false);
      console.log('handleCheckIn: Check-in process finished. Loading set to false.');
    }
  };

  // 检查今天是否已打卡
  const hasCheckedInToday = checkInStats.lastCheckIn && 
    new Date(checkInStats.lastCheckIn).toDateString() === new Date().toDateString();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              每日打卡
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              坚持打卡，记录你的学习历程
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCheckIn}
              disabled={loading || hasCheckedInToday}
              startIcon={<CalendarMonth />}
            >
              {hasCheckedInToday ? '今日已打卡' : '立即打卡'}
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            打卡成功！继续加油！
          </Alert>
        )}
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                总打卡次数
              </Typography>
              <Typography variant="h3" color="primary">
                {checkInStats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                当前连续打卡
              </Typography>
              <Typography variant="h3" color="primary">
                {checkInStats.currentStreak}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                最长连续打卡
              </Typography>
              <Typography variant="h3" color="primary">
                {checkInStats.longestStreak}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          最近打卡记录
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[...Array(7)].map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - index);
            const dateStr = date.toISOString().split('T')[0];
            const isChecked = checkInStats.recentCheckIns.includes(dateStr);
            
            return (
              <Grid item xs={6} sm={4} md={2} key={dateStr}>
                <Card 
                  sx={{ 
                    bgcolor: isChecked ? 'success.light' : 'grey.100',
                    color: isChecked ? 'white' : 'text.secondary'
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 1 }}>
                    <Typography variant="body2">
                      {date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </Typography>
                    <Typography variant="h6">
                      {isChecked ? '✓' : '-'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
}

export default CheckIn; 