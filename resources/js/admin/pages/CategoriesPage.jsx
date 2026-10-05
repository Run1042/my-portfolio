import React, { useState, useEffect, useMemo } from 'react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    Search, 
    Tag, 
    Layers, 
    FolderGit2, 
    Cpu, 
    Brain, 
    Layout, 
    Server, 
    Database, 
    Terminal, 
    Palette, 
    Code2, 
    Users, 
    MessageSquare, 
    Sparkles, 
    Globe, 
    Shield, 
    Smartphone,
    Check,
    CheckCircle2,
    SlidersHorizontal,
    FolderTree
} from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../libs/api';

// Icon Renderer for Category
export function CategoryIcon({ icon, color, className = "w-5 h-5", containerClassName = "w-11 h-11 rounded-xl" }) {
    const iconName = (icon || '').toLowerCase();

    let IconComp = Tag;
    if (iconName === 'layout' || iconName === 'frontend') IconComp = Layout;
    else if (iconName === 'server' || iconName === 'backend') IconComp = Server;
    else if (iconName === 'database' || iconName === 'db') IconComp = Database;
    else if (iconName === 'terminal' || iconName === 'devops') IconComp = Terminal;
    else if (iconName === 'code' || iconName === 'code2') IconComp = Code2;
    else if (iconName === 'brain' || iconName === 'problem-solving') IconComp = Brain;
    else if (iconName === 'users' || iconName === 'team') IconComp = Users;
    else if (iconName === 'message' || iconName === 'message-square') IconComp = MessageSquare;
    else if (iconName === 'layers' || iconName === 'full-stack') IconComp = Layers;
    else if (iconName === 'sparkles' || iconName === 'ai') IconComp = Sparkles;
    else if (iconName === 'palette' || iconName === 'ui-ux') IconComp = Palette;
    else if (iconName === 'smartphone' || iconName === 'mobile') IconComp = Smartphone;
    else if (iconName === 'globe' || iconName === 'web') IconComp = Globe;
    else if (iconName === 'shield' || iconName === 'security') IconComp = Shield;

    const customStyle = color ? { color, backgroundColor: `${color}15`, borderColor: `${color}30` } : {};

    return (
        <div 
            className={`${containerClassName} border flex items-center justify-center shrink-0 shadow-xs transition`}
            style={customStyle}
        >
            <IconComp className={className} />
        </div>
    );
}

