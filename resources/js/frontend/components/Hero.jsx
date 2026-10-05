import React, { useState } from 'react';
import { ArrowDown, Mail, Terminal, FileText, Send, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import { ReactIcon, LaravelIcon, TailwindIcon, PostgreSQLIcon, NodeIcon, PythonIcon, AWSIcon, DockerIcon } from './BrandIcons';

export default function Hero({ profile = {}, about = {} }) {
    const data = {
        name: profile?.name || about?.name || 'Alex Rivera',
        title: profile?.title || about?.title || 'Full-Stack Engineer & Cloud Architect',
        statusBadge: about?.status_badge || 'Available for full-time & high-impact contracts',
        statusActive: about?.status_active !== undefined ? about.status_active : true,
        headline: about?.headline || 'Architecting high-scale web platforms with precision & craft',
        bio: profile?.bio || about?.bio || 'Full-Stack Engineer building robust, fault-tolerant web applications. Focused on Laravel, React, Tailwind CSS, and scalable cloud APIs.',
        githubUrl: profile?.github_url || about?.github_url || 'https://github.com',
        linkedinUrl: profile?.linkedin_url || about?.linkedin_url || 'https://linkedin.com',
        email: profile?.email || about?.email || 'alex.rivera@devmail.test',
        heroImage: about?.hero_image_url || profile?.avatar_url || profile?.avatar || null,
        avatar: profile?.avatar_url || profile?.avatar || null,
        resumeUrl: profile?.resume_url || '',
        experienceYears: about?.experience_years || '5+ Years',
        projectsCount: about?.projects_count || '30+ Apps',
        uptimeStat: about?.uptime_stat || '99.9%',
        satisfactionStat: about?.satisfaction_stat || '100%',
        codeClassName: about?.code_class_name || 'SeniorFullStackEngineer',
        codeFramework: about?.code_framework || 'Laravel 12 / PHP 8.2',
        codeFrontend: about?.code_frontend || 'React 19 / Tailwind CSS',
        codeDatabase: about?.code_database || 'PostgreSQL, Redis, SQLite',
    };

    const locale = window.__INITIAL_DATA__?.locale === 'km' ? 'kh' : (window.__INITIAL_DATA__?.locale || 'en');
    const globalT = window.__INITIAL_DATA__?.translations?.[window.__INITIAL_DATA__?.locale] || window.__INITIAL_DATA__?.translations?.en || {};
    const localT = {
        en: {
            helloIm: 'Hello, I’m',
            experience: 'Experience',
            projectsCompleted: 'Projects Completed',
            happyClients: 'Happy Clients',
            sayHello: 'Say Hello!',
            socialModalTitle: 'Connect with me',
            socialModalDesc: 'Choose a platform to get in touch.',
        },
        kh: {
            helloIm: 'សួស្តី ខ្ញុំគឺ',
            experience: 'បទពិសោធន៍',
            projectsCompleted: 'គម្រោងដែលបានបញ្ចប់',
            happyClients: 'អតិថិជនពេញចិត្ត',
            sayHello: 'និយាយសួស្តី!',
            socialModalTitle: 'ភ្ជាប់ទំនាក់ទំនងជាមួយខ្ញុំ',
            socialModalDesc: 'សូមជ្រើសរើសបណ្តាញសង្គមណាមួយដើម្បីទាក់ទង។',
        }
    }[locale] || {};
    const t = { ...localT, ...globalT };

    const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

    return (
        <>
            <section id="home" className="relative pt-24 pb-12 md:pt-36 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Content */}

                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="lg:col-span-7 text-center lg:text-left"
                >
                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-4 sm:mb-6">
                        {t.helloIm || "Hello, I'm"} <br />
                        <span className="text-gray-900 dark:text-gray-100">{data.name}</span>
                    </h1>

                    <div 
                        className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed font-normal"
                        dangerouslySetInnerHTML={{ __html: data.bio || `I'm a Full-Stack Engineer based in ${profile?.location || 'Phnom Penh, Cambodia'}.` }}
                    />

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8 sm:mb-12">
                        <button onClick={() => setIsSocialModalOpen(true)} className="bg-[#8247e5] hover:bg-[#7034d6] text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 transition-all text-sm sm:text-base">
                            {t.letsTalk || t.sayHello || 'Say Hello!'}
                        </button>
                    </div>

                    {/* Quick Metrics Bar */}
                    <div className="bg-[#f5effc] dark:bg-purple-900/10 rounded-xl p-4 sm:p-5 w-full max-w-sm mx-auto lg:mx-0 grid grid-cols-3 divide-x divide-purple-200/60 dark:divide-purple-500/20 text-center shadow-sm">
                        <div className="px-1.5">
                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{data.experienceYears.split(' ')[0]}</p>
                            <p className="text-[9px] sm:text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1 font-semibold leading-tight">{t.experience || 'Experience'}</p>
                        </div>
                        <div className="px-1.5">
                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{data.projectsCount.split(' ')[0]}</p>
                            <p className="text-[9px] sm:text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1 font-semibold leading-tight">{t.projectsCompleted || 'Projects\nCompleted'}</p>
                        </div>
                        <div className="px-1.5">
                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{data.satisfactionStat === '100%' ? '50+' : data.satisfactionStat}</p>
                            <p className="text-[9px] sm:text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1 font-semibold leading-tight">{t.happyClients || 'Happy\nClients'}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Content - Avatar Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="lg:col-span-5 relative max-w-[260px] sm:max-w-xs mx-auto lg:max-w-none"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/20 rounded-[32px] transform scale-105 -rotate-2"></div>
                    <div className="relative bg-white dark:bg-[#0f172a] p-2.5 rounded-[28px] shadow-xl shadow-gray-200/50 dark:shadow-none border border-white/50 dark:border-gray-800">
                        <img
                            src={data.heroImage || '/images/brooklyn.jpg'}
                            alt={data.name}
                            className="w-full h-auto object-cover object-top rounded-[22px] bg-gray-100"
                            style={{ aspectRatio: '4/5', maxHeight: '380px' }}
                        />
                    </div>
                </motion.div>

            </div>
            
            {/* Tech Stack Marquee */}
            <div className="mt-6 sm:mt-8 pb-4 sm:pb-8 overflow-hidden relative w-full pt-5 sm:pt-6">
                <div className="absolute left-0 top-0 w-12 sm:w-24 h-full bg-gradient-to-r from-[#fcfcfd] dark:from-[#0B0F19] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-12 sm:w-24 h-full bg-gradient-to-l from-[#fcfcfd] dark:from-[#0B0F19] to-transparent z-10 pointer-events-none"></div>
                
                <div className="flex w-max animate-marquee items-center">
                    {/* First Set */}
                    <div className="flex items-center gap-6 sm:gap-10 px-3 sm:px-6">
                        {[
                            { name: 'React 19', Icon: ReactIcon, color: '#61DAFB' },
                            { name: 'Laravel 12', Icon: LaravelIcon, color: '#FF2D20' },
                            { name: 'Tailwind CSS', Icon: TailwindIcon, color: '#06B6D4' },
                            { name: 'PostgreSQL', Icon: PostgreSQLIcon, color: '#336791' },
                            { name: 'Node.js', Icon: NodeIcon, color: '#339933' },
                            { name: 'Python', Icon: PythonIcon, color: '#3776AB' },
                            { name: 'AWS', Icon: AWSIcon, color: '#FF9900' },
                            { name: 'Docker', Icon: DockerIcon, color: '#2496ED' }
                        ].map((tech, idx) => (
                            <div key={`tech1-${idx}`} className="flex flex-col items-center gap-1.5 text-gray-500 dark:text-gray-400 font-bold text-xs sm:text-sm whitespace-nowrap opacity-60 hover:opacity-100 transition-all duration-300 group">
                                <tech.Icon className="w-6 h-6 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" style={{ color: tech.color }} />
                                <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                    {/* Duplicated Set for infinite scroll */}
                    <div className="flex items-center gap-6 sm:gap-10 px-3 sm:px-6">
                        {[
                            { name: 'React 19', Icon: ReactIcon, color: '#61DAFB' },
                            { name: 'Laravel 12', Icon: LaravelIcon, color: '#FF2D20' },
                            { name: 'Tailwind CSS', Icon: TailwindIcon, color: '#06B6D4' },
                            { name: 'PostgreSQL', Icon: PostgreSQLIcon, color: '#336791' },
                            { name: 'Node.js', Icon: NodeIcon, color: '#339933' },
                            { name: 'Python', Icon: PythonIcon, color: '#3776AB' },
                            { name: 'AWS', Icon: AWSIcon, color: '#FF9900' },
                            { name: 'Docker', Icon: DockerIcon, color: '#2496ED' }
                        ].map((tech, idx) => (
                            <div key={`tech2-${idx}`} className="flex flex-col items-center gap-1.5 text-gray-500 dark:text-gray-400 font-bold text-xs sm:text-sm whitespace-nowrap opacity-60 hover:opacity-100 transition-all duration-300 group">
                                <tech.Icon className="w-6 h-6 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" style={{ color: tech.color }} />
                                <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            </section>

            {/* Social Media Selection Modal */}
            {isSocialModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSocialModalOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button 
                            onClick={() => setIsSocialModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6 text-center mt-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">
                                {t.socialModalTitle || 'Connect with me'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {t.socialModalDesc || 'Choose a platform to get in touch.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <a href={profile?.telegram_url || '#'} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:hover:bg-sky-900/40 transition-colors group">
                                <Send className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
                                <span className="text-xs font-semibold">Telegram</span>
                            </a>
                            <a href={`mailto:${data.email}`} className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-500 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 transition-colors group">
                                <Mail className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
                                <span className="text-xs font-semibold">Gmail</span>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 transition-colors group">
                                <svg className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c1.05 0 2.05.2 2.05.2v2.25h-1.16c-1.14 0-1.5.71-1.5 1.44V12h2.5l-.4 3h-2.1v6.8C18.56 20.87 22 16.84 22 12z"/></svg>
                                <span className="text-xs font-semibold">Facebook</span>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:hover:bg-pink-900/40 transition-colors group">
                                <svg className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                <span className="text-xs font-semibold">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
