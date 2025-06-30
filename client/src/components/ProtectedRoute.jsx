'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Loading screen component
const FullScreenLoader = () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500"></div>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If loading is finished and there's no user, redirect to login page.
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // 1. While the authentication status is being checked, show a loader.
    // This is the most important part. It PREVENTS the children from rendering too early.
    if (loading) {
        return <FullScreenLoader />;
    }

    // 2. If authentication is checked and a user exists, render the child components (the dashboard).
    if (user) {
        return <>{children}</>;
    }

    // 3. If no user, this will be briefly rendered before the redirect happens.
    return null; 
};

export default ProtectedRoute;