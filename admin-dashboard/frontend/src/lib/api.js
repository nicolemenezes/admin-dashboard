import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Auth APIs
export const signin = (credentials) => api.post('/api/signin', credentials);
export const register = (userData) => api.post('/api/register', userData);
export const logout = () => api.post('/api/logout');

// Dashboard APIs
export const getDashboardStats = () => api.get('/api/dashboard/stats');
export const getRecentActivity = () => api.get('/api/dashboard/activity');

// Transaction APIs
export const getTransactions = () => api.get('/api/transactions');
export const getMyTransactions = () => api.get('/api/transactions/my-transactions');
export const createTransaction = (data) => api.post('/api/transactions', data);
export const getTransactionById = (id) => api.get(`/api/transactions/${id}`);
export const updateTransaction = (id, data) => api.put(`/api/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/api/transactions/${id}`);

// User APIs
export const getUsers = () => api.get('/api/users');
export const getUserById = (id) => api.get(`/api/users/${id}`);
export const createUser = (data) => api.post('/api/users', data);
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);

// Project APIs
export const getProjects = () => api.get('/api/projects');
export const createProject = (data) => api.post('/api/projects', data);

// Subscription APIs
export const getSubscriptions = () => api.get('/api/subscriptions');
export const createSubscription = (data) => api.post('/api/subscriptions', data);

// Billing APIs
export const getBillingInfo = () => api.get('/api/billing');
export const updateBillingInfo = (data) => api.put('/api/billing', data);

export default api;
