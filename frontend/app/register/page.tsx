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
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-blue-600 p-8 text-white text-center">
                    <h1 className="text-3xl font-bold">Yojana-Setu</h1>
                    <p className="opacity-80 mt-2">Create your Citizen Account</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Pura Naam (Full Name)</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. Arijeet Banerjee"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                        <input
                            required
                            type="tel"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Register & Start Chat'}
                    </button>
                </form>
            </div>
        </main>
    );
}
