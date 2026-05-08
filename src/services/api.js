import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle connection errors
    if (!error.response) {
      console.error('Network error - cannot connect to backend API at', API_BASE_URL);
      return Promise.reject(new Error('Cannot connect to backend server. Please make sure Django is running.'));
    }

    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
};

// Scholarships API
export const scholarshipsAPI = {
  getAll: (params) => api.get('/scholarships/', { params }),
  getById: (id) => api.get(`/scholarships/${id}/`),
  getFeatured: () => api.get('/scholarships/', { params: { featured: true } }),
  search: (query) => api.get('/scholarships/', { params: { search: query } }),
  create: (data) => api.post('/scholarships/', data),
  update: (id, data) => api.put(`/scholarships/${id}/`, data),
  delete: (id) => api.delete(`/scholarships/${id}/`),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services/'),
  getById: (id) => api.get(`/services/${id}/`),
};

// Service Orders API
export const serviceOrdersAPI = {
  create: (data) => api.post('/service-orders/', data),
  getAll: (params) => api.get('/service-orders/', { params }),
  getById: (id) => api.get(`/service-orders/${id}/`),
  uploadReceipt: (id, file) => {
    const formData = new FormData();
    formData.append('receipt', file);
    return api.post(`/service-orders/${id}/upload_receipt/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Applications API
export const applicationsAPI = {
  create: (data) => api.post('/applications/', data),
  getAll: (params) => api.get('/applications/', { params }),
  getById: (id) => api.get(`/applications/${id}/`),
  submit: (id) => api.post(`/applications/${id}/submit/`),
  uploadDocument: (id, file, type) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    return api.post(`/applications/${id}/upload_document/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadReceipt: (id, file) => {
    const formData = new FormData();
    formData.append('receipt', file);
    return api.post(`/applications/${id}/upload_receipt/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Contact API
export const contactAPI = {
  sendMessage: (data) => api.post('/contact/', data),
  getFAQ: (params) => api.get('/contact-faq/', { params }),
};

// Scholarship FAQ API
export const scholarshipFAQAPI = {
  getAll: (params) => api.get('/scholarship-faq/', { params }),
  getByScholarship: (scholarshipId) => api.get('/scholarship-faq/', { params: { scholarship: scholarshipId } }),
  create: (data) => api.post('/scholarship-faq/', data),
  update: (id, data) => api.put(`/scholarship-faq/${id}/`, data),
  delete: (id) => api.delete(`/scholarship-faq/${id}/`),
};

export default api;
