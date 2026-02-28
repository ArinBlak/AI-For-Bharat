'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function IVRSimulator() {
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
    const [logs, setLogs] = useState<string[]>([]);

    const startCall = () => {
        setCallStatus('calling');
        addLog('Initiating call to AI agent...');

        setTimeout(() => {
            setCallStatus('connected');
            addLog('Call connected.');
            addLog('AI: Namaste, main Yojana-Setu hoon. Aapki kya sahayata kar sakta hoon?');
        }, 2000);
    };

    const endCall = () => {
        setCallStatus('idle');
        addLog('Call ended.');
    };

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-8">
            <div className="w-full max-w-sm flex flex-col h-full space-y-8">
                <Link href="/" className="self-start text-slate-400 hover:text-white transition-colors">
                    ← Back
                </Link>

                <div className="bg-slate-800 rounded-3xl p-8 flex flex-col items-center space-y-6 shadow-2xl border border-slate-700">
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-4xl shadow-lg shadow-blue-500/20">
                        📞
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Yojana-Setu IVR</h2>
                        <p className="text-slate-400">{callStatus === 'idle' ? 'Ready to call' : callStatus === 'calling' ? 'Calling...' : 'In conversation'}</p>
                    </div>

                    <div className="w-full grid gap-4 pt-4">
                        {callStatus === 'idle' ? (
                            <button
                                onClick={startCall}
                                className="w-full bg-green-500 hover:bg-green-600 py-4 rounded-2xl font-bold text-lg transition-all"
                            >
                                Call Bot
                            </button>
                        ) : (
                            <button
                                onClick={endCall}
                                className="w-full bg-red-500 hover:bg-red-600 py-4 rounded-2xl font-bold text-lg transition-all"
                            >
                                End Call
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-black/50 rounded-2xl p-4 flex-1 border border-slate-800 overflow-y-auto max-h-64 font-mono text-xs">
                    <p className="text-blue-400 mb-2">// System Logs</p>
                    {logs.map((log, i) => (
                        <p key={i} className="text-slate-300 py-1 border-b border-slate-800 last:border-0">{log}</p>
                    ))}
                    {logs.length === 0 && <p className="text-slate-600">No active logs...</p>}
                </div>
            </div>
        </div>
    );
}
