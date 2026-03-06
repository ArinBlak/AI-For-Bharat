'use client';

import React from 'react';

export default function MockGovPortal({ data, isFilling }: { data: any, isFilling: boolean }) {
    // Helper for showing field values with highlight when filling
    const Field = ({ label, value, placeholder }: { label: string, value: any, placeholder?: string }) => (
        <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">{label}</label>
            <div className={`w-full border-2 p-2.5 text-xs font-bold transition-all duration-700 min-h-[38px] flex items-center rounded-lg ${isFilling && value ? 'bg-orange-50 border-[#FF9933]/50 text-slate-800 shadow-[0_0_15px_-5px_rgba(255,153,51,0.3)]' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                {value || placeholder || '---'}
            </div>
        </div>
    );

    return (
        <div className="h-full bg-slate-50 text-slate-800 p-6 overflow-y-auto border-l-4 border-slate-100 flex flex-col gap-6 custom-scrollbar">
            <div className="max-w-2xl mx-auto w-full bg-white shadow-2xl rounded-[1.5rem] border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-[#003366] text-white p-5 flex items-center justify-between border-b-4 border-[#FF9933]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-inner">
                            🏛️
                        </div>
                        <div>
                            <h1 className="text-xs font-black uppercase tracking-widest leading-none mb-1">Government of Bharat</h1>
                            <p className="text-[9px] opacity-70 font-bold uppercase tracking-tighter">Pradhan Mantri Awas Yojana (PMAY)</p>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest">Live Portal Preview</div>
                        <div className="text-[10px] font-mono mt-2 opacity-50">REF-2026-PMAY-{data?.phone?.slice(-4) || 'XXXX'}</div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-10">
                    <div className="border-b-2 border-slate-50 pb-4 flex justify-between items-end">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">आवेदन पत्र</h2>
                            <p className="text-[10px] text-[#138808] font-black uppercase tracking-widest">PMAY Application - 2026 Phase II</p>
                        </div>
                        <div className={`text-[10px] font-black px-3 py-1 rounded-full border-2 ${isFilling ? 'bg-orange-50 text-[#FF9933] border-[#FF9933]/20 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                            {isFilling ? '● Processing...' : '○ Ready'}
                        </div>
                    </div>

                    {/* Section 1: Personal Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-4 bg-[#FF9933] rounded-full"></div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#003366]">1. Personal Details / व्यक्तिगत विवरण</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Full Name / पूरा नाम" value={data?.username || data?.name} />
                            <Field label="Father's/Husband's Name" value={data?.fathername} />
                            <Field label="Date of Birth / जन्म तिथि" value={data?.dob} />
                            <Field label="Gender / लिंग" value={data?.gender} />
                            <Field label="Aadhaar Number / आधार नंबर" value={data?.aadhaar || data?.aadhar} placeholder="XXXX-XXXX-XXXX" />
                            <Field label="Mobile Number" value={data?.phone} />
                            <Field label="Category / वर्ग" value={data?.category} />
                            <Field label="Annual Income / वार्षिक आय" value={data?.income} />
                        </div>
                    </div>

                    {/* Section 2: Address Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-4 bg-[#138808] rounded-full"></div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#003366]">2. Address Details / पता विवरण</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <Field label="Full Address / पूरा पता" value={data?.address} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="State / राज्य" value={data?.state} />
                            <Field label="District / जिला" value={data?.district} />
                            <Field label="City/Town/Village" value={data?.city} />
                            <Field label="PIN Code / पिन कोड" value={data?.pincode} />
                        </div>
                    </div>

                    {/* Section 3: Documents Uploaded */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-4 bg-blue-500 rounded-full"></div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#003366]">3. Pramaan Patra (Documents Uploaded)</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-700 ${data?.hasAadharDoc ? 'bg-green-50 border-[#138808]/20 ring-4 ring-[#138808]/5' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="text-2xl">{data?.hasAadharDoc ? '✅' : '📄'}</div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Aadhaar Card</span>
                            </div>
                            <div className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-700 ${data?.hasIncomeDoc ? 'bg-green-50 border-[#138808]/20 ring-4 ring-[#138808]/5' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="text-2xl">{data?.hasIncomeDoc ? '✅' : '📜'}</div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Income Proof</span>
                            </div>
                            <div className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-700 ${data?.hasPhoto ? 'bg-green-50 border-[#138808]/20 ring-4 ring-[#138808]/5' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="text-2xl">{data?.hasPhoto ? '✅' : '📸'}</div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Passport Photo</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t-2 border-dashed border-slate-100">
                        <button
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 ${isFilling ? 'bg-[#FF9933] text-white shadow-2xl shadow-orange-200 -translate-y-1' : 'bg-slate-100 text-slate-400'}`}
                        >
                            {isFilling ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting to Portal...
                                </>
                            ) : 'Aavedan Karein / Submit Application'}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-4 border-t border-slate-100">
                    <div className="flex items-center gap-1 opacity-50">🔒 Secure 256-bit</div>
                    <div className="flex items-center gap-1 opacity-50">🛡️ Dept. of Housing</div>
                    <div className="flex items-center gap-1 opacity-50">🇮🇳 Digital India</div>
                </div>
            </div>
        </div>
    );
}
