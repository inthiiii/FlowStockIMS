// src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

export default api;