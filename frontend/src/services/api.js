import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function registerUser(email, password) {
  return api.post('/register', { email, password });
}

export function loginUser(email, password) {
  return api.post('/login', { email, password });
}

export function fetchTasks(params) {
  return api.get('/tasks', { params });
}

export function createTask(data) {
  return api.post('/tasks', data);
}

export function updateTask(id, data) {
  return api.put(`/tasks/${id}`, data);
}

export function deleteTask(id) {
  return api.delete(`/tasks/${id}`);
}

export default api;
