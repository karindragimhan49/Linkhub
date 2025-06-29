'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return toast.error("Please enter both email and password.");
        }
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            // The redirection to /dashboard is handled inside the login function
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="mt-2 text-slate-400">
                New to LinkHub?{' '}
                <Link href="/register" className="font-medium text-sky-400 hover:text-sky-300 transition-colors">
                    Create an account
                </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
                <input
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full p-3 bg-slate-900/50 text-white rounded-lg border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                <input
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full p-3 bg-slate-900/50 text-white rounded-lg border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 text-sm font-semibold rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition-all transform hover:scale-105 disabled:bg-sky-800 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}