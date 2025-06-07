import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SupabaseProvider } from './contexts/SupabaseContext';

const Layout = lazy(() => import('./components/Layout'));
const HomePage = lazy(() => import('./pages/HomePage'));
const TutorialList = lazy(() => import('./components/TutorialList'));
const TutorialDetail = lazy(() => import('./pages/TutorialDetail'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const BaseConvertPage = lazy(() => import('./pages/BaseConvertPage'));
const StringToolsPage = lazy(() => import('./pages/StringToolsPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2c3e50',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2c3e50',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#2c3e50',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SupabaseProvider>
        <Suspense fallback={<div style={{textAlign:'center',marginTop:80}}>页面加载中...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/tutorials" element={<TutorialList />} />
              <Route path="/tutorials/:id" element={<TutorialDetail />} />
              <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
              <Route path="/tools/calculator" element={<CalculatorPage />} />
              <Route path="/tools/base-convert" element={<BaseConvertPage />} />
              <Route path="/tools/string-tools" element={<StringToolsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </SupabaseProvider>
    </ThemeProvider>
  );
}

export default App;