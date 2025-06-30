'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { LogOut, User as UserIcon, Plus, Search, TrashIcon, ClipboardCopy, X } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '@/lib/api';

// Reusable Components
const FullScreenLoader = () => ( <div className="flex h-screen w-full items-center justify-center bg-slate-950"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500"></div></div>);

const DashboardHeader = ({ user, onLogout, onNewLinkClick }) => (
    <header className="bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-4"><div className="flex h-16 items-center justify-between"><Link href="/dashboard" className="text-2xl font-bold">Link<span className="text-blue-500">Hub</span></Link><div className="flex items-center gap-4"><button onClick={onNewLinkClick} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"><Plus className="w-4 h-4" /> New Link</button><span className="text-slate-400">|</span><div className="flex items-center gap-3"><UserIcon className="w-5 h-5 text-slate-500"/><span className="text-sm font-medium text-slate-300">{user?.name || 'User'}</span></div><button onClick={onLogout} className="p-2 text-slate-400 hover:text-white" title="Logout"><LogOut className="w-5 h-5" /></button></div></div></div>
    </header>
);

const LinkCard = ({ link, onDeleted }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col justify-between group"><a href={link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-100 hover:text-blue-400 break-words line-clamp-2">{link.title}</a><div className="pt-4 mt-4 border-t border-slate-700 flex justify-between items-center"><span className="text-xs text-purple-400 bg-purple-900/50 px-2 py-1 rounded-full">{link.project || 'General'}</span><div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { navigator.clipboard.writeText(link.url); toast.success('Link copied!'); }} className="p-2 text-slate-400 hover:text-white" title="Copy URL"><ClipboardCopy className="w-4 h-4" /></button><button onClick={() => onDeleted(link._id)} className="p-2 text-slate-400 hover:text-red-500" title="Delete"><TrashIcon className="w-4 h-4" /></button></div></div></div>
);

const NewLinkForm = ({ onClose, onLinkAdded }) => {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [project, setProject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => { e.preventDefault(); if (!url || !title) return toast.error("URL and Title are required."); setIsLoading(true); try { const res = await API.post('/links', { url, title, project }); onLinkAdded(res.data); toast.success("Link added!"); onClose(); } catch (error) { toast.error(error.response?.data?.message || "Failed to add link."); } finally { setIsLoading(false); } };
    return (<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}><div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg relative" onClick={e => e.stopPropagation()}><button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button><h2 className="text-xl font-bold text-white mb-4">Add a New Link</h2><form onSubmit={handleSubmit} className="space-y-4"><input type="text" placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} required className="w-full p-2 bg-slate-900 rounded-md border border-slate-700" /><input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 bg-slate-900 rounded-md border border-slate-700" /><input type="text" placeholder="Project (optional)" value={project} onChange={e => setProject(e.target.value)} className="w-full p-2 bg-slate-900 rounded-md border border-slate-700" /><button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-800">{isLoading ? "Saving..." : "Save Link"}</button></form></div></div>);
};

// THE MAIN DASHBOARD PAGE
export default function DashboardPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [links, setLinks] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async () => {
        try { setLoadingData(true); const res = await API.get('/links', { params: { search: searchTerm.trim() } }); setLinks(res.data); } catch (error) { toast.error("Could not fetch data."); } finally { setLoadingData(false); }
    }, [searchTerm]);

    useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading, router]);
    useEffect(() => { if (user) { const handler = setTimeout(fetchData, 300); return () => clearTimeout(handler); } }, [user, fetchData]);

    const handleLinkAdded = (newLink) => setLinks(p => [newLink, ...p]);
    const handleLinkDeleted = async (deletedId) => { const oldLinks = [...links]; setLinks(p => p.filter(l => l._id !== deletedId)); try { await API.delete(`/links/${deletedId}`); toast.success('Link deleted!'); } catch (error) { setLinks(oldLinks); toast.error('Failed to delete.'); } };

    if (authLoading || !user) {
        return <FullScreenLoader />;
    }

    return (
        <>
            <div className="min-h-screen bg-slate-900">
                <DashboardHeader user={user} onLogout={logout} onNewLinkClick={() => setShowModal(true)} />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-white">Your Links</h1><div className="w-full md:w-1/3 relative"><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 pl-10 bg-slate-800 text-slate-300 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500" /><Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /></div></div>
                    {loadingData ? <div className="text-center py-10 text-slate-400">Loading...</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{links.length > 0 ? links.map(link => <LinkCard key={link._id} link={link} onDeleted={handleLinkDeleted} />) : <div className="col-span-full text-center py-16"><h3 className="text-lg font-medium text-slate-200">No Links Found</h3><p className="mt-1 text-slate-400">Click "New Link" to add your first one!</p></div>}</div>}
                </main>
            </div>
            {showModal && <NewLinkForm onClose={() => setShowModal(false)} onLinkAdded={handleLinkAdded} />}
        </>
    );
}