import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { Container, Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import Giscus from '@giscus/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const ArticleDetail = () => {
  const { id } = useParams();
  const { sql, loading: dbLoading, dbConnected } = useDatabase();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!dbConnected) {
        setError('数据库未连接');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const result = await sql`
          SELECT 
            a.id, 
            a.title, 
            a.content, 
            a.created_at, 
            u.email as author_email 
          FROM articles a
          JOIN users u ON a.author_id = u.id
          WHERE a.id = ${id}
        `;
        
        if (result.length === 0) {
          setError('文章不存在');
        } else {
          setArticle(result[0]);
        }
      } catch (err) {
        setError('加载文章失败: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!dbLoading) {
      fetchArticle();
    }
  }, [dbConnected, dbLoading, sql, id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>加载文章中...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!article) {
    return <Alert severity="warning">文章不存在</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          作者: {article.author_email || '未知'} | 发布日期: {new Date(article.created_at).toLocaleDateString()}
        </Typography>
        <Box sx={{ lineHeight: 1.8, mb: 4 }}>
          <ReactMarkdown
            children={article.content}
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : 'text';

                return !inline ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={dracula}
                    language={language}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </Box>
        <Giscus
          id="comments"
          repo="[YOUR_GITHUB_USERNAME]/[YOUR_REPO_NAME]" // 替换为你的 GitHub 用户名和仓库名
          repoId="[YOUR_REPO_ID]" // 替换为你的 Repo ID
          category="[YOUR_DISCUSSION_CATEGORY_NAME]" // 替换为你的 Discussion Category Name (例如: General)
          categoryId="[YOUR_CATEGORY_ID]" // 替换为你的 Category ID
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="zh-CN"
          loading="lazy"
        />
      </Paper>
    </Container>
  );
};

export default ArticleDetail; 