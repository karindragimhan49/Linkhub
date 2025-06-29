'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start with loading true
    const router = useRouter();

    const loadUserFromToken = async () => {
        const token = localStorage.getItem('linkhub-token');
        if (token) {
            API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const res = await API.get('/auth/me');
                setUser(res.data);
            } catch (error) {
                console.error("Token invalid, logging out.");
                localStorage.removeItem('linkhub-token');
                setUser(null);
                delete API.defaults.headers.common['Authorization'];
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUserFromToken();
    }, []);

    const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        const { token, ...userData } = res.data;
        localStorage.setItem('linkhub-token', token);
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        router.push('/dashboard');
    };

    const register = async (name, email, password) => {
        const res = await API.post('/auth/register', { name, email, password });
        const { token, ...userData } = res.data;
        localStorage.setItem('linkhub-token', token);
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('linkhub-token');
        delete API.defaults.headers.common['Authorization'];
        setUser(null);
        toast.success("You've been logged out.");
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);