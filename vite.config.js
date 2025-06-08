import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api/luogu': {
          target: 'https://www.luogu.com.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/luogu/, ''),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Referer': 'https://www.luogu.com.cn/'
          }
        }
      }
    },
    build: {
      outDir: 'dist',
    },
    // 确保环境变量被正确加载
    define: {
      'import.meta.env.VITE_DATABASE_URL': JSON.stringify(env.VITE_DATABASE_URL)
    }
  };
});