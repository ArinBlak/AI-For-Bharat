import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Yojana-Setu</h1>
          <p className="text-slate-500">The Voice-First AI Caseworker for Rural India</p>
        </div>

        <div className="grid gap-4">
          <Link
            href="/register"
            className="group relative flex flex-col items-start p-6 bg-slate-900 rounded-2xl border border-slate-700 shadow-xl hover:shadow-blue-500/20 hover:border-blue-500 transition-all text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform ring-1 ring-blue-500/20">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Advanced Agentic Demo</h3>
            <p className="text-slate-400 text-sm mt-1">Register as a citizen and watch the AI proactively collect docs and apply to a live external Government portal.</p>
          </Link>

          <Link
            href="/whatsapp"
            className="group relative flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-green-500 transition-all text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🟢</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Tier 1: WhatsApp AI</h3>
            <p className="text-slate-500 text-sm mt-1">Smartphones & Feature phones with WhatsApp. Supports Voice Notes & Documents.</p>
          </Link>

          <Link
            href="/ivr"
            className="group relative flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all text-left"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Tier 2/3: IVR Voice Bot</h3>
            <p className="text-slate-500 text-sm mt-1">Feature phones via Missed Call/IVR. AI talks directly to citizens in Hindi.</p>
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-xs text-slate-400">Winning "AI for Bharat" Hackathon Prototype</p>
        </div>
      </div>
    </main>
  );
}
