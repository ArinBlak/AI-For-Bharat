'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

        // Add a placeholder for the assistant's stream
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_text: userMessage
                }),
            });

            if (!response.ok) throw new Error('API request failed');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6).trim();
                        if (dataStr === '[DONE]') continue;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.content) {
                                accumulatedContent += data.content;
                                // Update the LAST message with the accumulated stream
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1] = {
                                        role: 'assistant',
                                        content: accumulatedContent
                                    };
                                    return newMessages;
                                });
                            }
                        } catch (e) {
                            console.error('Error parsing stream chunk:', e);
                        }
                    }
                }
            }

            // After stream is done, check for actions in the final content
            const actionRegex = /\[ACTION:\s*OPEN_PORTAL\s*\|\s*scheme:\s*(.*?)\s*\|\s*details:\s*(\{.*?\})\]/;
            const match = accumulatedContent.match(actionRegex);

            if (match) {
                try {
                    const scheme = match[1].trim();
                    const details = JSON.parse(match[2]);
                    const payload = { scheme, details };

                    // Clean the action tag from the UI message
                    const cleanedContent = accumulatedContent.replace(actionRegex, '').trim();
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].content = cleanedContent || "Opening portal for application...";
                        return newMessages;
                    });

                    triggerPortalApplication(payload);
                } catch (err) {
                    console.error('Action execution failed:', err);
                }
            }

        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: 'Maaf kijiye, server se judne mein dikkat ho rahi hai.'
                };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white text-slate-800 overflow-hidden font-sans">
            {/* Indigenous Tiranga Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-slate-100 shrink-0 z-20 shadow-[0_4px_20px_-5px_rgba(255,153,51,0.2),0_4px_20px_-5px_rgba(19,136,8,0.2)]">
                <div className="flex items-center gap-4">
                    <Link href="/register" className="text-slate-400 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div className="border-2 border-blue-100 px-3 py-1 rounded-xl bg-blue-50/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <h1 className="text-2xl font-black tracking-tighter">
                            <span className="text-[#FF9933]">Yojana</span>
                            <span className="text-slate-200 transition-opacity">-</span>
                            <span className="text-[#138808]">Setu</span>
                        </h1>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setAgentBrowserVisible(!agentBrowserVisible)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${agentBrowserVisible ? 'bg-[#138808] border-[#138808] text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                    >
                        {agentBrowserVisible ? '🎯 PORTAL LIVE' : '🖥️ GOV PORTAL'}
                    </button>
                    <Link href="/" className="px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all">
                        HOME
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Chat Panel (Full width focus) */}
                <main className={`transition-all duration-700 flex flex-col ${agentBrowserVisible ? 'flex-[0.5]' : 'flex-1'} bg-white`}>
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 no-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-10">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-700`}
                                >
                                    <div className={`
                                        max-w-[85%] sm:max-w-[75%] px-6 py-5 rounded-2xl transition-all
                                        ${msg.role === 'user'
                                            ? 'bg-orange-50 border-2 border-[#FF9933] text-orange-900 shadow-sm'
                                            : 'bg-white text-slate-800 border-l-4 border-l-[#FF9933] border-r-4 border-r-[#138808] border-t border-b border-slate-100 shadow-[0_10px_30px_-10px_rgba(255,153,51,0.2),0_10px_30px_-10px_rgba(19,136,8,0.2)]'}
                                    `}>
                                        <div className={`text-[10px] font-black uppercase tracking-widest mb-3 ${msg.role === 'user' ? 'text-orange-600' : 'text-[#FF9933]'}`}>
                                            {msg.role === 'user' ? 'Citizen Request' : 'Yojna Setu Assistance'}
                                        </div>
                                        <div className={`prose prose-sm max-w-none font-medium leading-[1.8] ${msg.role === 'user' ? 'prose-orange' : 'prose-slate'}`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl flex gap-3 items-center">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-[#FF9933] rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-2 h-2 bg-[#138808] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Processing Scheme Data...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Chat Input - Floating Indigenous Design */}
                    <div className="p-6 bg-white border-t border-slate-100">
                        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Puchhiye: PM Kisan eligibility kya hai?"
                                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF9933] focus:bg-white transition-all font-semibold shadow-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-[#138808] hover:bg-[#0f6c06] disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center border-b-4 border-[#0a4d04]"
                            >
                                <span className="font-black">SEND</span>
                            </button>
                        </form>
                        <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">Digital India • Yojana-Setu AI Powered</p>
                    </div>
                </main>

                {/* Agent Browser (Right Side - Conditional for Demo) */}
                {agentBrowserVisible && (
                    <div className="w-1/2 relative bg-slate-50 border-l-4 border-slate-100 animate-in slide-in-from-right duration-700">
                        <iframe
                            ref={iframeRef}
                            src="/gov-portal"
                            className="w-full h-full border-none"
                            title="Government Portal"
                        />
                        <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] text-slate-900 text-[10px] font-black text-center uppercase tracking-widest shadow-sm">
                            Real-Time Agent Automation Active
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
