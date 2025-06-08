import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { sql } = useDatabase();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 获取用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const result = await sql`
        SELECT * FROM users 
        WHERE email = ${email} AND password = ${password}
      `;

      if (result && result.length > 0) {
        const userData = result[0];
        console.log('signIn: Setting user data to localStorage and state:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: '邮箱或密码错误' 
        };
      }
    } catch (error) {
      console.error('登录失败:', error);
      return { 
        success: false, 
        error: '登录失败，请稍后重试' 
      };
    }
  };

  const signUp = async (email, password) => {
    try {
      // 检查邮箱是否已存在
      const existingUser = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;

      if (existingUser && existingUser.length > 0) {
        return { 
          success: false, 
          error: '该邮箱已被注册' 
        };
      }

      // 创建新用户，依赖数据库自动生成 UUID
      const result = await sql`
        INSERT INTO users (email, password, created_at)
        VALUES (${email}, ${password}, CURRENT_TIMESTAMP)
        RETURNING *
      `;

      if (result && result.length > 0) {
        const userData = result[0];
        console.log('signUp: Setting user data to localStorage and state:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: '注册失败，请稍后重试' 
        };
      }
    } catch (error) {
      console.error('注册失败:', error);
      return { 
        success: false, 
        error: '注册失败，请稍后重试' 
      };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log('User signed out, localStorage cleared.');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 