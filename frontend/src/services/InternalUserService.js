import api from "../Api";
export const createInternalUser = (payload) => api.post("/internal-users", payload);
export const listInternalUsers = () => api.get("/internal-users");
export const getInternalUser = (id) => api.get(`/internal-users/${id}`);
export const updateInternalUser = (id, payload) => api.put(`/internal-users/${id}`, payload);
export const deleteInternalUser = (id) => api.delete(`/internal-users/${id}`);