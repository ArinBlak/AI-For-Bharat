'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agentBrowserVisible, setAgentBrowserVisible] = useState(false);
    const [userPhone, setUserPhone] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const phone = localStorage.getItem('user_phone');
        const name = localStorage.getItem('user_name');

        if (phone && name) {
            setUserPhone(phone);
            setUserName(name);
            setMessages([
                {
                    role: 'assistant',
                    content: `Namaste ${name}! Main Yojna Setu AI hoon. Main aapki sarkari yojanaon (government schemes) ke baare mein jaankari paane aur aavedan (apply) karne mein madad kar sakta hoon. Aap mujhse kisi bhi scheme ke baare mein pooch sakte hain.`
                }
            ]);
        } else {
            // If no registration, redirect back or use default
            setUserPhone('9876543210');
            setUserName('Guest User');
            setMessages([
                {
                    role: 'assistant',
                    content: 'Namaste! Kripya register karein ya chat shuru karein.'
                }
            ]);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const triggerPortalApplication = (payload: any) => {
        setAgentBrowserVisible(true);
        // Wait for iframe to load, then send message
        setTimeout(() => {
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: 'AUTO_FILL',
                    payload: payload
                }, '*');
            }
        }, 1500);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('message', userMessage);
            formData.append('phone', userPhone || '9876543210');
            formData.append('history', JSON.stringify(messages));

            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            let replyContent = data.reply;

            // Robust regex to extract action and parameters
            // New Format: [ACTION: OPEN_PORTAL | scheme: X | details: {JSON}]
            const actionRegex = /\[ACTION:\s*OPEN_PORTAL\s*\|\s*scheme:\s*(.*?)\s*\|\s*details:\s*(\{.*?\})\]/;
            const match = replyContent.match(actionRegex);

            if (match) {
                try {
                    const scheme = match[1].trim();
                    const details = JSON.parse(match[2]);

                    const payload = {
                        scheme: scheme,
                        details: details
                    };

                    // Remove the action tag from display
                    replyContent = replyContent.replace(actionRegex, '').trim();

                    // Fallback if AI only sends the tag without text
                    if (!replyContent) {
                        replyContent = "Theek hai! Mujhe saari jankari mil gayi hai. Main ab portal par aapka application bhar raha hoon. Kripya screen par dekhiye...";
                    }

                    setMessages(prev => [...prev, { role: 'assistant', content: replyContent }]);

                    // Start the agent browser flow
                    triggerPortalApplication(payload);
                } catch (parseError) {
                    console.error('Action Parse Error:', parseError);
                    replyContent = replyContent.replace(actionRegex, '').trim();
                    setMessages(prev => [...prev, { role: 'assistant', content: replyContent }]);
                }
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: replyContent }]);
            }

        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: 'Maaf kijiye, server se judne mein dikkat ho rahi hai.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
            {/* Dark Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0 z-20 shadow-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/register" className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Yojana-Setu Agentic Demo
                        </h1>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            AI Caseworker • {userName}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setAgentBrowserVisible(!agentBrowserVisible)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${agentBrowserVisible ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                    >
                        {agentBrowserVisible ? '🎯 AGENT AT WORK' : '🖥️ BROWSER IDLE'}
                    </button>
                    <Link href="/" className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300">
                        HOME
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Chat Panel (Left) */}
                <main className={`transition-all duration-700 flex flex-col border-r border-slate-800 ${agentBrowserVisible ? 'flex-[0.8]' : 'flex-1'}`}>
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                        <div className="max-w-2xl mx-auto space-y-8">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                                >
                                    <div className={`
                                        max-w-[90%] px-5 py-4 rounded-2xl shadow-xl transition-all
                                        ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white ring-1 ring-blue-400/50'
                                            : 'bg-slate-800/90 backdrop-blur-md text-slate-100 border border-slate-700'}
                                    `}>
                                        <div className="text-[10px] font-black uppercase tracking-tighter mb-2 opacity-40">
                                            {msg.role === 'user' ? 'Citizen Request' : 'Yojna Setu Reasoning'}
                                        </div>
                                        <p className="leading-relaxed font-medium text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-700 flex gap-2 items-center">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Analyzing Profile...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-6 bg-slate-900 border-t border-slate-800 shadow-inner">
                        <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Example: Apply for Ladli Behna Yojana..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </main>

                {/* Agent Browser (Iframe) */}
                <div className={`transition-all duration-700 flex-1 relative bg-white ${agentBrowserVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                    {/* Iframe pointing to the standalone gov portal */}
                    <iframe
                        ref={iframeRef}
                        src="/gov-portal"
                        className="w-full h-full border-none shadow-2xl"
                        title="Government Portal"
                    />

                    {/* Agent Live Control Overlay */}
                    <div className="absolute top-0 left-0 w-full p-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold text-center uppercase tracking-[0.2em] shadow-md z-10">
                        Autonomous Agent Monitoring: External Session Active
                    </div>
                </div>
            </div>
        </div>
    );
}
