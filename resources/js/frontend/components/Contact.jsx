import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendContactMessage } from '../libs/api';

export default function Contact({ profile }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const locale = window.__INITIAL_DATA__?.locale === 'km' ? 'kh' : (window.__INITIAL_DATA__?.locale || 'en');
    const globalT = window.__INITIAL_DATA__?.translations?.[window.__INITIAL_DATA__?.locale] || window.__INITIAL_DATA__?.translations?.en || {};
    const localT = {
        en: {
            contactMe: 'Contact Me',
            title: 'I Want To Hear From You',
            desc: 'Please fill out the form on this section to contact with me. Or call between 9:00 a.m. and 8:00 p.m. ET, Monday through Friday',
            address: 'Address',
            phone: 'Phone',
            messageSent: 'Message Sent!',
            thankYou: 'Thank you for reaching out. I\'ll get back to you as soon as possible.',
            sendAnother: 'Send Another Note',
            yourName: 'Your Name',
            yourEmail: 'Your Email',
            yourSubject: 'Your Subject',
            yourMessage: 'Your Message',
            sending: 'Sending...',
            submitNow: 'Submit Now'
        },
        kh: {
            contactMe: 'ទំនាក់ទំនងខ្ញុំ',
            title: 'ខ្ញុំចង់ឮពីអ្នក',
            desc: 'សូមបំពេញទម្រង់ក្នុងផ្នែកនេះដើម្បីទាក់ទងមកខ្ញុំ។ ឬហៅទូរស័ព្ទចន្លោះពីម៉ោង ៩:០០ ព្រឹកដល់ ៨:០០ យប់ ថ្ងៃចន្ទដល់ថ្ងៃសុក្រ',
            address: 'អាសយដ្ឋាន',
            phone: 'ទូរស័ព្ទ',
            messageSent: 'សារបានផ្ញើ!',
            thankYou: 'សូមអរគុណដែលបានទាក់ទង។ ខ្ញុំនឹងឆ្លើយតបទៅអ្នកវិញឲ្យបានលឿនបំផុត។',
            sendAnother: 'ផ្ញើសារមួយទៀត',
            yourName: 'ឈ្មោះរបស់អ្នក',
            yourEmail: 'អ៊ីមែលរបស់អ្នក',
            yourSubject: 'ប្រធានបទ',
            yourMessage: 'សាររបស់អ្នក',
            sending: 'កំពុងផ្ញើ...',
            submitNow: 'បញ្ជូនឥឡូវនេះ'
        }
    }[locale] || {};
    const t = { ...localT, ...globalT };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            await sendContactMessage(formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('error');
            const msg = err.response?.data?.message || 'Something went wrong while submitting. Please try again.';
            setErrorMessage(msg);
        }
    };

    return (
        <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                
                {/* Left Column: Direct Info */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div>
                        <span className="text-sm font-bold text-[#8247e5] uppercase tracking-widest block mb-3">{t.contactMe || 'Contact Me'}</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                            {t.title || 'I Want To Hear From You'}
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-6 leading-relaxed">
                            {t.desc || 'Please fill out the form on this section to contact with me. Or call between 9:00 a.m. and 8:00 p.m. ET, Monday through Friday'}
                        </p>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/30 group-hover:bg-[#8247e5] flex items-center justify-center text-[#8247e5] dark:text-purple-400 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t.address || 'Address'}</h4>
                                <span className="text-gray-500 dark:text-gray-400">{profile?.location || '20, Somewhere in world'}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 group-hover:bg-[#8247e5] flex items-center justify-center text-emerald-500 dark:text-emerald-400 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Email</h4>
                                <a href={`mailto:${profile?.email || 'hello@example.com'}`} className="text-gray-500 dark:text-gray-400 hover:text-[#8247e5] transition">
                                    {profile?.email || 'hello@example.com'}
                                </a>
                            </div>
                        </div>

                        {profile?.phone && (
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-full bg-cyan-50 dark:bg-cyan-900/30 group-hover:bg-[#8247e5] flex items-center justify-center text-cyan-500 dark:text-cyan-400 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t.phone || 'Phone'}</h4>
                                    <a href={`tel:${profile.phone}`} className="text-gray-500 dark:text-gray-400 hover:text-[#8247e5] transition">
                                        {profile.phone}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Right Column: Contact Form */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700"
                >
                    {status === 'success' ? (
                        <div className="py-16 text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{t.messageSent || 'Message Sent!'}</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                {t.thankYou || 'Thank you for reaching out. I\'ll get back to you as soon as possible.'}
                            </p>
                            <div className="pt-8">
                                <button onClick={() => setStatus('idle')} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold transition">
                                    {t.sendAnother || 'Send Another Note'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2.5">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.yourName || "Your Name"}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8247e5]/50 focus:bg-white dark:focus:bg-gray-700 transition"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.yourEmail || "Your Email"}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8247e5]/50 focus:bg-white dark:focus:bg-gray-700 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder={t.yourSubject || "Your Subject"}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8247e5]/50 focus:bg-white dark:focus:bg-gray-700 transition"
                                />
                            </div>

                            <div>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder={t.yourMessage || "Your Message"}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8247e5]/50 focus:bg-white dark:focus:bg-gray-700 transition resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-[#8247e5] hover:bg-[#7034d6] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                            >
                                {status === 'loading' ? (
                                    <span>{t.sending || 'Sending...'}</span>
                                ) : (
                                    <>
                                        <span>{t.submitNow || 'Submit Now'}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
