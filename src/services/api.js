import axios from "axios";

const API_URL = "http://localhost:3500/api";

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signup = async () => {
  const response = await api.post("/auth/signup");
  return response.data;
}; 

export const signin = async (email, password) => {
  const response = await api.post("/auth/signin", { email, password });
  return response.data;
};

export const getTemplates = async () => {
  const response = await api.get("/templates");
  return response.data;
};

export const getTemplate = async (id) => {
  const response = await api.get(`/templates/${id}`);
  return response.data;
};

export const createTemplate = async (template) => {
  const response = await api.post("/completed-templates", template);
  return response.data;
};