import React from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Calculate, SwapHoriz, TextFields, School } from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: '在线计算器',
      description: '支持基础四则运算、科学计算等，方便编程时随时使用。',
      icon: <Calculate fontSize="large" color="primary" />,
      link: '/tools/calculator'
    },
    {
      title: '进制转换',
      description: '快速进行二进制、八进制、十进制、十六进制等进制互转。',
      icon: <SwapHoriz fontSize="large" color="primary" />,
      link: '/tools/base-convert'
    },
    {
      title: '字符串处理',
      description: '大小写转换、去空格、编码解码等常用字符串操作。',
      icon: <TextFields fontSize="large" color="primary" />,
      link: '/tools/string-tools'
    },
    {
      title: '系统化教程',
      description: '从基础到进阶，循序渐进的学习路径，帮助你掌握C语言编程技能。',
      icon: <School fontSize="large" color="primary" />,
      link: '/tutorials'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ 
          textAlign: 'center', 
          maxWidth: '800px', 
          mx: 'auto',
          mb: { xs: 6, md: 10 }
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3
            }}
          >
            欢迎来到
            <Box 
              component="span" 
              sx={{ 
                color: 'primary.main',
                display: 'inline-block',
                ml: 1
              }}
            >
              C语言学习网
            </Box>
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'text.secondary',
              mb: 4,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.6
            }}
          >
            一站式C语言学习平台，从入门到精通
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/articles')}
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2
            }}
          >
            浏览文章
          </Button>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature) => (
            <Grid item xs={12} md={3} key={feature.title}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    p: 2, 
                    borderRadius: '12px', 
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    mb: 2
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: '1.1rem'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    size="large" 
                    color="primary" 
                    onClick={() => navigate(feature.link)}
                    sx={{ 
                      fontWeight: 500,
                      borderRadius: 2
                    }}
                  >
                    了解更多
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Why Choose Us Section */}
        <Box sx={{ 
          textAlign: 'center', 
          maxWidth: '800px', 
          mx: 'auto',
          mb: 8,
          px: 2
        }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: 4,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            为什么选择我们？
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              fontSize: '1.1rem', 
              color: 'text.secondary', 
              lineHeight: 1.8,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            我们提供全面的C语言学习资源，从基础语法到高级应用，帮助你成为C语言专家。
            注册账号后，你可以保存学习进度，参与社区讨论，获取个性化学习建议。
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;