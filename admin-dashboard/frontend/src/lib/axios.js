import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Axios] Token added to request:', token.slice(0, 20) + '...');
    } else {
      console.log('[Axios] No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('[Axios] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('[Axios] Response successful:', response.status);
    return response;
  },
  (error) => {
    console.error('[Axios] Response error:', error.response?.status, error.response?.data);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('[Axios] 401 Unauthorized - Clearing localStorage and redirecting to signin');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.warn('[Axios] 403 Forbidden - Access denied');
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('[Axios] 500 Server Error:', error.response?.data?.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;