import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDatabase } from '../contexts/DatabaseContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Person,
  Login,
  Logout,
  Brightness4,
  Brightness7,
  Article,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useThemeMode } from '../contexts/ThemeContext';

function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { mode, toggleTheme } = useThemeMode();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const { sql, dbConnected } = useDatabase();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: '首页', icon: <Home />, path: '/' },
    { text: '文章', icon: <Article />, path: '/articles' },
  ];

  const authItems = user ? [
    { text: '个人中心', icon: <Person />, path: '/profile' },
    { text: '退出登录', icon: <Logout />, onClick: handleLogout },
  ] : [
    { text: '登录', path: '/login' },
    { text: '注册', path: '/register' },
  ];

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const result = await sql`
            SELECT role FROM users WHERE id = ${user.id}
          `;
          setIsUserAdmin(result[0]?.role === 'admin');
        } catch (error) {
          console.error('检查管理员状态失败:', error);
        }
      }
    };

    checkAdminStatus();
  }, [user, sql]);

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {authItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={item.onClick ? 'div' : Link} 
            to={item.path} 
            onClick={item.onClick}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{
        mt: 2,
        mx: { xs: 0.5, sm: 2 },
        borderRadius: '16px 16px 0 0',
        overflow: 'hidden',
        boxShadow: 2
      }}>
        <AppBar position="static" elevation={0} color="primary">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
              C语言学习网
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.text} 
                  color="inherit" 
                  component={Link} 
                  to={item.path}
                  sx={{ mx: 1 }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
              {isUserAdmin && (
                <Button
                  key="admin"
                  color="inherit"
                  component={Link}
                  to="/admin"
                  sx={{ mx: 1 }}
                  startIcon={<AdminPanelSettings />}
                >
                  后台管理
                </Button>
              )}
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <IconButton color="inherit" onClick={toggleTheme} sx={{ mx: 1 }}>
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              {authItems.map((item) => (
                <Button 
                  key={item.text} 
                  color="inherit" 
                  component={item.onClick ? 'button' : Link} 
                  to={item.path}
                  onClick={item.onClick}
                  sx={{ mx: 1 }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} C语言学习网 - 提供优质C语言学习资源
          </Typography>
        </Container>
      </Box>
    </>
  );
}

export default Layout;