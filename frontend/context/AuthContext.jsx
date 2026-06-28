'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('customerUser');
    if (stored) setCustomer(JSON.parse(stored));
    setLoading(false);
  }, []);

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('customerToken', res.data.token);
    localStorage.setItem('customerUser', JSON.stringify(res.data.customer));
    setCustomer(res.data.customer);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('customerToken', res.data.token);
    localStorage.setItem('customerUser', JSON.stringify(res.data.customer));
    setCustomer(res.data.customer);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
