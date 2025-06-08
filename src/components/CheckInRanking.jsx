import React, { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { EmojiEvents, Person } from '@mui/icons-material';

function CheckInRanking() {
  const { sql } = useDatabase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      // 获取用户打卡排名数据
      const result = await sql`
        WITH user_stats AS (
          SELECT 
            u.id,
            u.email,
            COUNT(ci.id) as total_check_ins,
            MAX(ci.check_in_date) as last_check_in,
            (
              SELECT COUNT(*)
              FROM (
                SELECT check_in_date,
                  ROW_NUMBER() OVER (ORDER BY check_in_date DESC) as rn
                FROM check_ins
                WHERE user_id = u.id
              ) dates
              WHERE check_in_date = CURRENT_DATE - ((rn - 1) || ' days')::interval
            ) as current_streak
          FROM users u
          LEFT JOIN check_ins ci ON u.id = ci.user_id
          GROUP BY u.id, u.email
        )
        SELECT 
          id,
          email,
          total_check_ins,
          current_streak,
          last_check_in,
          RANK() OVER (ORDER BY total_check_ins DESC, last_check_in DESC) as rank
        FROM user_stats
        ORDER BY rank
        LIMIT 10
      `;

      setRankings(result);
    } catch (error) {
      console.error('获取排行榜失败:', error);
      setError('获取排行榜失败，请稍后重试');
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
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        打卡排行榜
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {rankings.map((user, index) => (
          <React.Fragment key={user.id}>
            <ListItem
              sx={{
                bgcolor: index < 3 ? 'action.hover' : 'transparent',
                borderRadius: 1,
                mb: 1
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: index === 0 ? 'gold' : 
                             index === 1 ? 'silver' : 
                             index === 2 ? '#cd7f32' : 'primary.main'
                  }}
                >
                  {index < 3 ? <EmojiEvents /> : <Person />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box component="span" display="flex" alignItems="center">
                    <Typography component="span" variant="subtitle1" sx={{ mr: 1 }}>
                      {index + 1}. {user.email}
                    </Typography>
                    {index < 3 && (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          bgcolor: index === 0 ? 'gold' : 
                                  index === 1 ? 'silver' :
                                  index === 2 ? '#cd7f32' : '',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}
                      >
                        {index === 0 ? '🏆 冠军' : 
                         index === 1 ? '🥈 亚军' : '🥉 季军'}
                      </Typography>
                    )}
                  </Box>
                }
                secondary={
                  <Box component="span" display="flex" gap={2}>
                    <Typography component="span" variant="body2" color="text.secondary">
                      总打卡: {user.total_check_ins} 次
                    </Typography>
                    <Typography component="span" variant="body2" color="text.secondary">
                      当前连续: {user.current_streak} 天
                    </Typography>
                    <Typography component="span" variant="body2" color="text.secondary">
                      最后打卡: {new Date(user.last_check_in).toLocaleDateString('zh-CN')}
                    </Typography>
                  </Box>
                }
                primaryTypographyProps={{ component: 'span' }}
                secondaryTypographyProps={{ component: 'span' }}
              />
            </ListItem>
            {index < rankings.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default CheckInRanking; 