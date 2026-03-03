'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const body = new FormData();
            body.append('username', formData.username);
            body.append('email', formData.email);
            body.append('phone', formData.phone);

            const res = await fetch('http://localhost:8000/register', {
                method: 'POST',
                body: body,
            });

            if (res.ok) {
                // Store phone in localStorage for the chat to pick up
                localStorage.setItem('user_phone', formData.phone);
                localStorage.setItem('user_name', formData.username);
                router.push('/chat');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(255,153,51,0.2),0_20px_50px_-15px_rgba(19,136,8,0.1)] border-t-8 border-[#FF9933] overflow-hidden relative">
                {/* Subtle bottom tricolor accent */}
                <div className="absolute bottom-0 left-0 w-full h-2 flex">
                    <div className="h-full w-1/3 bg-[#FF9933]"></div>
                    <div className="h-full w-1/3 bg-white"></div>
                    <div className="h-full w-1/3 bg-[#138808]"></div>
                </div>

                <div className="pt-12 pb-6 text-center border-b border-slate-50 flex flex-col items-center">
                    <div className="inline-block border-2 border-blue-100 px-6 py-2 rounded-2xl bg-blue-50/20 shadow-sm mb-4">
                        <h1 className="text-3xl font-black tracking-tighter">
                            <span className="text-[#FF9933]">Yojana</span>
                            <span className="text-slate-200 mx-0.5">-</span>
                            <span className="text-[#138808]">Setu</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Citizen Registration Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pura Naam (Full Name)</label>
                        <input
                            required
                            type="text"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#FF9933]/30 focus:ring-4 focus:ring-[#FF9933]/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                            placeholder="Arijeet Banerjee"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#FF9933]/30 focus:ring-4 focus:ring-[#FF9933]/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                            placeholder="name@digitalindia.gov.in"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Number</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF9933] font-black">+91</span>
                            <input
                                required
                                type="tel"
                                className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#138808]/30 focus:ring-4 focus:ring-[#138808]/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                placeholder="XXXXX XXXXX"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-[#138808] hover:bg-[#0f6d06] text-white font-black py-4 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-tighter text-lg border-b-4 border-black/20"
                    >
                        {loading ? 'Processing...' : 'Satyapan & Start'}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                            Already have an account?
                            <a href="/login" className="ml-2 text-[#FF9933] hover:underline">Login here</a>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}
