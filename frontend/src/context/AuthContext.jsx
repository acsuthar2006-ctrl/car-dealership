import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login if token exists on load
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({
            username: decoded.sub, // 'sub' usually holds the username in standard JWTs
            roles: decoded.roles || [],
            isAdmin: decoded.roles?.includes('ROLE_ADMIN') || false
          });
        }
      } catch (err) {
        console.error("Invalid token found, logging out", err);
        logout();
      }
    } else {
      setUser(null);
    }
    setLoading(false);

    // Listen for unauthorized events from our api interceptor
    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [token]);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    return data;
  };

  const register = async (username, email, password) => {
    return await authService.register(username, email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
