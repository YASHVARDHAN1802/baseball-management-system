// src/services/api.js
// Centralized Axios API client with interceptors

import axios from 'axios';

const BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT token
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

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Auth =====
export const authAPI = {
  login:  (credentials) => api.post('/auth/login', credentials),
  getMe:  ()            => api.get('/auth/me'),
};

// ===== Players =====
export const playerAPI = {
  getAll:       (params) => api.get('/players', { params }),
  getById:      (id)     => api.get(`/players/${id}`),
  getCareer:    (id)     => api.get(`/players/${id}/career-stats`),
  create:       (data)   => api.post('/players', data),
  update:       (id, data) => api.put(`/players/${id}`, data),
  delete:       (id)     => api.delete(`/players/${id}`),
  transfer:     (id, data) => api.post(`/players/${id}/transfer`, data),
};

// ===== Teams =====
export const teamAPI = {
  getAll:  (params) => api.get('/teams', { params }),
  getById: (id)     => api.get(`/teams/${id}`),
  create:  (data)   => api.post('/teams', data),
  update:  (id, data) => api.put(`/teams/${id}`, data),
  delete:  (id)     => api.delete(`/teams/${id}`),
};

// ===== Games =====
export const gameAPI = {
  getAll:    (params) => api.get('/games', { params }),
  getById:   (id)     => api.get(`/games/${id}`),
  schedule:  (data)   => api.post('/games', data),
  update:    (id, data) => api.put(`/games/${id}`, data),
  recordScore: (id, data) => api.post(`/games/${id}/score`, data),
  delete:    (id)     => api.delete(`/games/${id}`),
};

// ===== Statistics =====
export const statsAPI = {
  getAll:        (params) => api.get('/statistics', { params }),
  getLeaderboard: (params) => api.get('/statistics/leaderboard', { params }),
  getSeasons:    ()       => api.get('/statistics/seasons'),
  upsert:        (data)   => api.post('/statistics', data),
  delete:        (id)     => api.delete(`/statistics/${id}`),
};

// ===== Injuries =====
export const injuryAPI = {
  getAll:  (params) => api.get('/injuries', { params }),
  getById: (id)     => api.get(`/injuries/${id}`),
  create:  (data)   => api.post('/injuries', data),
  update:  (id, data) => api.put(`/injuries/${id}`, data),
  delete:  (id)     => api.delete(`/injuries/${id}`),
};

// ===== Contracts =====
export const contractAPI = {
  getAll:     (params) => api.get('/contracts', { params }),
  getById:    (id)     => api.get(`/contracts/${id}`),
  getPayroll: ()       => api.get('/contracts/payroll'),
  create:     (data)   => api.post('/contracts', data),
  update:     (id, data) => api.put(`/contracts/${id}`, data),
  delete:     (id)     => api.delete(`/contracts/${id}`),
};

// ===== Stadiums =====
export const stadiumAPI = {
  getAll:  (params) => api.get('/stadiums', { params }),
  getById: (id)     => api.get(`/stadiums/${id}`),
  create:  (data)   => api.post('/stadiums', data),
  update:  (id, data) => api.put(`/stadiums/${id}`, data),
  delete:  (id)     => api.delete(`/stadiums/${id}`),
};

// ===== Reports =====
export const reportAPI = {
  getDashboard:  () => api.get('/reports/dashboard'),
  getPayroll:    () => api.get('/reports/payroll'),
  getTransfers:  () => api.get('/reports/transfers'),
  getStandings:  () => api.get('/reports/standings'),
};

export default api;

