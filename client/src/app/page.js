"use client"; // We need this for Framer Motion and other hooks

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Tag, Search, Check, Shield } from 'lucide-react';
import React from 'react';

// ====================================================================
// 1. MAIN PAGE COMPONENT
// This is the main component that assembles all other sections.
// ====================================================================
// client/src/app/page.js -> HomePage component එක

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070911] text-white antialiased">
      <Header />
      {/* THE FIX IS HERE: We adjust the top padding of the main content area */}
      <main className="flex-grow pt-[40px]"> {/* Changed from pt-20 to a specific pixel value */}
        <HeroSection />
        <FeatureGrid />
        <HowItWorksSection />
        <TestimonialSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}


// ====================================================================
// 2. SUB-COMPONENTS FOR THE PAGE
// We define all the building blocks of our page here for clarity.
// ====================================================================

// client/src/app/page.js -> Header component එක

const Header = () => (
    // Main header tag: This will span the full width
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gradient-to-b from-slate-950/80 to-slate-950/20 backdrop-blur-lg">
        {/* Container: This will center the content */}
        <div className="container mx-auto px-6">
            <nav className="flex justify-between items-center py-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold">
                    Link<span className="text-blue-500">Hub</span>
                </Link>

                {/* Navigation Links (Center) */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
                    <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
                </div>
                
                {/* Action Buttons (Right) */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>
        </div>
    </header>
);

const HeroSection = () => (
  <section className="relative text-center pt-24 pb-32 px-6 overflow-hidden">
    {/* Subtle Aurora Gradient Background */}
    <div className="aurora-background"></div>

    {/* Animated Grid Background */}
    <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>
    
    <div className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 !leading-tight">
          Beyond Bookmarks.
        </h1>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 animate-gradient bg-[200%_auto] !leading-tight mt-2">
          Your Intelligent Link Hub.
        </h2>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 max-w-2xl mx-auto text-lg text-slate-400"
      >
        A sophisticated, AI-powered platform to capture, organize, and rediscover your digital knowledge. Stop searching, start finding.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10"
      >
        <Link
          href="/register"
          className="bg-white text-slate-900 px-8 py-3 rounded-md font-semibold text-lg hover:bg-slate-200 transition-colors transform hover:scale-105 inline-flex items-center gap-2"
        >
          Get Started - It's Free <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  </section>
);

const FeatureGrid = () => {
    const features = [
        {
            title: "Smart Categorization",
            description: "Automatically sort your links into relevant categories like 'DevOps', 'AI', or 'Design'.",
            icon: <Layers />,
            className: "md:col-span-2",
            bgColor: "bg-blue-950/50",
        },
        {
            title: "AI-Powered Tagging",
            description: "Our AI analyzes link content to suggest relevant tags, making your collection effortlessly searchable.",
            icon: <Tag />,
            className: "md:col-span-1",
            bgColor: "bg-green-950/50",
        },
        {
            title: "Instant Semantic Search",
            description: "Search for concepts, not just keywords. Find 'how to deploy a node app' even if you saved a link titled 'server setup'.",
            icon: <Search />,
            className: "md:col-span-1",
            bgColor: "bg-purple-950/50",
        },
        {
            title: "Secure & Private by Design",
            description: "Your data is yours. End-to-end encryption ensures your link collection remains confidential.",
            icon: <Shield />,
            className: "md:col-span-2",
            bgColor: "bg-red-950/50",
        },
    ];

    return (
        <section className="py-24 px-6" id="features">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold text-white">A Smarter Way to Manage Knowledge</h2>
                     <p className="mt-4 text-slate-400 max-w-2xl mx-auto">LinkHub isn't just about saving links. It's about building a second brain that works for you.</p>
                </div>
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            className={`p-8 rounded-2xl border border-white/10 ${feature.bgColor} ${feature.className}`}
                        >
                            <div className="text-white mb-4">{feature.icon}</div>
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const HowItWorksSection = () => {
    const steps = [
        { number: "01", title: "Capture Any Link", description: "Save articles, videos, or repos from anywhere on the web with a single click or command." },
        { number: "02", title: "Auto-Categorize & Tag", description: "Our AI engine analyzes the content and intelligently assigns categories and tags for you." },
        { number: "03", title: "Find in an Instant", description: "Use our powerful semantic search to find what you need, exactly when you need it." }
    ];

    return (
        <section className="py-24 px-6 bg-slate-900/50 border-y border-slate-800">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                     <h2 className="text-3xl md:text-4xl font-bold text-white">Effortless, from Start to Finish</h2>
                     <p className="mt-4 text-slate-400 max-w-xl mx-auto">Three simple steps to build your second brain.</p>
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute top-8 left-0 w-full h-px">
                        <svg width="100%" height="100%"><line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="2" strokeDasharray="8 8" className="stroke-slate-700"/></svg>
                    </div>
                    
                    <div className="relative grid md:grid-cols-3 gap-12">
                        {steps.map((step, i) => (
                            <div key={i} className="text-center">
                                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-full text-xl font-bold text-blue-400">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-slate-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const TestimonialSection = () => {
    return (
        <section className="py-24 px-6">
            <div className="container mx-auto max-w-3xl">
                <div className="bg-transparent border border-slate-800 rounded-2xl p-8 md:p-12 text-center">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User Testimonial" className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-slate-700" />
                    <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                        "LinkHub has completely changed how I manage my learning resources. The AI tagging is a game-changer. I'm saving hours every week. I can't imagine my workflow without it now."
                    </blockquote>
                    <cite className="block mt-6 not-italic">
                        <span className="font-semibold text-slate-200">Sarah Dole</span>
                        <br/>
                        <span className="text-slate-400">Lead Frontend Engineer @ Vercel</span>
                    </cite>
                </div>
            </div>
        </section>
    );
};

const PricingSection = () => {
    const plans = [
        {
            name: "Hobby",
            price: "$0",
            description: "For individuals and casual link savers. Get started for free, forever.",
            features: ["Up to 100 links", "Basic categorization", "Standard search"],
            cta: "Start for Free",
            isFeatured: false,
        },
        {
            name: "Pro",
            price: "$8",
            description: "For power users and professionals who need advanced features.",
            features: ["Unlimited links", "AI-powered auto-tagging", "Semantic search", "Team collaboration (soon)"],
            cta: "Go Pro",
            isFeatured: true,
        },
    ];

    return (
        <section className="py-24 px-6" id="pricing">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                     <h2 className="text-3xl md:text-4xl font-bold text-white">Find the Perfect Plan</h2>
                     <p className="mt-4 text-slate-400 max-w-xl mx-auto">Start for free and scale up as your knowledge base grows.</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`border rounded-2xl p-8 flex flex-col ${plan.isFeatured ? 'border-blue-500 bg-slate-900' : 'border-slate-800'}`}>
                            <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                            <p className="text-slate-400 mt-2 min-h-[40px]">{plan.description}</p>
                            <div className="mt-6">
                                <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                                {plan.price !== "$0" && <span className="text-slate-500"> / month</span>}
                            </div>
                            <ul className="mt-8 space-y-4 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register" className={`mt-10 block text-center w-full py-3 rounded-md font-semibold transition-colors ${plan.isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="py-8 px-6 border-t border-white/10 mt-20">
        <div className="container mx-auto flex justify-between items-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} LinkHub Inc. All rights reserved.</p>
        <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Docs</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
        </div>
        </div>
    </footer>
);