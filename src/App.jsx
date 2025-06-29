import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProviderCustom } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetail';
import ArticlesPage from './pages/ArticlesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProblemListPage from './pages/ProblemList';
import ProblemDetailPage from './pages/ProblemDetail';
import StringToolsPage from './pages/StringToolsPage';
import BaseConvertPage from './pages/BaseConvertPage';
import CalculatorPage from './pages/CalculatorPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProviderCustom>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DatabaseProvider>
          <AuthProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/article/:id" element={<ArticleDetailPage />} />
                  <Route path="/articles" element={<ArticlesPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/problems" element={<ProblemListPage />} />
                  <Route path="/problem/:id" element={<ProblemDetailPage />} />
                  <Route path="/tools/string" element={<StringToolsPage />} />
                  <Route path="/tools/base-convert" element={<BaseConvertPage />} />
                  <Route path="/tools/calculator" element={<CalculatorPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            </Router>
          </AuthProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </ThemeProviderCustom>
  );
}

export default App;