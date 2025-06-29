import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const { getArticles } = useDatabase();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { articles: articlesData, error } = await getArticles();
        if (error) {
          console.error('获取文章列表失败:', error);
          return;
        }
        setArticles(articlesData);
      } catch (error) {
        console.error('获取文章列表失败:', error);
      }
    };

    fetchArticles();
  }, [getArticles]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          最新文章
        </Typography>
        <Button
          component={Link}
          to="/articles"
          variant="contained"
          color="primary"
        >
          写文章
        </Button>
      </Box>

      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {article.content}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/article/${article.id}`}
                  size="small"
                  color="primary"
                >
                  阅读更多
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HomePage;