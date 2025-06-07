import React, { useState } from 'react';
import { Box, Button, Container, Paper, Typography, Grid, TextField, MenuItem } from '@mui/material';

const actions = [
  { label: '全部小写', value: 'lower' },
  { label: '全部大写', value: 'upper' },
  { label: '去除所有空格', value: 'trimAll' },
  { label: '去除首尾空格', value: 'trimEdge' },
  { label: '字符串反转', value: 'reverse' },
  { label: '统计长度', value: 'length' },
];

function processString(str, action) {
  switch (action) {
    case 'lower':
      return str.toLowerCase();
    case 'upper':
      return str.toUpperCase();
    case 'trimAll':
      return str.replace(/\s+/g, '');
    case 'trimEdge':
      return str.trim();
    case 'reverse':
      return str.split('').reverse().join('');
    case 'length':
      return str.length + ' 个字符';
    default:
      return str;
  }
}

const StringToolsPage = () => {
  const [input, setInput] = useState('');
  const [action, setAction] = useState('lower');
  const [result, setResult] = useState('');

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setResult(processString(val, action));
  };

  const handleActionChange = (e) => {
    const act = e.target.value;
    setAction(act);
    setResult(processString(input, act));
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          字符串处理工具
        </Typography>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="输入字符串"
              value={input}
              onChange={handleInputChange}
              placeholder="请输入要处理的内容"
              variant="outlined"
              inputProps={{ style: { fontSize: '1.1rem' } }}
              multiline
              minRows={2}
              maxRows={4}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="操作类型"
              value={action}
              onChange={handleActionChange}
              variant="outlined"
              inputProps={{ style: { fontSize: '1.1rem' } }}
            >
              {actions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          sx={{ mb: 3, borderRadius: 2 }}
          onClick={handleClear}
        >
          清空
        </Button>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            处理结果：
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, minHeight: 60 }}>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
              {result}
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default StringToolsPage; 