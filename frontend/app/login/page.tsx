'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';


export default function LoginPage() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const body = new FormData();
            body.append('phone', phone);

            const res = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                body: body,
            });

            if (res.ok) {
                const data = await res.json();
                const profile = data.profile;

                // Store in localStorage for the chat to pick up
                localStorage.setItem('user_phone', profile.phone || profile.user_id);
                localStorage.setItem('user_name', profile.username || 'Citizen');
                router.push('/chat');
            } else {
                const errData = await res.json();
                setError(errData.detail || 'Login failed. Please check your number.');
            }
        } catch (err) {
            console.error(err);
            setError('Server connection failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(255,153,51,0.15),0_20px_50px_-15px_rgba(19,136,8,0.15)] border border-slate-100 overflow-hidden">
                <div className="bg-white p-10 text-center border-b-4 border-slate-50 flex flex-col items-center">
                    <div className="inline-block border-2 border-blue-100 px-6 py-2 rounded-2xl bg-blue-50/20 shadow-sm mb-4">
                        <h1 className="text-4xl font-black tracking-tighter">
                            <span className="text-[#FF9933]">Yojana</span>
                            <span className="text-slate-200">-</span>
                            <span className="text-[#138808]">Setu</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Portal Access • Digital India</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mobile Number</label>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF9933] font-black">+91</span>
                            <input
                                required
                                type="tel"
                                className="w-full bg-slate-50 pl-16 pr-5 py-5 rounded-2xl border-2 border-slate-100 text-slate-800 focus:border-[#FF9933] focus:bg-white outline-none transition-all font-bold placeholder-slate-300 shadow-sm"
                                placeholder="XXXXX XXXXX"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 px-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Secured via National Database</p>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-[#138808] hover:bg-[#0f6c06] text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 border-b-4 border-[#0a4d04]"
                    >
                        {loading ? 'VERIFYING...' : (
                            <>
                                LOGIN TO ACCOUNT
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>

                    <div className="pt-4 text-center">
                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                            New here?
                            <Link href="/register" className="ml-2 text-[#FF9933] hover:text-[#e68a00] underline decoration-[#FF9933]/20 underline-offset-4 decoration-2">
                                Create Profile
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Cultural Footer Accent */}
                <div className="flex h-1.5 w-full">
                    <div className="flex-1 bg-[#FF9933]"></div>
                    <div className="flex-1 bg-white"></div>
                    <div className="flex-1 bg-[#138808]"></div>
                </div>
            </div>
        </main>
    );
}
