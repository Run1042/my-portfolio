import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Star,
    X,
    UploadCloud,
    Check,
} from 'lucide-react';
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from '../libs/api';

export default function ProjectsPage({ showAddModal, setShowAddModal, onNotify, theme = 'dark', locale = 'en' }) {
    const t = {
        en: {
            search: 'Search projects...', newProject: 'New Project', loading: 'Loading projects...',
            noProjects: 'No projects matching your query.', addFirst: '+ Add Your First Project',
            colProject: 'Project', colCategory: 'Category', colTech: 'Tech Stack', colFeatured: 'Featured',
            colOrder: 'Order', colActions: 'Actions', standard: 'Standard', edit: 'Edit Project',
            create: 'Create New Project', desc: 'Showcase details for your public developer portfolio.',
            title: 'Project Title *', slug: 'Slug *', cat: 'Category *', order: 'Display Order',
            featHome: 'Feature on Home', shortDesc: 'Short Summary Description *',
            tags: 'Tech Stack Tags (Comma separated)', liveUrl: 'Live Demo URL',
            gitUrl: 'GitHub Repository URL', thumb: 'Project Thumbnail Image',
            upload: 'Upload Local File', orUrl: 'Or Image URL', preview: 'Live Preview',
            noImg: 'No image selected', cancel: 'Cancel', save: 'Save Project', saving: 'Saving...',
        },
        kh: {
            search: 'ស្វែងរកគម្រោង...', newProject: 'គម្រោងថ្មី', loading: 'កំពុងទាញទិន្នន័យ...',
            noProjects: 'គ្មានគម្រោងដែលអ្នកស្វែងរកទេ។', addFirst: '+ បន្ថែមគម្រោងដំបូង',
            colProject: 'គម្រោង', colCategory: 'ប្រភេទ', colTech: 'បច្ចេកវិទ្យា', colFeatured: 'លេចធ្លោ',
            colOrder: 'លំដាប់', colActions: 'សកម្មភាព', standard: 'ធម្មតា', edit: 'កែប្រែគម្រោង',
            create: 'បង្កើតគម្រោងថ្មី', desc: 'បង្ហាញព័ត៌មានលម្អិតនៃគម្រោងរបស់អ្នក។',
            title: 'ឈ្មោះគម្រោង *', slug: 'តំណភ្ជាប់ស្តង់ដារ (Slug) *', cat: 'ប្រភេទ *', order: 'លំដាប់បង្ហាញ',
            featHome: 'បង្ហាញលើទំព័រដើម', shortDesc: 'ការពិពណ៌នាសង្ខេប *',
            tags: 'បច្ចេកវិទ្យា (ប្រើសញ្ញាក្បៀស)', liveUrl: 'តំណភ្ជាប់គម្រោងពិត',
            gitUrl: 'តំណភ្ជាប់ GitHub', thumb: 'រូបតំណាងគម្រោង',
            upload: 'ផ្ទុករូបភាព', orUrl: 'ឬតំណភ្ជាប់រូបភាព', preview: 'មើលរូបភាព',
            noImg: 'មិនមានរូបភាព', cancel: 'បោះបង់', save: 'រក្សាទុក', saving: 'កំពុងរក្សាទុក...',
        }
    }[locale] || {};

    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    const isDark = theme === 'dark';
    const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-sm';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputBg = isDark ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400';
    const theadBg = isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600';
    const dividerColor = isDark ? 'divide-slate-800/80' : 'divide-slate-100';
    const rowHover = isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/80';
    const modalBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';

    // Modal state
    const [editingProject, setEditingProject] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form inputs
    const [form, setForm] = useState({
        title: '',
        slug: '',
        category: 'Full-Stack Application',
        description: '',
        content: '',
        tags: '',
        demo_url: '',
        github_url: '',
        image_url: '',
        is_featured: false,
        order: 0,
    });
    const [fileUpload, setFileUpload] = useState(null);
    const [previewSrc, setPreviewSrc] = useState('');

    const fetchProjectsList = async () => {
        setLoading(true);
        try {
            const data = await getProjects({ search, category: categoryFilter });
            setProjects(data.projects || []);
            setCategories(['All', ...(data.categories || [])]);
        } catch (e) {
            onNotify('error', 'Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectsList();
    }, [search, categoryFilter]);

    useEffect(() => {
        if (showAddModal) {
            openCreateModal();
        }
    }, [showAddModal]);

    const openCreateModal = () => {
        setEditingProject(null);
        setForm({
            title: '',
            slug: '',
            category: 'Full-Stack Application',
            description: '',
            content: '',
            tags: '',
            demo_url: '',
            github_url: '',
            image_url: '',
            is_featured: false,
            order: 0,
        });
        setFileUpload(null);
        setPreviewSrc('');
        setShowAddModal(true);
    };

    const openEditModal = (p) => {
        setEditingProject(p);
        setForm({
            title: p.title || '',
            slug: p.slug || '',
            category: p.category || 'Full-Stack Application',
            description: p.description || '',
            content: p.content || '',
            tags: p.tags || '',
            demo_url: p.demo_url || '',
            github_url: p.github_url || '',
            image_url: p.image && p.image.startsWith('http') ? p.image : '',
            is_featured: !!p.is_featured,
            order: p.order || 0,
        });
        setFileUpload(null);
        setPreviewSrc(p.image_url || '');
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingProject(null);
    };

    const handleTitleChange = (val) => {
        const slug = val
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/[\s_-]+/g, '-');
        setForm((prev) => ({
            ...prev,
            title: val,
            slug: editingProject ? prev.slug : slug,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileUpload(file);
            const reader = new FileReader();
            reader.onload = (re) => setPreviewSrc(re.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('slug', form.slug);
        formData.append('category', form.category);
        formData.append('description', form.description);
        formData.append('content', form.content || '');
        formData.append('tags', form.tags || '');
        formData.append('demo_url', form.demo_url || '');
        formData.append('github_url', form.github_url || '');
        formData.append('is_featured', form.is_featured ? '1' : '0');
        formData.append('order', form.order || 0);

        if (fileUpload) {
            formData.append('image', fileUpload);
        } else if (form.image_url) {
            formData.append('image_url', form.image_url);
        }

        try {
            if (editingProject) {
                await updateProject(editingProject.id, formData);
                onNotify('success', 'Project updated successfully!');
            } else {
                await createProject(formData);
                onNotify('success', 'Project created successfully!');
            }
            closeModal();
            fetchProjectsList();
        } catch (err) {
            const msg =
                err.response?.data?.message || 'Failed to save project. Please check inputs.';
            onNotify('error', msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (p) => {
        if (!window.confirm(`Are you sure you want to delete "${p.title}"?`)) {
            return;
        }

        try {
            await deleteProject(p.id);
            onNotify('success', 'Project deleted.');
            fetchProjectsList();
        } catch (e) {
            onNotify('error', 'Failed to delete project.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Filter / Search Bar */}
            <div className={`${cardBg} border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition duration-150`}>
                <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t.search || "Search projects..."}
                            className={`w-full pl-10 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${inputBg}`}
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={`w-full sm:w-auto px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${inputBg}`}
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={openCreateModal}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t.newProject || 'New Project'}</span>
                </button>
            </div>

            {/* Projects Table */}
            <div className={`${cardBg} border rounded-2xl overflow-hidden transition duration-150`}>
                {loading ? (
                    <div className={`py-20 text-center text-xs ${subColor}`}>
                        {t.loading || 'Loading projects...'}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                        <p className={`text-sm ${subColor}`}>{t.noProjects || 'No projects matching your query.'}</p>
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition"
                        >
                            {t.addFirst || '+ Add Your First Project'}
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className={`border-b text-[11px] font-semibold uppercase tracking-wider ${theadBg}`}>
                                <tr>
                                    <th className="py-3.5 px-6">{t.colProject || 'Project'}</th>
                                    <th className="py-3.5 px-6">{t.colCategory || 'Category'}</th>
                                    <th className="py-3.5 px-6">{t.colTech || 'Tech Stack'}</th>
                                    <th className="py-3.5 px-6">{t.colFeatured || 'Featured'}</th>
                                    <th className="py-3.5 px-6">{t.colOrder || 'Order'}</th>
                                    <th className="py-3.5 px-6 text-right">{t.colActions || 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${dividerColor}`}>
                                {projects.map((project) => (
                                    <tr key={project.id} className={`${rowHover} transition`}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3.5">
                                                {project.image_url ? (
                                                    <img
                                                        src={project.image_url}
                                                        alt={project.title}
                                                        className={`w-12 h-12 rounded-xl object-cover border shrink-0 ${
                                                            isDark ? 'bg-slate-800 border-slate-700/80' : 'bg-slate-100 border-slate-200'
                                                        }`}
                                                    />
                                                ) : (
                                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 text-xs font-mono ${
                                                        isDark ? 'bg-slate-800 border-slate-700/80 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
                                                    }`}>
                                                        &lt;/&gt;
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <h4 className={`font-bold tracking-tight truncate max-w-xs ${titleColor}`}>
                                                        {project.title}
                                                    </h4>
                                                    <p className={`text-xs truncate max-w-xs mt-0.5 ${subColor}`}>
                                                        {project.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-xs whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
                                                isDark
                                                    ? 'bg-slate-800/80 border-slate-700/80 text-slate-300'
                                                    : 'bg-slate-100 border-slate-200 text-slate-700'
                                            }`}>
                                                {project.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-xs">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {(project.tags_list || []).map((t, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                                                            isDark
                                                                ? 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40'
                                                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                        }`}
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            {project.is_featured ? (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                                    isDark
                                                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    <Star className="w-3 h-3 fill-amber-400" />
                                                    <span>Featured</span>
                                                </span>
                                            ) : (
                                                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.standard || 'Standard'}</span>
                                            )}
                                        </td>
                                        <td className={`py-4 px-6 text-xs whitespace-nowrap font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {project.order}
                                        </td>
                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                {project.demo_url && (
                                                    <a
                                                        href={project.demo_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={`p-2 rounded-lg border transition ${
                                                            isDark
                                                                ? 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border-slate-700/60'
                                                                : 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-200'
                                                        }`}
                                                        title="Live preview"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(project)}
                                                    className={`p-2 rounded-lg border transition ${
                                                        isDark
                                                            ? 'text-slate-300 hover:text-indigo-400 bg-slate-800/80 hover:bg-slate-800 border-slate-700/60'
                                                            : 'text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border-slate-200'
                                                    }`}
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project)}
                                                    className={`p-2 rounded-lg border transition ${
                                                        isDark
                                                            ? 'text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10 border-slate-700/60'
                                                            : 'text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border-slate-200'
                                                    }`}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add / Edit Project Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div
                        className={`${modalBg} border ${isDark ? 'border-slate-800' : 'border-slate-200'} rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'} mb-6`}>
                            <div>
                                <h3 className={`text-lg font-bold ${titleColor}`}>
                                    {editingProject ? (t.edit || 'Edit Project') : (t.create || 'Create New Project')}
                                </h3>
                                <p className={`text-xs ${subColor}`}>
                                    {t.desc || 'Showcase details for your public developer portfolio.'}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className={`p-2 rounded-xl transition ${
                                    isDark
                                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider mb-2`}>
                                        {t.title || 'Project Title *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="e.g. Nexus SaaS Engine"
                                        className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider mb-2`}>
                                        {t.slug || 'Slug *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.slug}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, slug: e.target.value }))
                                        }
                                        placeholder="nexus-saas-engine"
                                        className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider mb-2`}>
                                        {t.cat || 'Category *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, category: e.target.value }))
                                        }
                                        list="cat-options"
                                        className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                    />
                                    <datalist id="cat-options">
                                        <option value="Full-Stack Application" />
                                        <option value="Frontend & UI/UX" />
                                        <option value="AI & Automation" />
                                        <option value="Mobile App" />
                                        <option value="API & Backend" />
                                    </datalist>
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider mb-2`}>
                                        {t.order || 'Display Order'}
                                    </label>
                                    <input
                                        type="number"
                                        value={form.order}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, order: e.target.value }))
                                        }
                                        className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                    />
                                </div>

                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={form.is_featured}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    is_featured: e.target.checked,
                                                }))
                                            }
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            {t.featHome || 'Feature on Home'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider mb-2`}>
                                    {t.shortDesc || 'Short Summary Description *'}
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Brief overview explaining what the application does..."
                                    className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider mb-2`}>
                                    {t.tags || 'Tech Stack Tags (Comma separated)'}
                                </label>
                                <input
                                    type="text"
                                    value={form.tags}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, tags: e.target.value }))
                                    }
                                    placeholder="Laravel 12, React, Tailwind CSS, PostgreSQL"
                                    className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider mb-2`}>
                                        {t.liveUrl || 'Live Demo URL'}
                                    </label>
                                    <input
                                        type="url"
                                        value={form.demo_url}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                demo_url: e.target.value,
                                            }))
                                        }
                                        placeholder="https://demo.example.com"
                                        className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider mb-2`}>
                                        {t.gitUrl || 'GitHub Repository URL'}
                                    </label>
                                    <input
                                        type="url"
                                        value={form.github_url}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                github_url: e.target.value,
                                            }))
                                        }
                                        placeholder="https://github.com/org/repo"
                                        className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                    />
                                </div>
                            </div>

                            {/* Image Selection */}
                            <div className={`border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'} pt-5`}>
                                <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-wider mb-3`}>
                                    {t.thumb || 'Project Thumbnail Image'}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                                    <div className="space-y-3">
                                        <div>
                                            <span className={`text-xs ${subColor} block mb-1`}>
                                                {t.upload || 'Upload Local File'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className={`block w-full text-xs ${subColor} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold ${
                                                    isDark
                                                        ? 'file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30'
                                                        : 'file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100'
                                                } file:cursor-pointer`}
                                            />
                                        </div>
                                        <div>
                                            <span className={`text-xs ${subColor} block mb-1`}>
                                                {t.orUrl || 'Or Image URL'}
                                            </span>
                                            <input
                                                type="url"
                                                value={form.image_url}
                                                onChange={(e) => {
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        image_url: e.target.value,
                                                    }));
                                                    setPreviewSrc(e.target.value);
                                                }}
                                                placeholder="https://images.unsplash.com/..."
                                                className={`w-full px-3.5 py-2 ${inputBg} border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <span className={`text-xs ${subColor} block mb-1`}>
                                            {t.preview || 'Live Preview'}
                                        </span>
                                        <div className={`w-full h-32 rounded-xl border border-dashed ${
                                            isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-300 bg-slate-50'
                                        } flex items-center justify-center overflow-hidden`}>
                                            {previewSrc ? (
                                                <img
                                                    src={previewSrc}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                                                    {t.noImg || 'No image selected'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className={`border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'} pt-5 flex items-center justify-end gap-3`}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={`px-5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                                        isDark
                                            ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                                            : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {t.cancel || 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                                >
                                    {isSaving ? (t.saving || 'Saving...') : (t.save || 'Save Project')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
