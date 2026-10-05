import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    RefreshCw,
    Globe,
    Bell,
    Sun,
    Moon,
    ChevronDown,
    User,
    LogOut,
    ExternalLink,
    Shield,
    Mail,
    Check,
    CheckCheck,
    Sparkles,
    Calendar,
    Users,
    Languages,
    Menu,
    Settings,
} from 'lucide-react';
import { adminLogout } from '../libs/api';
import FlagIcon, { FlagCambodia, FlagUK } from './FlagIcons';

export default function Header({
    currentTab,
    setCurrentTab,
    user = {},
    stats = {},
    recentMessages = [],
    onAddProject,
    onAddSkill,
    onRefresh,
    loading,
    theme = 'dark',
    setTheme,
    locale = 'en',
    setLocale,
    mobileOpen = false,
    setMobileOpen,
}) {
    const [languageOpen, setLanguageOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest('[data-dropdown]')) {
                setLanguageOpen(false);
                setNotificationsOpen(false);
                setProfileOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    // Bilingual dictionary (English & Khmer)
    const t = {
        en: {
            brand: 'Admin',
            pageTitles: {
                dashboard: 'Control Center Overview',
                home: 'Home Page Configuration',
                about: 'About & Profile Management',
                projects: 'Projects Management',
                skills: 'Technical Skills & Stack',
                messages: 'Inquiries & Inbox',
                roles: 'Role-Based Access Control',
                users: 'User Accounts & Team',
                categories: 'Categories Management',
                reviews: 'Client Reviews',
                settings: 'System & Portfolio Settings',
            },
            breadcrumbs: {
                dashboard: 'Dashboard',
                home: 'Home',
                about: 'About & Bio',
                projects: 'Projects',
                skills: 'Skills',
                messages: 'Messages',
                roles: 'Roles & RBAC',
                users: 'Users',
                categories: 'Categories',
                reviews: 'Reviews',
                settings: 'Settings',
            },
            notifications: {
                title: 'Notifications',
                unread: 'unread',
                empty: 'No new notifications',
                markAllRead: 'Mark all as read',
                viewAll: 'Open Inbox',
                newInquiry: 'New Client Inquiry',
            },
            profile: {
                manageAccount: 'Account & Profile',
                viewSite: 'View Live Portfolio',
                roles: 'Roles & Access',
                team: 'Team Members',
                settings: 'System Settings',
                logout: 'Sign Out',
            },
            quick: {
                addProject: 'Add Project',
                addSkill: 'Add Skill',
                reload: 'Reload',
            },
            theme: {
                toLight: 'Switch to Light Mode',
                toDark: 'Switch to Dark Mode',
            },
        },
        kh: {
            brand: 'រដ្ឋបាល',
            pageTitles: {
                dashboard: 'ទិដ្ឋភាពទូទៅនៃផ្ទាំងគ្រប់គ្រង',
                home: 'ការកំណត់ទំព័រដើម',
                about: 'ការគ្រប់គ្រងព័ត៌មានអំពី & ប្រវត្តិរូប',
                projects: 'ការគ្រប់គ្រងគម្រោង',
                skills: 'ជំនាញបច្ចេកវិទ្យា',
                messages: 'ប្រអប់សារ & ទំនាក់ទំនង',
                roles: 'តួនាទី & សិទ្ធិប្រើប្រាស់',
                users: 'គណនីអ្នកប្រើប្រាស់ & ក្រុមការងារ',
                categories: 'ការគ្រប់គ្រងប្រភេទ',
                reviews: 'ការគ្រប់គ្រងមតិយោបល់',
                settings: 'ការកំណត់គេហទំព័រ & ប្រព័ន្ធ',
            },
            breadcrumbs: {
                dashboard: 'ផ្ទាំងគ្រប់គ្រង',
                home: 'ទំព័រដើម',
                about: 'អំពីខ្ញុំ',
                projects: 'គម្រោង',
                skills: 'ជំនាញ',
                messages: 'សារ',
                roles: 'តួនាទី & សិទ្ធិ',
                users: 'អ្នកប្រើប្រាស់',
                categories: 'ប្រភេទ',
                reviews: 'មតិយោបល់',
                settings: 'ការកំណត់',
            },
            notifications: {
                title: 'ការជូនដំណឹង',
                unread: 'មិនទាន់អាន',
                empty: 'គ្មានការជូនដំណឹងថ្មីទេ',
                markAllRead: 'សម្គាល់ថាបានអានទាំងអស់',
                viewAll: 'បើកប្រអប់សារ',
                newInquiry: 'មានសារទំនាក់ទំនងថ្មី',
            },
            profile: {
                manageAccount: 'គណនី និងព័ត៌មានផ្ទាល់ខ្លួន',
                viewSite: 'មើលគេហទំព័រផ្ទាល់',
                roles: 'តួនាទី & សិទ្ធិប្រើប្រាស់',
                team: 'សមាជិកក្រុមការងារ',
                settings: 'ការកំណត់ប្រព័ន្ធ',
                logout: 'ចាកចេញពីប្រព័ន្ធ',
            },
            quick: {
                addProject: 'បន្ថែមគម្រោង',
                addSkill: 'បន្ថែមជំនាញ',
                reload: 'ទាញទិន្នន័យ',
            },
            theme: {
                toLight: 'ប្ដូរទៅផ្ទាំងភ្លឺ (Light Mode)',
                toDark: 'ប្ដូរទៅផ្ទាំងងងឹត (Dark Mode)',
            },
        },
    }[locale] || t.en;

    const unreadCount = stats.unread_messages || 0;

    const handleLogout = async () => {
        try {
            await adminLogout();
        } catch (e) {
            window.location.href = '/admin/login';
        }
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        if (setTheme) setTheme(nextTheme);
    };

    const isDark = theme === 'dark';

    return (
        <header
            className={`h-16 shrink-0 border-b px-4 sm:px-6 lg:px-8 flex items-center justify-between backdrop-blur-xl sticky top-0 z-30 transition-colors duration-200 ${
                isDark
                    ? 'bg-slate-900/80 border-slate-800/80 text-white'
                    : 'bg-white/85 border-slate-200/90 text-slate-800 shadow-sm'
            }`}
        >
            {/* Left: Page Title & Breadcrumbs */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileOpen && setMobileOpen(!mobileOpen)}
                    className={`p-2 -ml-1 rounded-xl border md:hidden transition duration-150 ${
                        isDark
                            ? 'text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-700/60'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                    }`}
                    aria-label="Toggle navigation menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div>
                    <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                            {t.brand}
                        </span>
                        <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>/</span>
                        <span className="text-indigo-500 font-semibold">
                            {t.breadcrumbs[currentTab] || currentTab}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">
                            {t.pageTitles[currentTab] || 'Admin Dashboard'}
                        </h1>
                        <span
                            className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                                isDark
                                    ? 'bg-indigo-950/70 border border-indigo-800/60 text-indigo-400'
                                    : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
                            }`}
                        >
                            SPA
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Actions Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Contextual Quick Actions */}
                {currentTab === 'projects' && (
                    <button
                        onClick={onAddProject}
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition duration-150"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t.quick.addProject}</span>
                    </button>
                )}

                {currentTab === 'skills' && (
                    <button
                        onClick={onAddSkill}
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition duration-150"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t.quick.addSkill}</span>
                    </button>
                )}

                {/* Reload Button */}
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    title={t.quick.reload}
                    className={`p-2 rounded-xl border transition duration-150 ${
                        isDark
                            ? 'text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                            : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border-slate-200'
                    }`}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
                </button>

                {/* 1. Language Switcher (Flag Button) */}
                <div className="relative" data-dropdown>
                    <button
                        onClick={() => {
                            setLanguageOpen(!languageOpen);
                            setNotificationsOpen(false);
                            setProfileOpen(false);
                        }}
                        className={`p-2 rounded-xl border transition duration-150 flex items-center justify-center relative group ${
                            languageOpen
                                ? isDark
                                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400'
                                    : 'bg-indigo-50 border-indigo-300 text-indigo-600'
                                : isDark
                                ? 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                                : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200'
                        }`}
                        title={locale === 'kh' ? 'ភាសាខ្មែរ (KH) - ចុចដើម្បីប្ដូរ' : 'English (EN) - Click to switch'}
                    >
                        <FlagIcon
                            locale={locale}
                            className="w-5 h-3.5 rounded shadow-sm group-hover:scale-110 transition-transform"
                        />
                    </button>

                    {languageOpen && (
                        <div
                            className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                                isDark
                                    ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-black/60'
                                    : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/80'
                            }`}
                        >
                            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {locale === 'kh' ? 'ជ្រើសរើសភាសា' : 'Select Language'}
                            </div>
                            <button
                                onClick={() => {
                                    if (setLocale) setLocale('en');
                                    setLanguageOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                                    locale === 'en'
                                        ? 'bg-indigo-600/15 text-indigo-500 font-semibold'
                                        : isDark
                                        ? 'hover:bg-slate-800 text-slate-300'
                                        : 'hover:bg-slate-100 text-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <FlagUK className="w-5 h-3.5 rounded shadow-sm" />
                                    <span>English (EN)</span>
                                </div>
                                {locale === 'en' && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                            </button>

                            <button
                                onClick={() => {
                                    if (setLocale) setLocale('kh');
                                    setLanguageOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                                    locale === 'kh'
                                        ? 'bg-indigo-600/15 text-indigo-500 font-semibold'
                                        : isDark
                                        ? 'hover:bg-slate-800 text-slate-300'
                                        : 'hover:bg-slate-100 text-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <FlagCambodia className="w-5 h-3.5 rounded shadow-sm" />
                                    <span>ភាសាខ្មែរ (KH)</span>
                                </div>
                                {locale === 'kh' && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. Dark / Light Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    title={isDark ? t.theme.toLight : t.theme.toDark}
                    className={`p-2 rounded-xl border transition duration-150 ${
                        isDark
                            ? 'text-amber-400 hover:text-amber-300 bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                            : 'text-indigo-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200/80 border-slate-200'
                    }`}
                >
                    {isDark ? (
                        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
                    ) : (
                        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
                    )}
                </button>

                {/* 3. Notifications Dropdown */}
                <div className="relative" data-dropdown>
                    <button
                        onClick={() => {
                            setNotificationsOpen(!notificationsOpen);
                            setLanguageOpen(false);
                            setProfileOpen(false);
                        }}
                        title={t.notifications.title}
                        className={`p-2 rounded-xl border relative transition duration-150 ${
                            isDark
                                ? 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                                : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border-slate-200'
                        }`}
                    >
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            </span>
                        )}
                    </button>

                    {notificationsOpen && (
                        <div
                            className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 ${
                                isDark
                                    ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-black/70'
                                    : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/90'
                            }`}
                        >
                            {/* Notifications Header */}
                            <div
                                className={`px-4 py-3 border-b flex items-center justify-between ${
                                    isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/80'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.notifications.title}</h4>
                                    {unreadCount > 0 && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                            {unreadCount} {t.notifications.unread}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        if (setCurrentTab) setCurrentTab('messages');
                                        setNotificationsOpen(false);
                                    }}
                                    className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-400"
                                >
                                    {t.notifications.viewAll} &rarr;
                                </button>
                            </div>

                            {/* Notifications List */}
                            <div className={`max-h-72 overflow-y-auto divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-100'}`}>
                                {recentMessages.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-slate-400">
                                        {t.notifications.empty}
                                    </div>
                                ) : (
                                    recentMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            onClick={() => {
                                                if (setCurrentTab) setCurrentTab('messages');
                                                setNotificationsOpen(false);
                                            }}
                                            className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                                                isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                                                    !msg.is_read
                                                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                                        : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                                                }`}
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-1">
                                                    <p className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                        {msg.name}
                                                    </p>
                                                    {!msg.is_read && (
                                                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                                                    {msg.subject || t.notifications.newInquiry}
                                                </p>
                                                <p className="text-[10px] text-slate-500 truncate mt-0.5 line-clamp-1">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Notifications Footer */}
                            <div
                                className={`p-2.5 text-center border-t ${
                                    isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'
                                }`}
                            >
                                <button
                                    onClick={() => {
                                        if (setCurrentTab) setCurrentTab('messages');
                                        setNotificationsOpen(false);
                                    }}
                                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition"
                                >
                                    {t.notifications.viewAll}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. User Profile Button & Dropdown */}
                <div className="relative ml-1" data-dropdown>
                    <button
                        onClick={() => {
                            setProfileOpen(!profileOpen);
                            setLanguageOpen(false);
                            setNotificationsOpen(false);
                        }}
                        className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border transition duration-150 ${
                            isDark
                                ? 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-white'
                                : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800'
                        }`}
                        title="Profile & Settings"
                    >
                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0">
                            {user?.avatar_url || user?.avatar ? (
                                <img
                                    src={user.avatar_url || user.avatar}
                                    alt={user.name || 'User'}
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                            )}
                        </div>
                        <div className="hidden md:block text-left">
                            <span className="text-xs font-semibold block leading-tight truncate max-w-[120px]">
                                {user?.name || 'Administrator'}
                            </span>
                            <span className="text-[10px] text-indigo-400 font-medium block leading-none mt-0.5 capitalize">
                                {user?.roles?.[0]?.name || 'Admin'}
                            </span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                    </button>

                    {profileOpen && (
                        <div
                            className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                                isDark
                                    ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-black/70'
                                    : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/90'
                            }`}
                        >
                            {/* Profile Info Card */}
                            <div
                                className={`p-3 rounded-xl mb-1.5 flex items-center gap-3 ${
                                    isDark ? 'bg-slate-800/60' : 'bg-slate-100/80'
                                }`}
                            >
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-md">
                                    {user?.avatar_url || user?.avatar ? (
                                        <img
                                            src={user.avatar_url || user.avatar}
                                            alt={user.name || 'User'}
                                            className="w-full h-full object-cover rounded-xl"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {user?.name || 'Administrator'}
                                    </p>
                                    <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {user?.email || 'admin@portfolio.test'}
                                    </p>
                                    <div className="mt-1 flex items-center gap-1.5">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                            <Shield className="w-2.5 h-2.5" />
                                            <span>{user?.roles?.[0]?.name || 'Super Admin'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-0.5">
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                                        isDark
                                            ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                                        <span>{t.profile.viewSite}</span>
                                    </span>
                                </a>

                                <button
                                    onClick={() => {
                                        if (setCurrentTab) setCurrentTab('roles');
                                        setProfileOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                                        isDark
                                            ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>{t.profile.roles}</span>
                                    </span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (setCurrentTab) setCurrentTab('users');
                                        setProfileOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                                        isDark
                                            ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Users className="w-3.5 h-3.5 text-pink-400" />
                                        <span>{t.profile.team}</span>
                                    </span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (setCurrentTab) setCurrentTab('settings');
                                        setProfileOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                                        isDark
                                            ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Settings className="w-3.5 h-3.5 text-amber-400" />
                                        <span>{t.profile.settings}</span>
                                    </span>
                                </button>
                            </div>

                            {/* Divider & Sign Out */}
                            <div className={`pt-1.5 mt-1.5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>{t.profile.logout}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
