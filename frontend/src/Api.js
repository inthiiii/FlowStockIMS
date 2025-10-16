// src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

// Derive the API origin (e.g., http://localhost:3000) to resolve static asset URLs like /uploads/...
const API_ORIGIN = BASE.replace(/\/?api\/?$/, "");

export const toPublicUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

export default api;