import React, { Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { ThemeProviderCustom, useThemeMode } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

const Layout = lazy(() => import('./components/Layout'));
const HomePage = lazy(() => import('./pages/HomePage'));
const TutorialList = lazy(() => import('./components/TutorialList'));
const TutorialDetail = lazy(() => import('./pages/TutorialDetail'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const { mode } = useThemeMode();
  const currentTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode,
    },
  });

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <DatabaseProvider>
        <AuthProvider>
          <Suspense fallback={<div style={{textAlign:'center',marginTop:80}}>页面加载中...</div>}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="tutorials" element={<TutorialList />} />
                <Route path="tutorials/:id" element={<TutorialDetail />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <ThemeProviderCustom>
        <AppContent />
      </ThemeProviderCustom>
    </Router>
  );
}

export default App;