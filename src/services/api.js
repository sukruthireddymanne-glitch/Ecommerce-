import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject JWT token
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

// Response interceptor to catch unauthorized or errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Something went wrong. Please check your backend connection.';
    return Promise.reject(new Error(message));
  }
);

// Auth Service
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// User Service
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getStudents: () => api.get('/users/students'),
  getFaculty: () => api.get('/users/faculty'),
};

// Feedback Service
export const feedbackService = {
  submitStudentToFaculty: (data) => api.post('/feedback/student-to-faculty', data),
  submitFacultyToStudent: (data) => api.post('/feedback/faculty-to-student', data),
  getMySubmissions: () => api.get('/feedback/my-submissions'),
  getReceived: () => api.get('/feedback/received'),
  getAll: () => api.get('/feedback/all'),
};

// Analytics Service
export const analyticsService = {
  getOverview: () => api.get('/analytics/overview'),
  getRatingsDistribution: () => api.get('/analytics/ratings'),
  getCategoryAverages: () => api.get('/analytics/categories'),
};

export default api;
