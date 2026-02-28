'use client';

import React, { useState, useEffect } from 'react';

type SchemeConfig = {
    title: string;
    subtitle: string;
    theme: string;
    headerColor: string;
    fields: { key: string; label: string; placeholder: string }[];
};

const SCHEME_MAP: Record<string, SchemeConfig> = {
    'PM Awas Yojana': {
        title: 'Pradhan Mantri Awas Yojana',
        subtitle: 'Housing for All (Urban/Rural)',
        theme: '#005a9c',
        headerColor: '#003366',
        fields: [
            { key: 'aadhar', label: 'Aadhar Number', placeholder: 'XXXX-XXXX-XXXX' },
            { key: 'income', label: 'Monthly Family Income (₹)', placeholder: 'e.g. 15000' },
            { key: 'land_status', label: 'Land Ownership (Yes/No)', placeholder: 'e.g. Yes' }
        ]
    },
    'PM Kisan': {
        title: 'PM-Kisan Samman Nidhi',
        subtitle: 'Direct Benefit Transfer for Farmers',
        theme: '#2e7d32',
        headerColor: '#1b5e20',
        fields: [
            { key: 'aadhar', label: 'Aadhar Card Number', placeholder: 'XXXX-XXXX-XXXX' },
            { key: 'farmer_id', label: 'Kisan Credit Card / Farmer ID', placeholder: 'e.g. FID-9908' },
            { key: 'bank_account', label: 'Bank Account Number', placeholder: 'e.g. 3099XXXXXXXX' }
        ]
    },
    'Ladli Behna': {
        title: 'Mukhyamantri Ladli Behna Yojana',
        subtitle: 'Women Empowerment Mission',
        theme: '#c2185b',
        headerColor: '#880e4f',
        fields: [
            { key: 'aadhar', label: 'Samagra Aadhar Number', placeholder: 'XXXX-XXXX-XXXX' },
            { key: 'samagra_id', label: 'Samagra Member ID', placeholder: 'e.g. 192837465' },
            { key: 'bank_account', label: 'Bank Account No.', placeholder: 'e.g. 5010XXXXXXXX' }
        ]
    },
    'Swasthya Sathi': {
        title: 'Swasthya Sathi Card Portal',
        subtitle: 'Universal Health Coverage Scheme',
        theme: '#0288d1',
        headerColor: '#01579b',
        fields: [
            { key: 'aadhar', label: 'Head of Family Aadhar', placeholder: 'XXXX-XXXX-XXXX' },
            { key: 'ration_card', label: 'Ration Card Number (Digital)', placeholder: 'e.g. R-102837' },
            { key: 'family_count', label: 'Total Family Members', placeholder: 'e.g. 4' }
        ]
    },
    'Old Age Pension': {
        title: 'NSAP Old Age Pension',
        subtitle: 'Financial Assistance for Senior Citizens',
        theme: '#ef6c00',
        headerColor: '#e65100',
        fields: [
            { key: 'aadhar', label: 'Aadhar Number', placeholder: 'XXXX-XXXX-XXXX' },
            { key: 'age_proof', label: 'Age Proof Document Type', placeholder: 'e.g. Birth Certificate' },
            { key: 'bank_ifsc', label: 'Bank IFSC Code', placeholder: 'e.g. SBIN000XXXX' }
        ]
    }
};

export default function GovPortalPage() {
    const [activeScheme, setActiveScheme] = useState<string>('PM Awas Yojana');
    const [formData, setFormData] = useState<any>({});
    const [status, setStatus] = useState('Draft');

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'AUTO_FILL') {
                const { scheme, details } = event.data.payload;
                if (SCHEME_MAP[scheme]) {
                    setActiveScheme(scheme);
                    setFormData({}); // Reset first

                    const fill = async () => {
                        setStatus('Agent Accessing Portal...');
                        await new Promise(r => setTimeout(r, 1000));
                        setStatus('Form Filling...');

                        // Fill fields one by one
                        for (const key of Object.keys(details)) {
                            setFormData((prev: any) => ({ ...prev, [key]: details[key] }));
                            await new Promise(r => setTimeout(r, 600));
                        }

                        await new Promise(r => setTimeout(r, 1500));
                        setStatus('Application Submitted Successfully ✅');
                    };
                    fill();
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const config = SCHEME_MAP[activeScheme] || SCHEME_MAP['PM Awas Yojana'];

    return (
        <div className="min-h-screen p-4 md:p-10 font-serif transition-colors duration-1000" style={{ backgroundColor: `${config.theme}10` }}>
            <div className="max-w-4xl mx-auto bg-white shadow-2xl border-t-8 transition-colors duration-1000" style={{ borderTopColor: config.theme }}>
                {/* Gov Header */}
                <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white border rounded-full flex items-center justify-center text-3xl shadow-md border-slate-200">
                            🇮🇳
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold uppercase tracking-tighter" style={{ color: config.headerColor }}>{config.title}</h1>
                            <p className="text-xs font-sans text-slate-500 font-bold tracking-widest">{config.subtitle}</p>
                        </div>
                    </div>
                    <div className="text-right font-sans">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${status.includes('Draft') ? 'bg-slate-200' : 'bg-emerald-100 text-emerald-700 animate-pulse'}`}>
                            {status}
                        </div>
                        <p className="text-[10px] mt-1 text-slate-400">Portal Version: 2026.4.1</p>
                    </div>
                </div>

                {/* Application Form */}
                <div className="p-10 space-y-8">
                    <div className="text-center space-y-2 border-b pb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Online Application Form</h2>
                        <p className="text-slate-500 font-sans italic text-sm">Official form for {activeScheme}. Digital India portal.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 font-sans">
                        {config.fields.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
                                <div className={`p-3 border-2 rounded transition-all duration-300 ${formData[field.key] ? 'bg-yellow-50 border-blue-400' : 'bg-slate-50 border-slate-200'}`}>
                                    <input
                                        type="text"
                                        value={formData[field.key] || ''}
                                        readOnly
                                        className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-300 italic"
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t font-sans">
                        <button
                            disabled={status === 'Draft' || status.includes('Successfully')}
                            className={`w-full py-5 rounded-xl text-lg font-bold shadow-xl transition-all uppercase tracking-widest ${status.includes('Agent') || status.includes('Form') ? 'bg-orange-500 text-white animate-pulse' : status.includes('Success') ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}
                        >
                            {status === 'Draft' ? 'Waiting for AI Agent...' : status}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-900 text-slate-400 p-8 text-[11px] font-sans flex flex-col md:flex-row justify-between gap-4">
                    <div className="max-w-xs uppercase leading-relaxed font-bold opacity-60">
                        Government of Bharat • Department of E-Governance • Managed by NIC
                    </div>
                    <div className="flex gap-4 underline">
                        <a href="#">Terms & Conditions</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Accessibility Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
