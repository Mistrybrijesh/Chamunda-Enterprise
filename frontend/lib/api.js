import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://chamunda-enterprise-gamma.vercel.app/api',
});

API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('customerToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
