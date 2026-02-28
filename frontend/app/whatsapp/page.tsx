'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    isAudio?: boolean;
}

export default function WhatsAppSimulator() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Namaste! I am Yojana-Setu, your AI assistant for government schemes. How can I help you today?',
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMsg]);
        const currentInput = inputText;
        setInputText('');

        try {
            const formData = new FormData();
            formData.append('message', currentInput);
            formData.append('phone', '9876543210'); // Default for demo
            formData.append('history', JSON.stringify(messages.slice(-5).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: [{ text: m.text }]
            }))));

            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            const aiMsg: Message = {
                id: Date.now().toString(),
                text: data.reply,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg: Message = {
                id: Date.now().toString(),
                text: "Maaf kijiye, backend se connect nahi ho pa raha. Check if server is running.",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            // Logic to stop and send
            setIsRecording(false);
            // Mocking voice send for now as actual MediaRecorder needs delicate handling
            const mockVoiceMsg: Message = {
                id: Date.now().toString(),
                text: "🎤 Voice message sent",
                sender: 'user',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isAudio: true
            };
            setMessages(p => [...p, mockVoiceMsg]);

            // Call process-voice endpoint
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Samjha! Aapka awaz record ho gaya hai. Main use transcribe kar raha hoon...",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(p => [...p, aiMsg]);
        } else {
            setIsRecording(true);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#e5ddd5] font-sans">
            {/* WhatsApp Header */}
            <header className="bg-[#075e54] text-white p-3 flex items-center gap-3 shadow-md z-10">
                <Link href="/" className="p-1 hover:bg-[#128c7e] rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                </Link>
                <div className="w-10 h-10 bg-slate-300 rounded-full flex-shrink-0 flex items-center justify-center">
                    <span className="text-xl">👩‍💼</span>
                </div>
                <div className="flex-1">
                    <h2 className="font-semibold leading-tight">Yojana-Setu AI</h2>
                    <p className="text-xs text-green-200">Online</p>
                </div>
            </header>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-2 rounded-lg shadow-sm relative ${msg.sender === 'user'
                                ? 'bg-[#dcf8c6] rounded-tr-none'
                                : 'bg-white rounded-tl-none'
                                }`}
                        >
                            <p className="text-sm text-slate-800 break-words pr-12">{msg.text}</p>
                            <span className="text-[10px] text-slate-500 absolute bottom-1 right-2">
                                {msg.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <footer className="bg-[#f0f2f5] p-3 flex items-center gap-2 border-t border-slate-200">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full bg-white rounded-full py-2 px-4 text-sm focus:outline-none shadow-sm"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                </div>

                <button
                    onClick={toggleRecording}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#00a884] text-white'
                        }`}
                >
                    {isRecording ? '⏹️' : '🎤'}
                </button>

                {inputText.trim() && (
                    <button
                        onClick={handleSend}
                        className="w-10 h-10 bg-[#075e54] text-white rounded-full flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                    </button>
                )}
            </footer>
        </div>
    );
}
