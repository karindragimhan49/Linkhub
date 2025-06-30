'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUserFromToken = async () => {
            const token = localStorage.getItem('linkhub-token');
            if (token) {
                try {
                    const res = await API.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    localStorage.removeItem('linkhub-token');
                }
            }
            setLoading(false);
        };
        loadUserFromToken();
    }, []);

    const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('linkhub-token', res.data.token);
        setUser(res.data);
        router.push('/dashboard');
    };

    const register = async (name, email, password) => {
        const res = await API.post('/auth/register', { name, email, password });
        localStorage.setItem('linkhub-token', res.data.token);
        setUser(res.data);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('linkhub-token');
        setUser(null);
        toast.success("You've been logged out.");
        router.push('/login');
    };

    const value = { user, loading, login, register, logout, isAuthenticated: !!user };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};