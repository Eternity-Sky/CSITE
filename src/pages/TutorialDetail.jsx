import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tutorials } from '../data/tutorials';
import { Container, Paper, Typography, Box, Button, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GiscusComments from '../components/GiscusComments';

const TutorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tutorial = tutorials.find(t => String(t.id) === String(id));

  if (!tutorial) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">未找到该教程</Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate(-1)}>
            返回
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          返回
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          {tutorial.title}
        </Typography>
        <Chip label={tutorial.category} color="primary" size="small" sx={{ mb: 2, fontWeight: 500 }} />
        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.15rem' }}>
          {tutorial.content}
        </Typography>
        <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
            代码示例：
          </Typography>
          <Box component="pre" sx={{ m: 0, p: 2, bgcolor: 'grey.100', borderRadius: 1, overflowX: 'auto', fontSize: '1rem', fontFamily: 'Consolas, Monaco, \"Courier New\", monospace' }}>
            <code>{tutorial.codeExample}</code>
          </Box>
        </Box>
        {/* Giscus 评论区 */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            评论区
          </Typography>
          <GiscusComments />
        </Box>
      </Paper>
    </Container>
  );
};

export default TutorialDetail; 