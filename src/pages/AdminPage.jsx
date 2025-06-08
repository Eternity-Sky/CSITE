import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from '@mui/material';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sql, loading: dbLoading, dbConnected, createArticle } = useDatabase();
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [currentTab, setCurrentTab] = useState(0); // 0 for User Management, 1 for Article Publishing
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [publishMessage, setPublishMessage] = useState(null);

  // 文章编辑相关状态
  const [openEditArticleDialog, setOpenEditArticleDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editArticleTitle, setEditArticleTitle] = useState('');
  const [editArticleContent, setEditArticleContent] = useState('');

  useEffect(() => {
    // 检查是否是管理员
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      if (!dbConnected) {
        setError('数据库未连接');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        if (currentTab === 0) { // Fetch users
          const result = await sql`
            SELECT id, email, role, created_at
            FROM users
            ORDER BY created_at DESC
          `;
          setUsers(result);
        } else if (currentTab === 1) { // Fetch articles
          const result = await sql`
            SELECT 
              a.id, 
              a.title, 
              a.content, 
              a.created_at, 
              u.email as author_email 
            FROM articles a
            JOIN users u ON a.author_id = u.id
            ORDER BY a.created_at DESC
          `;
          setArticles(result);
        }
      } catch (err) {
        setError('加载数据失败: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!dbLoading) {
      fetchData();
    }
  }, [dbConnected, dbLoading, sql, user, navigate, currentTab]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await sql`
        UPDATE users
        SET role = ${newRole}
        WHERE id = ${userId}
      `;
      // 更新本地状态
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setOpenDialog(false);
    } catch (err) {
      setError('更新用户角色失败: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('确定要删除这个用户吗？此操作不可恢复。\n\n请注意：如果该用户有文章或打卡记录，您可能需要先删除相关记录才能删除用户，以避免外键约束错误。')) {
      return;
    }
    try {
      await sql`
        DELETE FROM users
        WHERE id = ${userId}
      `;
      // 更新本地状态
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError('删除用户失败: ' + err.message);
    }
  };

  const handlePublishArticle = async () => {
    if (!articleTitle || !articleContent) {
      setPublishMessage({ type: 'error', text: '标题和内容不能为空！' });
      return;
    }
    if (!user || user.role !== 'admin') {
      setPublishMessage({ type: 'error', text: '您没有权限发布文章！' });
      return;
    }
    if (!dbConnected) {
      setPublishMessage({ type: 'error', text: '数据库未连接，无法发布文章。' });
      return;
    }

    try {
      const { article, error: articleError } = await createArticle(articleTitle, articleContent, user.id);
      if (articleError) {
        setPublishMessage({ type: 'error', text: '文章发布失败: ' + articleError });
        return;
      }
      setPublishMessage({ type: 'success', text: '文章发布成功！' });
      setArticleTitle('');
      setArticleContent('');
      // 刷新文章列表
      // 如果当前在文章管理 Tab，重新获取文章列表
      if (currentTab === 1) {
        const result = await sql`
          SELECT 
            a.id, 
            a.title, 
            a.content, 
            a.created_at, 
            u.email as author_email 
          FROM articles a
          JOIN users u ON a.author_id = u.id
          ORDER BY a.created_at DESC
        `;
        setArticles(result);
      }
    } catch (err) {
      setPublishMessage({ type: 'error', text: '文章发布失败: ' + err.message });
    }
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setEditArticleTitle(article.title);
    setEditArticleContent(article.content);
    setOpenEditArticleDialog(true);
  };

  const handleUpdateArticle = async () => {
    if (!editingArticle) return;
    if (!editArticleTitle || !editArticleContent) {
      setError('标题和内容不能为空！');
      return;
    }
    try {
      await sql`
        UPDATE articles
        SET title = ${editArticleTitle}, content = ${editArticleContent}
        WHERE id = ${editingArticle.id}
      `;
      setArticles(articles.map(art => 
        art.id === editingArticle.id ? { ...art, title: editArticleTitle, content: editArticleContent } : art
      ));
      setOpenEditArticleDialog(false);
      setError(null); // Clear any previous error
    } catch (err) {
      setError('更新文章失败: ' + err.message);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      return;
    }
    try {
      await sql`
        DELETE FROM articles
        WHERE id = ${articleId}
      `;
      setArticles(articles.filter(art => art.id !== articleId));
      setError(null); // Clear any previous error
    } catch (err) {
      setError('删除文章失败: ' + err.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setError(null); // Clear error when switching tabs
    setPublishMessage(null); // Clear publish message when switching tabs
    setLoading(true); // Set loading to true to re-fetch data for the new tab
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>加载中...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          后台管理
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="admin sections">
            <Tab label="用户管理" />
            <Tab label="文章管理" />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>邮箱</TableCell>
                    <TableCell>角色</TableCell>
                    <TableCell>注册时间</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role);
                            setOpenDialog(true);
                          }}
                          sx={{ mr: 1 }}
                        >
                          修改角色
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          删除
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>修改用户角色</DialogTitle>
              <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>角色</InputLabel>
                  <Select
                    value={newRole}
                    label="角色"
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <MenuItem value="user">普通用户</MenuItem>
                    <MenuItem value="admin">管理员</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>取消</Button>
                <Button 
                  onClick={() => handleRoleChange(selectedUser.id, newRole)}
                  variant="contained"
                >
                  确认
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {currentTab === 1 && (
          <Box sx={{ p: 3 }} component={Paper}>
            <Typography variant="h5" gutterBottom>发布新文章</Typography>
            {publishMessage && (
              <Alert severity={publishMessage.type} sx={{ mb: 2 }}>
                {publishMessage.text}
              </Alert>
            )}
            <TextField
              label="文章标题"
              fullWidth
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="文章内容"
              fullWidth
              multiline
              rows={10}
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePublishArticle}
              sx={{ mb: 4 }}
            >
              发布文章
            </Button>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>已发布文章</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>标题</TableCell>
                    <TableCell>作者</TableCell>
                    <TableCell>发布日期</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {articles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">暂无文章</TableCell>
                    </TableRow>
                  ) : (
                    articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>{article.title}</TableCell>
                        <TableCell>{article.author_email}</TableCell>
                        <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleEditArticle(article)}
                            sx={{ mr: 1 }}
                          >
                            编辑
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            删除
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={openEditArticleDialog} onClose={() => setOpenEditArticleDialog(false)}>
              <DialogTitle>编辑文章</DialogTitle>
              <DialogContent>
                <TextField
                  label="文章标题"
                  fullWidth
                  value={editArticleTitle}
                  onChange={(e) => setEditArticleTitle(e.target.value)}
                  sx={{ mb: 2, mt: 2 }}
                />
                <TextField
                  label="文章内容"
                  fullWidth
                  multiline
                  rows={10}
                  value={editArticleContent}
                  onChange={(e) => setEditArticleContent(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenEditArticleDialog(false)}>取消</Button>
                <Button 
                  onClick={handleUpdateArticle}
                  variant="contained"
                >
                  保存
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AdminPage;