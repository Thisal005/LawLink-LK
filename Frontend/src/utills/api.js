import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// Request interceptor to add auth token
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error.response?.data || error.message);
  }
);

// Message API
export const getMessages = async (receiverId) => {
  return api.get(`/messages/${receiverId}`);
};

export const sendMessage = async (receiverId, { message, caseId = null }) => {
  return api.post(`/messages/send/${receiverId}`, { message, caseId });
};

export const uploadFile = async (receiverId, formData) => {
  return api.post(`/messages/upload/${receiverId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Case API
export const getCases = async () => {
  return api.get('/case/user-cases');
};

export const createCase = async (caseData) => {
  return api.post('/case/create-case', caseData);
};

// User API
export const getUserProfile = async () => {
  return api.get('/user/profile');
};

export default api;