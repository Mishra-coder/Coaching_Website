import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.MODE === 'development'
        ? 'http://localhost:5001/api'
        : 'https://coaching-website-nine.vercel.app/api',
    headers: {
        'Content-Type': 'application/json'
    }
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
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
    googleLogin: async (accessToken) => {
        const response = await api.post('/auth/google/token', { access_token: accessToken });
        return response.data;
    },
    getAllStudents: async () => {
        const response = await api.get('/auth/all-students');
        return response.data;
    }
};
export const quizAPI = {
    submit: async (resultData) => {
        const response = await api.post('/quiz/submit', resultData);
        return response.data;
    },
    getHistory: async () => {
        const response = await api.get('/quiz/history');
        return response.data;
    }
};
export const questionsAPI = {
    getAll: async (filters = {}) => {
        const response = await api.get('/questions', { params: filters });
        return response.data;
    },
    create: async (questionData) => {
        const response = await api.post('/questions', questionData);
        return response.data;
    },
    update: async (id, questionData) => {
        const response = await api.put(`/questions/${id}`, questionData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/questions/${id}`);
        return response.data;
    }
};
export const coursesAPI = {
    getAll: async (filters = {}) => {
        const response = await api.get('/courses', { params: filters });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },
    create: async (courseData) => {
        const response = await api.post('/courses', courseData);
        return response.data;
    },
    update: async (id, courseData) => {
        const response = await api.put(`/courses/${id}`, courseData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    }
};
export const enrollmentsAPI = {
    create: async (enrollmentData) => {
        const response = await api.post('/enrollments', enrollmentData);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/enrollments');
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
    updateStatus: async (id, status) => {
        const response = await api.put(`/enrollments/${id}/status`, { status });
        return response.data;
    }
};
export default api;