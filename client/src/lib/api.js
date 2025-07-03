import axios from 'axios';

const API = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('linkhub-token') : null;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;