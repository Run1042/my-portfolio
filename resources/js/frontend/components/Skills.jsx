import React, { useState, useMemo } from 'react';
import { 
    Cpu, 
    Server, 
    Layout, 
    Database, 
    Terminal, 
    Layers, 
    Brain, 
    Users, 
    MessageSquare, 
    Target, 
    Sparkles,
    CheckCircle2,
    Code2,
    Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Skills({ skills = [] }) {
    const [activeTab, setActiveTab] = useState('hard');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const locale = window.__INITIAL_DATA__?.locale === 'km' ? 'kh' : (window.__INITIAL_DATA__?.locale || 'en');
    const globalT = window.__INITIAL_DATA__?.translations?.[window.__INITIAL_DATA__?.locale] || window.__INITIAL_DATA__?.translations?.en || {};
    const localT = {
        en: {
            title: 'Skills & Technologies',
            heading: 'Technical & Professional Stack',
            desc: 'A curated breakdown of the programming languages, frameworks, developer tools, and interpersonal qualities that power my engineering workflow.',
            hardSkills: 'Hard Skills (Technical)',
            softSkills: 'Soft Skills (Professional)',
            allCategories: 'All Categories',
            noHardSkills: 'No Hard Skills Added Yet',
            noSoftSkills: 'No Soft Skills Added Yet',
            addSkillsPrompt: 'You can easily add new skills with custom icons in the Admin Dashboard under Skills & Stack.',
            skillCount: 'skills',
            skillCountSingle: 'skill',
            hardSkillLabel: 'Hard Skill',
            softSkillLabel: 'Soft Skill'
        },
        kh: {
            title: 'ជំនាញ & បច្ចេកវិទ្យា',
            heading: 'ជំនាញបច្ចេកទេស និងវិជ្ជាជីវៈ',
            desc: 'ការបំបែកយ៉ាងលម្អិតនៃភាសាវិវឌ្ឍកម្មវិធី ក្របខ័ណ្ឌ (frameworks) ឧបករណ៍អ្នកអភិវឌ្ឍន៍ និងគុណភាពអន្តរបុគ្គលដែលផ្តល់ថាមពលដល់លំហូរការងារវិស្វកម្មរបស់ខ្ញុំ។',
            hardSkills: 'ជំនាញរឹង (បច្ចេកទេស)',
            softSkills: 'ជំនាញទន់ (វិជ្ជាជីវៈ)',
            allCategories: 'ប្រភេទទាំងអស់',
            noHardSkills: 'មិនទាន់មានជំនាញរឹងត្រូវបានបន្ថែមនៅឡើយទេ',
            noSoftSkills: 'មិនទាន់មានជំនាញទន់ត្រូវបានបន្ថែមនៅឡើយទេ',
            addSkillsPrompt: 'អ្នកអាចបន្ថែមជំនាញថ្មីបានយ៉ាងងាយស្រួលជាមួយនឹងរូបតំណាងផ្ទាល់ខ្លួននៅក្នុងផ្ទាំងគ្រប់គ្រងរដ្ឋបាលក្រោមផ្នែកជំនាញ។',
            skillCount: 'ជំនាញ',
            skillCountSingle: 'ជំនាញ',
            hardSkillLabel: 'ជំនាញរឹង',
            softSkillLabel: 'ជំនាញទន់'
        }
    }[locale] || {};
    const t = { ...localT, ...globalT };

    // Normalize skills to flat array
    const normalizedSkills = useMemo(() => {
        if (Array.isArray(skills)) {
            return skills;
        }
        if (skills && typeof skills === 'object') {
            return Object.entries(skills).flatMap(([cat, items]) => {
                if (Array.isArray(items)) {
                    return items.map(item => ({
                        ...item,
                        category: item.category || cat,
                        type: item.type || 'hard'
                    }));
                }
                return [];
            });
        }
        return [];
    }, [skills]);

    // Check availability of tabs
    const hasSoftSkills = useMemo(() => {
        return normalizedSkills.some(s => (s.type || 'hard') === 'soft');
    }, [normalizedSkills]);

    // Filter by tab
    const tabSkills = useMemo(() => {
        return normalizedSkills.filter(s => (s.type || 'hard') === activeTab);
    }, [normalizedSkills, activeTab]);

    // Unique categories in current tab
    const categories = useMemo(() => {
        const set = new Set();
        tabSkills.forEach(s => {
            if (s.category) set.add(s.category);
        });
        return Array.from(set);
    }, [tabSkills]);

    // Filter by category
    const filteredSkills = useMemo(() => {
        if (selectedCategory === 'all') return tabSkills;
        return tabSkills.filter(s => s.category === selectedCategory);
    }, [tabSkills, selectedCategory]);

    // Group skills by category for structured view
    const groupedSkills = useMemo(() => {
        return filteredSkills.reduce((acc, skill) => {
            const cat = skill.category || 'General';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill);
            return acc;
        }, {});
    }, [filteredSkills]);

    const getCategoryIcon = (category = '', className = "w-5 h-5 text-indigo-500") => {
        const catLower = category.toLowerCase();
        if (catLower.includes('front')) return <Layout className={className} />;
        if (catLower.includes('back')) return <Server className={className} />;
        if (catLower.includes('data')) return <Database className={className} />;
        if (catLower.includes('devops') || catLower.includes('tool')) return <Terminal className={className} />;
        if (catLower.includes('communicat') || catLower.includes('team')) return <MessageSquare className={className} />;
        if (catLower.includes('lead') || catLower.includes('manage')) return <Users className={className} />;
        if (catLower.includes('problem') || catLower.includes('creativ')) return <Brain className={className} />;
        if (catLower.includes('soft') || catLower.includes('people')) return <Sparkles className={className} />;
        return <Cpu className={className} />;
    };

    const getProficiencyLabel = (val) => {
        if (val >= 90) return 'Expert';
        if (val >= 75) return 'Advanced';
        if (val >= 60) return 'Proficient';
        return 'Intermediate';
    };

    return (
        <section id="skills" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.title || 'Skills & Technologies'}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t.heading || 'Technical & Professional Stack'}
                </h2>
                <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    {t.desc || 'A curated breakdown of the programming languages, frameworks, developer tools, and interpersonal qualities that power my engineering workflow.'}
                </p>
            </motion.div>

            {/* Tab Switcher: Hard Skills vs Soft Skills */}
            <div className="flex flex-col items-center gap-5 mb-12">
                <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-inner">
                    <button
                        onClick={() => {
                            setActiveTab('hard');
                            setSelectedCategory('all');
                        }}
                        className={`relative px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'hard'
                                ? 'text-white shadow-lg shadow-indigo-500/25'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        {activeTab === 'hard' && (
                            <motion.div
                                layoutId="activeTabBadge"
                                className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-xl"
                                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                            />
                        )}
                        <Code2 className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{t.hardSkills || 'Hard Skills (Technical)'}</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('soft');
                            setSelectedCategory('all');
                        }}
                        className={`relative px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'soft'
                                ? 'text-white shadow-lg shadow-purple-500/25'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        {activeTab === 'soft' && (
                            <motion.div
                                layoutId="activeTabBadge"
                                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl"
                                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                            />
                        )}
                        <Brain className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{t.softSkills || 'Soft Skills (Professional)'}</span>
                    </button>
                </div>

                {/* Sub-Category Filter Badges (if multiple categories exist in active tab) */}
                {categories.length > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                selectedCategory === 'all'
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-400'
                            }`}
                        >
                            {t.allCategories || 'All Categories'} ({tabSkills.length})
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Skills Content Grid */}
            <AnimatePresence mode="wait">
                {tabSkills.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="text-center py-20 px-6 rounded-3xl bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 max-w-xl mx-auto"
                    >
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
                            {activeTab === 'hard' ? <Wrench className="w-7 h-7" /> : <Brain className="w-7 h-7" />}
                        </div>
                        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                            {activeTab === 'hard' ? (t.noHardSkills || 'No Hard Skills Added Yet') : (t.noSoftSkills || 'No Soft Skills Added Yet')}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t.addSkillsPrompt || 'You can easily add new skills with custom icons in the Admin Dashboard under Skills & Stack.'}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div 
                        key={activeTab + selectedCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    >
                        {filteredSkills.map((skill, idx) => {
                            const isImg = skill.icon_url || (skill.icon && (skill.icon.startsWith('http') || skill.icon.startsWith('data:') || skill.icon.includes('/') || /\.(png|jpe?g|svg|webp|gif|ico)$/i.test(skill.icon)));
                            const iconSrc = skill.icon_url || (isImg ? (skill.icon.startsWith('http') || skill.icon.startsWith('data:') ? skill.icon : `/storage/${skill.icon}`) : null);

                            return (
                                <motion.div
                                    key={skill.id || skill.name}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.4, delay: (idx % 10) * 0.05 }}
                                    className="group relative flex flex-col bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-3xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-none transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2"
                                >
                                    {/* Category Tag */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50">
                                            {skill.category}
                                        </span>
                                    </div>

                                    {/* Big Icon/Image */}
                                    <div className="w-full aspect-[3/4] sm:aspect-[2/3] lg:aspect-[3/4] mb-5 mt-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-2 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors overflow-hidden">
                                        {iconSrc ? (
                                            <img 
                                                src={iconSrc} 
                                                alt={skill.name} 
                                                className="w-full h-full object-cover filter group-hover:scale-110 transition-transform duration-500 rounded-xl"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                                                {getCategoryIcon(skill.category, "w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity")}
                                            </div>
                                        )}
                                    </div>

                                    {/* Title & Proficiency */}
                                    <div className="mt-auto">
                                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1" title={skill.name}>
                                            {skill.name}
                                        </h3>
                                        
                                        <div className="flex items-center justify-between gap-2 mb-2.5">
                                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                {getProficiencyLabel(skill.proficiency)}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                {skill.proficiency}%
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 rounded-full bg-slate-200/70 dark:bg-slate-700/50 overflow-hidden relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.proficiency}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                                className={`absolute top-0 left-0 h-full rounded-full ${
                                                    activeTab === 'hard'
                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
