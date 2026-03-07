'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Case } from "@/components/ui/cases-with-infinite-scroll";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { Feature } from "@/components/ui/feature-with-image-carousel";
import DisplayCards from "@/components/ui/display-cards";
import { Languages, Bot, Mic, RefreshCw, Sparkles, Play, Pause, Volume2, Github, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useRef } from 'react';
import Preloader from "@/components/Preloader";

export default function HomeLandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#FF9933]/30 selection:text-[#FF9933] overflow-x-hidden relative">
            <Preloader />

            {/* Top Pattern Banner (Like Sarvam's 'Indus is live in beta') */}
            <div className="bg-[#e86a33] text-white text-xs md:text-sm font-semibold flex items-center justify-center py-2.5 px-4 gap-3 relative z-50 overflow-hidden">
                {/* Subtle pattern over banner */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz4KPC9zdmc+')" }}></div>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] tracking-widest uppercase">New</span>
                <span>Yojana-Setu is live for Bharat. Try Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative top-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </div>

            {/* Ambient Top Gradients (Saffron & Green) */}
            <div className="absolute top-0 inset-x-0 h-[800px] pointer-events-none z-0 overflow-hidden flex justify-center">
                {/* Main Saffron (Orange) Gradient Blob at Top Center (Like Sarvam's top orange) */}
                <div className="absolute top-[-300px] w-[90vw] h-[600px] bg-[#FF9933]/75 blur-[120px] rounded-[100%]"></div>

                {/* Green Gradient Blobs on the sides (Where Sarvam had blue) */}
                <div className="absolute top-[-100px] left-[-5%] w-[45vw] h-[550px] bg-[#138808]/45 blur-[130px] rounded-[100%]"></div>
                <div className="absolute top-[-100px] right-[-5%] w-[45vw] h-[550px] bg-[#138808]/45 blur-[130px] rounded-[100%]"></div>

                {/* Center blend effect */}
                <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-transparent via-[#fafafa]/70 to-[#fafafa]"></div>
            </div>

            {/* Navbar */}
            <nav className={`fixed top-[40px] w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">

                    {/* Logo matched to provided screenshot (Raw text, no pill) */}
                    <Link href="/home" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                        <span className="text-[32px] font-black tracking-tighter" style={{ WebkitTextStroke: '1px white' }}>
                            <span className="text-[#FF9933]">Yojana</span>
                            <span className="text-slate-900 mx-1" style={{ WebkitTextStroke: '0px' }}>-</span>
                            <span className="text-[#138808]">Setu</span>
                        </span>
                    </Link>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link href="#platform" className="text-[12px] uppercase tracking-widest font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                            Platform <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                        <Link href="#citizens" className="text-[12px] uppercase tracking-widest font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                            Citizens <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                        <Link href="#about" className="text-[12px] uppercase tracking-widest font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                            About <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-black py-2 px-4 rounded-full transition-colors border border-transparent hover:border-slate-300">
                            Facilitator Login
                        </Link>
                        <Link href="/" className="px-6 py-2.5 rounded-full bg-[#222] text-white font-medium text-sm transition-all hover:bg-black shadow-lg shadow-black/10 hover:shadow-black/20 flex items-center gap-2 border border-slate-700">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-[250px] pb-20 flex flex-col items-center px-6 text-center min-h-screen">

                {/* Decorative flourish (from public uploaded file) */}
                <div className="z-10 relative mt-[-100px] mb-6">
                    {/* mix-blend-multiply is critical here to remove the hard white background from the PNG! */}
                    <img src="/design.png" alt="Decorative Flourish" className="mx-auto block mix-blend-multiply opacity-80" style={{ width: '500px', objectFit: 'contain' }} />
                </div>

                {/* Pill Badge */}
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full mb-8 bg-blue-50/50 border border-blue-100/50 backdrop-blur-sm shadow-sm">
                    <span className="text-[13px] font-semibold text-blue-600">
                        Bharat's First Phygital AI Platform
                    </span>
                </div>

                {/* Main Headline (Serif-style, elegant) */}
                <h1 className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-tight leading-[1.05] mb-8 max-w-4xl text-slate-900 font-serif mx-auto">
                    AI designed for all of Bharat
                </h1>

                {/* Subheadline */}
                <p className="text-xl md:text-[22px] text-slate-600 max-w-3xl mb-12 font-serif font-light leading-relaxed">
                    Built for Indian citizens. Powered by frontier-class voice models. <br className="hidden md:block" />
                    Delivering population-scale impact through native languages.
                </p>

                {/* Dark Pill CTA */}
                <Link href="/register" className="group flex items-center justify-center px-8 py-3.5 bg-[#222] hover:bg-black text-white rounded-full font-medium text-lg transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-[#444] mb-24">
                    Experience Yojana-Setu
                </Link>

                {/* Integrated Infinite Scroll Logos Component */}
                <div className="w-full mb-32">
                    <Case />
                </div>

                {/* About Section with Text Gradient Scroll */}
                <section id="about" className="w-full max-w-5xl mx-auto py-32 px-6 flex flex-col items-center text-center">
                    <div className="mb-10 text-xs font-bold uppercase tracking-[0.3em] text-[#FF9933]">
                        Our Mission
                    </div>
                    <TextGradientScroll
                        className="text-4xl md:text-5xl lg:text-5xl font-serif text-slate-900 leading-[1.3] text-center justify-center"
                        text="Yojana-Setu is envisioned as the ultimate bridge between government initiatives and the citizens of Bharat. By harnessing the power of frontier-class voice AI and native language models, we are breaking down the barriers of literacy and technology. Our mission is to ensure that every citizen, regardless of their location or language, has seamless access to the life-changing schemes they deserve. This is not just a portal; it is a movement towards a truly digital and inclusive India."
                    />
                </section>

                {/* Feature Section with Platform Carousel */}
                <Feature />

                {/* Scewed Feature Cards Section */}
                <section className="w-full py-32 px-6 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
                        <div className="flex-1 space-y-6 text-left items-start">
                            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight text-left">
                                Built with cutting-edge <br /> AI infrastructure
                            </h2>
                            <p className="text-xl text-slate-600 font-light max-w-lg text-left">
                                We leverage the latest in agentic frameworks and large language models to ensure every interaction is precise, relevant, and helpful.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-8 text-left">
                                <div className="space-y-2 text-left">
                                    <div className="text-[#FF9933] font-bold text-2xl">99.9%</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-widest">Accuracy</div>
                                </div>
                                <div className="space-y-2 text-left">
                                    <div className="text-[#138808] font-bold text-2xl">22+</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-widest">Languages</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center md:justify-start md:-ml-20 md:-mt-40">
                            <DisplayCards
                                cards={[
                                    {
                                        title: "Multilanguage Model",
                                        description: "Bhashini integration for 22+ languages",
                                        date: "Core Engine",
                                        icon: <Sparkles className="size-4 text-orange-400" />,
                                        iconClassName: "text-orange-500",
                                        titleClassName: "text-orange-500",
                                        className: "[grid-area:stack] hover:-translate-y-12 transition-all duration-500"
                                    },
                                    {
                                        title: "Agentic Automation",
                                        description: "Automated form filling & scheme mapping",
                                        date: "Active Agent",
                                        icon: <Sparkles className="size-4 text-green-400" />,
                                        iconClassName: "text-green-500",
                                        titleClassName: "text-green-500",
                                        className: "[grid-area:stack] translate-x-12 translate-y-16 hover:translate-y-4 transition-all duration-500 before:absolute before:inset-0 before:bg-white/5 before:backdrop-blur-[1px] grayscale-[50%] hover:grayscale-0"
                                    },
                                    {
                                        title: "Voice Model Support",
                                        description: "AI-driven voice interface for all citizens",
                                        date: "Voice-First",
                                        icon: <Sparkles className="size-4 text-blue-400" />,
                                        iconClassName: "text-blue-500",
                                        titleClassName: "text-blue-500",
                                        className: "[grid-area:stack] translate-x-24 translate-y-32 hover:translate-y-20 transition-all duration-500 before:absolute before:inset-0 before:bg-white/5 before:backdrop-blur-[1px] grayscale-[50%] hover:grayscale-0"
                                    },
                                    {
                                        title: "Real-time Updation",
                                        description: "Instant data sync across govt. portals",
                                        date: "Live Sync",
                                        icon: <Sparkles className="size-4 text-purple-400" />,
                                        iconClassName: "text-purple-500",
                                        titleClassName: "text-purple-500",
                                        className: "[grid-area:stack] translate-x-36 translate-y-48 hover:translate-y-36 transition-all duration-500 before:absolute before:inset-0 before:bg-white/5 before:backdrop-blur-[1px] grayscale-[50%] hover:grayscale-0"
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </section>

                {/* Video & Audio Section */}
                <section className="w-full py-24 px-6 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Video Card */}
                        <div className="relative group rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-slate-50 transition-transform hover:scale-[1.01] duration-500 h-[400px]">
                            <video
                                className="w-full h-full object-cover"
                                poster="/view1.png"
                                controls
                                preload="none"
                            >
                                <source src="/video.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="absolute top-6 left-6 z-10">
                                <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold tracking-wide border border-white/20">
                                    Product Demo
                                </span>
                            </div>
                        </div>

                        {/* Ornate Audio Card */}
                        <div className="flex flex-col items-center justify-center space-y-8 py-10">
                            <div className="relative flex items-center justify-center">
                                {/* Ornate Background Shape */}
                                <div className="absolute w-[360px] h-[360px] md:w-[480px] md:h-[480px] animate-[spin_20s_linear_infinite] opacity-80 pointer-events-none">
                                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#F58220]">
                                        <path
                                            fill="currentColor"
                                            d="M100 0 C110 40 160 40 160 100 C160 160 110 160 100 200 C90 160 40 160 40 100 C40 40 90 40 100 0 M100 30 C130 30 170 70 170 100 C170 130 130 170 100 170 C70 170 30 130 30 100 C30 70 70 30 100 30"
                                            className="opacity-20"
                                        />
                                        <g transform="translate(100, 100)">
                                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                                                <path
                                                    key={angle}
                                                    transform={`rotate(${angle})`}
                                                    fill="currentColor"
                                                    d="M0 -90 C15 -70 25 -40 0 -20 C-25 -40 -15 -70 0 -90"
                                                    className="opacity-40"
                                                />
                                            ))}
                                            <circle cx="0" cy="0" r="70" fill="url(#grad1)" />
                                        </g>
                                        <defs>
                                            <radialGradient id="grad1">
                                                <stop offset="0%" stopColor="#F9A03F" />
                                                <stop offset="100%" stopColor="#F58220" />
                                            </radialGradient>
                                        </defs>
                                    </svg>
                                </div>

                                {/* Inner Shadow Shape (The flower look) */}
                                <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                                        <path
                                            fill="#F58220"
                                            d="M100 20 C115 50 150 50 180 100 C150 150 115 150 100 180 C85 150 50 150 20 100 C50 50 85 50 100 20"
                                            className="opacity-90"
                                        />
                                        <path
                                            fill="#F9A03F"
                                            d="M100 40 C110 65 140 65 160 100 C140 135 110 135 100 160 C90 135 60 135 40 100 C60 65 90 65 100 40"
                                        />
                                    </svg>
                                </div>

                                {/* Central Content (Button + Text) */}
                                <div className="z-20 flex flex-col items-center justify-center space-y-6">
                                    <button
                                        onClick={toggleAudio}
                                        className="group relative flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/40 rounded-full text-white font-bold text-lg shadow-2xl transition-all active:scale-95 hover:bg-white/20 hover:border-white/60"
                                    >
                                        <div className="size-8 flex items-center justify-center bg-white rounded-full text-[#F58220] transition-transform group-hover:scale-110">
                                            {isPlaying ? <Pause className="fill-current size-5" /> : <Play className="fill-current size-5 translate-x-0.5" />}
                                        </div>
                                        <span className="tracking-tight">
                                            {isPlaying ? "Pause Intro" : "Listen to Shubh"}
                                        </span>
                                    </button>
                                </div>

                                <audio ref={audioRef} onEnded={() => setIsPlaying(false)}>
                                    <source src="/subh.mp3" type="audio/mpeg" />
                                </audio>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Premium Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-serif font-black tracking-tighter">
                                    <span className="text-[#FF9933]">Yojana</span>
                                    <span className="text-slate-300 mx-1">/</span>
                                    <span className="text-[#138808]">Setu</span>
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                                Intelligence designed for all of Bharat. Bridging the gap between government schemes and citizens through cutting-edge AI.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="#" className="size-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#FF9933] hover:border-[#FF9933]/50 transition-all shadow-sm">
                                    <Github className="size-5" />
                                </Link>
                                <Link href="#" className="size-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 transition-all shadow-sm">
                                    <Twitter className="size-5" />
                                </Link>
                                <Link href="#" className="size-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0077B5] hover:border-[#0077B5]/50 transition-all shadow-sm">
                                    <Linkedin className="size-5" />
                                </Link>
                                <Link href="#" className="size-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#E4405F] hover:border-[#E4405F]/50 transition-all shadow-sm">
                                    <Instagram className="size-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Platform Column */}
                        <div className="space-y-6">
                            <h4 className="text-slate-900 font-bold uppercase tracking-widest text-xs">Platform</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-slate-500 hover:text-[#FF9933] transition-colors text-sm font-medium">AI Core Engine</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-[#FF9933] transition-colors text-sm font-medium">Agentic Framework</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-[#FF9933] transition-colors text-sm font-medium">Bhashini Integration</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-[#FF9933] transition-colors text-sm font-medium">Developer API</Link></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div className="space-y-6">
                            <h4 className="text-slate-900 font-bold uppercase tracking-widest text-xs">Company</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-slate-500 hover:text-[#FF9933] transition-colors text-sm font-medium">About Mission</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-[#FF9933] transition-colors text-sm font-medium">Our Story</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-[#FF9933] transition-colors text-sm font-medium">Team Bharat</Link></li>
                                <li><Link href="#" className="text-slate-500 hover:text-[#FF9933] transition-colors text-sm font-medium">Careers</Link></li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="space-y-6">
                            <h4 className="text-slate-900 font-bold uppercase tracking-widest text-xs">Contact Us</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-500 text-sm">
                                    <MapPin className="size-5 text-[#FF9933] shrink-0" />
                                    <span>AI Research Lab, New Delhi, India</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-500 text-sm">
                                    <Mail className="size-5 text-[#FF9933] shrink-0" />
                                    <span>contact@yojanasetu.gov.in</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-500 text-sm">
                                    <Phone className="size-5 text-[#FF9933] shrink-0" />
                                    <span>+91 1800-AI-BHARAT</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-400 text-xs">
                            © 2026 Yojana-Setu AI. Designed with ❤️ for a digital Bharat.
                        </p>
                        <div className="flex gap-8">
                            <Link href="#" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">Privacy Policy</Link>
                            <Link href="#" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">Terms of Service</Link>
                            <Link href="#" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
