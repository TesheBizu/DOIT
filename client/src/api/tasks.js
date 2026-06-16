import api from './axios';

export const getProjectTasks = (projectId, status) =>
  api.get(`/projects/${projectId}/tasks`, { params: status ? { status } : {} });
export const createTask = (projectId, data) => api.post(`/projects/${projectId}/tasks`, data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
