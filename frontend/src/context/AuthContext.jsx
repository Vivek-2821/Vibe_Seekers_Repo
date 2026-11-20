import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vibe_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vibe_access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('vibe_access_token');
      if (savedToken) {
        try {
          const res = await axiosInstance.get('/api/customer/profile');
          setUser(res.data.data);
          localStorage.setItem('vibe_user', JSON.stringify(res.data.data));
        } catch (err) {
          console.warn('Session expired or invalid token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const saveAuthSession = (authData) => {
    const { accessToken, refreshToken, ...userData } = authData;
    localStorage.setItem('vibe_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('vibe_refresh_token', refreshToken);
    }
    localStorage.setItem('vibe_user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const login = async (email, password, isAdmin = false) => {
    const endpoint = isAdmin ? '/api/auth/admin-login' : '/api/auth/login';
    const res = await axiosInstance.post(endpoint, { email, password });
    const authData = res.data.data;
    saveAuthSession(authData);
    return authData;
  };

  const signup = async (fullName, email, phone, password) => {
    const res = await axiosInstance.post('/api/auth/register', {
      fullName,
      email,
      phone,
      password,
    });
    return res.data;
  };

  const verifyRegistration = async (email, otp) => {
    const res = await axiosInstance.post('/api/auth/verify-registration', {
      email,
      otp,
      purpose: 'REGISTRATION',
    });
    const authData = res.data.data;
    saveAuthSession(authData);
    return authData;
  };

  const forgotPassword = async (email) => {
    const res = await axiosInstance.post('/api/auth/forgot-password', { email });
    return res.data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const res = await axiosInstance.post('/api/auth/reset-password', {
      email,
      otp,
      newPassword,
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('vibe_access_token');
    localStorage.removeItem('vibe_refresh_token');
    localStorage.removeItem('vibe_user');
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (profileData) => {
    const res = await axiosInstance.put('/api/customer/profile', profileData);
    const updated = res.data.data;
    setUser((prev) => ({ ...prev, ...updated }));
    localStorage.setItem('vibe_user', JSON.stringify({ ...user, ...updated }));
    return updated;
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        verifyRegistration,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
