import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
  async forgotPassword(payload) {
    const { data } = await axios.post(`${API_BASE}/auth/forgot-password`, payload);
    return data;
  },
};


