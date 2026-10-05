import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import MessagesPage from './pages/MessagesPage';
import ReviewsPage from './pages/ReviewsPage';
import RolesPage from './pages/RolesPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import CategoriesPage from './pages/CategoriesPage';
import { getDashboard } from './libs/api';

export default function AdminApp() {
    const [user, setUser] = useState(() => window.__ADMIN_USER__ || { name: 'Administrator', email: 'admin@portfolio.test' });

    const handleUpdateUser = (updated) => {
        setUser((prev) => {
            const next = { ...prev, ...updated };
            window.__ADMIN_USER__ = next;
            return next;
        });
    };

    // Parse URL on initial load
    const parsePath = () => {
        const path = window.location.pathname.replace(/\/+$/, '');
        if (path.includes('/admin/projects/create')) {
            return { tab: 'projects', openCreate: true };
        }
        if (path.includes('/admin/home')) return { tab: 'home', openCreate: false };
        if (path.includes('/admin/about')) return { tab: 'about', openCreate: false };
        if (path.includes('/admin/projects')) return { tab: 'projects', openCreate: false };
        if (path.includes('/admin/skills')) return { tab: 'skills', openCreate: false };
        if (path.includes('/admin/reviews')) return { tab: 'reviews', openCreate: false };
        if (path.includes('/admin/messages')) return { tab: 'messages', openCreate: false };
        if (path.includes('/admin/roles')) return { tab: 'roles', openCreate: false };
        if (path.includes('/admin/users')) return { tab: 'users', openCreate: false };
        if (path.includes('/admin/settings')) return { tab: 'settings', openCreate: false };
        if (path.includes('/admin/categories')) return { tab: 'categories', openCreate: false };
        return { tab: 'dashboard', openCreate: false };
    };

    const initial = parsePath();
    const [currentTab, setCurrentTabState] = useState(initial.tab);
    const [showAddProjectModal, setShowAddProjectModal] = useState(initial.openCreate);
    const [showAddSkillModal, setShowAddSkillModal] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        recent_projects: [],
        recent_messages: [],
    });
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);
    const [theme, setTheme] = useState(() => localStorage.getItem('admin_theme') || 'dark');
    const [locale, setLocale] = useState(() => localStorage.getItem('admin_locale') || 'en');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('admin_theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('admin_locale', locale);
    }, [locale]);

    const setCurrentTab = (tab) => {
        setCurrentTabState(tab);
        const targetPath = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
        if (window.location.pathname !== targetPath) {
            window.history.pushState(null, '', targetPath);
        }
    };

    useEffect(() => {
        const handlePopState = () => {
            const parsed = parsePath();
            setCurrentTabState(parsed.tab);
            if (parsed.openCreate) {
                setShowAddProjectModal(true);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const data = await getDashboard();
            setDashboardData(data);
            if (data.user) {
                setUser((prev) => ({ ...prev, ...data.user }));
            }
        } catch (e) {
            console.error('Failed to load dashboard data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleUpdateUnread = (newCount) => {
        setDashboardData((prev) => ({
            ...prev,
            stats: {
                ...prev.stats,
                unread_messages: newCount,
            },
        }));
    };

    const isDark = theme === 'dark';

    return (
        <div
            className={`h-screen h-[100dvh] flex flex-col md:flex-row overflow-hidden transition-colors duration-200 ${
                isDark ? 'bg-[#0b0f19] text-slate-200' : 'bg-slate-100 text-slate-800'
            }`}
        >
            {/* Sidebar (Fixed on Desktop, Drawer on Mobile) */}
            <Sidebar
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                stats={dashboardData.stats || {}}
                user={user}
                theme={theme}
                locale={locale}
                mobileOpen={mobileSidebarOpen}
                setMobileOpen={setMobileSidebarOpen}
            />

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header (Permanently fixed at top, never scrolls) */}
                <Header
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    user={user}
                    stats={dashboardData.stats || {}}
                    recentMessages={dashboardData.recent_messages || []}
                    onAddProject={() => {
                        setCurrentTab('projects');
                        setShowAddProjectModal(true);
                    }}
                    onAddSkill={() => {
                        setCurrentTab('skills');
                        setShowAddSkillModal(true);
                    }}
                    onRefresh={loadDashboard}
                    loading={loading}
                    theme={theme}
                    setTheme={setTheme}
                    locale={locale}
                    setLocale={setLocale}
                    mobileOpen={mobileSidebarOpen}
                    setMobileOpen={setMobileSidebarOpen}
                />

                {/* Toasts */}
                <div className="fixed top-5 right-5 z-50 space-y-2 pointer-events-none">
                    {toasts.map((t) => (
                        <div
                            key={t.id}
                            className={`p-4 rounded-xl text-xs font-semibold shadow-2xl backdrop-blur-md pointer-events-auto transition-all ${
                                t.type === 'success'
                                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                                    : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                            }`}
                        >
                            {t.message}
                        </div>
                    ))}
                </div>

                {/* Scrollable Page Content Area */}
                <div className="flex-1 overflow-y-auto min-w-0">
                    <main className="p-4 sm:p-6 lg:p-8 min-h-full">
                        {currentTab === 'dashboard' && (
                            <DashboardPage
                                data={dashboardData}
                                user={user}
                                setCurrentTab={setCurrentTab}
                                onAddProject={() => {
                                    setCurrentTab('projects');
                                    setShowAddProjectModal(true);
                                }}
                                theme={theme}
                                locale={locale}
                            />
                        )}

                        {currentTab === 'home' && (
                            <HomePage
                                onNotify={addToast}
                                onUpdateUser={handleUpdateUser}
                                theme={theme}
                                locale={locale}
                            />
                        )}

                        {currentTab === 'about' && (
                            <AboutPage
                                onNotify={addToast}
                                onUpdateUser={handleUpdateUser}
                                theme={theme}
                                locale={locale}
                            />
                        )}

                        {currentTab === 'projects' && (
                            <ProjectsPage
                                showAddModal={showAddProjectModal}
                                setShowAddModal={setShowAddProjectModal}
                                onNotify={addToast}
                                theme={theme}
                                locale={locale}
                            />
                        )}

                        {currentTab === 'skills' && (
                            <SkillsPage
                                showAddModal={showAddSkillModal}
                                setShowAddModal={setShowAddSkillModal}
                                onNotify={addToast}
                                theme={theme}
                                locale={locale}
                            />
                        )}

                        {currentTab === 'reviews' && (
                            <ReviewsPage onNotify={addToast} theme={theme} locale={locale} />
                        )}

                        {currentTab === 'messages' && (
                            <MessagesPage
                                onNotify={addToast}
                                onUpdateUnread={handleUpdateUnread}
                                theme={theme}
                                locale={locale}
                            />
                        )}

                        {currentTab === 'roles' && (
                            <RolesPage onNotify={addToast} theme={theme} locale={locale} />
                        )}

                        {currentTab === 'users' && (
                            <UsersPage
                                onNotify={addToast}
                                currentUser={user}
                                theme={theme}
                                locale={locale}
                            />
                        )}

                        {currentTab === 'settings' && (
                            <SettingsPage onNotify={addToast} theme={theme} locale={locale} />
                        )}

                        {currentTab === 'categories' && (
                            <CategoriesPage onNotify={addToast} theme={theme} locale={locale} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

// Mount to DOM
const container = document.getElementById('admin-root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <AdminApp />
        </React.StrictMode>
    );
}
