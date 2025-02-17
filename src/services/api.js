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

export const signup = async (name, lastName, email, password, role) => {
  const response = await api.post("/auth/signup", { name, lastName, email, password, role } );
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

export const getAdmins = async () => {
  const response = await api.get('/admins');
  return response.data;
}

export const blockAdmins = async (ids) => {
  const response = await api.post('/admin/block', ids)
  return response.data;
}

export const unblockAdmins = async (ids) => {
  const response = await api.post('/admin/unblock', ids)
  return response.data;
}

export const deleteAdmins = async (ids) => {
  console.log('estan pasando en endpoint', ids)
  const response = await api.post('/admins/delete', ids)
  return response.data;
}

export const createAdmin = async (admin) => {
  const response = await api.post('/admins', admin)
  return response.data;
}

export const getAdmin = async (id) => {
  const response = await api.get(`/admin/${id}`);
  return response.data;
};

export const getCompletedTemplates = async (id) => {
  const response = await api.get(`/completed-templates/admin/${id}`);
  return response.data;
};

export const createPool = async (pool) => {
  const response = await api.post("/templates", pool);
  return response.data;
};

export const getComments = async (id) => {
  const response = await api.get(`/templates/${id}/comment`);
  return response.data;
}

export const createComment = async (id, comment) => {
  const response = await api.post(`/templates/${id}/comment`, comment);
  return response.data;
}

export const likeTemplate = async (id, adminId) => {
  const response = await api.post(`/templates/${id}/like`, adminId);
  return response.data;
}

export const unlikeTemplate = async (id, adminId) => {
  const response = await api.post(`/templates/${id}/unlike`, adminId);
  return response.data;
}

export const validateToken = async () => {
  try {
    const response = await api.get("/auth/validate-token");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
    throw error;
  }
}