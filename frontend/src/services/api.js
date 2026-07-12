import axios from 'axios';

// Create an Axios instance with base URL configuration
const api = axios.create({
  baseURL: '/api/v1', // Using relative path so Vite proxy intercepts it
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is expired or invalid
      localStorage.removeItem('token');
      // Dispatch a custom event so our AuthContext can react to it
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
