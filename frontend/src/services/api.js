import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  adminRegister: async (adminData) => {
    const response = await api.post('/auth/admin-register', adminData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
  googleLogin: async (accessToken, isAdmin = false) => {
    const response = await api.post('/auth/google/token', {
      access_token: accessToken,
      isAdmin,
    });
    return response.data;
  },
  getAllStudents: async () => {
    const response = await api.get('/auth/all-students');
    return response.data;
  },
};

export const leaderboardAPI = {
  getLeaderboard: async () => {
    const response = await api.get('/leaderboard');
    return response.data;
  },
};

export const quizAPI = {
  submit: async (resultData) => {
    const response = await api.post('/quiz/submit', resultData);
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/quiz/history');
    return response.data;
  },
};

export const questionsAPI = {
  getAll: async (filters = {}) => {
    const response = await api.get('/questions', { params: filters });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/questions/stats');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/questions', data);
    return response.data;
  },
  bulkUpload: async (fileData) => {
    const response = await api.post('/questions/bulk-upload', { fileData });
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/questions/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },
};

export const coursesAPI = {
  getAll: async (filters = {}) => {
    const response = await api.get('/courses', { params: filters });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/courses/stats/count');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/courses', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

export const enrollmentsAPI = {
  create: async (data) => {
    const response = await api.post('/enrollments', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/enrollments/stats/count');
    return response.data;
  },
  getUserEnrollments: async (userId) => {
    const response = await api.get(`/enrollments/user/${userId}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/enrollments/${id}`, data);
    return response.data;
  },
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/enrollments/${id}/status`, statusData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/enrollments/${id}`);
    return response.data;
  },
};

export const demoBookingsAPI = {
  create: async (data) => {
    const response = await api.post('/demo-bookings', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/demo-bookings');
    return response.data;
  },
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/demo-bookings/${id}/status`, statusData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/demo-bookings/${id}`);
    return response.data;
  },
};

export const contestsAPI = {
  getAll: async () => {
    const response = await api.get('/contests');
    return response.data;
  },
  getActive: async () => {
    const response = await api.get('/contests/active');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/contests/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/contests', data);
    return response.data;
  },
  bulkUpload: async (fileData, contestDetails = {}) => {
    const response = await api.post('/contests/bulk-upload', {
      fileData,
      ...contestDetails,
    });
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/contests/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/contests/${id}`);
    return response.data;
  },
  submit: async (id, answers) => {
    const response = await api.post(`/contests/${id}/submit`, { answers });
    return response.data;
  },
  getLeaderboard: async (id) => {
    const response = await api.get(`/contests/${id}/leaderboard`);
    return response.data;
  },
  getMyResult: async (id) => {
    const response = await api.get(`/contests/${id}/my-result`);
    return response.data;
  },
};

export const videosAPI = {
  getAll: async () => {
    const response = await api.get('/videos');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/videos/stats');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },
  upload: async (formData, onProgress) => {
    const response = await api.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },
};

export default api;
