'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email, password });
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
                />
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
                    Create Account
                </button>
            </form>
        </div>
    );
}