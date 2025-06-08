import React, { createContext, useContext, useState, useEffect } from 'react';
import { neon } from '@neondatabase/serverless';

// 检查环境变量
const dbUrl = import.meta.env.VITE_DATABASE_URL;
if (!dbUrl) {
  console.error('数据库连接字符串未设置！请检查 .env 文件中的 VITE_DATABASE_URL');
  throw new Error('数据库连接字符串未设置！请检查 .env 文件中的 VITE_DATABASE_URL');
}

// 创建 SQL 客户端，禁用浏览器警告
const sql = neon(dbUrl, { disableWarningInBrowsers: true });

// 测试数据库连接
const testConnection = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('数据库连接成功！', result);
    return true;
  } catch (error) {
    console.error('数据库连接失败：', error);
    return false;
  }
};

// 创建上下文
const DatabaseContext = createContext();

// 提供者组件
export function DatabaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  // 初始化数据库连接
  useEffect(() => {
    const init = async () => {
      try {
        const connected = await testConnection();
        setDbConnected(connected);
        
        if (connected) {
          const token = localStorage.getItem('auth_token');
          if (token) {
            try {
              const result = await sql`
                SELECT id, email, created_at 
                FROM users 
                WHERE auth_token = ${token}
              `;
              if (result.length > 0) {
                setUser(result[0]);
              }
            } catch (error) {
              console.error('验证用户失败:', error);
              localStorage.removeItem('auth_token');
            }
          }
        }
      } catch (error) {
        console.error('初始化失败:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // 登录功能
  const signIn = async (email, password) => {
    try {
      console.log('尝试登录:', email);
      const result = await sql`
        SELECT id, email, created_at 
        FROM users 
        WHERE email = ${email} AND password = ${password}
      `;
      
      if (result.length === 0) {
        throw new Error('邮箱或密码错误');
      }

      const user = result[0];
      const token = Math.random().toString(36).substring(2);
      
      await sql`
        UPDATE users 
        SET auth_token = ${token} 
        WHERE id = ${user.id}
      `;
      
      localStorage.setItem('auth_token', token);
      setUser(user);
      
      return { user, error: null };
    } catch (error) {
      console.error('登录失败:', error);
      return { user: null, error: error.message };
    }
  };

  // 注册功能
  const signUp = async (email, password) => {
    try {
      console.log('尝试注册:', email);
      // 检查邮箱是否已存在
      const exists = await sql`
        SELECT id FROM users WHERE email = ${email}
      `;
      
      if (exists.length > 0) {
        throw new Error('邮箱已被注册');
      }

      const result = await sql`
        INSERT INTO users (email, password) 
        VALUES (${email}, ${password}) 
        RETURNING id, email, created_at
      `;
      
      const user = result[0];
      const token = Math.random().toString(36).substring(2);
      
      await sql`
        UPDATE users 
        SET auth_token = ${token} 
        WHERE id = ${user.id}
      `;
      
      localStorage.setItem('auth_token', token);
      setUser(user);
      
      return { user, error: null };
    } catch (error) {
      console.error('注册失败:', error);
      return { user: null, error: error.message };
    }
  };

  // 登出功能
  const signOut = async () => {
    try {
      if (user) {
        await sql`
          UPDATE users 
          SET auth_token = NULL 
          WHERE id = ${user.id}
        `;
      }
      localStorage.removeItem('auth_token');
      setUser(null);
      return { error: null };
    } catch (error) {
      console.error('登出失败:', error);
      return { error: error.message };
    }
  };

  // 获取文章功能
  const getArticles = async () => {
    try {
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
      return { articles: result, error: null };
    } catch (error) {
      console.error('获取文章失败:', error);
      return { articles: [], error: error.message };
    }
  };

  // 创建文章功能
  const createArticle = async (title, content, author_id) => {
    try {
      const result = await sql`
        INSERT INTO articles (title, content, author_id)
        VALUES (${title}, ${content}, ${author_id})
        RETURNING id, title, created_at;
      `;
      return { article: result[0], error: null };
    } catch (error) {
      console.error('创建文章失败:', error);
      return { article: null, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    dbConnected,
    signIn,
    signUp,
    signOut,
    sql,
    getArticles,
    createArticle,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

// 自定义钩子
export function useDatabase() {
  return useContext(DatabaseContext);
} 