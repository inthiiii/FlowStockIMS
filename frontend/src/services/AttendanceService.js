import api from "../api";
export const createAttendance = (payload) => api.post("/attendance", payload);
export const listAttendance = (params) => api.get("/attendance", { params });
export const updateAttendance = (id, payload) => api.put(`/attendance/${id}`, payload);
export const deleteAttendance = (id) => api.delete(`/attendance/${id}`);
export const getAttendanceSummary = (params) => api.get("/attendance/summary", { params });