'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATES = [
    'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const CATEGORIES = [
    { value: 'ews', label: 'EWS - Economically Weaker Section' },
    { value: 'lig', label: 'LIG - Low Income Group' },
    { value: 'mig1', label: 'MIG-I - Middle Income Group I' },
    { value: 'mig2', label: 'MIG-II - Middle Income Group II' },
];

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '',
        fathername: '',
        dob: '',
        gender: '',
        aadhaar: '',
        phone: '',
        email: '',
        category: '',
        income: '',
        address: '',
        state: '',
        district: '',
        city: '',
        pincode: '',
    });

    const update = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const body = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                body.append(key, value);
            });

            const res = await fetch('http://localhost:8000/register', {
                method: 'POST',
                body: body,
            });

            if (res.ok) {
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

    const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-[#FF9933]/40 focus:ring-4 focus:ring-[#FF9933]/5 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300 text-sm";
    const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1";
    const selectClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-[#FF9933]/40 focus:ring-4 focus:ring-[#FF9933]/5 outline-none transition-all font-semibold text-slate-700 text-sm bg-white appearance-none";

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-orange-50/30 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(255,153,51,0.15),0_20px_50px_-15px_rgba(19,136,8,0.08)] border-t-8 border-[#FF9933] overflow-hidden relative">
                {/* Bottom tricolor accent */}
                <div className="absolute bottom-0 left-0 w-full h-2 flex">
                    <div className="h-full w-1/3 bg-[#FF9933]"></div>
                    <div className="h-full w-1/3 bg-white"></div>
                    <div className="h-full w-1/3 bg-[#138808]"></div>
                </div>

                {/* Header */}
                <div className="pt-8 pb-4 text-center border-b border-slate-50 flex flex-col items-center">
                    <div className="inline-block border-2 border-blue-100 px-6 py-2 rounded-2xl bg-blue-50/20 shadow-sm mb-3">
                        <h1 className="text-3xl font-black tracking-tighter">
                            <span className="text-[#FF9933]">Yojana</span>
                            <span className="text-slate-200 mx-0.5">-</span>
                            <span className="text-[#138808]">Setu</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Citizen Registration Portal</p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 py-4 px-8">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step >= s ? 'bg-[#FF9933] text-white shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-400'}`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-12 h-1 rounded-full transition-all ${step > s ? 'bg-[#138808]' : 'bg-slate-100'}`} />}
                        </div>
                    ))}
                </div>
                <div className="text-center mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {step === 1 && 'Personal & Contact Details'}
                        {step === 2 && 'Category & Income'}
                        {step === 3 && 'Address Details'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
                    {/* Step 1: Personal & Contact */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Full Name / पूरा नाम *</label>
                                    <input required type="text" className={inputClass} placeholder="As per Aadhaar" value={formData.username} onChange={e => update('username', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Father&apos;s / Husband&apos;s Name *</label>
                                    <input required type="text" className={inputClass} placeholder="पिता/पति का नाम" value={formData.fathername} onChange={e => update('fathername', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Date of Birth / जन्म तिथि *</label>
                                    <input required type="date" className={inputClass} value={formData.dob} onChange={e => update('dob', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Gender / लिंग *</label>
                                    <select required className={selectClass} value={formData.gender} onChange={e => update('gender', e.target.value)}>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male / पुरुष</option>
                                        <option value="female">Female / महिला</option>
                                        <option value="other">Other / अन्य</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Aadhaar Number / आधार नंबर *</label>
                                <input required type="text" maxLength={12} pattern="\d{12}" className={inputClass} placeholder="12-digit Aadhaar number" value={formData.aadhaar} onChange={e => update('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Mobile / मोबाइल नंबर *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF9933] font-black text-sm">+91</span>
                                        <input required type="tel" maxLength={10} pattern="\d{10}" className={`${inputClass} pl-12`} placeholder="XXXXX XXXXX" value={formData.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Email (Optional)</label>
                                    <input type="email" className={inputClass} placeholder="name@email.com" value={formData.email} onChange={e => update('email', e.target.value)} />
                                </div>
                            </div>
                            <button type="button" onClick={() => { if (formData.username && formData.fathername && formData.dob && formData.gender && formData.aadhaar && formData.phone) setStep(2); }}
                                className="w-full bg-[#FF9933] hover:bg-[#e68a2e] text-white font-black py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 uppercase tracking-tighter border-b-4 border-[#cc7a29]">
                                Next → Category & Income
                            </button>
                        </div>
                    )}

                    {/* Step 2: Category & Income */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-1.5">
                                <label className={labelClass}>Category / वर्ग *</label>
                                <select required className={selectClass} value={formData.category} onChange={e => update('category', e.target.value)}>
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Annual Family Income / वार्षिक आय (₹) *</label>
                                <input required type="number" className={inputClass} placeholder="e.g. 200000" value={formData.income} onChange={e => update('income', e.target.value)} />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 font-black py-3.5 rounded-xl transition-all active:scale-95 uppercase tracking-tighter">
                                    ← Back
                                </button>
                                <button type="button" onClick={() => { if (formData.category && formData.income) setStep(3); }}
                                    className="flex-1 bg-[#FF9933] hover:bg-[#e68a2e] text-white font-black py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 uppercase tracking-tighter border-b-4 border-[#cc7a29]">
                                    Next → Address
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Address */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-1.5">
                                <label className={labelClass}>Full Address / पूरा पता *</label>
                                <input required type="text" className={inputClass} placeholder="House No., Street, Locality" value={formData.address} onChange={e => update('address', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>State / राज्य *</label>
                                    <select required className={selectClass} value={formData.state} onChange={e => update('state', e.target.value)}>
                                        <option value="">Select State</option>
                                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>District / जिला *</label>
                                    <input required type="text" className={inputClass} placeholder="District Name" value={formData.district} onChange={e => update('district', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>City/Town/Village *</label>
                                    <input required type="text" className={inputClass} placeholder="शहर/कस्बा/गांव" value={formData.city} onChange={e => update('city', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>PIN Code / पिन कोड *</label>
                                    <input required type="text" maxLength={6} pattern="\d{6}" className={inputClass} placeholder="6-digit code" value={formData.pincode} onChange={e => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStep(2)} className="flex-1 bg-slate-100 text-slate-600 font-black py-3.5 rounded-xl transition-all active:scale-95 uppercase tracking-tighter">
                                    ← Back
                                </button>
                                <button disabled={loading} type="submit"
                                    className="flex-1 bg-[#138808] hover:bg-[#0f6d06] text-white font-black py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-tighter border-b-4 border-black/20">
                                    {loading ? 'Processing...' : '✓ Register & Start'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="text-center pt-1">
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
