'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { LogOut, Plus, Search, Trash, Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';

// ====================================================================
//  Reusable UI Components
// ====================================================================
const FullScreenLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-950">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500"></div>
  </div>
);

const DashboardHeader = ({ user, onLogout }) => (
  <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
    <div className="container mx-auto px-6 py-3">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold">Link<span className="text-blue-400">Hub</span></Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-300 hidden sm:block">Welcome, {user?.name}!</span>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-white" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
);

const LinkCard = ({ link, onDeleted }) => {
  let hostname = 'unknown';
  let faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  let screenshotUrl = '';
  try {
    const urlObj = new URL(link.url);
    hostname = urlObj.hostname.replace('www.', '');
    faviconUrl = `https://logo.clearbit.com/${hostname}`;
    screenshotUrl = `https://image.thum.io/get/width/600/crop/800/https://${hostname}`;
  } catch (e) {
    console.error("Invalid URL for card:", link.url);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/50"
    >
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="block h-32 bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url(${screenshotUrl})` }}></a>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <img src={faviconUrl} alt="favicon" className="w-4 h-4 rounded-full bg-white/20" onError={(e) => e.target.style.display = 'none'} />
          <p className="text-xs text-slate-400 break-all truncate">{hostname}</p>
        </div>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-100 hover:text-blue-400 break-words line-clamp-2 text-md">{link.title}</a>
        <div className="pt-3 mt-3 flex justify-between items-center">
          <span className="text-xs font-medium text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full">{link.project || 'General'}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => { navigator.clipboard.writeText(link.url); toast.success('Link copied!'); }} className="p-1.5 rounded-full text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-white" title="Copy URL">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={() => onDeleted(link._id)} className="p-1.5 rounded-full text-slate-400 bg-slate-800 hover:bg-red-900/50 hover:text-white" title="Delete">
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ====================================================================
//  NewLinkFormModal Component (Minimal Working Implementation)
// ====================================================================
const NewLinkFormModal = ({ onClose, onLinkAdded }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [project, setProject] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !url || !project) {
      toast.error("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/links', { title, url, project });
      onLinkAdded(res.data);
      toast.success("Link added!");
      onClose();
    } catch (error) {
      toast.error("Failed to add link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-slate-900 p-6 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white"><X /></button>
        <h2 className="text-xl font-bold mb-4 text-white">Add New Link</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-white/5 text-slate-300 rounded border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-2 bg-white/5 text-slate-300 rounded border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Project" value={project} onChange={(e) => setProject(e.target.value)} className="w-full p-2 bg-white/5 text-slate-300 rounded border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 rounded text-white hover:bg-blue-700">{loading ? 'Adding...' : 'Add Link'}</button>
        </form>
      </div>
    </motion.div>
  );
};


// ====================================================================
//  THE MAIN DASHBOARD PAGE
// ====================================================================
export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [projects, setProjects] = useState(['All Projects']);
  const [loadingData, setLoadingData] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [linksRes, projectsRes] = await Promise.all([
        API.get('/links', { params: { project: selectedProject, search: searchTerm.trim() } }),
        API.get('/links/projects')
      ]);
      setLinks(linksRes.data);
      setProjects(['All Projects', ...projectsRes.data]);
    } catch (error) {
      toast.error("Could not fetch data.");
    } finally {
      setLoadingData(false);
    }
  }, [selectedProject, searchTerm]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const handler = setTimeout(fetchData, 300);
      return () => clearTimeout(handler);
    }
  }, [user, fetchData]);

  const handleLinkAdded = (newLink) => {
    setLinks(p => [newLink, ...p]);
    if (newLink.project && !projects.includes(newLink.project)) {
      setProjects(p => [...p, newLink.project]);
    }
  };

  const handleLinkDeleted = async (deletedId) => {
    const oldLinks = [...links];
    setLinks(links.filter(l => l._id !== deletedId));
    try {
      await API.delete(`/links/${deletedId}`);
      toast.success('Link deleted!');
      fetchData();
    } catch (error) {
      setLinks(oldLinks);
      toast.error('Failed to delete link.');
    }
  };

  const breakpointColumnsObj = { default: 3, 1280: 3, 1024: 2, 768: 1 };

  if (authLoading || !user) return <FullScreenLoader />;

  return (
    <>
      <div className="min-h-screen">
        <DashboardHeader user={user} onLogout={logout} />
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h2 className="text-sm font-semibold text-slate-400 mb-3">Search</h2>
                  <div className="relative">
                    <input type="text" placeholder="By title, URL..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 pl-9 bg-white/5 text-slate-300 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-400 mb-3">Filter by Project</h2>
                  <div className="space-y-2">
                    {projects.map((p, i) => (
                      <button key={i} onClick={() => setSelectedProject(p)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedProject === p ? 'bg-blue-500/20 text-blue-300 font-semibold' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Feed */}
            <div className="lg:col-span-9">
              {loadingData ? (
                <div className="text-center py-20 text-slate-400">Initializing Mission Control...</div>
              ) : (
                <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                  {links.length > 0 ? (
                    links.map(link => <LinkCard key={link._id} link={link} onDeleted={handleLinkDeleted} />)
                  ) : (
                    <div className="text-center py-20 px-6 bg-white/5 border border-dashed border-white/10 rounded-xl">
                      <h3 className="text-lg font-medium text-slate-200">No Links Found</h3>
                      <p className="mt-1 text-slate-400">Try a different filter or add a new link.</p>
                    </div>
                  )}
                </Masonry>
              )}
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <button onClick={() => setShowModal(true)} className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transform hover:scale-110 transition-all">
          <Plus size={32} />
        </button>
      </div>

      <AnimatePresence>
        {showModal && <NewLinkFormModal onClose={() => setShowModal(false)} onLinkAdded={handleLinkAdded} />}
      </AnimatePresence>
    </>
  );
}
