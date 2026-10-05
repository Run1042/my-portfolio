import {
    LayoutDashboard,
    UserCircle2,
    FolderGit2,
    Cpu,
    Mail,
    ExternalLink,
    LogOut,
    Sparkles,
    ShieldCheck,
    Users,
    Settings,
    X,
    HomeIcon,
    Star,
    FolderTree,
} from 'lucide-react';
import { adminLogout } from '../libs/api';

export default function Sidebar({
    currentTab,
    setCurrentTab,
    stats = {},
    user = {},
    theme = 'dark',
    locale = 'en',
    mobileOpen = false,
    setMobileOpen,
}) {
    const isDark = theme === 'dark';

    const labels = {
        en: {
            brandSub: 'React Admin',
            dashboard: 'Dashboard',
            home: 'Home',
            about: 'About',
            projects: 'Projects',
            skills: 'Skills & Stack',
            reviews: 'Reviews',
            messages: 'Inbox',
            roles: 'Roles & Access',
            users: 'Users & Team',
            categories: 'Categories',
            settings: 'System Settings',
            viewSite: 'View Public Portfolio',
            signOut: 'Sign out',
        },
        kh: {
            brandSub: 'ផ្ទាំងរដ្ឋបាល',
            dashboard: 'ផ្ទាំងគ្រប់គ្រង',
            home: 'ទំព័រដើម',
            about: 'អំពីខ្ញុំ',
            projects: 'គម្រោង',
            skills: 'ជំនាញបច្ចេកវិទ្យា',
            reviews: 'មតិយោបល់',
            messages: 'ប្រអប់សារ',
            roles: 'តួនាទី & សិទ្ធិ',
            users: 'អ្នកប្រើប្រាស់ & ក្រុម',
            categories: 'ប្រភេទ',
            settings: 'ការកំណត់ប្រព័ន្ធ',
            viewSite: 'មើលគេហទំព័រផ្ទាល់',
            signOut: 'ចាកចេញ',
        },
    }[locale] || {};

    const navItems = [
        { id: 'dashboard', label: labels.dashboard, icon: LayoutDashboard },
        { id: 'home', label: labels.home, icon: HomeIcon },
        { id: 'about', label: labels.about, icon: UserCircle2 },
        {
            id: 'projects',
            label: labels.projects,
            icon: FolderGit2,
            count: stats.total_projects,
        },
        {
            id: 'skills',
            label: labels.skills,
            icon: Cpu,
            count: stats.total_skills,
        },
        {
            id: 'categories',
            label: labels.categories,
            icon: FolderTree,
        },
        {
            id: 'messages',
            label: labels.messages,
            icon: Mail,
            unread: stats.unread_messages,
        },
        {
            id: 'reviews',
            label: labels.reviews,
            icon: Star,
        },
        {
            id: 'roles',
            label: labels.roles,
            icon: ShieldCheck,
            count: stats.total_roles,
        },
        {
            id: 'users',
            label: labels.users,
            icon: Users,
            count: stats.total_users,
        },
        {
            id: 'settings',
            label: labels.settings,
            icon: Settings,
        },
    ];

    const handleLogout = async () => {
        try {
            await adminLogout();
        } catch (e) {
            window.location.href = '/admin/login';
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 md:static md:h-screen shrink-0 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
                } border-r backdrop-blur-xl ${
                    isDark
                        ? 'bg-slate-900/95 border-slate-800/80 text-slate-200'
                        : 'bg-white/95 border-slate-200/90 text-slate-700 shadow-sm'
                }`}
            >
                <div>
                    {/* Brand Header */}
                    <div
                        className={`h-16 flex items-center justify-between px-6 border-b ${
                            isDark ? 'border-slate-800/80' : 'border-slate-200/90'
                        }`}
                    >
                        <button
                            onClick={() => {
                                setCurrentTab('dashboard');
                                if (setMobileOpen) setMobileOpen(false);
                            }}
                            className="flex items-center gap-3 group text-left"
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-200">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <span
                                    className={`font-bold tracking-tight text-base block leading-none ${
                                        isDark ? 'text-white' : 'text-slate-900'
                                    }`}
                                >
                                    Portfolio<span className="text-indigo-500">OS</span>
                                </span>
                                <span
                                    className={`text-[11px] font-medium tracking-wide ${
                                        isDark ? 'text-slate-400' : 'text-slate-500'
                                    }`}
                                >
                                    {labels.brandSub}
                                </span>
                            </div>
                        </button>

                        {/* Mobile Close Button */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen && setMobileOpen(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition"
                            aria-label="Close sidebar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="p-4 space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = currentTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setCurrentTab(item.id);
                                        if (setMobileOpen) setMobileOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition duration-150 ${
                                        active
                                            ? isDark
                                                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm font-semibold'
                                                : 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 shadow-sm font-semibold'
                                            : isDark
                                            ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                    </span>

                                    {item.unread > 0 ? (
                                        <span className="text-[10px] bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold px-2 py-0.5 rounded-full shrink-0">
                                            {item.unread}
                                        </span>
                                    ) : item.count !== undefined ? (
                                        <span
                                            className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${
                                                isDark
                                                    ? 'bg-slate-800 border border-slate-700/60 text-slate-400'
                                                    : 'bg-slate-100 border border-slate-200 text-slate-500'
                                            }`}
                                        >
                                            {item.count}
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer / User Profile */}
                <div
                    className={`p-4 border-t space-y-3 ${
                        isDark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200/90 bg-slate-50/70'
                    }`}
                >
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold rounded-xl border transition duration-150 group ${
                            isDark
                                ? 'text-slate-300 bg-slate-800/80 hover:bg-slate-800 border-slate-700/60'
                                : 'text-slate-700 bg-white hover:bg-slate-100 border-slate-200 shadow-sm'
                        }`}
                    >
                        <span>{labels.viewSite}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                    </a>

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
                                {user?.avatar_url || user?.avatar ? (
                                    <img
                                        src={user.avatar_url || user.avatar}
                                        alt={user.name || 'User'}
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                                )}
                            </div>
                            <div className="truncate">
                                <p
                                    className={`text-xs font-semibold truncate ${
                                        isDark ? 'text-white' : 'text-slate-900'
                                    }`}
                                >
                                    {user?.name || 'Administrator'}
                                </p>
                                <p
                                    className={`text-[11px] truncate ${
                                        isDark ? 'text-slate-400' : 'text-slate-500'
                                    }`}
                                >
                                    {user?.email || 'admin@portfolio.test'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            title={labels.signOut}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition duration-150"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
