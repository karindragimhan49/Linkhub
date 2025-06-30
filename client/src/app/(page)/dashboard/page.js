'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { LogOut, User as UserIcon, Plus, Search, Trash, Copy, Command, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '@/lib/api';
import { Command as CommandPrimitive } from 'cmdk';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

// ====================================================================
//  Reusable UI Components (The Building Blocks of our Pro UI)
// ====================================================================

const FullScreenLoader = () => ( <div className="flex h-screen w-full items-center justify-center bg-slate-950"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500"></div></div>);

const DashboardHeader = ({ user, onLogout, onCommandMenuOpen }) => (
    <header className="bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-4"><div className="flex h-16 items-center justify-between"><Link href="/dashboard" className="text-2xl font-bold">Link<span className="text-blue-500">Hub</span></Link><div className="flex items-center gap-4"><button onClick={onCommandMenuOpen} className="flex items-center gap-2 border border-slate-700 bg-slate-800/50 text-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors text-sm"><Command className="w-4 h-4" /> Quick Action <kbd className="ml-2 text-xs border border-slate-600 rounded px-1.5 py-0.5">⌘K</kbd></button><span className="text-slate-400">|</span><div className="flex items-center gap-3"><span className="text-sm font-medium text-slate-300">{user?.name || 'User'}</span></div><button onClick={onLogout} className="p-2 text-slate-400 hover:text-white" title="Logout"><LogOut className="w-5 h-5" /></button></div></div></div>
    </header>
);

const LinkCard = ({ link, onDeleted }) => (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col group transition-all hover:border-blue-500/50 hover:bg-slate-800/30">
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-100 hover:text-blue-400 break-words line-clamp-2 mb-2">{link.title}</a>
        <p className="text-xs text-slate-500 break-all truncate">{new URL(link.url).hostname}</p>
        <div className="flex-grow mt-2">
            {link.project && <span className="text-xs text-purple-400 bg-purple-900/50 px-2 py-1 rounded-full">{link.project}</span>}
        </div>
        <div className="pt-3 mt-3 border-t border-slate-800 flex justify-end items-center">
            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { navigator.clipboard.writeText(link.url); toast.success('Link copied!'); }} className="p-1.5 text-slate-400 hover:text-white" title="Copy URL"><Copy className="w-4 h-4" /></button>
                <button onClick={() => onDeleted(link._id)} className="p-1.5 text-slate-400 hover:text-red-500" title="Delete"><Trash className="w-4 h-4" /></button>
            </div>
        </div>
    </div >
);

const CommandMenu = ({ open, onOpenChange, onLinkAdded }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddLink = async (e) => {
        e.preventDefault();
        if (!url) return;
        setIsLoading(true);
        try {
            // We can add a backend endpoint to fetch metadata from URL later
            // For now, we'll just add the URL and let the user edit title later.
            const res = await API.post('/links', { url, title: url, project: 'General' });
            onLinkAdded(res.data);
            toast.success("Link captured!");
            onOpenChange(false);
            setUrl('');
        } catch (error) {
            toast.error("Failed to add link.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <DialogPrimitive.Content className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90vw] max-w-2xl bg-slate-900/80 border border-slate-700 rounded-xl shadow-2xl z-50">
                    <CommandPrimitive className="flex h-full w-full flex-col overflow-hidden rounded-md text-slate-100">
                        <form onSubmit={handleAddLink}>
                        <div className="flex items-center border-b border-slate-700 px-3">
                            <Link2 className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                                placeholder="Paste a link to save..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500"
                            />
                             <button type="submit" disabled={isLoading} className="text-xs bg-slate-800 hover:bg-slate-700 p-2 rounded-md transition-colors disabled:opacity-50">
                                {isLoading ? "Saving..." : "Save"}
                             </button>
                        </div>
                        </form>
                        <div className="p-4 text-center text-sm text-slate-500">
                            Or search your existing links... (Search functionality to be added here)
                        </div>
                    </CommandPrimitive>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

// ====================================================================
//  THE MAIN DASHBOARD PAGE
// ====================================================================
export default function DashboardPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [links, setLinks] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isCommandMenuOpen, setCommandMenuOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
        if (user) fetchData();
    }, [user, authLoading, router]);
    
    // Keyboard shortcut for Command Menu (Cmd/Ctrl + K)
    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandMenuOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);


    const fetchData = useCallback(async () => {
        try { setLoadingData(true); const res = await API.get('/links'); setLinks(res.data); } 
        catch (error) { toast.error("Could not fetch data."); } 
        finally { setLoadingData(false); }
    }, []);

    const handleLinkAdded = (newLink) => setLinks(p => [newLink, ...p]);

    const handleLinkDeleted = async (deletedId) => {
        const oldLinks = [...links]; setLinks(p => p.filter(l => l._id !== deletedId));
        try { await API.delete(`/links/${deletedId}`); toast.success('Link deleted!'); } 
        catch (error) { setLinks(oldLinks); toast.error('Failed to delete.'); }
    };

    if (authLoading || !user) return <FullScreenLoader />;

    return (
        <>
            <CommandMenu open={isCommandMenuOpen} onOpenChange={setCommandMenuOpen} onLinkAdded={handleLinkAdded} />
            <div className="min-h-screen bg-slate-950">
                <DashboardHeader user={user} onLogout={logout} onCommandMenuOpen={() => setCommandMenuOpen(true)} />
                <main className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
                        <p className="text-slate-400">Your personal link sanctuary.</p>
                    </div>
                    {loadingData ? (
                        <div className="text-center py-10 text-slate-400">Loading your links...</div>
                    ) : (
                        <AnimatePresence>
                            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {links.length > 0 ? (
                                    links.map(link => <LinkCard key={link._id} link={link} onDeleted={handleLinkDeleted} />)
                                ) : (
                                    <div className="col-span-full text-center py-16">
                                        <h3 className="text-lg font-medium text-slate-200">Your Hub is Empty</h3>
                                        <p className="mt-1 text-slate-400">Press <kbd className="mx-1 text-xs border border-slate-600 rounded px-1.5 py-0.5">⌘K</kbd> to add your first link!</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </main>
            </div>
        </>
    );
}