export default function CategoriesPage({ onNotify, theme = 'dark', locale = 'en' }) {
    const t = {
        en: {
            loading: 'Loading taxonomy matrix...',
            noMatches: 'No matching categories found',
            noCategories: 'No Categories Added',
            clearSearch: 'Try clearing your search term',
            addFirst: 'Add your first category to organize your skills and projects.',
            addCategory: 'Add Category',
            totalCategories: 'Total Categories',
            hardSkillStacks: 'Hard Skill Stacks',
            softSkillTracks: 'Soft Skill Tracks',
            projectDomains: 'Project Domains',
            all: 'All',
            hardSkills: 'Hard Skills',
            softSkills: 'Soft Skills',
            projects: 'Projects',
            searchPlaceholder: 'Search categories...',
            editCategory: 'Edit Category',
            deleteCategory: 'Delete Category',
            noDescription: 'No description provided.',
            projectsCount: 'projects',
            skillsCount: 'skills',
            addNewCategory: 'Add New Category',
            editCategoryTitle: 'Edit Category',
            defineTaxonomy: 'Define taxonomy name, target group, icon & branding color',
            categoryFor: 'Category For *',
            hardSkill: 'Hard Skill',
            softSkill: 'Soft Skill',
            project: 'Project',
            categoryName: 'Category Name *',
            namePlaceholder: 'e.g. Frontend, Cloud Infrastructure, SaaS',
            order: 'Order',
            description: 'Description',
            descPlaceholder: 'Brief overview of what items belong in this domain...',
            iconRep: 'Icon Representation',
            brandingColor: 'Branding Color',
            cancel: 'Cancel',
            saving: 'Saving...',
            saveChanges: 'Save Changes',
            createCategoryBtn: 'Create Category',
            errLoad: 'Failed to load categories.',
            successCreate: 'Category created successfully!',
            errCreate: 'Failed to create category.',
            successUpdate: 'Category updated successfully!',
            errUpdate: 'Failed to update category.',
            successDelete: 'Category deleted.',
            errDelete: 'Failed to delete category.',
            confirmDelete: 'Are you sure you want to delete category',
            warningCategorized: 'item(s) are currently categorized under this category.'
        },
        kh: {
            loading: 'កំពុងទាញយកទិន្នន័យចំណាត់ថ្នាក់...',
            noMatches: 'រកមិនឃើញចំណាត់ថ្នាក់ដែលត្រូវគ្នា',
            noCategories: 'មិនទាន់មានចំណាត់ថ្នាក់',
            clearSearch: 'សាកល្បងលុបពាក្យស្វែងរករបស់អ្នក',
            addFirst: 'បន្ថែមចំណាត់ថ្នាក់ដំបូងរបស់អ្នក ដើម្បីរៀបចំជំនាញ និងគម្រោង។',
            addCategory: 'បន្ថែមចំណាត់ថ្នាក់',
            totalCategories: 'ចំណាត់ថ្នាក់សរុប',
            hardSkillStacks: 'ក្រុមបច្ចេកទេស',
            softSkillTracks: 'ក្រុមជំនាញទន់',
            projectDomains: 'ក្រុមគម្រោង',
            all: 'ទាំងអស់',
            hardSkills: 'ជំនាញបច្ចេកទេស',
            softSkills: 'ជំនាញទន់',
            projects: 'គម្រោង',
            searchPlaceholder: 'ស្វែងរកចំណាត់ថ្នាក់...',
            editCategory: 'កែប្រែចំណាត់ថ្នាក់',
            deleteCategory: 'លុបចំណាត់ថ្នាក់',
            noDescription: 'មិនមានការពិពណ៌នាទេ។',
            projectsCount: 'គម្រោង',
            skillsCount: 'ជំនាញ',
            addNewCategory: 'បន្ថែមចំណាត់ថ្នាក់ថ្មី',
            editCategoryTitle: 'កែប្រែចំណាត់ថ្នាក់',
            defineTaxonomy: 'កំណត់ឈ្មោះចំណាត់ថ្នាក់ ក្រុមគោលដៅ រូបតំណាង និងពណ៌ម៉ាក',
            categoryFor: 'ចំណាត់ថ្នាក់សម្រាប់ *',
            hardSkill: 'ជំនាញបច្ចេកទេស',
            softSkill: 'ជំនាញទន់',
            project: 'គម្រោង',
            categoryName: 'ឈ្មោះចំណាត់ថ្នាក់ *',
            namePlaceholder: 'ឧ. ផ្នែកខាងមុខ (Frontend), ប្រព័ន្ធ Cloud, SaaS',
            order: 'លំដាប់',
            description: 'ការពិពណ៌នា',
            descPlaceholder: 'ទិដ្ឋភាពទូទៅសង្ខេបអំពីអ្វីដែលជាកម្មសិទ្ធិរបស់ក្រុមនេះ...',
            iconRep: 'រូបតំណាង',
            brandingColor: 'ពណ៌ម៉ាក',
            cancel: 'បោះបង់',
            saving: 'កំពុងរក្សាទុក...',
            saveChanges: 'រក្សាទុកការផ្លាស់ប្តូរ',
            createCategoryBtn: 'បង្កើតចំណាត់ថ្នាក់',
            errLoad: 'មិនអាចទាញយកចំណាត់ថ្នាក់បានទេ។',
            successCreate: 'បានបង្កើតចំណាត់ថ្នាក់ដោយជោគជ័យ!',
            errCreate: 'មិនអាចបង្កើតចំណាត់ថ្នាក់បានទេ។',
            successUpdate: 'បានកែប្រែចំណាត់ថ្នាក់ដោយជោគជ័យ!',
            errUpdate: 'មិនអាចកែប្រែចំណាត់ថ្នាក់បានទេ។',
            successDelete: 'បានលុបចំណាត់ថ្នាក់។',
            errDelete: 'មិនអាចលុបចំណាត់ថ្នាក់បានទេ។',
            confirmDelete: 'តើអ្នកប្រាកដជាចង់លុបចំណាត់ថ្នាក់',
            warningCategorized: 'ធាតុត្រូវបានចាត់ថ្នាក់នៅក្រោមក្រុមនេះ។'
        }
    }[locale] || {};
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'hard_skill', 'soft_skill', 'project'
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        name: '',
        type: 'hard_skill',
        description: '',
        icon: 'layout',
        color: '#6366f1',
        order: 0,
        is_active: true,
    });

    const isDark = theme === 'dark';
    const cardBg = isDark ? 'bg-slate-900/80 border-slate-800/80 shadow-lg' : 'bg-white border-slate-200/90 shadow-xs';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputBg = isDark ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500';

    const presetIcons = [
        { id: 'layout', label: 'Layout / UI', icon: Layout },
        { id: 'server', label: 'Backend / Server', icon: Server },
        { id: 'database', label: 'Database', icon: Database },
        { id: 'terminal', label: 'Terminal / DevOps', icon: Terminal },
        { id: 'code2', label: 'Code / APIs', icon: Code2 },
        { id: 'brain', label: 'Brain / Logic', icon: Brain },
        { id: 'users', label: 'Team / People', icon: Users },
        { id: 'message-square', label: 'Communication', icon: MessageSquare },
        { id: 'layers', label: 'Full-Stack', icon: Layers },
        { id: 'sparkles', label: 'AI & Automation', icon: Sparkles },
        { id: 'palette', label: 'Design / Creative', icon: Palette },
        { id: 'smartphone', label: 'Mobile App', icon: Smartphone },
        { id: 'globe', label: 'Web & Cloud', icon: Globe },
        { id: 'shield', label: 'Security & Auth', icon: Shield },
    ];

    const presetColors = [
        '#6366f1', // Indigo
        '#8b5cf6', // Purple
        '#3b82f6', // Blue
        '#0ea5e9', // Sky
        '#10b981', // Emerald
        '#14b8a6', // Teal
        '#f59e0b', // Amber
        '#ec4899', // Pink
        '#f43f5e', // Rose
    ];

    const fetchCategoriesList = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (e) {
            onNotify?.('error', t.errLoad || 'Failed to load categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoriesList();
    }, []);

    // Statistics
    const hardSkillCount = useMemo(() => categories.filter(c => c.type === 'hard_skill' || (c.type === 'skill' && !c.name.toLowerCase().includes('soft'))).length, [categories]);
    const softSkillCount = useMemo(() => categories.filter(c => c.type === 'soft_skill').length, [categories]);
    const projectCount = useMemo(() => categories.filter(c => c.type === 'project').length, [categories]);

    // Filtering
    const filteredCategories = useMemo(() => {
        return categories.filter(cat => {
            const matchesTab = 
                activeTab === 'all' || 
                cat.type === activeTab ||
                (activeTab === 'hard_skill' && cat.type === 'skill');
            const matchesSearch = 
                !searchQuery.trim() ||
                cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                cat.slug.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [categories, activeTab, searchQuery]);

    const getTypeBadge = (type) => {
        if (type === 'hard_skill' || type === 'skill') {
            return {
                label: t.hardSkill || 'Hard Skill',
                classes: isDark ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-indigo-700 bg-indigo-50 border-indigo-200'
            };
        }
        if (type === 'soft_skill') {
            return {
                label: t.softSkill || 'Soft Skill',
                classes: isDark ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-700 bg-purple-50 border-purple-200'
            };
        }
        return {
            label: t.project || 'Project',
            classes: isDark ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : 'text-cyan-800 bg-cyan-50 border-cyan-200'
        };
    };

    // Open Create Modal
    const handleOpenCreate = () => {
        setFormData({
            name: '',
            type: activeTab === 'all' ? 'hard_skill' : activeTab,
            description: '',
            icon: 'layout',
            color: '#6366f1',
            order: categories.length + 1,
            is_active: true,
        });
        setIsAddModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            type: category.type || 'hard_skill',
            description: category.description || '',
            icon: category.icon || 'layout',
            color: category.color || '#6366f1',
            order: category.order || 0,
            is_active: category.is_active !== false,
        });
    };

    // Submit Create
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        setIsSubmitting(true);
        try {
            await createCategory(formData);
            onNotify?.('success', t.successCreate || 'Category created successfully!');
            setIsAddModalOpen(false);
            fetchCategoriesList();
        } catch (err) {
            onNotify?.('error', t.errCreate || 'Failed to create category.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Submit Update
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingCategory || !formData.name.trim()) return;
        setIsSubmitting(true);
        try {
            await updateCategory(editingCategory.id, formData);
            onNotify?.('success', t.successUpdate || 'Category updated successfully!');
            setEditingCategory(null);
            fetchCategoriesList();
        } catch (err) {
            onNotify?.('error', t.errUpdate || 'Failed to update category.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete
    const handleDelete = async (category) => {
        const skillsCount = category.skills_count || 0;
        const projectsCount = category.projects_count || 0;
        const totalLinked = skillsCount + projectsCount;
        
        let confirmMsg = `${t.confirmDelete || 'Are you sure you want to delete category'} "${category.name}"?`;
        if (totalLinked > 0) {
            confirmMsg += ` \n\n⚠️ ${totalLinked} ${t.warningCategorized || 'item(s) are currently categorized under this category.'}`;
        }

        if (!window.confirm(confirmMsg)) return;

        try {
            await deleteCategory(category.id);
            onNotify?.('success', t.successDelete || 'Category deleted.');
            fetchCategoriesList();
        } catch (err) {
            onNotify?.('error', t.errDelete || 'Failed to delete category.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`${cardBg} rounded-2xl p-4 border flex items-center justify-between`}>
                    <div>
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${subColor}`}>
                            {t.totalCategories || 'Total Categories'}
                        </span>
                        <span className={`text-2xl font-black mt-1 block ${titleColor}`}>
                            {categories.length}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                        <FolderTree className="w-5 h-5" />
                    </div>
                </div>

                <div className={`${cardBg} rounded-2xl p-4 border flex items-center justify-between`}>
                    <div>
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${subColor}`}>
                            {t.hardSkillStacks || 'Hard Skill Stacks'}
                        </span>
                        <span className={`text-2xl font-black mt-1 block ${titleColor}`}>
                            {hardSkillCount}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                        <Cpu className="w-5 h-5" />
                    </div>
                </div>

                <div className={`${cardBg} rounded-2xl p-4 border flex items-center justify-between`}>
                    <div>
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${subColor}`}>
                            {t.softSkillTracks || 'Soft Skill Tracks'}
                        </span>
                        <span className={`text-2xl font-black mt-1 block ${titleColor}`}>
                            {softSkillCount}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                        <Brain className="w-5 h-5" />
                    </div>
                </div>

                <div className={`${cardBg} rounded-2xl p-4 border flex items-center justify-between`}>
                    <div>
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${subColor}`}>
                            {t.projectDomains || 'Project Domains'}
                        </span>
                        <span className={`text-2xl font-black mt-1 block ${titleColor}`}>
                            {projectCount}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                        <FolderGit2 className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Toolbar: Tabs, Search, Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Tabs */}
                <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            activeTab === 'all'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <span>{t.all || 'All'}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'all' ? 'bg-white/20 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'}`}>
                            {categories.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('hard_skill')}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            activeTab === 'hard_skill'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{t.hardSkills || 'Hard Skills'}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'hard_skill' ? 'bg-white/20 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'}`}>
                            {hardSkillCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('soft_skill')}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            activeTab === 'soft_skill'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Brain className="w-3.5 h-3.5" />
                        <span>{t.softSkills || 'Soft Skills'}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'soft_skill' ? 'bg-white/20 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'}`}>
                            {softSkillCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('project')}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            activeTab === 'project'
                                ? 'bg-cyan-600 text-white shadow-sm'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>{t.projects || 'Projects'}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'project' ? 'bg-white/20 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'}`}>
                            {projectCount}
                        </span>
                    </button>
                </div>

                {/* Search & Add Button */}
                <div className="flex items-center gap-2.5">
                    <div className="relative flex-1 sm:w-64">
                        <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${subColor}`} />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder || "Search categories..."}
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
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{t.addCategory || 'Add Category'}</span>
                    </button>
                </div>
            </div>

            {/* Categories Card Grid */}
            {loading ? (
                <div className={`${cardBg} rounded-2xl p-16 text-center text-xs ${subColor}`}>
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span>{t.loading || 'Loading taxonomy matrix...'}</span>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className={`${cardBg} rounded-2xl p-16 text-center border-dashed border-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Tag className="w-7 h-7" />
                    </div>
                    <h4 className={`text-base font-bold ${titleColor} mb-1`}>
                        {searchQuery ? (t.noMatches || 'No matching categories found') : (t.noCategories || 'No Categories Added')}
                    </h4>
                    <p className={`text-xs ${subColor} max-w-sm mx-auto mb-5`}>
                        {searchQuery ? `${t.clearSearch || 'Try clearing your search term'} "${searchQuery}".` : (t.addFirst || 'Add your first category to organize your skills and projects.')}
                    </p>
                    <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{t.addCategory || 'Add Category'}</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCategories.map((category) => {
                        const typeInfo = getTypeBadge(category.type);
                        const linkedItemsCount = (category.skills_count || 0) + (category.projects_count || 0);

                        return (
                            <div
                                key={category.id}
                                className={`${cardBg} rounded-2xl p-5 border transition-all duration-200 group relative flex flex-col justify-between hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10`}
                            >
                                {/* Top: Icon + Actions */}
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <CategoryIcon 
                                            icon={category.icon} 
                                            color={category.color} 
                                            className="w-5 h-5" 
                                            containerClassName="w-11 h-11 rounded-2xl"
                                        />
                                        <div className="flex items-center gap-1">
                                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                                                isDark ? 'bg-slate-800/90 border-slate-700/60 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                                            }`}>
                                                #{category.order}
                                            </span>
                                            <button
                                                onClick={() => handleOpenEdit(category)}
                                                title={t.editCategory || "Edit Category"}
                                                className={`p-1.5 rounded-lg border transition ${
                                                    isDark 
                                                        ? 'bg-slate-800/60 hover:bg-indigo-600 border-slate-700/60 text-slate-400 hover:text-white' 
                                                        : 'bg-slate-100 hover:bg-indigo-600 border-slate-200 text-slate-600 hover:text-white hover:border-indigo-600 shadow-xs'
                                                }`}
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
                                                title={t.deleteCategory || "Delete Category"}
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

                                    {/* Middle: Title, Slug, Description */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className={`text-base font-bold truncate group-hover:text-indigo-400 transition ${titleColor}`}>
                                                {category.name}
                                            </h4>
                                        </div>
                                        <p className={`text-[11px] font-mono mb-2 ${subColor}`}>
                                            /{category.slug}
                                        </p>
                                        <p className={`text-xs line-clamp-2 leading-relaxed ${subColor}`}>
                                            {category.description || (t.noDescription || 'No description provided.')}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom: Type Badge & Items Count */}
                                <div className={`pt-3 border-t flex items-center justify-between text-xs ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${typeInfo.classes}`}>
                                        {typeInfo.label}
                                    </span>
                                    <span className={`text-xs font-medium ${subColor}`}>
                                        {category.type === 'project' 
                                            ? `${category.projects_count || 0} ${t.projectsCount || 'projects'}` 
                                            : `${category.skills_count || 0} ${t.skillsCount || 'skills'}`}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Quick Add Card */}
                    <button
                        onClick={handleOpenCreate}
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
                            {t.addNewCategory || 'Add New Category'}
                        </span>
                    </button>
                </div>
            )}

            {/* ========================================================= */}
            {/* ADD / EDIT CATEGORY MODAL                                 */}
            {/* ========================================================= */}
            {(isAddModalOpen || editingCategory) && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between pb-4 mb-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                    {editingCategory ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className={`text-base font-bold ${titleColor}`}>
                                        {editingCategory ? (t.editCategoryTitle || 'Edit Category') : (t.addNewCategory || 'Add New Category')}
                                    </h3>
                                    <p className={`text-xs ${subColor}`}>
                                        {t.defineTaxonomy || 'Define taxonomy name, target group, icon & branding color'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setEditingCategory(null);
                                }}
                                className={`p-1.5 rounded-xl transition ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={editingCategory ? handleUpdate : handleCreate} className="space-y-4">
                            {/* Type Selector */}
                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-2`}>
                                    {t.categoryFor || 'Category For *'}
                                </label>
                                <div className={`grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'hard_skill' }))}
                                        className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                            formData.type === 'hard_skill' || formData.type === 'skill'
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Cpu className="w-3.5 h-3.5" />
                                        <span>{t.hardSkill || 'Hard Skill'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'soft_skill' }))}
                                        className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                            formData.type === 'soft_skill'
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Brain className="w-3.5 h-3.5" />
                                        <span>{t.softSkill || 'Soft Skill'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'project' }))}
                                        className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                            formData.type === 'project'
                                                ? 'bg-cyan-600 text-white shadow-sm'
                                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <FolderGit2 className="w-3.5 h-3.5" />
                                        <span>{t.project || 'Project'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Name & Order */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                    <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                        {t.categoryName || 'Category Name *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={t.namePlaceholder || "e.g. Frontend, Cloud Infrastructure, SaaS"}
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${inputBg}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                        {t.order || 'Order'}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${inputBg}`}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                    {t.description || 'Description'}
                                </label>
                                <textarea
                                    rows="2"
                                    placeholder={t.descPlaceholder || "Brief overview of what items belong in this domain..."}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none ${inputBg}`}
                                />
                            </div>

                            {/* Icon Preset Picker */}
                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                    {t.iconRep || 'Icon Representation'}
                                </label>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                    {presetIcons.map(({ id, label, icon: IconComponent }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            title={label}
                                            onClick={() => setFormData(prev => ({ ...prev, icon: id }))}
                                            className={`h-10 rounded-xl border flex items-center justify-center transition ${
                                                formData.icon === id
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                                                    : isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <IconComponent className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div>
                                <label className={`block text-xs font-semibold ${subColor} uppercase tracking-wider mb-1.5`}>
                                    {t.brandingColor || 'Branding Color'}
                                </label>
                                <div className="flex items-center gap-2">
                                    {presetColors.map((hex) => (
                                        <button
                                            key={hex}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, color: hex }))}
                                            className={`w-7 h-7 rounded-full border-2 transition flex items-center justify-center ${
                                                formData.color === hex ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: hex }}
                                        >
                                            {formData.color === hex && <Check className="w-3.5 h-3.5 text-white" />}
                                        </button>
                                    ))}
                                    <input 
                                        type="color" 
                                        value={formData.color} 
                                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                        className="w-7 h-7 rounded-full border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                                        title="Pick custom color"
                                    />
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditingCategory(null);
                                    }}
                                    className={`px-4 py-2.5 border text-xs font-semibold rounded-xl transition ${
                                        isDark 
                                            ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' 
                                            : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {t.cancel || 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>{t.saving || 'Saving...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>{editingCategory ? (t.saveChanges || 'Save Changes') : (t.createCategoryBtn || 'Create Category')}</span>
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
