import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
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

// Add response interceptor to handle error objects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error has a response with data
    if (error.response && error.response.data) {
      // If the data is an object, convert it to a string
      if (typeof error.response.data === 'object') {
        error.response.data = JSON.stringify(error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};

export const register = (username, email, password) => {
  return api.post('/auth/register', { username, email, password });
};

// Password reset services
export const requestPasswordReset = (email) => {
  return api.post('/password/reset-request', { email });
};

export const confirmPasswordReset = (token, newPassword) => {
  return api.post('/password/reset-confirm', { token, newPassword });
};

// Account activation service
export const activateAccount = (token) => {
  return api.post('/account/activate', { token });
};

export default api; 