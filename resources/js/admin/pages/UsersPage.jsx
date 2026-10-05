import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Shield,
    Mail,
    Calendar,
    Edit2,
    Trash2,
    X,
    Check,
    Lock,
    Key,
    UserCheck,
    AlertCircle,
} from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../libs/api';

export default function UsersPage({ onNotify, currentUser: propCurrentUser, theme = 'dark', locale = 'en' }) {
    const t = {
        en: {
            title: 'User Accounts & Team', desc: 'Manage administrative users and assign system access roles',
            addBtn: 'Add New User', total: 'Total Users', configuredRoles: 'Configured Roles',
            activeSuper: 'Active Super Admins', searchPh: 'Search users by name or email...',
            allRoles: 'All Roles', loading: 'Loading user accounts...', noMatch: 'No user accounts match your search.',
            colUser: 'User', colEmail: 'Email Address', colRole: 'Assigned Role', colCreated: 'Created On', colActions: 'Actions',
            you: 'You', noRoleAssigned: 'No Role Assigned', editUser: 'Edit user', cantDel: 'Cannot delete yourself',
            delUser: 'Delete user', modalEditTitle: 'Edit User Account', modalCreateTitle: 'Create New User Account',
            name: 'Full Name', namePh: 'e.g. Sokha Chan', email: 'Email Address', emailPh: 'sokha@portfolio.test',
            pass: 'Password', passEdit: '(leave blank to keep unchanged)', passPhEdit: '••••••••', passPhCreate: 'Min 6 characters',
            roleLbl: 'Assigned System Role', cancel: 'Cancel', save: 'Save Changes', createAcc: 'Create Account',
            modalDelTitle: 'Delete User Account', delConfirm1: 'Are you sure you want to delete',
            delConfirm2: 'This action cannot be undone.', errReq: 'Name and email are required.',
            errPassReq: 'Password is required and must be at least 6 characters.',
            errPassLen: 'New password must be at least 6 characters.'
        },
        kh: {
            title: 'គណនីអ្នកប្រើប្រាស់ & ក្រុម', desc: 'គ្រប់គ្រងអ្នកប្រើប្រាស់ និងកំណត់សិទ្ធិចូលប្រើប្រព័ន្ធ',
            addBtn: 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី', total: 'អ្នកប្រើប្រាស់សរុប', configuredRoles: 'តួនាទីដែលបានកំណត់',
            activeSuper: 'អ្នកគ្រប់គ្រងកំពូលសកម្ម', searchPh: 'ស្វែងរកអ្នកប្រើប្រាស់តាមឈ្មោះ ឬអ៊ីមែល...',
            allRoles: 'តួនាទីទាំងអស់', loading: 'កំពុងទាញទិន្នន័យ...', noMatch: 'មិនមានគណនីអ្នកប្រើប្រាស់ដែលត្រូវនឹងការស្វែងរកទេ។',
            colUser: 'អ្នកប្រើប្រាស់', colEmail: 'អាសយដ្ឋានអ៊ីមែល', colRole: 'តួនាទី', colCreated: 'បង្កើតនៅ', colActions: 'សកម្មភាព',
            you: 'អ្នក', noRoleAssigned: 'មិនបានកំណត់តួនាទី', editUser: 'កែប្រែអ្នកប្រើប្រាស់', cantDel: 'មិនអាចលុបខ្លួនឯងបានទេ',
            delUser: 'លុបអ្នកប្រើប្រាស់', modalEditTitle: 'កែប្រែគណនីអ្នកប្រើប្រាស់', modalCreateTitle: 'បង្កើតគណនីថ្មី',
            name: 'ឈ្មោះពេញ', namePh: 'ឧ. សុខា ចាន់', email: 'អាសយដ្ឋានអ៊ីមែល', emailPh: 'sokha@portfolio.test',
            pass: 'ពាក្យសម្ងាត់', passEdit: '(ទុកចំហរបើមិនចង់ផ្លាស់ប្តូរ)', passPhEdit: '••••••••', passPhCreate: 'យ៉ាងតិច ៦ តួអក្សរ',
            roleLbl: 'កំណត់តួនាទី', cancel: 'បោះបង់', save: 'រក្សាទុក', createAcc: 'បង្កើតគណនី',
            modalDelTitle: 'លុបគណនីអ្នកប្រើប្រាស់', delConfirm1: 'តើអ្នកប្រាកដជាចង់លុប',
            delConfirm2: 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។', errReq: 'ឈ្មោះ និងអ៊ីមែលត្រូវបានទាមទារ។',
            errPassReq: 'ទាមទារពាក្យសម្ងាត់ និងមានយ៉ាងតិច ៦ តួអក្សរ។',
            errPassLen: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ។'
        }
    }[locale] || {};

    const currentUser = propCurrentUser || window.__ADMIN_USER__ || {};
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const isDark = theme === 'dark';
    const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/80 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputBg = isDark ? 'bg-slate-900/60 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400';
    const theadBg = isDark ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600';
    const dividerColor = isDark ? 'divide-slate-800/60' : 'divide-slate-100';
    const rowHover = isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80';
    const modalBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';

    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Delete state
    const [deletingUser, setDeletingUser] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data.users || []);
            setRoles(data.roles || []);
            if (data.roles?.length && !form.role) {
                setForm((prev) => ({ ...prev, role: data.roles[0].slug }));
            }
        } catch (e) {
            onNotify('error', 'Failed to load users list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const openCreateModal = () => {
        setEditingUser(null);
        setErrorMsg('');
        setForm({
            name: '',
            email: '',
            password: '',
            role: roles[0]?.slug || 'administrator',
        });
        setShowModal(true);
    };

    const openEditModal = (u) => {
        setEditingUser(u);
        setErrorMsg('');
        const userRole = u.roles?.[0]?.slug || (roles[0]?.slug || '');
        setForm({
            name: u.name || '',
            email: u.email || '',
            password: '',
            role: userRole,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setErrorMsg('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!form.name.trim() || !form.email.trim()) {
            setErrorMsg(t.errReq || 'Name and email are required.');
            return;
        }

        if (!editingUser && (!form.password || form.password.length < 6)) {
            setErrorMsg(t.errPassReq || 'Password is required and must be at least 6 characters.');
            return;
        }

        if (editingUser && form.password && form.password.length < 6) {
            setErrorMsg(t.errPassLen || 'New password must be at least 6 characters.');
            return;
        }

        setIsSaving(true);
        try {
            if (editingUser) {
                const payload = {
                    name: form.name,
                    email: form.email,
                    role: form.role,
                };
                if (form.password) {
                    payload.password = form.password;
                }
                const res = await updateUser(editingUser.id, payload);
                onNotify('success', `User "${form.name}" updated successfully!`);
                setUsers((prev) =>
                    prev.map((u) => (u.id === editingUser.id ? res.user : u))
                );
            } else {
                const res = await createUser(form);
                onNotify('success', `User "${form.name}" created successfully!`);
                setUsers((prev) => [res.user, ...prev]);
            }
            closeModal();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join(' ')
                    : 'Failed to save user account.';
            setErrorMsg(msg);
            onNotify('error', msg);
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingUser) return;
        setIsDeleting(true);
        try {
            await deleteUser(deletingUser.id);
            onNotify('success', `User "${deletingUser.name}" deleted.`);
            setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
            setDeletingUser(null);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete user.';
            onNotify('error', msg);
        } finally {
            setIsDeleting(false);
        }
    };

    // Filtered users
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const userRole = u.roles?.[0]?.slug || 'none';
        const matchesRole = filterRole === 'all' || userRole === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (slug) => {
        switch (slug) {
            case 'super-admin':
                return isDark
                    ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    : 'bg-purple-50 text-purple-700 border-purple-200';
            case 'administrator':
                return isDark
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'editor':
                return isDark
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    : 'bg-cyan-50 text-cyan-700 border-cyan-200';
            case 'viewer':
                return isDark
                    ? 'bg-slate-700/40 text-slate-300 border-slate-600/40'
                    : 'bg-slate-100 text-slate-700 border-slate-200';
            default:
                return isDark
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Bar / Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${titleColor}`}>
                        <Users className="w-5 h-5 text-indigo-500" />
                        <span>{t.title || 'User Accounts & Team'}</span>
                    </h2>
                    <p className={`text-xs mt-1 ${subColor}`}>
                        {t.desc || 'Manage administrative users and assign system access roles'}
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition duration-150"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>{t.addBtn || 'Add New User'}</span>
                </button>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`${cardBg} border rounded-xl p-4 flex items-center justify-between transition duration-150`}>
                    <div>
                        <span className={`text-xs font-medium ${subColor}`}>{t.total || 'Total Users'}</span>
                        <div className={`text-2xl font-bold mt-1 ${titleColor}`}>{users.length}</div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                        isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    }`}>
                        <Users className="w-5 h-5" />
                    </div>
                </div>

                <div className={`${cardBg} border rounded-xl p-4 flex items-center justify-between transition duration-150`}>
                    <div>
                        <span className={`text-xs font-medium ${subColor}`}>{t.configuredRoles || 'Configured Roles'}</span>
                        <div className={`text-2xl font-bold mt-1 ${titleColor}`}>{roles.length}</div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                        isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-600'
                    }`}>
                        <Shield className="w-5 h-5" />
                    </div>
                </div>

                <div className={`${cardBg} border rounded-xl p-4 flex items-center justify-between transition duration-150`}>
                    <div>
                        <span className={`text-xs font-medium ${subColor}`}>{t.activeSuper || 'Active Super Admins'}</span>
                        <div className={`text-2xl font-bold mt-1 ${titleColor}`}>
                            {users.filter((u) => u.roles?.some((r) => r.slug === 'super-admin')).length}
                        </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                        isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    }`}>
                        <UserCheck className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder={t.searchPh || "Search users by name or email..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 transition ${inputBg}`}
                    />
                </div>

                <div className="sm:w-56">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 transition ${inputBg}`}
                    >
                        <option value="all">{t.allRoles || 'All Roles'} ({users.length})</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.slug}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className={`${cardBg} border rounded-2xl overflow-hidden transition duration-150`}>
                {loading ? (
                    <div className={`py-16 text-center text-xs flex flex-col items-center justify-center gap-2 ${subColor}`}>
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>{t.loading || 'Loading user accounts...'}</span>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className={`py-16 text-center text-xs ${subColor}`}>
                        {t.noMatch || 'No user accounts match your search.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className={`border-b font-semibold uppercase tracking-wider ${theadBg}`}>
                                    <th className="py-3.5 px-6">{t.colUser || 'User'}</th>
                                    <th className="py-3.5 px-6">{t.colEmail || 'Email Address'}</th>
                                    <th className="py-3.5 px-6">{t.colRole || 'Assigned Role'}</th>
                                    <th className="py-3.5 px-6">{t.colCreated || 'Created On'}</th>
                                    <th className="py-3.5 px-6 text-right">{t.colActions || 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${dividerColor}`}>
                                {filteredUsers.map((u) => {
                                    const isSelf = currentUser?.id === u.id || currentUser?.email === u.email;
                                    const role = u.roles?.[0];
                                    const roleSlug = role?.slug || 'none';
                                    const roleName = role?.name || (t.noRoleAssigned || 'No Role Assigned');

                                    return (
                                        <tr
                                            key={u.id}
                                            className={`${rowHover} transition duration-150 group`}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0">
                                                        {(isSelf && (currentUser?.avatar_url || currentUser?.avatar)) || u.avatar_url || u.avatar ? (
                                                            <img
                                                                src={(isSelf && (currentUser?.avatar_url || currentUser?.avatar)) || u.avatar_url || u.avatar}
                                                                alt={u.name || 'User'}
                                                                className="w-full h-full object-cover rounded-full"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            u.name?.charAt(0).toUpperCase() || 'U'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className={`font-semibold flex items-center gap-2 ${titleColor}`}>
                                                            <span>{u.name}</span>
                                                            {isSelf && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                                                    {t.you || 'You'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 font-mono">
                                                            ID: #{u.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getRoleBadgeColor(
                                                        roleSlug
                                                    )}`}
                                                >
                                                    <Shield className="w-3 h-3" />
                                                    <span>{roleName}</span>
                                                </span>
                                            </td>
                                            <td className={`py-4 px-6 ${subColor}`}>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>
                                                        {u.created_at
                                                            ? new Date(u.created_at).toLocaleDateString('en-US', {
                                                                  year: 'numeric',
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                              })
                                                            : '—'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(u)}
                                                        title={t.editUser || "Edit user"}
                                                        className={`p-1.5 rounded-lg transition ${
                                                            isDark
                                                                ? 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10'
                                                                : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                                        }`}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => setDeletingUser(u)}
                                                        disabled={isSelf}
                                                        title={isSelf ? (t.cantDel || 'Cannot delete yourself') : (t.delUser || 'Delete user')}
                                                        className={`p-1.5 rounded-lg transition ${
                                                            isSelf
                                                                ? 'text-slate-400/40 cursor-not-allowed'
                                                                : isDark
                                                                ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                                                                : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                                        }`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className={`border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${modalBg}`}>
                        {/* Modal Header */}
                        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <h3 className={`text-sm font-bold flex items-center gap-2 ${titleColor}`}>
                                <Users className="w-4 h-4 text-indigo-500" />
                                <span>{editingUser ? (t.modalEditTitle || 'Edit User Account') : (t.modalCreateTitle || 'Create New User Account')}</span>
                            </h3>
                            <button
                                onClick={closeModal}
                                className={`p-1 rounded-lg transition ${
                                    isDark
                                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            {errorMsg && (
                                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {t.name || 'Full Name'} <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder={t.namePh || "e.g. Sokha Chan"}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 transition ${inputBg}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {t.email || 'Email Address'} <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder={t.emailPh || "sokha@portfolio.test"}
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 transition ${inputBg}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {t.pass || 'Password'} {editingUser ? (t.passEdit || '(leave blank to keep unchanged)') : <span className="text-rose-500">*</span>}
                                </label>
                                <div className="relative">
                                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        placeholder={editingUser ? (t.passPhEdit || '••••••••') : (t.passPhCreate || 'Min 6 characters')}
                                        required={!editingUser}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-indigo-500 transition ${inputBg}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {t.roleLbl || 'Assigned System Role'}
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {roles.map((r) => {
                                        const selected = form.role === r.slug;
                                        return (
                                            <button
                                                type="button"
                                                key={r.id}
                                                onClick={() => setForm({ ...form, role: r.slug })}
                                                className={`p-3 rounded-xl border text-left flex items-start justify-between transition ${
                                                    selected
                                                        ? isDark
                                                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                                            : 'bg-indigo-50 border-indigo-500 text-indigo-900'
                                                        : isDark
                                                        ? 'bg-slate-800/50 border-slate-700/70 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                                                }`}
                                            >
                                                <div>
                                                    <span className="text-xs font-bold block">{r.name}</span>
                                                    <span className={`text-[10px] leading-tight block mt-0.5 line-clamp-1 ${
                                                        selected
                                                            ? isDark ? 'text-indigo-300' : 'text-indigo-600'
                                                            : isDark ? 'text-slate-400' : 'text-slate-500'
                                                    }`}>
                                                        {r.slug}
                                                    </span>
                                                </div>
                                                {selected && <Check className="w-4 h-4 text-indigo-500 shrink-0 ml-1" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className={`pt-4 border-t flex items-center justify-end gap-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={`px-4 py-2 text-xs font-medium rounded-xl transition ${
                                        isDark
                                            ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {t.cancel || 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition"
                                >
                                    {isSaving && (
                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    <span>{editingUser ? (t.save || 'Save Changes') : (t.createAcc || 'Create Account')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingUser && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className={`border rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 ${modalBg}`}>
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h4 className={`text-sm font-bold ${titleColor}`}>{t.modalDelTitle || 'Delete User Account'}</h4>
                            <p className={`text-xs mt-1.5 leading-relaxed ${subColor}`}>
                                {t.delConfirm1 || 'Are you sure you want to delete'}{' '}
                                <span className={`font-semibold ${titleColor}`}>"{deletingUser.name}"</span>? {t.delConfirm2 || 'This action cannot be undone.'}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingUser(null)}
                                className={`px-4 py-2 text-xs font-medium rounded-xl transition ${
                                    isDark
                                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                {t.cancel || 'Cancel'}
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={confirmDelete}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-600/30 transition"
                            >
                                {isDeleting && (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                                <span>{t.delUser || 'Delete User'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
