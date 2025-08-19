import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      await verifyToken(token);
    } catch (error) {
      console.error('Auth initialization failed:', error);
      logout(); // Clear invalid token
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await api.get('/api/auth/verify/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUser(response.data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login/', credentials);
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      await verifyToken(response.data.access);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/api/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}