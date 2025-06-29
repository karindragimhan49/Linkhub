'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, password });
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
                />
                <input
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full p-3 bg-slate-900/50 text-white rounded-lg border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full py-3 px-4 text-sm font-semibold rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition-all transform hover:scale-105"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}