import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('zenith_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('zenith_token') || null);
  const [loading, setLoading] = useState(false);

  // Sync token to api / localStorage
  const saveSession = (newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('zenith_user', JSON.stringify(newUser));
    localStorage.setItem('zenith_token', newToken);
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('zenith_user');
    localStorage.removeItem('zenith_token');
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      saveSession(res.data.user, res.data.token);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      saveSession(res.data.user, res.data.token);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.updateProfile(data);
      saveSession(res.data.user, res.data.token);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

