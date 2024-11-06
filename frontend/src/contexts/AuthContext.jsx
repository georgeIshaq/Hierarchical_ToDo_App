import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on page load
    const user = authService.getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const data = await authService.login(username, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during login');
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const data = await authService.register(username, email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during registration');
      throw err;
    }
  };

  const logout = async () => {
    try {
    await authService.logout();
    setUser(null);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during logout');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, error }}>
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

