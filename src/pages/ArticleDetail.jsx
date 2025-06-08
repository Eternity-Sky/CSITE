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
  const { supabase } = useDatabase();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, supabase]);

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
          repo="[在此填入您的 GitHub 仓库名]"
          repoId="[在此填入您的仓库 ID]"
          category="General"
          categoryId="DIC_kwDOJ5YfYc4Cb5w0"
          mapping="pathname"
          term="Welcome to @giscus/react component!"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme="light"
          lang="zh-CN"
          loading="lazy"
        />
      </Paper>
    </Container>
  );
};

export default ArticleDetail; 