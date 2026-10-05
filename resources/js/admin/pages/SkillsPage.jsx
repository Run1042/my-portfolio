import React, { useState, useEffect, useMemo } from 'react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    Search, 
    Sparkles, 
    Layers, 
    Upload, 
    Image as ImageIcon,
    Server, 
    Database, 
    Code2, 
    Layout, 
    Palette, 
    Terminal, 
    GitBranch, 
    Cpu, 
    Users, 
    MessageSquare, 
    Brain, 
    Check, 
    Sliders,
    ArrowUpDown,
    CheckCircle2
} from 'lucide-react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../libs/api';

// Icon Renderer that handles custom images with graceful fallback to Lucide icons
export function SkillIcon({ icon, name, className = "w-6 h-6", containerClassName = "w-10 h-10 rounded-xl" }) {
    const [imgError, setImgError] = useState(false);

    const isImage = useMemo(() => {
        if (!icon) return false;
        return (
            icon.startsWith('http') || 
            icon.startsWith('data:') || 
            icon.startsWith('/storage') || 
            icon.includes('/') || 
            /\.(png|jpe?g|svg|webp|gif|ico)$/i.test(icon)
        );
    }, [icon]);

    const imageSrc = useMemo(() => {
        if (!icon || !isImage) return null;
        if (icon.startsWith('http') || icon.startsWith('data:')) return icon;
        if (icon.startsWith('/storage')) return icon;
        return `/storage/${icon}`;
    }, [icon, isImage]);

    if (imageSrc && !imgError) {
        return (
            <div className={`${containerClassName} bg-slate-800/80 border border-slate-700/80 p-1.5 flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}>
                <img 
                    src={imageSrc} 
                    alt={name || 'Skill icon'} 
                    className={`${className} object-contain rounded`}
                    onError={() => setImgError(true)} 
                />
            </div>
        );
    }

    // Lucide Icon Fallbacks
    const iconName = (icon || '').toLowerCase();
    const nameLower = (name || '').toLowerCase();

    let IconComponent = Cpu;
    let badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";

    if (iconName === 'server' || nameLower.includes('laravel') || nameLower.includes('backend') || nameLower.includes('node') || nameLower.includes('php')) {
        IconComponent = Server;
        badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
    } else if (iconName === 'database' || nameLower.includes('sql') || nameLower.includes('data') || nameLower.includes('redis') || nameLower.includes('mongo')) {
        IconComponent = Database;
        badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    } else if (iconName === 'code' || iconName === 'code-xml' || nameLower.includes('script') || nameLower.includes('api') || nameLower.includes('rest')) {
        IconComponent = Code2;
        badgeColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    } else if (iconName === 'layout' || nameLower.includes('react') || nameLower.includes('vue') || nameLower.includes('frontend') || nameLower.includes('blade')) {
        IconComponent = Layout;
        badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    } else if (iconName === 'palette' || nameLower.includes('tailwind') || nameLower.includes('css') || nameLower.includes('design')) {
        IconComponent = Palette;
        badgeColor = "bg-pink-500/10 text-pink-400 border-pink-500/20";
    } else if (iconName === 'terminal' || nameLower.includes('docker') || nameLower.includes('linux') || nameLower.includes('bash')) {
        IconComponent = Terminal;
        badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    } else if (iconName === 'git-branch' || nameLower.includes('git') || nameLower.includes('ci/cd') || nameLower.includes('cloud')) {
        IconComponent = GitBranch;
        badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    } else if (nameLower.includes('communicat') || nameLower.includes('talk')) {
        IconComponent = MessageSquare;
        badgeColor = "bg-sky-500/10 text-sky-400 border-sky-500/20";
    } else if (nameLower.includes('lead') || nameLower.includes('team') || nameLower.includes('manage')) {
        IconComponent = Users;
        badgeColor = "bg-violet-500/10 text-violet-400 border-violet-500/20";
    } else if (nameLower.includes('problem') || nameLower.includes('think') || nameLower.includes('agile')) {
        IconComponent = Brain;
        badgeColor = "bg-teal-500/10 text-teal-400 border-teal-500/20";
    }

    return (
        <div className={`${containerClassName} ${badgeColor} border flex items-center justify-center shrink-0 shadow-sm`}>
            <IconComponent className={className} />
        </div>
    );
}

export default function SkillsPage({ showAddModal, setShowAddModal, onNotify, theme = 'dark', locale = 'en' }) {
    const t = {
        en: {
            hard: 'Hard Skills', soft: 'Soft Skills', search: 'Search skills or category...',
            addHard: 'Add Hard Skill', addSoft: 'Add Soft Skill', cat: 'Category:', all: 'All',
            loading: 'Loading technical capability stack...', noMatches: 'No matching skills found',
            noHard: 'No Hard Skills Added', noSoft: 'No Soft Skills Added',
            clearSearch: 'Try clearing your search term',
            startAddingHard: 'Start expanding your portfolio matrix by adding your first technical skill.',
            startAddingSoft: 'Start expanding your portfolio matrix by adding your first soft skill.',
            addNew: 'Add New Skill', skill: 'skill', skills: 'skills', addTo: 'Add to',
            edit: 'Edit Skill', delete: 'Delete Skill', expert: 'Expert',
            advanced: 'Advanced', proficient: 'Proficient', intermediate: 'Intermediate',
            modalAdd: 'Add New Skill', modalAddDesc: 'Expand your technical matrix with custom icon & metrics',
            modalEdit: 'Edit Skill', modalEditDesc: 'Update your skill parameters',
            type: 'Skill Type *', typeHard: 'Hard Skill (Technical)', typeSoft: 'Soft Skill (Interpersonal)',
            name: 'Skill Name *', namePhHard: 'e.g. Next.js, Docker, Python', namePhSoft: 'e.g. Leadership, Problem Solving',
            order: 'Order', category: 'Category *', catPh: 'Enter or select category',
            profLevel: 'Proficiency Level', icon: 'Skill Icon (Image Upload or Preset)',
            uploadFile: 'Upload Image File', previewIcon: 'Preview:', noFile: 'No file chosen',
            orPreset: 'OR Type Preset Icon Name', presetPh: 'e.g. layout, database, terminal...',
            cancel: 'Cancel', addBtn: 'Add Skill', saveBtn: 'Save Changes', saving: 'Saving...'
        },
        kh: {
            hard: 'ជំនាញបច្ចេកទេស', soft: 'ជំនាញទន់', search: 'ស្វែងរកជំនាញ ឬប្រភេទ...',
            addHard: 'បន្ថែមជំនាញបច្ចេកទេស', addSoft: 'បន្ថែមជំនាញទន់', cat: 'ប្រភេទ៖', all: 'ទាំងអស់',
            loading: 'កំពុងទាញទិន្នន័យ...', noMatches: 'រកមិនឃើញជំនាញនេះទេ',
            noHard: 'មិនមានជំនាញបច្ចេកទេសទេ', noSoft: 'មិនមានជំនាញទន់ទេ',
            clearSearch: 'សូមលុបពាក្យស្វែងរករបស់អ្នក',
            startAddingHard: 'ចាប់ផ្តើមបន្ថែមជំនាញបច្ចេកទេសដំបូងរបស់អ្នក។',
            startAddingSoft: 'ចាប់ផ្តើមបន្ថែមជំនាញទន់ដំបូងរបស់អ្នក។',
            addNew: 'បន្ថែមជំនាញថ្មី', skill: 'ជំនាញ', skills: 'ជំនាញ', addTo: 'បន្ថែមទៅ',
            edit: 'កែប្រែជំនាញ', delete: 'លុបជំនាញ', expert: 'ជំនាញច្បាស់លាស់ (Expert)',
            advanced: 'កម្រិតខ្ពស់ (Advanced)', proficient: 'ស្ទាត់ជំនាញ (Proficient)', intermediate: 'មធ្យម (Intermediate)',
            modalAdd: 'បន្ថែមជំនាញថ្មី', modalAddDesc: 'បន្ថែមជំនាញ និងរូបតំណាងរបស់អ្នក',
            modalEdit: 'កែប្រែជំនាញ', modalEditDesc: 'ផ្លាស់ប្តូរព័ត៌មានលម្អិតនៃជំនាញរបស់អ្នក',
            type: 'ប្រភេទជំនាញ *', typeHard: 'ជំនាញបច្ចេកទេស', typeSoft: 'ជំនាញទន់',
            name: 'ឈ្មោះជំនាញ *', namePhHard: 'ឧ. Next.js, Docker, Python', namePhSoft: 'ឧ. ភាពជាអ្នកដឹកនាំ, ដោះស្រាយបញ្ហា',
            order: 'លំដាប់បង្ហាញ', category: 'ប្រភេទ *', catPh: 'បញ្ចូល ឬជ្រើសរើសប្រភេទ',
            profLevel: 'កម្រិតជំនាញ', icon: 'រូបតំណាងជំនាញ',
            uploadFile: 'ផ្ទុករូបភាព', previewIcon: 'មើលសាកល្បង៖', noFile: 'មិនមានឯកសារទេ',
            orPreset: 'ឬបញ្ចូលឈ្មោះរូបតំណាង', presetPh: 'ឧ. layout, database, terminal...',
            cancel: 'បោះបង់', addBtn: 'បន្ថែមជំនាញ', saveBtn: 'រក្សាទុក', saving: 'កំពុងរក្សាទុក...'
        }
    }[locale] || {};

    const [skillsList, setSkillsList] = useState([]);
    const [activeTab, setActiveTab] = useState('hard');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

    // Add Modal State (controlled by parent prop or local button)
    const [internalAddOpen, setInternalAddOpen] = useState(false);
    const isAddOpen = showAddModal !== undefined ? showAddModal : internalAddOpen;
    const setAddOpen = setShowAddModal !== undefined ? setShowAddModal : setInternalAddOpen;

    // Form State (New Skill)
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState('hard');
    const [newCategory, setNewCategory] = useState('Frontend');
    const [newProficiency, setNewProficiency] = useState(85);
    const [newOrder, setNewOrder] = useState(0);
    const [newIconFile, setNewIconFile] = useState(null);
    const [newIconPreview, setNewIconPreview] = useState(null);
    const [newPresetIcon, setNewPresetIcon] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit Modal State
    const [editingSkill, setEditingSkill] = useState(null);
    const [editIconFile, setEditIconFile] = useState(null);
    const [editIconPreview, setEditIconPreview] = useState(null);

    const isDark = theme === 'dark';
    const cardBg = isDark ? 'bg-slate-900/70 border-slate-800/80 shadow-lg' : 'bg-white border-slate-200/90 shadow-sm';
    const itemBg = isDark ? 'bg-slate-950/70 border-slate-800/80 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-xs';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputBg = isDark ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500';

    const fetchSkillsList = async () => {
        setLoading(true);
        try {
            const data = await getSkills();
            setSkillsList(data.skills || []);
        } catch (e) {
            onNotify?.('error', 'Failed to load skills.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkillsList();
    }, []);

    // Tab counts
    const hardCount = useMemo(() => skillsList.filter(s => (s.type || 'hard') === 'hard').length, [skillsList]);
    const softCount = useMemo(() => skillsList.filter(s => (s.type || 'hard') === 'soft').length, [skillsList]);

    // Filter skills by tab, category, search query
    const currentTabSkills = useMemo(() => {
        return skillsList.filter((s) => (s.type || 'hard') === activeTab);
    }, [skillsList, activeTab]);

    const availableCategories = useMemo(() => {
        const set = new Set();
        currentTabSkills.forEach(s => {
            if (s.category) set.add(s.category);
        });
        return Array.from(set);
    }, [currentTabSkills]);

    const filteredSkills = useMemo(() => {
        return currentTabSkills.filter(skill => {
            const matchesCategory = selectedCategoryFilter === 'all' || skill.category === selectedCategoryFilter;
            const matchesSearch = !searchQuery.trim() || 
                skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (skill.category && skill.category.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [currentTabSkills, selectedCategoryFilter, searchQuery]);

    // Group filtered skills by category
    const skillsByCategory = useMemo(() => {
        return filteredSkills.reduce((acc, skill) => {
            const cat = skill.category || 'General';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill);
            return acc;
        }, {});
    }, [filteredSkills]);

    const categories = Object.keys(skillsByCategory);

    // Category suggestions
    const hardCategories = ['Frontend', 'Backend', 'Database', 'DevOps & Tools', 'Architecture & Cloud', 'Mobile Development'];
    const softCategories = ['Communication', 'Leadership & Teamwork', 'Problem Solving', 'Project Management', 'Adaptability'];

    const getProficiencyLabel = (val) => {
        if (val >= 90) return { 
            label: t.expert || 'Expert', 
            badge: isDark 
                ? 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30' 
                : 'text-indigo-700 bg-indigo-50 border-indigo-200 font-bold' 
        };
        if (val >= 75) return { 
            label: t.advanced || 'Advanced', 
            badge: isDark 
                ? 'text-purple-300 bg-purple-500/15 border-purple-500/30' 
                : 'text-purple-700 bg-purple-50 border-purple-200 font-bold' 
        };
        if (val >= 60) return { 
            label: t.proficient || 'Proficient', 
            badge: isDark 
                ? 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30' 
                : 'text-cyan-800 bg-cyan-50 border-cyan-200 font-bold' 
        };
        return { 
            label: t.intermediate || 'Intermediate', 
            badge: isDark 
                ? 'text-amber-300 bg-amber-500/15 border-amber-500/30' 
                : 'text-amber-800 bg-amber-50 border-amber-200 font-bold' 
        };
    };

    // Open Add Modal
    const handleOpenAdd = (type = activeTab) => {
        setNewType(type);
        setNewCategory(type === 'hard' ? 'Frontend' : 'Communication');
        setNewName('');
        setNewProficiency(85);
        setNewOrder(0);
        setNewIconFile(null);
        setNewIconPreview(null);
        setNewPresetIcon('');
        setAddOpen(true);
    };

    // Close Add Modal
    const handleCloseAdd = () => {
        setAddOpen(false);
        setNewIconFile(null);
        setNewIconPreview(null);
    };

    // Handle New Icon File Selection
    const handleNewFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewIconFile(file);
            setNewIconPreview(URL.createObjectURL(file));
            setNewPresetIcon('');
        }
    };

    // Handle Edit Icon File Selection
    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditIconFile(file);
            setEditIconPreview(URL.createObjectURL(file));
        }
    };

    // Create Skill
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', newName.trim());
            formData.append('type', newType);
            formData.append('category', newCategory.trim());
            formData.append('proficiency', newProficiency);
            formData.append('order', newOrder);
            if (newIconFile) {
                formData.append('icon_file', newIconFile);
            } else if (newPresetIcon) {
                formData.append('icon', newPresetIcon);
            }

            await createSkill(formData);
            onNotify?.('success', 'Skill added successfully!');
            handleCloseAdd();
            fetchSkillsList();
        } catch (err) {
            onNotify?.('error', 'Failed to add skill.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update Skill
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingSkill) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', editingSkill.name);
            formData.append('type', editingSkill.type || 'hard');
            formData.append('category', editingSkill.category);
            formData.append('proficiency', editingSkill.proficiency);
            formData.append('order', editingSkill.order);
            if (editIconFile) {
                formData.append('icon_file', editIconFile);
            } else if (editingSkill.icon) {
                formData.append('icon', editingSkill.icon);
            }

            await updateSkill(editingSkill.id, formData);
            onNotify?.('success', 'Skill updated successfully!');
            setEditingSkill(null);
            setEditIconFile(null);
            setEditIconPreview(null);
            fetchSkillsList();
        } catch (err) {
            onNotify?.('error', 'Failed to update skill.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Skill
    const handleDelete = async (skill) => {
        if (!window.confirm(`Are you sure you want to delete "${skill.name}"?`)) return;
        try {
            await deleteSkill(skill.id);
            onNotify?.('success', 'Skill removed.');
            fetchSkillsList();
        } catch (err) {
            onNotify?.('error', 'Failed to delete skill.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Toolbar: Tabs, Search, Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Tabs with Counts */}
                <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <button
                        onClick={() => {
                            setActiveTab('hard');
                            setSelectedCategoryFilter('all');
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                            activeTab === 'hard'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Code2 className="w-4 h-4" />
                        <span>{t.hard || 'Hard Skills'}</span>
                        <span className={`text-[11px] px-2 py-0.2 rounded-full font-mono font-bold ${
                            activeTab === 'hard' 
                                ? 'bg-white/20 text-white' 
                                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'
                        }`}>
                            {hardCount}
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab('soft');
                            setSelectedCategoryFilter('all');
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                            activeTab === 'soft'
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Brain className="w-4 h-4" />
                        <span>{t.soft || 'Soft Skills'}</span>
                        <span className={`text-[11px] px-2 py-0.2 rounded-full font-mono font-bold ${
                            activeTab === 'soft' 
                                ? 'bg-white/20 text-white' 
                                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'
                        }`}>
                            {softCount}
                        </span>
                    </button>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-2.5">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${subColor}`} />
                        <input
                            type="text"
                            placeholder={t.search || "Search skills or category..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-7 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${inputBg}`}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${subColor} hover:text-white`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => handleOpenAdd(activeTab)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition duration-150 shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{activeTab === 'hard' ? (t.addHard || 'Add Hard Skill') : (t.addSoft || 'Add Soft Skill')}</span>
                    </button>
                </div>
            </div>

            {/* Category Filter Pills (if multiple categories) */}
            {availableCategories.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider mr-1 ${subColor}`}>
                        {t.cat || 'Category:'}
                    </span>
                    <button
                        onClick={() => setSelectedCategoryFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                            selectedCategoryFilter === 'all'
                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                                : isDark ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
                        }`}
                    >
                        {t.all || 'All'} ({currentTabSkills.length})
                    </button>
                    {availableCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                                selectedCategoryFilter === cat
                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                                    : isDark ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className={`${cardBg} rounded-2xl p-16 text-center text-xs ${subColor}`}>
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span>{t.loading || 'Loading technical capability stack...'}</span>
                </div>
            ) : categories.length === 0 ? (
                <div className={`${cardBg} rounded-2xl p-16 text-center border-dashed border-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        {activeTab === 'hard' ? <Code2 className="w-7 h-7" /> : <Brain className="w-7 h-7" />}
                    </div>
                    <h4 className={`text-base font-bold ${titleColor} mb-1`}>
                        {searchQuery ? (t.noMatches || 'No matching skills found') : (activeTab === 'hard' ? (t.noHard || 'No Hard Skills Added') : (t.noSoft || 'No Soft Skills Added'))}
                    </h4>
                    <p className={`text-xs ${subColor} max-w-sm mx-auto mb-5`}>
                        {searchQuery 
                            ? `${t.clearSearch || 'Try clearing your search term'} "${searchQuery}".` 
                            : (activeTab === 'hard' ? (t.startAddingHard || 'Start expanding your portfolio matrix by adding your first technical skill.') : (t.startAddingSoft || 'Start expanding your portfolio matrix by adding your first soft skill.'))}
                    </p>
                    <button
                        onClick={() => handleOpenAdd(activeTab)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{t.addNew || 'Add New Skill'}</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {categories.map((cat) => (
                        <div key={cat} className="space-y-4">
                            {/* Category Section Header */}
                            <div className={`flex items-center justify-between border-b pb-2.5 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                                    <h3 className={`text-base font-bold tracking-tight ${titleColor}`}>
                                        {cat}
                                    </h3>
                                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'}`}>
                                        {skillsByCategory[cat].length} {skillsByCategory[cat].length === 1 ? (t.skill || 'skill') : (t.skills || 'skills')}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setNewCategory(cat);
                                        handleOpenAdd(activeTab);
                                    }}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                                        isDark 
                                            ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80' 
                                            : 'bg-white hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 border-slate-200 shadow-xs'
                                    }`}
                                >
                                    <Plus className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>{t.addTo || 'Add to'} {cat}</span>
                                </button>
                            </div>

                            {/* Skills Card Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {skillsByCategory[cat].map((skill) => {
                                    const profInfo = getProficiencyLabel(skill.proficiency);

                                    return (
                                        <div
                                            key={skill.id}
                                            className={`${cardBg} rounded-2xl p-5 border transition-all duration-200 group relative flex flex-col justify-between hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10`}
                                        >
                                            {/* Top: Icon + Actions */}
                                            <div className="flex items-start justify-between gap-3 mb-4">
                                                <SkillIcon 
                                                    icon={skill.icon} 
                                                    name={skill.name} 
                                                    className="w-6 h-6" 
                                                    containerClassName="w-12 h-12 rounded-2xl"
                                                />
                                                <div className="flex items-center gap-1">
                                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                                                        isDark ? 'bg-slate-800/90 border-slate-700/60 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                                                    }`}>
                                                        #{skill.order}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            setEditingSkill({ ...skill });
                                                            setEditIconFile(null);
                                                            setEditIconPreview(null);
                                                        }}
                                                        title={t.edit || "Edit Skill"}
                                                        className={`p-1.5 rounded-lg border transition ${
                                                            isDark 
                                                                ? 'bg-slate-800/60 hover:bg-indigo-600 border-slate-700/60 text-slate-400 hover:text-white' 
                                                                : 'bg-slate-100 hover:bg-indigo-600 border-slate-200 text-slate-600 hover:text-white hover:border-indigo-600 shadow-xs'
                                                        }`}
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(skill)}
                                                        title={t.delete || "Delete Skill"}
                                                        className={`p-1.5 rounded-lg border transition ${
                                                            isDark 
                                                                ? 'bg-slate-800/60 hover:bg-rose-600 border-slate-700/60 text-slate-400 hover:text-white' 
                                                                : 'bg-slate-100 hover:bg-rose-600 border-slate-200 text-slate-600 hover:text-white hover:border-rose-600 shadow-xs'
                                                        }`}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Middle: Title & Category */}
                                            <div className="mb-4">
                                                <h4 className={`text-base font-bold truncate group-hover:text-indigo-400 transition mb-1 ${titleColor}`}>
                                                    {skill.name}
                                                </h4>
                                                <span className={`text-xs ${subColor}`}>
                                                    {skill.category}
                                                </span>
                                            </div>

                                            {/* Bottom: Proficiency & Bar */}
                                            <div className={`pt-3 border-t space-y-2 ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${profInfo.badge}`}>
                                                        {profInfo.label}
                                                    </span>
                                                    <span className={`font-mono font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                        {skill.proficiency}%
                                                    </span>
                                                </div>
                                                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
                                                        style={{ width: `${skill.proficiency}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add Skill Quick Card */}
                                <button
                                    onClick={() => {
                                        setNewCategory(cat);
                                        handleOpenAdd(activeTab);
                                    }}
                                    className={`rounded-2xl p-5 border border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2.5 min-h-[160px] group ${
                                        isDark 
                                            ? 'border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-500/5 text-slate-400 hover:text-indigo-400' 
                                            : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 bg-white text-slate-600 hover:text-indigo-600 shadow-xs'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                                        isDark 
                                            ? 'bg-slate-800 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white' 
                                            : 'bg-slate-100 group-hover:bg-indigo-600 text-slate-600 group-hover:text-white'
                                    }`}>
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold">
                                        {t.addTo || 'Add to'} {cat}
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ========================================================= */}
            {/* ADD SKILL MODAL                                           */}
            {/* ========================================================= */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between pb-4 mb-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`text-base font-bold ${titleColor}`}>
                                        {t.modalAdd || 'Add New Skill'}
                                    </h3>
                                    <p className={`text-xs ${subColor}`}>
                                        {t.modalAddDesc || 'Expand your technical matrix with custom icon & metrics'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseAdd}
                                className={`p-1.5 rounded-xl transition ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreate} className="space-y-4">
                            {/* Skill Type Switcher */}
                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-2`}>
                                    {t.type || 'Skill Type *'}
                                </label>
                                <div className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewType('hard');
                                            if (newCategory === 'Communication') setNewCategory('Frontend');
                                        }}
                                        className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                                            newType === 'hard'
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Code2 className="w-3.5 h-3.5" />
                                        <span>{t.typeHard || 'Hard Skill (Technical)'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewType('soft');
                                            if (newCategory === 'Frontend') setNewCategory('Communication');
                                        }}
                                        className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                                            newType === 'soft'
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Brain className="w-3.5 h-3.5" />
                                        <span>{t.typeSoft || 'Soft Skill (Interpersonal)'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Name & Order */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                    <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                        {t.name || 'Skill Name *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={newType === 'hard' ? (t.namePhHard || "e.g. Next.js, Docker, Python") : (t.namePhSoft || "e.g. Leadership, Problem Solving")}
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${inputBg}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                        {t.order || 'Order'}
                                    </label>
                                    <input
                                        type="number"
                                        value={newOrder}
                                        onChange={(e) => setNewOrder(Number(e.target.value))}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${inputBg}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                    {t.category || 'Category *'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder={t.catPh || "Enter or select category"}
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition mb-2 ${inputBg}`}
                                />
                                <div className="flex flex-wrap gap-1.5">
                                    {(newType === 'hard' ? hardCategories : softCategories).map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setNewCategory(cat)}
                                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                                                newCategory === cat
                                                    ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40 font-semibold'
                                                    : isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider`}>
                                        {t.profLevel || 'Proficiency Level'}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${getProficiencyLabel(newProficiency).color}`}>
                                            {getProficiencyLabel(newProficiency).label}
                                        </span>
                                        <span className="font-mono text-xs font-bold text-indigo-400">
                                            {newProficiency}%
                                        </span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={newProficiency}
                                    onChange={(e) => setNewProficiency(Number(e.target.value))}
                                    className="w-full accent-indigo-500 cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-2`}>
                                    {t.icon || 'Skill Icon (Image Upload or Preset)'}
                                </label>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                    {/* Upload Trigger Box */}
                                    <label className={`border border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                                        isDark 
                                            ? 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 hover:bg-slate-950' 
                                            : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-slate-100'
                                    }`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleNewFileChange}
                                            className="hidden"
                                        />
                                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        <div className="text-center">
                                            <span className={`text-xs font-semibold ${titleColor} block`}>
                                                {newIconFile ? newIconFile.name : 'Upload Icon Image'}
                                            </span>
                                            <span className={`text-[10px] ${subColor}`}>
                                                PNG, SVG, or JPG (max 2MB)
                                            </span>
                                        </div>
                                    </label>

                                    {/* Preview Box */}
                                    <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                                        isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                        <div className="shrink-0">
                                            {newIconPreview ? (
                                                <div className="w-12 h-12 rounded-xl bg-slate-800 p-1.5 border border-indigo-500/40 flex items-center justify-center">
                                                    <img src={newIconPreview} alt="Preview" className="w-full h-full object-contain rounded" />
                                                </div>
                                            ) : (
                                                <SkillIcon 
                                                    icon={newPresetIcon} 
                                                    name={newName} 
                                                    containerClassName="w-12 h-12 rounded-xl"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <span className={`text-xs font-bold block truncate ${titleColor}`}>
                                                {newName || 'Skill Name'}
                                            </span>
                                            <span className={`text-[10px] ${subColor} block`}>
                                                {newIconPreview ? 'Custom uploaded icon' : 'Auto icon preview'}
                                            </span>
                                            {newIconPreview && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNewIconFile(null);
                                                        setNewIconPreview(null);
                                                    }}
                                                    className="text-[10px] text-rose-400 hover:underline mt-0.5 block"
                                                >
                                                    Remove Image
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                <button
                                    type="button"
                                    onClick={handleCloseAdd}
                                    className={`px-4 py-2.5 border text-xs font-semibold rounded-xl transition ${
                                        isDark 
                                            ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' 
                                            : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            <span>Add Skill</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* EDIT SKILL MODAL                                          */}
            {/* ========================================================= */}
            {editingSkill && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between pb-4 mb-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                    <Edit2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className={`text-base font-bold ${titleColor}`}>
                                        Edit Skill: {editingSkill.name}
                                    </h3>
                                    <p className={`text-xs ${subColor}`}>
                                        Update skill metrics, category, and icon
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingSkill(null)}
                                className={`p-1.5 rounded-xl transition ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdate} className="space-y-4">
                            {/* Skill Type Switcher */}
                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-2`}>
                                    Skill Type *
                                </label>
                                <div className={`grid grid-cols-2 gap-2 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                                    <button
                                        type="button"
                                        onClick={() => setEditingSkill(prev => ({ ...prev, type: 'hard' }))}
                                        className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                                            (editingSkill.type || 'hard') === 'hard'
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Code2 className="w-3.5 h-3.5" />
                                        <span>Hard Skill</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingSkill(prev => ({ ...prev, type: 'soft' }))}
                                        className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                                            (editingSkill.type || 'hard') === 'soft'
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Brain className="w-3.5 h-3.5" />
                                        <span>Soft Skill</span>
                                    </button>
                                </div>
                            </div>

                            {/* Name & Order */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                    <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                        Skill Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingSkill.name}
                                        onChange={(e) => setEditingSkill(prev => ({ ...prev, name: e.target.value }))}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${inputBg}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        value={editingSkill.order}
                                        onChange={(e) => setEditingSkill(prev => ({ ...prev, order: Number(e.target.value) }))}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${inputBg}`}
                                    />
                                </div>
                            </div>

                            {/* Category with Suggestions */}
                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                    Category *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editingSkill.category}
                                    onChange={(e) => setEditingSkill(prev => ({ ...prev, category: e.target.value }))}
                                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition mb-2 ${inputBg}`}
                                />
                                <div className="flex flex-wrap gap-1.5">
                                    {((editingSkill.type || 'hard') === 'hard' ? hardCategories : softCategories).map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setEditingSkill(prev => ({ ...prev, category: cat }))}
                                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                                                editingSkill.category === cat
                                                    ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40 font-semibold'
                                                    : isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Proficiency Slider */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider`}>
                                        Proficiency Level
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${getProficiencyLabel(editingSkill.proficiency).color}`}>
                                            {getProficiencyLabel(editingSkill.proficiency).label}
                                        </span>
                                        <span className="font-mono text-xs font-bold text-indigo-400">
                                            {editingSkill.proficiency}%
                                        </span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={editingSkill.proficiency}
                                    onChange={(e) => setEditingSkill(prev => ({ ...prev, proficiency: Number(e.target.value) }))}
                                    className="w-full accent-indigo-500 cursor-pointer"
                                />
                            </div>

                            {/* Icon Image Upload (Clean & Preview) */}
                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-2`}>
                                    Skill Icon
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                    {/* Upload Trigger */}
                                    <label className={`border border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                                        isDark 
                                            ? 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 hover:bg-slate-950' 
                                            : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-slate-100'
                                    }`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEditFileChange}
                                            className="hidden"
                                        />
                                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        <div className="text-center">
                                            <span className={`text-xs font-semibold ${titleColor} block`}>
                                                {editIconFile ? editIconFile.name : 'Upload New Icon'}
                                            </span>
                                            <span className={`text-[10px] ${subColor}`}>
                                                Replace current icon image
                                            </span>
                                        </div>
                                    </label>

                                    {/* Current Icon Preview */}
                                    <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                                        isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                        <div className="shrink-0">
                                            {editIconPreview ? (
                                                <div className="w-12 h-12 rounded-xl bg-slate-800 p-1.5 border border-indigo-500/40 flex items-center justify-center">
                                                    <img src={editIconPreview} alt="Preview" className="w-full h-full object-contain rounded" />
                                                </div>
                                            ) : (
                                                <SkillIcon 
                                                    icon={editingSkill.icon} 
                                                    name={editingSkill.name} 
                                                    containerClassName="w-12 h-12 rounded-xl"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <span className={`text-xs font-bold block truncate ${titleColor}`}>
                                                {editingSkill.name}
                                            </span>
                                            <span className={`text-[10px] ${subColor} block`}>
                                                {editIconPreview ? 'New icon selected' : 'Current active icon'}
                                            </span>
                                            {editIconPreview && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditIconFile(null);
                                                        setEditIconPreview(null);
                                                    }}
                                                    className="text-[10px] text-rose-400 hover:underline mt-0.5 block"
                                                >
                                                    Undo Change
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                <button
                                    type="button"
                                    onClick={() => setEditingSkill(null)}
                                    className={`px-4 py-2.5 border text-xs font-semibold rounded-xl transition ${
                                        isDark 
                                            ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' 
                                            : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
