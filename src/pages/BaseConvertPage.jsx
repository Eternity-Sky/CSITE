import React, { useState } from 'react';
import { Box, Button, Container, Paper, Typography, Grid, TextField, MenuItem } from '@mui/material';

const baseOptions = [
  { label: '二进制', value: 2 },
  { label: '八进制', value: 8 },
  { label: '十进制', value: 10 },
  { label: '十六进制', value: 16 },
];

function convertAllBases(value, fromBase) {
  let num;
  try {
    num = parseInt(value, fromBase);
    if (isNaN(num)) return null;
  } catch {
    return null;
  }
  return {
    2: num.toString(2),
    8: num.toString(8),
    10: num.toString(10),
    16: num.toString(16).toUpperCase(),
  };
}

const BaseConvertPage = () => {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [converted, setConverted] = useState({ 2: '', 8: '', 10: '', 16: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const val = e.target.value.trim();
    setInput(val);
    if (!val) {
      setConverted({ 2: '', 8: '', 10: '', 16: '' });
      setError('');
      return;
    }
    const result = convertAllBases(val, fromBase);
    if (result) {
      setConverted(result);
      setError('');
    } else {
      setConverted({ 2: '', 8: '', 10: '', 16: '' });
      setError('输入格式不正确');
    }
  };

  const handleBaseChange = (e) => {
    const base = Number(e.target.value);
    setFromBase(base);
    if (!input) {
      setConverted({ 2: '', 8: '', 10: '', 16: '' });
      setError('');
      return;
    }
    const result = convertAllBases(input, base);
    if (result) {
      setConverted(result);
      setError('');
    } else {
      setConverted({ 2: '', 8: '', 10: '', 16: '' });
      setError('输入格式不正确');
    }
  };

  const handleClear = () => {
    setInput('');
    setConverted({ 2: '', 8: '', 10: '', 16: '' });
    setError('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          进制转换工具
        </Typography>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={7}>
            <TextField
              fullWidth
              label="输入数字"
              value={input}
              onChange={handleInputChange}
              placeholder="如 1010 或 123 或 1A3F"
              variant="outlined"
              inputProps={{ style: { fontSize: '1.2rem' } }}
              error={!!error}
              helperText={error}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              select
              fullWidth
              label="原始进制"
              value={fromBase}
              onChange={handleBaseChange}
              variant="outlined"
              inputProps={{ style: { fontSize: '1.1rem' } }}
            >
              {baseOptions.map((opt) => (
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
            转换结果：
          </Typography>
          <Grid container spacing={2}>
            {baseOptions.map((opt) => (
              <Grid item xs={12} sm={6} key={opt.value}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, minHeight: 60 }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                    {opt.label}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.2rem', wordBreak: 'break-all' }}>
                    {converted[opt.value]}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default BaseConvertPage; 