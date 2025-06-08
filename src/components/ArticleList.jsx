import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Grid } from '@mui/material';

const ArticleList = () => {
  const navigate = useNavigate();
  const { getArticles, loading: dbLoading, dbConnected } = useDatabase();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!dbConnected) {
        setError('数据库未连接');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { articles: fetchedArticles, error: fetchError } = await getArticles();
        if (fetchError) {
          setError(fetchError);
        } else {
          setArticles(fetchedArticles);
        }
      } catch (err) {
        setError('加载文章失败: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!dbLoading) {
      fetchArticles();
    }
  }, [dbConnected, dbLoading, getArticles]);

  const handleArticleClick = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>加载文章中...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (articles.length === 0) {
    return <Typography variant="body1">暂无文章。</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out'
                }
              }}
              onClick={() => handleArticleClick(article.id)}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  作者: {article.author_email || '未知'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  发布日期: {new Date(article.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ArticleList; 