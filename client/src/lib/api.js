import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// We can add interceptors here later to handle errors globally

export default API;