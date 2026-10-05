import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Plus, Edit2, Trash2, X, Check, Lock } from 'lucide-react';
import { getRoles, getPermissions, createRole, updateRole, deleteRole } from '../libs/api';

export default function RolesPage({ onNotify, theme = 'dark', locale = 'en' }) {
    const t = {
        en: {
            title: 'Role-Based Access Control (RBAC)', desc: 'Define administrative roles, manage permissions, and enforce security policies.',
            createBtn: 'Create Role', loading: 'Loading roles...', system: 'System', edit: 'Edit Role & Permissions',
            del: 'Delete Role', noDesc: 'No description specified for this role.', granted: 'Granted Permissions:',
            allPerms: 'All Permissions (Bypass)', assigned: 'assigned', fullRoot: '* Full Root Access',
            noPerms: 'No permissions assigned yet.', usersCount: 'Users with role:',
            config: 'Configure', modalEditTitle: 'Configure Role', modalCreateTitle: 'Create New Role',
            modalDesc: 'Specify role metadata and select permissions.', roleName: 'Role Name *', namePh: 'e.g. Content Manager',
            slug: 'Slug *', descLbl: 'Description', descPh: 'Responsibilities and access scope of this role...',
            matrix: 'Permissions Matrix', cancel: 'Cancel', save: 'Save Role', saving: 'Saving...',
            sysErr: 'System roles cannot be deleted.'
        },
        kh: {
            title: 'ការគ្រប់គ្រងសិទ្ធិ (RBAC)', desc: 'កំណត់តួនាទីអ្នកគ្រប់គ្រង គ្រប់គ្រងសិទ្ធិ និងអនុវត្តគោលការណ៍សុវត្ថិភាព។',
            createBtn: 'បង្កើតតួនាទី', loading: 'កំពុងទាញទិន្នន័យ...', system: 'ប្រព័ន្ធ', edit: 'កែប្រែតួនាទី និងសិទ្ធិ',
            del: 'លុបតួនាទី', noDesc: 'មិនមានការពិពណ៌នាសម្រាប់តួនាទីនេះទេ។', granted: 'សិទ្ធិដែលបានផ្តល់៖',
            allPerms: 'សិទ្ធិទាំងអស់', assigned: 'បានកំណត់', fullRoot: '* សិទ្ធិពេញលេញ',
            noPerms: 'មិនទាន់មានសិទ្ធិទេ។', usersCount: 'អ្នកប្រើប្រាស់ដែលមានតួនាទី៖',
            config: 'កំណត់រចនាសម្ព័ន្ធ', modalEditTitle: 'កំណត់តួនាទី', modalCreateTitle: 'បង្កើតតួនាទីថ្មី',
            modalDesc: 'កំណត់ទិន្នន័យតួនាទី និងជ្រើសរើសសិទ្ធិ។', roleName: 'ឈ្មោះតួនាទី *', namePh: 'ឧ. អ្នកគ្រប់គ្រងមាតិកា',
            slug: 'Slug *', descLbl: 'ការពិពណ៌នា', descPh: 'ទំនួលខុសត្រូវ និងសិទ្ធិរបស់តួនាទីនេះ...',
            matrix: 'ម៉ាទ្រីសសិទ្ធិ', cancel: 'បោះបង់', save: 'រក្សាទុកតួនាទី', saving: 'កំពុងរក្សាទុក...',
            sysErr: 'មិនអាចលុបតួនាទីប្រព័ន្ធបានទេ។'
        }
    }[locale] || {};

    const [roles, setRoles] = useState([]);
    const [permissionsByCategory, setPermissionsByCategory] = useState({});
    const [loading, setLoading] = useState(true);

    const isDark = theme === 'dark';
    const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/80 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputBg = isDark ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400';
    const modalBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';
    const dividerColor = isDark ? 'border-slate-800/80' : 'border-slate-200';
    const btnSecondary = isDark ? 'p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition' : 'p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition';

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        permissions: [],
    });
    const [saving, setIsSaving] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getRoles();
            setRoles(data.roles || []);
            setPermissionsByCategory(data.permissions_by_category || {});
        } catch (e) {
            onNotify('error', 'Failed to load roles and permissions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openCreateModal = () => {
        setEditingRole(null);
        setForm({
            name: '',
            slug: '',
            description: '',
            permissions: [],
        });
        setShowModal(true);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setForm({
            name: role.name || '',
            slug: role.slug || '',
            description: role.description || '',
            permissions: (role.permissions || []).map((p) => p.id),
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRole(null);
    };

    const handleNameChange = (val) => {
        const slug = val
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/[\s_-]+/g, '-');
        setForm((prev) => ({
            ...prev,
            name: val,
            slug: editingRole ? prev.slug : slug,
        }));
    };

    const togglePermission = (permId) => {
        setForm((prev) => {
            const exists = prev.permissions.includes(permId);
            return {
                ...prev,
                permissions: exists
                    ? prev.permissions.filter((id) => id !== permId)
                    : [...prev.permissions, permId],
            };
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingRole) {
                await updateRole(editingRole.id, form);
                onNotify('success', `Role "${form.name}" updated successfully!`);
            } else {
                await createRole(form);
                onNotify('success', `Role "${form.name}" created successfully!`);
            }
            closeModal();
            loadData();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to save role.';
            onNotify('error', msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (role) => {
        if (role.is_system) {
            onNotify('error', t.sysErr || 'System roles cannot be deleted.');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
            return;
        }

        try {
            await deleteRole(role.id);
            onNotify('success', `Role "${role.name}" deleted.`);
            loadData();
        } catch (e) {
            onNotify('error', 'Failed to delete role.');
        }
    };

    const categories = Object.keys(permissionsByCategory);

    return (
        <div className="space-y-8">
            {/* Header banner */}
            <div className={`${cardBg} border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition duration-150`}>
                <div>
                    <h2 className={`text-base font-bold flex items-center gap-2 ${titleColor}`}>
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        <span>{t.title || 'Role-Based Access Control (RBAC)'}</span>
                    </h2>
                    <p className={`text-xs mt-1 ${subColor}`}>
                        {t.desc || 'Define administrative roles, manage permissions, and enforce security policies.'}
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t.createBtn || 'Create Role'}</span>
                </button>
            </div>

            {/* Roles Grid */}
            {loading ? (
                <div className={`py-20 text-center text-xs ${subColor}`}>{t.loading || 'Loading roles...'}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className={`${cardBg} border rounded-2xl p-6 relative flex flex-col justify-between transition duration-150`}
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold ${
                                            isDark
                                                ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400'
                                                : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                        }`}>
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className={`text-base font-bold flex items-center gap-2 ${titleColor}`}>
                                                <span>{role.name}</span>
                                                {role.is_system && (
                                                    <span className={`text-[10px] border px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                                        isDark
                                                            ? 'bg-slate-800 border-slate-700 text-slate-400'
                                                            : 'bg-slate-100 border-slate-200 text-slate-600'
                                                    }`}>
                                                        <Lock className="w-3 h-3" /> {t.system || 'System'}
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-xs text-indigo-500 font-mono">
                                                slug: {role.slug}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(role)}
                                            className={btnSecondary}
                                            title={t.edit || "Edit Role & Permissions"}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {!role.is_system && (
                                            <button
                                                onClick={() => handleDelete(role)}
                                                className={isDark ? 'p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10 rounded-lg transition' : 'p-1.5 text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition'}
                                                title={t.del || "Delete Role"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <p className={`text-xs mb-4 ${subColor}`}>
                                    {role.description || (t.noDesc || 'No description specified for this role.')}
                                </p>

                                {/* Permissions count and badges */}
                                <div className={`pt-3 border-t ${dividerColor} mb-4`}>
                                    <div className={`flex items-center justify-between text-xs mb-2 ${subColor}`}>
                                        <span className={`font-semibold ${titleColor}`}>
                                            {t.granted || 'Granted Permissions:'}
                                        </span>
                                        <span className="font-mono text-indigo-500 font-bold">
                                            {role.slug === 'super-admin'
                                                ? (t.allPerms || 'All Permissions (Bypass)')
                                                : `${(role.permissions || []).length} ${t.assigned || 'assigned'}`}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                                        {role.slug === 'super-admin' ? (
                                            <span className={`text-[11px] px-2.5 py-0.5 rounded-md border ${
                                                isDark
                                                    ? 'bg-purple-950/40 text-purple-300 border-purple-800/40'
                                                    : 'bg-purple-50 text-purple-700 border-purple-200'
                                            }`}>
                                                {t.fullRoot || '* Full Root Access'}
                                            </span>
                                        ) : (role.permissions || []).length === 0 ? (
                                            <span className={`text-xs ${subColor}`}>
                                                {t.noPerms || 'No permissions assigned yet.'}
                                            </span>
                                        ) : (
                                            role.permissions.map((p) => (
                                                <span
                                                    key={p.id}
                                                    className={`text-[11px] px-2 py-0.5 rounded-md border ${
                                                        isDark
                                                            ? 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40'
                                                            : 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium'
                                                    }`}
                                                >
                                                    {p.slug}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={`pt-3 border-t ${dividerColor} flex items-center justify-between text-[11px] ${subColor}`}>
                                <span>{t.usersCount || 'Users with role:'} {role.users_count || 0}</span>
                                <button
                                    onClick={() => openEditModal(role)}
                                    className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold"
                                >
                                    {t.config || 'Configure'} &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal: Create or Edit Role */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div
                        className={`${modalBg} border rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`flex items-center justify-between pb-4 border-b ${dividerColor} mb-6`}>
                            <div>
                                <h3 className={`text-lg font-bold ${titleColor}`}>
                                    {editingRole ? `${t.modalEditTitle || 'Configure Role'}: ${editingRole.name}` : (t.modalCreateTitle || 'Create New Role')}
                                </h3>
                                <p className={`text-xs ${subColor}`}>
                                    {t.modalDesc || 'Specify role metadata and select permissions.'}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${titleColor}`}>
                                        {t.roleName || 'Role Name *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder={t.namePh || "e.g. Content Manager"}
                                        className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${titleColor}`}>
                                        {t.slug || 'Slug *'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!!editingRole}
                                        value={form.slug}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, slug: e.target.value }))
                                        }
                                        placeholder="content-manager"
                                        className={`w-full px-3.5 py-2.5 ${inputBg} border rounded-xl text-sm font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                                            editingRole ? 'opacity-60 cursor-not-allowed' : ''
                                        }`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${titleColor}`}>
                                    {t.descLbl || 'Description'}
                                </label>
                                <textarea
                                    rows={2}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    placeholder={t.descPh || "Responsibilities and access scope of this role..."}
                                    className={`w-full px-3.5 py-2 ${inputBg} border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold uppercase tracking-wider mb-3 ${titleColor}`}>
                                    {t.matrix || 'Permissions Matrix'}
                                </label>

                                <div className={`space-y-5 ${isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'} border rounded-2xl p-5 max-h-72 overflow-y-auto`}>
                                    {categories.map((category) => (
                                        <div key={category} className="space-y-2">
                                            <h4 className={`text-xs font-bold text-indigo-500 uppercase tracking-wider border-b ${dividerColor} pb-1`}>
                                                {category}
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {permissionsByCategory[category].map((perm) => {
                                                    const checked = form.permissions.includes(perm.id);
                                                    return (
                                                        <label
                                                            key={perm.id}
                                                            className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer select-none transition ${
                                                                checked
                                                                    ? isDark
                                                                        ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                                                                        : 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                                                                    : isDark
                                                                        ? 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                                                                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => togglePermission(perm.id)}
                                                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <div className="min-w-0">
                                                                <span className="font-semibold block truncate">
                                                                    {perm.name}
                                                                </span>
                                                                <span className={`text-[10px] ${subColor} font-mono block truncate`}>
                                                                    {perm.slug}
                                                                </span>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className={`border-t ${dividerColor} pt-5 flex items-center justify-end gap-3`}>
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
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                                >
                                    {saving ? (t.saving || 'Saving...') : (t.save || 'Save Role')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
