'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function RegisterPage() {
    const { register: registerUser } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        try {
            await registerUser(data.name, data.email, data.password);
            toast.success('Account created successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
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
            
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full space-y-4">
                <div>
                    <input
                        {...register("name")}
                        type="text"
                        className="w-full p-3 bg-slate-900/50 text-white rounded-lg border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                        placeholder="Full Name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <input
                        {...register("email")}
                        type="email"
                        autoComplete="email"
                        className="w-full p-3 bg-slate-900/50 text-white rounded-lg border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                        placeholder="Email address"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <input
                        {...register("password")}
                        type="password"
                        className="w-full p-3 bg-slate-900/50 text-white rounded-lg border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                        placeholder="Password (min. 6 characters)"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all transform hover:scale-105 disabled:bg-blue-800 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </div>
    );
}