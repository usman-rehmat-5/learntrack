import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

const api = axios.create({
  baseURL: `${API}/api`
});

api.interceptors.request.use(config => {
  const t = localStorage.getItem('token');
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeEnrollment, setActiveEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const fetchActiveEnrollment = useCallback(async () => {
    const t = localStorage.getItem('token');
    if (!t) return;
    try {
      const res = await api.get('/enrollment/active');
      setActiveEnrollment(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.log('Fetch enrollment error:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (token) fetchActiveEnrollment();
  }, [token, fetchActiveEnrollment]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setActiveEnrollment(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, updateUser, logout, activeEnrollment, fetchActiveEnrollment, loading, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
