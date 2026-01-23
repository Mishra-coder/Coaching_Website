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
        const res = await api.post('/auth/register', userData);
        return res.data;
    },
    login: async (credentials) => {
        const res = await api.post('/auth/login', credentials);
        return res.data;
    },
    getMe: async () => {
        const res = await api.get('/auth/me');
        return res.data;
    },
    updateProfile: async (userData) => {
        const res = await api.put('/auth/profile', userData);
        return res.data;
    },
    googleLogin: async (accessToken) => {
        const res = await api.post('/auth/google/token', { access_token: accessToken });
        return res.data;
    },
    getAllStudents: async () => {
        const res = await api.get('/auth/all-students');
        return res.data;
    }
};

export const quizAPI = {
    submit: async (resultData) => {
        const res = await api.post('/quiz/submit', resultData);
        return res.data;
    },
    getHistory: async () => {
        const res = await api.get('/quiz/history');
        return res.data;
    }
};

export const questionsAPI = {
    getAll: async (filters = {}) => {
        const res = await api.get('/questions', { params: filters });
        return res.data;
    },
    create: async (data) => {
        const res = await api.post('/questions', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/questions/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/questions/${id}`);
        return res.data;
    }
};

export const coursesAPI = {
    getAll: async (filters = {}) => {
        const res = await api.get('/courses', { params: filters });
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`/courses/${id}`);
        return res.data;
    },
    create: async (data) => {
        const res = await api.post('/courses', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/courses/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/courses/${id}`);
        return res.data;
    }
};

export const enrollmentsAPI = {
    create: async (data) => {
        const res = await api.post('/enrollments', data);
        return res.data;
    },
    getAll: async () => {
        const res = await api.get('/enrollments');
        return res.data;
    },
    getUserEnrollments: async (userId) => {
        const res = await api.get(`/enrollments/user/${userId}`);
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`/enrollments/${id}`);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/enrollments/${id}`, data);
        return res.data;
    },
    updateStatus: async (id, statusData) => {
        const res = await api.put(`/enrollments/${id}/status`, statusData);
        return res.data;
    }
};

export default api;