import api from './axios';

export const getDashboard = () => api.get('/dashboard');
export const searchTasks = (query) => api.get('/tasks/search', { params: { q: query } });
