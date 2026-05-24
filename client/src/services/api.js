import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor — attach JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('manufacto_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('manufacto_token');
      localStorage.removeItem('manufacto_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
