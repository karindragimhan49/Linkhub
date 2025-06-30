// client/src/app/(page)/dashboard/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { LogOut, User as UserIcon, Plus, Layers, Tag, Search, TrashIcon, ClipboardCopy } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '@/lib/api';

// --- Reusable Components (defined inside for simplicity) ---

const LoadingScreen = () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500"></div>
    </div>
);

const DashboardHeader = ({ user, onLogout, onNewLinkClick }) => (
    <header className="bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
                <Link href="/dashboard" className="text-2xl font-bold">
                    Link<span className="text-blue-500">Hub</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button onClick={onNewLinkClick} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
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

// --- Main Dashboard Page Component ---
export default function DashboardPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();

    const [links, setLinks] = useState([]);
    const [loadingLinks, setLoadingLinks] = useState(true);
    
    // States for filtering and adding
    const [projects, setProjects] = useState(['All Projects']);
    const [selectedProject, setSelectedProject] = useState('All Projects');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLinks = useCallback(async () => {
        if (!user) return;
        try {
            setLoadingLinks(true);
            const res = await API.get('/links', {
                params: {
                    project: selectedProject,
                    search: searchTerm.trim(),
                },
            });
            setLinks(res.data);
        } catch (error) {
            toast.error("Could not fetch your links.");
        } finally {
            setLoadingLinks(false);
        }
    }, [user, selectedProject, searchTerm]);

    const fetchProjects = useCallback(async () => {
        if (!user) return;
        try {
            const res = await API.get('/links/projects');
            setProjects(['All Projects', ...res.data.filter(p => p !== 'All Projects')]);
        } catch (error) {
            console.error("Failed to fetch projects");
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
        if (user) {
            fetchProjects();
        }
    }, [user, authLoading, router, fetchProjects]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchLinks();
        }, 300);
        return () => clearTimeout(handler);
    }, [fetchLinks]);

    const handleLinkDeleted = async (deletedId) => {
        const originalLinks = [...links];
        setLinks(links.filter(link => link._id !== deletedId));
        try {
            await API.delete(`/links/${deletedId}`);
            toast.success('Link deleted!');
        } catch (error) {
            setLinks(originalLinks);
            toast.error('Failed to delete link.');
        }
    };

    if (authLoading || !user) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <DashboardHeader user={user} onLogout={logout} onNewLinkClick={() => alert("New Link form will be a modal here!")} />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Your Link Dashboard</h1>
                </div>

                {/* Filter and Search Bar */}
                <div className="mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:w-2/3 relative">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 bg-slate-900 text-slate-300 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                         <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="w-full md:w-1/3 p-2 bg-slate-900 text-slate-300 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        {projects.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                {/* Links Grid */}
                {loadingLinks ? (
                     <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {links.length > 0 ? (
                            links.map(link => (
                                <LinkCard key={link._id} link={link} onDeleted={handleLinkDeleted} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 px-6 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl">
                                <h3 className="text-lg font-medium text-slate-200">No Links Found</h3>
                                <p className="mt-1 text-slate-400">Try a different search, or click "New Link" to add your first one!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

// Reusable Link Card Component
const LinkCard = ({ link, onDeleted }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(link.url);
        toast.success('Link copied!');
    };
    
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col justify-between group">
            <div className="flex-grow">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-100 hover:text-blue-400 break-words line-clamp-2">{link.title}</a>
                <p className="text-xs text-slate-500 mt-1 break-all truncate">{link.url}</p>
                <p className="text-sm text-slate-400 mt-2 line-clamp-3">{link.description}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-700 flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-purple-400 bg-purple-900/50 px-2 py-1 rounded-full">{link.category || 'Uncategorized'}</span>
                    {link.project && <span className="text-xs text-amber-400 bg-amber-900/50 px-2 py-1 rounded-full">{link.project}</span>}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white" title="Copy URL"><ClipboardCopy className="w-4 h-4" /></button>
                    <button onClick={() => onDeleted(link._id)} className="p-2 text-slate-400 hover:text-red-500" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
};