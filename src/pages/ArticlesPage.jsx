import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import ArticleList from '../components/ArticleList';

const ArticlesPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          文章列表
        </Typography>
        <ArticleList />
      </Box>
    </Container>
  );
};

export default ArticlesPage; 