import React, { useState, useEffect } from 'react';
import {
    User,
    Sparkles,
    Save,
    UploadCloud,
    ExternalLink,
    Terminal,
    Send,
    CheckCircle2,
    Eye,
    Award,
    Briefcase,
    Clock,
    MapPin,
    Mail,
    Phone,
    FileText,
    Check,
    AlertCircle,
    RefreshCw,
    Code2,
    CheckCheck,
    Layers,
    Sliders,
    Trash2,
} from 'lucide-react';
import { getAbout, updateAbout } from '../libs/api';

function GithubIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

function LinkedinIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
    );
}

function TwitterIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export default function HomePage({ onNotify, onUpdateUser, theme = 'dark', locale = 'en' }) {
    const isDark = theme === 'dark';
    
    const t = {
        en: {
            title: 'Home Page Configuration',
            desc: 'Manage your hero section, personal info, and metrics.',
            viewSite: 'View Live Site',
            saving: 'Saving...',
            saved: 'Saved!',
            saveChanges: 'Save Changes',
            statusLabel: 'Availability Status',
            available: 'Available for Hire',
            busy: 'Currently Unavailable / Busy',
            badgeText: 'Badge text',
            active: 'Active',
            hidden: 'Hidden',
            mediaDoc: 'Media & Documents',
            heroImage: 'Hero Image (Optional)',
            changeHero: 'Change Hero Image',
            removeHero: 'Remove Hero',
            primaryBrand: 'Primary Branding & Headlines',
            fullName: 'Full Name / Display Name *',
            titleTag: 'Professional Title / Tagline *',
            statusBadgeLabel: 'Status Badge Text (e.g. "Available for full-time & high-impact contracts")',
            shortBio: 'Short Bio / Hero Subtitle',
            resumeDoc: 'Resume & Documents',
            resumeUrl: 'Resume / CV Download URL',
            geoDetails: 'Geographic Details',
            location: 'Location / Base City',
            prodMetrics: 'Production Metrics & Achievements',
            metricDesc: 'These 4 high-impact counters are showcased prominently across the portfolio.',
            expValue: 'Experience Value',
            expLabel: 'Production Experience',
            appsShipped: 'Apps Shipped',
            shippedLabel: 'Shipped Worldwide',
            uptime: 'Uptime / SLA',
            uptimeLabel: 'Uptime & Reliability',
            clientRating: 'Client Rating',
            clientLabel: 'Client Satisfaction',
            previewMetric: 'Frontend Live Metric Strip Preview',
            socialProfile: 'Social & Developer Profiles',
            directContact: 'Direct Contact Points',
            primaryEmail: 'Primary Email',
            directPhone: 'Direct Phone / WhatsApp',
            inquiryRouting: 'Inquiry Routing',
            inquiryDesc: 'Client messages sent through the Contact Form will also be available directly in your admin Inbox tab.',
            terminalConfig: 'Hero Terminal Card Configuration',
            terminalDesc: 'Customize the interactive pseudo-code terminal shown on the public landing hero.',
            className: 'Class / Role Name',
            coreBackend: 'Core Backend Framework',
            frontendStack: 'Frontend Tech Stack',
            dbStack: 'Database & Cache Stack',
            dbTech: 'Database Technologies',
            livePreview: 'Live Hero Preview',
            loading: 'Loading About & Profile Data...',
            errLoad: 'Failed to load about profile data.',
            errSize: 'Image size must be less than 5MB.',
            errSave: 'Error saving about details.',
            successUpdate: 'Home & Profile updated successfully!',
            infoClear: 'Hero Image cleared. Click "Save Changes" to apply.',
            tabProfile: 'Hero Section',
            tabMetrics: 'Stats & Metrics',
            tabSocial: 'Social Links',
            tabTerminal: 'Code Snippet',
            tabPreview: 'Live Preview',
            liveInteractive: 'Live Interactive Terminal Preview',
            realTime: 'Real-time Visual Preview of Homepage Hero & About Section',
            replica: '1:1 Replica',
            hello: "Hello, I'm",
            exp: 'Experience',
            proj: 'Projects',
            rel: 'Reliability',
            sat: 'Satisfaction',
        },
        kh: {
            title: 'ការកំណត់ទំព័រដើម',
            desc: 'គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងស្ថិតិរបស់អ្នក។',
            viewSite: 'មើលគេហទំព័រផ្ទាល់',
            saving: 'កំពុងរក្សាទុក...',
            saved: 'បានរក្សាទុក!',
            saveChanges: 'រក្សាទុក',
            statusLabel: 'ស្ថានភាព',
            available: 'ទំនេរសម្រាប់ផ្តល់សេវាកម្ម',
            busy: 'មិនទំនេរនាពេលនេះ',
            badgeText: 'អត្ថបទស្ថានភាព',
            active: 'បង្ហាញ',
            hidden: 'លាក់',
            mediaDoc: 'ប្រព័ន្ធផ្សព្វផ្សាយ និងឯកសារ',
            heroImage: 'រូបភាពតំណាងទំព័រដើម',
            changeHero: 'ផ្លាស់ប្តូររូបភាព',
            removeHero: 'លុបរូបភាព',
            primaryBrand: 'ព័ត៌មានផ្ទាល់ខ្លួន និងចំណងជើង',
            fullName: 'ឈ្មោះពេញ / ឈ្មោះបង្ហាញ *',
            titleTag: 'តួនាទីអាជីព / ពាក្យស្លោក *',
            statusBadgeLabel: 'អត្ថបទស្ថានភាព (ឧ. "មានទទួលការងារក្រៅម៉ោង")',
            shortBio: 'ជីវប្រវត្តិសង្ខេប / ចំណងជើងរង',
            resumeDoc: 'ប្រវត្តិរូបសង្ខេប (CV)',
            resumeUrl: 'តំណភ្ជាប់ទាញយកប្រវត្តិរូប',
            geoDetails: 'ទីតាំងភូមិសាស្ត្រ',
            location: 'ទីតាំង / ទីក្រុង',
            prodMetrics: 'ស្ថិតិ និងសមិទ្ធិផល',
            metricDesc: 'ស្ថិតិទាំង 4 នេះនឹងបង្ហាញយ៉ាងលេចធ្លោនៅលើទំព័រដើមរបស់អ្នក។',
            expValue: 'បទពិសោធន៍ការងារ',
            expLabel: 'បទពិសោធន៍',
            appsShipped: 'គម្រោងដែលបានធ្វើ',
            shippedLabel: 'គម្រោងទូទាំងពិភពលោក',
            uptime: 'ប្រសិទ្ធភាពការងារ',
            uptimeLabel: 'ភាពជឿជាក់',
            clientRating: 'ការវាយតម្លៃអតិថិជន',
            clientLabel: 'ការពេញចិត្តរបស់អតិថិជន',
            previewMetric: 'ការបង្ហាញស្ថិតិសាកល្បង',
            socialProfile: 'បណ្តាញសង្គម',
            directContact: 'ព័ត៌មានទំនាក់ទំនងផ្ទាល់',
            primaryEmail: 'អ៊ីមែល',
            directPhone: 'លេខទូរស័ព្ទ / WhatsApp',
            inquiryRouting: 'ប្រអប់សារ',
            inquiryDesc: 'សាររបស់អតិថិជនដែលផ្ញើតាមទម្រង់ទំនាក់ទំនង នឹងមានបង្ហាញនៅក្នុងប្រអប់សារផងដែរ។',
            terminalConfig: 'ការកំណត់កូដ (Code Snippet)',
            terminalDesc: 'កែប្រែកូដនៅលើទំព័រដើមរបស់អ្នក។',
            className: 'ឈ្មោះ Class / តួនាទី',
            coreBackend: 'ប្រព័ន្ធ Backend',
            frontendStack: 'ប្រព័ន្ធ Frontend',
            dbStack: 'Database',
            dbTech: 'ប្រព័ន្ធ Database',
            livePreview: 'មើលសាកល្បង',
            loading: 'កំពុងទាញទិន្នន័យ...',
            errLoad: 'មិនអាចទាញយកទិន្នន័យបានទេ។',
            errSize: 'ទំហំរូបភាពមិនអាចធំជាង 5MB ទេ។',
            errSave: 'មិនអាចរក្សាទុកបានទេ។',
            successUpdate: 'បានរក្សាទុកព័ត៌មានជោគជ័យ!',
            infoClear: 'បានលុបរូបភាព។ សូមចុច "រក្សាទុក" ដើម្បីបញ្ជាក់ការលុប។',
            tabProfile: 'ព័ត៌មានផ្ទាល់ខ្លួន',
            tabMetrics: 'ស្ថិតិ',
            tabSocial: 'បណ្តាញសង្គម',
            tabTerminal: 'កូដ',
            tabPreview: 'មើលសាកល្បង',
            liveInteractive: 'មើលកូដសាកល្បងផ្ទាល់',
            realTime: 'មើលទំព័រដើមសាកល្បងផ្ទាល់',
            replica: 'មើល 1:1',
            hello: 'សួស្តី ខ្ញុំគឺ',
            exp: 'បទពិសោធន៍',
            proj: 'គម្រោង',
            rel: 'ភាពជឿជាក់',
            sat: 'ការពេញចិត្ត',
        }
    }[locale] || {};

    const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-sm';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputBg = isDark
        ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20';

    const [activeSubTab, setActiveSubTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    const [form, setForm] = useState({
        name: 'Alex Rivera',
        title: 'Full-Stack Engineer & Cloud Architect',
        status_badge: 'Available for full-time & high-impact contracts',
        status_active: true,
        bio: 'Full-Stack Engineer building robust, fault-tolerant web applications. Focused on Laravel, React, Tailwind CSS, and scalable cloud APIs.',
        about_text: 'Passionate about crafting elegant user experiences and rock-solid backend services. Over the last 5+ years, I have architected and deployed mission-critical systems across fintech, SaaS, and e-commerce platforms.',
        location: 'Phnom Penh, Cambodia',
        avatar_url: '',
        resume_url: '',
        experience_years: '5+ Years',
        projects_count: '30+ Apps',
        uptime_stat: '99.9%',
        satisfaction_stat: '100%',
        email: 'alex.rivera@devmail.test',
        phone: '+855 12 345 678',
        github_url: 'https://github.com',
        linkedin_url: 'https://linkedin.com',
        twitter_url: 'https://x.com',
        telegram_url: 'https://t.me/alexdev',
        code_class_name: 'SeniorFullStackEngineer',
        code_framework: 'Laravel 12 / PHP 8.2',
        code_frontend: 'React 19 / Tailwind CSS',
        code_database: 'PostgreSQL, Redis, SQLite',
    });

    const [heroImageFile, setHeroImageFile] = useState(null);
    const [heroImagePreview, setHeroImagePreview] = useState('');

    const fetchAboutData = async () => {
        setLoading(true);
        try {
            const res = await getAbout();
            if (res && res.data) {
                setForm(prev => ({
                    ...prev,
                    ...res.data,
                    status_active: Boolean(res.data.status_active),
                }));
                if (res.data.hero_image_url) {
                    setHeroImagePreview(res.data.hero_image_url);
                }
            }
        } catch (err) {
            console.error('Failed to load about profile:', err);
            if (onNotify) onNotify('error', t.errLoad || 'Failed to load about profile data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAboutData();
    }, []);

    const handleHeroImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                if (onNotify) onNotify('error', t.errSize || 'Image size must be less than 5MB.');
                return;
            }
            setHeroImageFile(file);
            setHeroImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveHeroImage = () => {
        setHeroImageFile(null);
        setHeroImagePreview('');
        setForm((prev) => ({ ...prev, hero_image_url: '' }));
        if (onNotify) onNotify('info', t.infoClear || 'Hero Image cleared. Click "Save Changes" to apply.');
    };

    // Save changes
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (key === 'status_active') {
                    formData.append(key, form[key] ? '1' : '0');
                } else if (form[key] !== null && form[key] !== undefined) {
                    formData.append(key, form[key]);
                }
            });

            if (heroImageFile) {
                formData.append('hero_image', heroImageFile);
            }

            const res = await updateAbout(formData);
            if (res && res.success) {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3000);
                if (onNotify) onNotify('success', t.successUpdate || 'Home & Profile updated successfully!');
                const newAvatar = res.data?.avatar_url ?? res.data?.profile?.avatar_url ?? form.avatar_url;
                setForm(prev => ({ 
                    ...prev, 
                    avatar_url: newAvatar, 
                    hero_image_url: res.data?.about?.hero_image_url ?? res.data?.hero_image_url ?? prev.hero_image_url,
                }));
                if (res.data?.hero_image_url || res.data?.about?.hero_image_url) setHeroImagePreview(res.data?.about?.hero_image_url || res.data?.hero_image_url);
                setHeroImageFile(null);
                if (onUpdateUser) {
                    onUpdateUser({
                        avatar_url: newAvatar,
                        avatar: newAvatar,
                        name: form.name,
                    });
                }
            }
        } catch (err) {
            console.error('Failed to update about profile:', err);
            const msg = err.response?.data?.message || t.errSave || 'Error saving about details.';
            if (onNotify) onNotify('error', msg);
        } finally {
            setSaving(false);
        }
    };

    // Keyboard shortcut: Ctrl+S / Cmd+S
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [form, heroImageFile]);

    const tabs = [
        { id: 'profile', label: t.tabProfile || 'Hero Section', icon: User },
        { id: 'metrics', label: t.tabMetrics || 'Stats & Metrics', icon: Award },
        { id: 'social', label: t.tabSocial || 'Social Links', icon: Send },
        { id: 'terminal', label: t.tabTerminal || 'Code Snippet', icon: Terminal },
        { id: 'preview', label: t.tabPreview || 'Live Preview', icon: Eye },
    ];

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className={`text-xs font-semibold uppercase tracking-wider ${subColor}`}>
                    {t.loading || 'Loading About & Profile Data...'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full pb-12">
            {/* Header with Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${titleColor}`}>
                                {t.title || 'Home Page Configuration'}
                            </h1>
                            <p className={`text-xs sm:text-sm ${subColor}`}>
                                {t.desc || 'Manage your hero section, personal info, and metrics.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="/#about"
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                            isDark
                                ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
                        }`}
                    >
                        <span>{t.viewSite || 'View Live Site'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition duration-150 ${
                            saving ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>{t.saving || 'Saving...'}</span>
                            </>
                        ) : savedSuccess ? (
                            <>
                                <CheckCheck className="w-4 h-4 text-emerald-300" />
                                <span>{t.saved || 'Saved!'}</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>{t.saveChanges || 'Save Changes'}</span>
                                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-indigo-700 text-[10px] font-mono opacity-80">
                                    Ctrl+S
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Quick Status Bar */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cardBg}`}>
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                        <span className={`w-3 h-3 rounded-full ${form.status_active ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
                        <span className={`w-3 h-3 rounded-full absolute ${form.status_active ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                    </div>
                    <div>
                        <p className={`text-xs font-bold ${titleColor}`}>
                            {t.statusLabel || 'Availability Status'}: {form.status_active ? (t.available || 'Available for Hire') : (t.busy || 'Currently Unavailable / Busy')}
                        </p>
                        <p className={`text-[11px] ${subColor}`}>
                            {t.badgeText || 'Badge text'}: "{form.status_badge}"
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.status_active}
                            onChange={(e) => setForm({ ...form, status_active: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        <span className={`ml-2 text-xs font-semibold ${subColor}`}>
                            {form.status_active ? (t.active || 'Active') : (t.hidden || 'Hidden')}
                        </span>
                    </label>
                </div>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="flex overflow-x-auto pb-1 gap-2 border-b border-slate-800/80">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeSubTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                                active
                                    ? isDark
                                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                                        : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                    : isDark
                                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: Profile & Bio */}
            {activeSubTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Avatar & Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
                            <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                                {t.mediaDoc || 'Media & Documents'}
                            </h3>
                            <div className="space-y-1.5 pt-2">
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    {t.heroImage || 'Hero Image (Optional)'}
                                </label>
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="relative group w-full">
                                        <div className={`w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-indigo-500/40 flex items-center justify-center shadow-xl ${
                                            isDark ? 'bg-indigo-950/40' : 'bg-indigo-50/80'
                                        }`}>
                                            <img
                                                src={heroImagePreview || form.avatar_url || '/images/brooklyn.jpg'}
                                                alt="Hero preview"
                                                className={`w-full h-full object-cover ${!heroImagePreview && !form.avatar_url ? 'opacity-80 grayscale' : ''}`}
                                            />
                                        </div>
                                        <label
                                            htmlFor="hero-upload"
                                            className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition text-white text-xs font-bold gap-1"
                                        >
                                            <UploadCloud className="w-5 h-5" />
                                            <span>{t.changeHero || 'Change Hero Image'}</span>
                                        </label>
                                        <input
                                            id="hero-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleHeroImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {(heroImagePreview || heroImageFile) && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveHeroImage}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition ${
                                                    isDark
                                                        ? 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
                                                        : 'border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700'
                                                }`}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>{t.removeHero || 'Remove Hero'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Right Column: Narrative & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className={`p-6 rounded-2xl border space-y-5 ${cardBg}`}>
                            <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                                {t.primaryBrand || 'Primary Branding & Headlines'}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={`block text-xs font-semibold ${subColor}`}>
                                        {t.fullName || 'Full Name / Display Name *'}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition ${inputBg}`}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className={`block text-xs font-semibold ${subColor}`}>
                                        {t.titleTag || 'Professional Title / Tagline *'}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition ${inputBg}`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    {t.statusBadgeLabel || 'Status Badge Text (e.g. "Available for full-time & high-impact contracts")'}
                                </label>
                                <input
                                    type="text"
                                    value={form.status_badge}
                                    onChange={(e) => setForm({ ...form, status_badge: e.target.value })}
                                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition ${inputBg}`}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    {t.shortBio || 'Short Bio / Hero Subtitle'}
                                </label>
                                <textarea
                                    rows={3}
                                    value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                    placeholder="Full-Stack Engineer building robust, fault-tolerant web applications. Focused on Laravel, React, Tailwind CSS, and scalable cloud APIs."
                                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition leading-relaxed ${inputBg}`}
                                />
                            </div>


                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Resume Download */}
                            <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
                                <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                                    {t.resumeDoc || 'Resume & Documents'}
                                </h3>
                                <div className="space-y-1.5">
                                    <label className={`block text-xs font-semibold ${subColor}`}>
                                        {t.resumeUrl || 'Resume / CV Download URL'}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.resume_url || ''}
                                        onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
                                        placeholder="/files/resume.pdf or Google Drive link"
                                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none transition ${inputBg}`}
                                    />
                                </div>
                            </div>

                            {/* Geographic Details */}
                            <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
                                <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                                    {t.geoDetails || 'Geographic Details'}
                                </h3>
                                <div className="space-y-1.5">
                                    <label className={`block text-xs font-semibold ${subColor}`}>
                                        {t.location || 'Location / Base City'}
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                        <input
                                            type="text"
                                            value={form.location || ''}
                                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                                            placeholder="Phnom Penh, Cambodia"
                                            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none transition ${inputBg}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Metrics & Stats */}
            {activeSubTab === 'metrics' && (
                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border space-y-6 ${cardBg}`}>
                        <div>
                            <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                                {t.prodMetrics || 'Production Metrics & Achievements'}
                            </h3>
                            <p className={`text-xs ${subColor}`}>
                                {t.metricDesc || 'These 4 high-impact counters are showcased prominently across the portfolio.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Metric 1 */}
                            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2">
                                <div className="flex items-center justify-between text-indigo-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] font-mono uppercase tracking-wider">Metric 1</span>
                                </div>
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    {t.expValue || 'Experience Value'}
                                </label>
                                <input
                                    type="text"
                                    value={form.experience_years}
                                    onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none ${inputBg}`}
                                    placeholder="5+ Years"
                                />
                                <p className="text-[11px] text-slate-400 font-medium">{t.expLabel || 'Production Experience'}</p>
                            </div>

                            {/* Metric 2 */}
                            <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-2">
                                <div className="flex items-center justify-between text-purple-400">
                                    <Briefcase className="w-4 h-4" />
                                    <span className="text-[10px] font-mono uppercase tracking-wider">Metric 2</span>
                                </div>
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    {t.appsShipped || 'Apps Shipped'}
                                </label>
                                <input
                                    type="text"
                                    value={form.projects_count}
                                    onChange={(e) => setForm({ ...form, projects_count: e.target.value })}
                                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none ${inputBg}`}
                                    placeholder="30+ Apps"
                                />
                                <p className="text-[11px] text-slate-400 font-medium">{t.shippedLabel || 'Shipped Worldwide'}</p>
                            </div>

                            {/* Metric 3 */}
                            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2">
                                <div className="flex items-center justify-between text-indigo-400">
                                    <Layers className="w-4 h-4" />
                                    <span className="text-[10px] font-mono uppercase tracking-wider">Metric 3</span>
                                </div>
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    {t.uptime || 'Uptime / SLA'}
                                </label>
                                <input
                                    type="text"
                                    value={form.uptime_stat}
                                    onChange={(e) => setForm({ ...form, uptime_stat: e.target.value })}
                                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none ${inputBg}`}
                                    placeholder="99.9%"
                                />
                                <p className="text-[11px] text-slate-400 font-medium">{t.uptimeLabel || 'Uptime & Reliability'}</p>
                            </div>

                            {/* Metric 4 */}
                            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                                <div className="flex items-center justify-between text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-[10px] font-mono uppercase tracking-wider">Metric 4</span>
                                </div>
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    {t.clientRating || 'Client Rating'}
                                </label>
                                <input
                                    type="text"
                                    value={form.satisfaction_stat}
                                    onChange={(e) => setForm({ ...form, satisfaction_stat: e.target.value })}
                                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none ${inputBg}`}
                                    placeholder="100%"
                                />
                                <p className="text-[11px] text-slate-400 font-medium">{t.clientLabel || 'Client Satisfaction'}</p>
                            </div>
                        </div>

                        {/* Live Preview of Metric Strip */}
                        <div className="pt-4 border-t border-slate-800/80">
                            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${subColor}`}>
                                {t.previewMetric || 'Frontend Live Metric Strip Preview'}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center">
                                    <p className="text-2xl font-black text-white">{form.experience_years}</p>
                                    <p className="text-[11px] text-slate-400">{t.expLabel || 'Production Experience'}</p>
                                </div>
                                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center">
                                    <p className="text-2xl font-black text-indigo-400">{form.projects_count}</p>
                                    <p className="text-[11px] text-slate-400">{t.shippedLabel || 'Shipped Worldwide'}</p>
                                </div>
                                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center">
                                    <p className="text-2xl font-black text-purple-400">{form.uptime_stat}</p>
                                    <p className="text-[11px] text-slate-400">{t.uptimeLabel || 'Uptime & Reliability'}</p>
                                </div>
                                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-center">
                                    <p className="text-2xl font-black text-emerald-400">{form.satisfaction_stat}</p>
                                    <p className="text-[11px] text-slate-400">{t.clientLabel || 'Client Satisfaction'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: Social & Contact */}
            {activeSubTab === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
                        <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                            {t.socialProfile || 'Social & Developer Profiles'}
                        </h3>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                GitHub Profile URL
                            </label>
                            <div className="relative">
                                <GithubIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                <input
                                    type="text"
                                    value={form.github_url || ''}
                                    onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                                    placeholder="https://github.com/username"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border outline-none transition ${inputBg}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                LinkedIn Profile URL
                            </label>
                            <div className="relative">
                                <LinkedinIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                <input
                                    type="text"
                                    value={form.linkedin_url || ''}
                                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                                    placeholder="https://linkedin.com/in/username"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border outline-none transition ${inputBg}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                Twitter / X URL
                            </label>
                            <div className="relative">
                                <TwitterIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                <input
                                    type="text"
                                    value={form.twitter_url || ''}
                                    onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
                                    placeholder="https://x.com/username"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border outline-none transition ${inputBg}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                Telegram Profile URL
                            </label>
                            <div className="relative">
                                <Send className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                <input
                                    type="text"
                                    value={form.telegram_url || ''}
                                    onChange={(e) => setForm({ ...form, telegram_url: e.target.value })}
                                    placeholder="https://t.me/username"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border outline-none transition ${inputBg}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
                        <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                            {t.directContact || 'Direct Contact Points'}
                        </h3>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                {t.primaryEmail || 'Primary Email'}
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                <input
                                    type="email"
                                    value={form.email || ''}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="developer@domain.com"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border outline-none transition ${inputBg}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                {t.directPhone || 'Direct Phone / WhatsApp'}
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                                <input
                                    type="text"
                                    value={form.phone || ''}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+855 12 345 678"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border outline-none transition ${inputBg}`}
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-xs space-y-1">
                            <p className="font-bold text-indigo-400">{t.inquiryRouting || 'Inquiry Routing'}</p>
                            <p className={subColor}>
                                {t.inquiryDesc || 'Client messages sent through the Contact Form will also be available directly in your admin Inbox tab.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: Code Snippet Customizer */}
            {activeSubTab === 'terminal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
                        <div>
                            <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                                {t.terminalConfig || 'Hero Terminal Card Configuration'}
                            </h3>
                            <p className={`text-xs ${subColor}`}>
                                {t.terminalDesc || 'Customize the interactive pseudo-code terminal shown on the public landing hero.'}
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                {t.className || 'Class / Role Name'}
                            </label>
                            <input
                                type="text"
                                value={form.code_class_name}
                                onChange={(e) => setForm({ ...form, code_class_name: e.target.value })}
                                className={`w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none ${inputBg}`}
                                placeholder="SeniorFullStackEngineer"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                {t.coreBackend || 'Core Backend Framework'}
                            </label>
                            <input
                                type="text"
                                value={form.code_framework}
                                onChange={(e) => setForm({ ...form, code_framework: e.target.value })}
                                className={`w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none ${inputBg}`}
                                placeholder="Laravel 12 / PHP 8.2"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                {t.frontendStack || 'Frontend Tech Stack'}
                            </label>
                            <input
                                type="text"
                                value={form.code_frontend}
                                onChange={(e) => setForm({ ...form, code_frontend: e.target.value })}
                                className={`w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none ${inputBg}`}
                                placeholder="React 19 / Tailwind CSS"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                {t.dbTech || 'Database Technologies'}
                            </label>
                            <input
                                type="text"
                                value={form.code_database}
                                onChange={(e) => setForm({ ...form, code_database: e.target.value })}
                                className={`w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none ${inputBg}`}
                                placeholder="PostgreSQL, Redis, SQLite"
                            />
                        </div>
                    </div>

                    {/* Right: Live Terminal Preview */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold uppercase tracking-wider ${subColor}`}>
                                {t.liveInteractive || 'Live Interactive Terminal Preview'}
                            </span>
                            <span className="text-[10px] font-mono text-indigo-400">developer-profile.php</span>
                        </div>

                        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>developer-profile.php</span>
                                </div>
                                <div className="w-12"></div>
                            </div>

                            <div className="p-6 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto space-y-1">
                                <p><span className="text-purple-400 font-semibold">&lt;?php</span></p>
                                <p><span className="text-indigo-400">class</span> <span className="text-amber-300 font-semibold">{form.code_class_name || 'Engineer'}</span> &#123;</p>
                                <p className="pl-6"><span className="text-slate-500">// Core Stack & Principles</span></p>
                                <p className="pl-6"><span className="text-indigo-400">public string</span> <span className="text-slate-200">$framework</span> = <span className="text-emerald-400">'{form.code_framework}'</span>;</p>
                                <p className="pl-6"><span className="text-indigo-400">public string</span> <span className="text-slate-200">$frontend</span>  = <span className="text-emerald-400">'{form.code_frontend}'</span>;</p>
                                <p className="pl-6"><span className="text-indigo-400">public array</span>  <span className="text-slate-200">$database</span>  = [<span className="text-emerald-400">'{form.code_database}'</span>];</p>
                                <p className="pl-6"><span className="text-indigo-400">public bool</span>   <span className="text-slate-200">$readyForHire</span> = <span className="text-rose-400">{form.status_active ? 'true' : 'false'}</span>;</p>
                                <p>&#125;</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 5: Live Real-Time Full Hero Preview */}
            {activeSubTab === 'preview' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${subColor}`}>
                            {t.realTime || 'Real-time Visual Preview of Homepage Hero & About Section'}
                        </span>
                        <span className="text-xs text-indigo-400 font-semibold">{t.replica || '1:1 Replica'}</span>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-[#080b14] text-slate-200 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                        {/* Glows */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                        {/* Status Badge */}
                        {form.status_active && (
                            <div className="flex items-center justify-center mb-6">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>{form.status_badge}</span>
                                </div>
                            </div>
                        )}

                        <div className="text-center max-w-3xl mx-auto space-y-4">
                            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                                    {t.hello || "Hello, I'm"} {form.name}
                                </span>
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
                                {form.bio}
                            </p>
                        </div>

                        {/* Metrics Bar */}
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                            <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center">
                                <p className="text-xl font-black text-white">{form.experience_years}</p>
                                <p className="text-[10px] text-slate-400">{t.exp || 'Experience'}</p>
                            </div>
                            <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center">
                                <p className="text-xl font-black text-indigo-400">{form.projects_count}</p>
                                <p className="text-[10px] text-slate-400">{t.proj || 'Projects'}</p>
                            </div>
                            <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center">
                                <p className="text-xl font-black text-purple-400">{form.uptime_stat}</p>
                                <p className="text-[10px] text-slate-400">{t.rel || 'Reliability'}</p>
                            </div>
                            <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center">
                                <p className="text-xl font-black text-emerald-400">{form.satisfaction_stat}</p>
                                <p className="text-[10px] text-slate-400">{t.sat || 'Satisfaction'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
