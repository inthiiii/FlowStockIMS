import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function authHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const authService = {
  async register(payload) {
    const { data } = await axios.post(`${API_BASE}/auth/register`, payload);
    return data;
  },
  async login(payload) {
    const { data } = await axios.post(`${API_BASE}/auth/login`, payload);
    if (data.token) localStorage.setItem('auth_token', data.token);
    return data;
  },
  async me() {
    const { data } = await axios.get(`${API_BASE}/auth/me`, { headers: authHeaders() });
    return data;
  },
  async forgotPassword(payload) {
    const { data } = await axios.post(`${API_BASE}/auth/forgot-password`, payload);
    return data;
  },
  async resetPassword(payload) {
    const { data } = await axios.post(`${API_BASE}/auth/reset-password`, payload);
    return data;
  },
  async changeCredentials(payload) {
    const { data } = await axios.post(`${API_BASE}/auth/change-credentials`, payload, { headers: authHeaders() });
    return data;
  },
};


