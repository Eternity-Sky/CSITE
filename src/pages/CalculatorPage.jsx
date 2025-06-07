import React, { useState } from 'react';
import { Box, Button, Container, Paper, Typography, Grid, TextField } from '@mui/material';

const buttonValues = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

function safeEval(expr) {
  try {
    // 只允许数字和运算符，防止注入
    if (!/^[0-9+\-*/.() ]+$/.test(expr)) return '错误';
    // eslint-disable-next-line no-eval
    const result = eval(expr);
    if (result === Infinity || result === -Infinity) return '∞';
    return result;
  } catch {
    return '错误';
  }
}

const CalculatorPage = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (val) => {
    if (val === '=') {
      setResult(safeEval(input));
    } else {
      setInput((prev) => prev + val);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9+\-*/.() ]/g, '');
    setInput(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setResult(safeEval(input));
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          在线计算器
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="请输入表达式，如 1+2*3"
          sx={{ mb: 2, fontSize: '1.2rem' }}
          inputProps={{ style: { textAlign: 'right', fontSize: '1.3rem', letterSpacing: 1 } }}
        />
        <Box sx={{ minHeight: 40, mb: 2, textAlign: 'right', fontSize: '1.5rem', color: 'primary.main', fontWeight: 600 }}>
          {result !== '' ? result : '\u00A0'}
        </Box>
        <Grid container spacing={1}>
          {buttonValues.flat().map((val, idx) => (
            <Grid item xs={3} key={idx}>
              <Button
                variant={val === '=' ? 'contained' : 'outlined'}
                color={val === '=' ? 'primary' : 'inherit'}
                fullWidth
                sx={{ py: 2, fontSize: '1.2rem', borderRadius: 2 }}
                onClick={() => handleButtonClick(val)}
              >
                {val}
              </Button>
            </Grid>
          ))}
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              sx={{ py: 2, fontSize: '1.1rem', borderRadius: 2, mt: 1 }}
              onClick={handleClear}
            >
              清空
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CalculatorPage; 