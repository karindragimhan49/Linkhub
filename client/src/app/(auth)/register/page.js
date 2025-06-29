'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            return toast.error("Please fill in all fields.");
        }
        setIsLoading(true);
        try {
            await register(name, email, password);
            toast.success('Account created successfully!');
            // The redirection to /dashboard is handled inside the register function
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-white">Create Your Hub</h1>
            <p className="mt-2 text-slate-400">
                Already a member?{' '}
                <Link href="/login" className="font-medium text-sky-400 hover:text-sky-300 transition-colors">
                    Sign In
                </Link>
            </p>
            
            <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
                <input
                    type="text"
                    required
                    className="w-full p-3 bg-slate-900/50 text-white rounded-lg border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                />
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
                    className="w-full py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all transform hover:scale-105 disabled:bg-blue-800 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </div>
    );
}