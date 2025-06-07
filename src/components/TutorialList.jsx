import React from 'react';
import { tutorials } from '../data/tutorials';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box,
  Chip,
  Paper
} from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TutorialList = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 6, 
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            color: 'white',
            borderRadius: 4
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            C语言教程
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            从入门到精通，系统化学习C语言编程
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {tutorials.map((tutorial) => (
            <Grid item xs={12} md={6} key={tutorial.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }
                }}
                onClick={() => navigate(`/tutorials/${tutorial.id}`)}
              >
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CodeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                      {tutorial.title}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 3, lineHeight: 1.7 }}
                  >
                    {tutorial.content}
                  </Typography>

                  <Box 
                    sx={{ 
                      bgcolor: 'grey.50',
                      p: 2,
                      borderRadius: 2,
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      color="primary" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <CodeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                      代码示例：
                    </Typography>
                    <Box 
                      component="pre" 
                      sx={{ 
                        m: 0,
                        p: 2,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        overflowX: 'auto',
                        fontSize: '0.875rem',
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                      }}
                    >
                      <code>{tutorial.codeExample}</code>
                    </Box>
                  </Box>

                  <Chip 
                    label={tutorial.category}
                    color="primary"
                    size="small"
                    sx={{ 
                      borderRadius: 1,
                      fontWeight: 500
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TutorialList; 