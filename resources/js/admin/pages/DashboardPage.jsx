import React, { useState, useEffect } from 'react';
import {
    FolderGit2,
    Star,
    Cpu,
    Mail,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Users,
    FolderTree,
    Clock,
    MessageSquare,
    Eye,
    Sparkles,
    ExternalLink,
} from 'lucide-react';
import TrafficAreaChart from '../components/charts/TrafficAreaChart';
import ProjectDistributionDonut from '../components/charts/ProjectDistributionDonut';
import InquiriesBarChart from '../components/charts/InquiriesBarChart';
import SkillsRadarMatrix from '../components/charts/SkillsRadarMatrix';

export default function DashboardPage({ data, user, setCurrentTab, onAddProject, theme = 'dark', locale = 'en' }) {
    const stats = data.stats || {};
    const recentProjects = data.recent_projects || [];
    const recentMessages = data.recent_messages || [];
    const activityFeed = data.activity_feed || [];
    const charts = data.charts || {};
    const isDark = theme === 'dark';

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Manual Khmer date format to ensure it works on all browsers/OS
    const formatKhmerDate = (date) => {
        const days = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
        const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
        const num = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        const toKhmerNum = (n) => String(n).split('').map(d => num[parseInt(d)] || d).join('');
        
        return `ថ្ងៃ${days[date.getDay()]} ទី${toKhmerNum(date.getDate())} ខែ${months[date.getMonth()]} ឆ្នាំ${toKhmerNum(date.getFullYear())}`;
    };

    const formatKhmerTime = (date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        
        // Use Western numbers for time as it is often preferred, but we can also return Khmer numbers
        // Let's use Western digits for time since it's cleaner in the UI
        return `${h}:${m}:${s}`;
    };

    const t = {
        en: {
            projects: 'Projects', view: 'View', featured: 'Featured', pinned: 'Pinned',
            skills: 'Skills', stack: 'Stack', inbox: 'Inbox', new: 'new', allRead: 'All read',
            reviews: 'Reviews', see: 'See', categories: 'Categories', roles: 'Roles', rbac: 'RBAC',
            users: 'Users', team: 'Team', recentProjects: 'Recent Projects', viewAll: 'View all',
            noProjects: 'No projects yet.', recentInquiries: 'Recent Inquiries', noMessages: 'No messages yet.',
            activityFeed: 'Activity Feed', realTime: 'Real-time', noActivity: 'No activity recorded yet.',
            viewers: 'Viewers', today: 'Today',
            welcomeTitle: 'Welcome back',
            welcomeSubtitle: 'Here is what is happening with your portfolio today. Review your latest inquiries and update your projects.',
            viewLiveSite: 'View Live Site'
        },
        kh: {
            projects: 'គម្រោង', view: 'មើល', featured: 'លេចធ្លោ', pinned: 'បានខ្ទាស់',
            skills: 'ជំនាញ', stack: 'បច្ចេកវិទ្យា', inbox: 'ប្រអប់សារ', new: 'ថ្មី', allRead: 'អានរួច',
            reviews: 'មតិយោបល់', see: 'មើល', categories: 'ប្រភេទ', roles: 'តួនាទី', rbac: 'សិទ្ធិ',
            users: 'អ្នកប្រើប្រាស់', team: 'ក្រុម', recentProjects: 'គម្រោងថ្មីៗ', viewAll: 'មើលទាំងអស់',
            noProjects: 'មិនទាន់មានគម្រោងទេ', recentInquiries: 'សារថ្មីៗ', noMessages: 'មិនទាន់មានសារទេ',
            activityFeed: 'សកម្មភាព', realTime: 'ពេលវេលាជាក់ស្តែង', noActivity: 'មិនទាន់មានសកម្មភាពទេ',
            viewers: 'អ្នកទស្សនា', today: 'ថ្ងៃនេះ',
            welcomeTitle: 'សូមស្វាគមន៍ត្រឡប់មកវិញ',
            welcomeSubtitle: 'នេះជាអ្វីដែលកំពុងកើតឡើងនៅក្នុងប្រវត្តិរូបរបស់អ្នកថ្ងៃនេះ។ ពិនិត្យមើលសារថ្មីៗ និងធ្វើបច្ចុប្បន្នភាពគម្រោងរបស់អ្នក។',
            viewLiveSite: 'មើលគេហទំព័រផ្ទាល់'
        }
    }[locale] || {};

    const cardBg = isDark
        ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
        : 'bg-white border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-md';

    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const dividerColor = isDark ? 'divide-slate-800/80' : 'divide-slate-100';

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Welcome Card */}
            <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${
                isDark 
                    ? 'bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/20' 
                    : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-white border border-indigo-100 shadow-sm'
            }`}>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold mb-4 border border-indigo-500/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            Dashboard
                        </div>
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {t.welcomeTitle}, <span className="text-indigo-500">{user?.name?.trim() ? user.name : (data?.profile?.name || 'Admin')}</span>! 👋
                        </h2>
                        <p className={`text-sm sm:text-base max-w-xl ${isDark ? 'text-indigo-200/70' : 'text-slate-600'}`}>
                            {t.welcomeSubtitle}
                        </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end text-right">
                        <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-indigo-200' : 'text-indigo-700'}`}>
                            {locale === 'kh' 
                                ? formatKhmerDate(currentTime)
                                : currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                            }
                        </div>
                        <div className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {locale === 'kh'
                                ? formatKhmerTime(currentTime)
                                : currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
                            }
                        </div>
                    </div>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Stat Cards — 2 rows, 4 cols each */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Projects */}
                <div className={`col-span-1 ${cardBg} border rounded-2xl p-4 transition duration-150`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${subColor}`}>{t.projects}</span>
                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                            isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        }`}><FolderGit2 className="w-3.5 h-3.5" /></span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className={`text-xl font-bold ${titleColor}`}>{stats.total_projects ?? 0}</span>
                        <button onClick={() => setCurrentTab('projects')} className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5">
                            <span>{t.view}</span><ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Viewers */}
                <div className={`col-span-1 ${cardBg} border rounded-2xl p-4 transition duration-150`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${subColor}`}>{t.viewers}</span>
                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                            isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
                        }`}><Eye className="w-3.5 h-3.5" /></span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className={`text-xl font-bold ${titleColor}`}>{stats.total_viewers ?? '15.2K'}</span>
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-500 font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                            +124 {t.today}
                        </span>
                    </div>
                </div>



                {/* Skills */}
                <div className={`col-span-1 ${cardBg} border rounded-2xl p-4 transition duration-150`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${subColor}`}>{t.skills}</span>
                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                            isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-600'
                        }`}><Cpu className="w-3.5 h-3.5" /></span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className={`text-xl font-bold ${titleColor}`}>{stats.total_skills ?? 0}</span>
                        <button onClick={() => setCurrentTab('skills')} className="text-[11px] font-semibold text-purple-500 hover:text-purple-600 flex items-center gap-0.5">
                            <span>{t.stack}</span><ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>



                {/* Reviews */}
                <div className={`col-span-1 ${cardBg} border rounded-2xl p-4 transition duration-150`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${subColor}`}>{t.reviews}</span>
                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                            isDark ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-600'
                        }`}><Star className="w-3.5 h-3.5" /></span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className={`text-xl font-bold ${titleColor}`}>{stats.total_reviews ?? 0}</span>
                        <button onClick={() => setCurrentTab('reviews')} className="text-[11px] font-semibold text-yellow-500 hover:text-yellow-600 flex items-center gap-0.5">
                            <span>{t.see}</span><ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>


            </div>

            {/* Interactive Charts & Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Traffic Spline Area Chart (8 cols) */}
                <div className="lg:col-span-8">
                    <TrafficAreaChart
                        initialData={charts.traffic_7d || []}
                        theme={theme}
                        locale={locale}
                    />
                </div>

                {/* Project Distribution Donut Chart (4 cols) */}
                <div className="lg:col-span-4">
                    <ProjectDistributionDonut
                        data={charts.projects_by_category || []}
                        totalProjects={stats.total_projects || 0}
                        theme={theme}
                        locale={locale}
                        onViewProjects={() => setCurrentTab('projects')}
                    />
                </div>
            </div>

            {/* Secondary Analytics: Inquiries Pipeline & Tech Stack Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InquiriesBarChart
                    data={charts.monthly_inquiries || []}
                    theme={theme}
                    locale={locale}
                    onViewMessages={() => setCurrentTab('messages')}
                />
                <SkillsRadarMatrix
                    data={charts.skills_by_category || []}
                    theme={theme}
                    locale={locale}
                    onViewSkills={() => setCurrentTab('skills')}
                />
            </div>

            {/* 3-Column Bottom: Recent Projects, Recent Messages, Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Projects */}
                <div className={`${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-sm'} border rounded-2xl p-5 transition duration-150`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-bold ${titleColor}`}>{t.recentProjects}</h3>
                        <button onClick={() => setCurrentTab('projects')} className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">{t.viewAll} &rarr;</button>
                    </div>
                    {recentProjects.length === 0 ? (
                        <div className={`text-center py-8 text-xs ${subColor}`}>{t.noProjects}</div>
                    ) : (
                        <div className={`divide-y ${dividerColor}`}>
                            {recentProjects.map((project) => (
                                <div key={project.id} className="py-3 flex items-center gap-3 group">
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title}
                                            className={`w-10 h-10 rounded-lg object-cover border shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`} />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 text-xs font-mono ${isDark ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>&lt;/&gt;</div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className={`text-xs font-semibold truncate group-hover:text-indigo-500 transition ${titleColor}`}>{project.title}</p>
                                        <p className={`text-[11px] truncate ${subColor}`}>{project.category}</p>
                                    </div>
                                    {project.is_featured && (
                                        <span className="text-[9px] bg-amber-500/10 text-amber-500 font-bold px-1.5 py-0.5 rounded-full border border-amber-500/20 shrink-0">★</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Messages */}
                <div className={`${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-sm'} border rounded-2xl p-5 transition duration-150`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-bold ${titleColor}`}>{t.recentInquiries}</h3>
                        <button onClick={() => setCurrentTab('messages')} className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">{t.inbox} &rarr;</button>
                    </div>
                    {recentMessages.length === 0 ? (
                        <div className={`text-center py-8 text-xs ${subColor}`}>{t.noMessages}</div>
                    ) : (
                        <div className={`divide-y ${dividerColor}`}>
                            {recentMessages.map((msg) => (
                                <div key={msg.id} onClick={() => setCurrentTab('messages')}
                                    className="py-3 flex items-start gap-3 group cursor-pointer">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                        isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    }`}>{(msg.name || '?')[0].toUpperCase()}</div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />}
                                            <p className={`text-xs font-semibold truncate ${titleColor}`}>{msg.name}</p>
                                        </div>
                                        <p className={`text-[11px] truncate mt-0.5 ${subColor}`}>{msg.subject || msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Activity Feed */}
                <div className={`${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-sm'} border rounded-2xl p-5 transition duration-150`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-bold ${titleColor}`}>{t.activityFeed}</h3>
                        <span className={`flex items-center gap-1 text-[11px] ${subColor}`}>
                            <Clock className="w-3 h-3" />{t.realTime}
                        </span>
                    </div>
                    {activityFeed.length === 0 ? (
                        <div className={`text-center py-8 text-xs ${subColor}`}>{t.noActivity}</div>
                    ) : (
                        <div className="space-y-3">
                            {activityFeed.map((item, idx) => {
                                const isProject = item.type === 'project';
                                const isMessage = item.type === 'message';
                                const dotColor = isProject ? 'bg-indigo-500' : isMessage ? 'bg-emerald-500' : 'bg-amber-500';
                                const IconEl = isProject ? FolderGit2 : isMessage ? MessageSquare : Star;
                                const iconBg = isProject
                                    ? isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                    : isMessage
                                        ? isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                        : isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600';
                                return (
                                    <div key={idx} className="flex items-start gap-3">
                                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}>
                                            <IconEl className="w-3.5 h-3.5" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-xs font-semibold leading-tight truncate ${titleColor}`}>{item.title}</p>
                                            <p className={`text-[11px] truncate ${subColor}`}>{item.subtitle}</p>
                                        </div>
                                        <span className={`shrink-0 text-[10px] ${subColor} whitespace-nowrap`}>{item.time_ago}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
