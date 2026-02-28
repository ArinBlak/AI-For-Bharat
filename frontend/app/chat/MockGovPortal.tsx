'use client';

import React from 'react';

export default function MockGovPortal({ data, isFilling }: { data: any, isFilling: boolean }) {
    return (
        <div className="h-full bg-[#f3f4f6] text-slate-800 p-8 overflow-y-auto border-l border-slate-300">
            <div className="max-w-2xl mx-auto bg-white shadow-md border border-slate-200">
                {/* Header */}
                <div className="bg-[#003366] text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#003366] font-bold">
                            🇮🇳
                        </div>
                        <div>
                            <h1 className="text-sm font-bold uppercase tracking-wider">Public Service Portal</h1>
                            <p className="text-[10px] opacity-80">Government of Bharat • Department of Social Welfare</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-mono">ID: MP-2026-X8B</div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-6">
                    <div className="border-b border-slate-200 pb-2">
                        <h2 className="text-xl font-bold text-slate-900 italic">Mukhyamantri Ladli Behna Yojana</h2>
                        <p className="text-xs text-slate-500">Avedan Patra (Application Form) - 2026 Phase II</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Pura Naam (Full Name)</label>
                            <input
                                type="text"
                                readOnly
                                value={data.name || ''}
                                className={`w-full border p-2 text-sm transition-all duration-500 ${isFilling && data.name ? 'bg-yellow-50 border-blue-400 ring-2 ring-blue-400/20' : 'bg-slate-50 border-slate-300'}`}
                                placeholder="---"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Mobile Number</label>
                            <input
                                type="text"
                                readOnly
                                value={data.phone || ''}
                                className={`w-full border p-2 text-sm transition-all duration-500 ${isFilling && data.phone ? 'bg-yellow-50 border-blue-400 ring-2 ring-blue-400/20' : 'bg-slate-50 border-slate-300'}`}
                                placeholder="---"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Aadhar Number</label>
                            <input
                                type="text"
                                readOnly
                                value={data.aadhar || ''}
                                className={`w-full border p-2 text-sm transition-all duration-500 ${isFilling && data.aadhar ? 'bg-yellow-50 border-blue-400 ring-2 ring-blue-400/20' : 'bg-slate-50 border-slate-300'}`}
                                placeholder="XXXX-XXXX-XXXX"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">District (Zila)</label>
                            <input
                                type="text"
                                readOnly
                                value={data.district || ''}
                                className={`w-full border p-2 text-sm transition-all duration-500 ${isFilling && data.district ? 'bg-yellow-50 border-blue-400 ring-2 ring-blue-400/20' : 'bg-slate-50 border-slate-300'}`}
                                placeholder="---"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 border-2 border-dashed border-slate-200 p-4 rounded-lg bg-slate-50">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Pramaan Patra (Documents Uploaded)</label>
                        <div className="flex gap-2">
                            <div className={`w-12 h-12 rounded border flex items-center justify-center text-xs ${data.hasPhoto ? 'bg-green-100 border-green-300' : 'bg-white border-slate-200'}`}>
                                {data.hasPhoto ? '📸' : '📄'}
                            </div>
                            <div className={`w-12 h-12 rounded border flex items-center justify-center text-xs ${data.hasAadharDoc ? 'bg-green-100 border-green-300' : 'bg-white border-slate-200'}`}>
                                {data.hasAadharDoc ? '🆔' : '📄'}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={!isFilling}
                            className={`w-full py-3 font-bold text-sm uppercase transition-all ${isFilling ? 'bg-[#ff9933] text-white shadow-lg scale-[1.02]' : 'bg-slate-200 text-slate-400'}`}
                        >
                            {isFilling ? 'Submitting Application...' : 'Apply Now'}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-100 p-4 text-[9px] text-slate-500 border-t border-slate-200">
                    This is a secure government application portal. Unauthorized access is prohibited.
                    Privacy Policy | Terms of Service | Helpdesk: 1800-XXX-XXXX
                </div>
            </div>
        </div>
    );
}
