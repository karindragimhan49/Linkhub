// client/src/app/(page)/dashboard/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from 'next/link';
// --- THE FIX IS HERE ---
import { LogOut, User as UserIcon, Plus, Layers, Tag, Search, TrashIcon, ClipboardCopy } from 'lucide-react';
// -----------------------
import toast from 'react-hot-toast';
import API from '@/lib/api';

// --- Reusable Components ---

const LoadingScreen = () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500"></div>
    </div>
);

const DashboardHeader = ({ user, onLogout }) => (
    <header className="bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
                <Link href="/dashboard" className="text-2xl font-bold">
                    Link<span className="text-blue-500">Hub</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                        <Plus className="w-4 h-4" /> New Link
                    </button>
                    <span className="text-slate-400">|</span>
                    <div className="flex items-center gap-3">
                        <UserIcon className="w-5 h-5 text-slate-500"/>
                        <span className="text-sm font-medium text-slate-300">{user?.name || 'User'}</span>
                    </div>
                    <button onClick={onLogout} className="p-2 text-slate-400 hover:text-white" title="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </header>
);

const LinkCard = ({ link, onDeleted }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(link.url);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col justify-between">
            <div>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-100 hover:text-blue-400 break-words">{link.title}</a>
                <p className="text-xs text-slate-500 mt-1 break-all">{link.url}</p>
                <p className="text-sm text-slate-400 mt-2">{link.description}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-purple-400 bg-purple-900/50 px-2 py-1 rounded-full">{link.category}</span>
                    {link.tags?.map(tag => <span key={tag} className="text-xs text-amber-400 bg-amber-900/50 px-2 py-1 rounded-full">{tag}</span>)}
                </div>
                <div className="flex items-center gap-2">
                    {/* --- THE FIX IS HERE --- */}
                    <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white" title="Copy URL"><ClipboardCopy className="w-4 h-4" /></button>
                    {/* ----------------------- */}
                    <button onClick={() => onDeleted(link._id)} className="p-2 text-slate-400 hover:text-red-500" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
};

// --- Main Dashboard Page Component ---

export default function DashboardPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();

    const [links, setLinks] = useState([]);
    const [loadingLinks, setLoadingLinks] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }

        if (user) {
            const fetchLinks = async () => {
                try {
                    setLoadingLinks(true);
                    const res = await API.get('/links'); // Changed from /snippets to /links
                    setLinks(res.data);
                } catch (error) {
                    toast.error('Could not fetch your links.');
                } finally {
                    setLoadingLinks(false);
                }
            };
            fetchLinks();
        }
    }, [user, authLoading, router]);

    const handleLinkDeleted = (deletedId) => {
        setLinks(links.filter(link => link._id !== deletedId));
        // You should also call an API to delete from backend
    };

    if (authLoading) {
        return <LoadingScreen />;
    }

    if (user) {
        return (
            <div className="min-h-screen bg-slate-900">
                <DashboardHeader user={user} onLogout={logout} />
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-white mb-6">Your Link Dashboard</h1>
                    
                    {loadingLinks ? (
                        <p className="text-slate-400">Loading your links...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {links.length > 0 ? (
                                links.map(link => <LinkCard key={link._id} link={link} onDeleted={handleLinkDeleted} />)
                            ) : (
                                <p className="text-slate-400 col-span-full text-center py-10">You haven't saved any links yet. Click "New Link" to get started!</p>
                            )}
                        </div>
                    )}
                </main>
            </div>
        );
    }

    return null; 
}