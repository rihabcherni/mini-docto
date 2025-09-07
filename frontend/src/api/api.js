import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const getMe = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/update-profile", data);

export const addAvailability = (data) => api.post("/professionals/availability", data);
export const getAvailabilities = () => api.get("/professionals/availability");
export const deleteAvailability = (id) => api.delete(`/professionals/availability/${id}`);
export const updateAvailability = (id, data) => api.put(`/professionals/availability/${id}`, data);

export const getAppointments = () => api.get("/professionals/appointments");
export const getProfessionals = () => api.get("/professionals");

export default api;
