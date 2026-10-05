import axios from 'axios';

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrfToken || '',
    },
});

api.interceptors.request.use((config) => {
    const locale = localStorage.getItem('admin_locale') || 'en';
    config.headers['X-Locale'] = locale;
    return config;
});

export const getDashboard = async () => {
    const res = await api.get('/admin/api/dashboard');
    return res.data;
};

// About & Profile
export const getAbout = async () => {
    const res = await api.get('/admin/api/about');
    return res.data;
};

export const updateAbout = async (formData) => {
    const isFormData = formData instanceof FormData;
    const res = await api.post('/admin/api/about', formData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
};

// Projects
export const getProjects = async (params = {}) => {
    const res = await api.get('/admin/api/projects', { params });
    return res.data;
};

export const createProject = async (formData) => {
    const res = await api.post('/admin/api/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const updateProject = async (id, formData) => {
    // For PUT with files in Laravel, we can use POST with _method = PUT
    formData.append('_method', 'PUT');
    const res = await api.post(`/admin/api/projects/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const deleteProject = async (id) => {
    const res = await api.delete(`/admin/api/projects/${id}`);
    return res.data;
};

// Skills
export const getSkills = async () => {
    const res = await api.get('/admin/api/skills');
    return res.data;
};

export const createSkill = async (data) => {
    const isFormData = data instanceof FormData;
    const res = await api.post('/admin/api/skills', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
};

export const updateSkill = async (id, data) => {
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
        const res = await api.post(`/admin/api/skills/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    }
    const res = await api.put(`/admin/api/skills/${id}`, data);
    return res.data;
};

export const deleteSkill = async (id) => {
    const res = await api.delete(`/admin/api/skills/${id}`);
    return res.data;
};

// Messages
export const getMessages = async (params = {}) => {
    const res = await api.get('/admin/api/messages', { params });
    return res.data;
};

export const toggleMessageRead = async (id) => {
    const res = await api.patch(`/admin/api/messages/${id}/toggle-read`);
    return res.data;
};

export const deleteMessage = async (id) => {
    const res = await api.delete(`/admin/api/messages/${id}`);
    return res.data;
};

// Roles & Permissions
export const getRoles = async () => {
    const res = await api.get('/admin/api/roles');
    return res.data;
};

export const getPermissions = async () => {
    const res = await api.get('/admin/api/permissions');
    return res.data;
};

export const createRole = async (data) => {
    const res = await api.post('/admin/api/roles', data);
    return res.data;
};

export const updateRole = async (id, data) => {
    const res = await api.put(`/admin/api/roles/${id}`, data);
    return res.data;
};

export const deleteRole = async (id) => {
    const res = await api.delete(`/admin/api/roles/${id}`);
    return res.data;
};

// Users
export const getUsers = async () => {
    const res = await api.get('/admin/api/users');
    return res.data;
};

export const createUser = async (data) => {
    const res = await api.post('/admin/api/users', data);
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await api.put(`/admin/api/users/${id}`, data);
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await api.delete(`/admin/api/users/${id}`);
    return res.data;
};

export const adminLogout = async () => {
    const res = await api.post('/admin/api/logout');
    window.location.href = '/admin/login';
    return res.data;
};

// Settings & System
export const getSettings = async () => {
    const res = await api.get('/admin/api/settings');
    return res.data;
};

export const updateSettings = async (settings) => {
    const res = await api.post('/admin/api/settings', { settings });
    return res.data;
};

export const clearSystemCache = async () => {
    const res = await api.post('/admin/api/settings/clear-cache');
    return res.data;
};

export const exportPortfolioData = async () => {
    const res = await api.get('/admin/api/settings/export');
    return res.data;
};

// --- Reviews ---
export const getReviews = async () => {
    const res = await api.get('/admin/api/reviews');
    return res.data;
};
export const createReview = async (data) => {
    const res = await api.post('/admin/api/reviews', data);
    return res.data;
};
export const updateReview = async (id, data) => {
    const res = await api.put(`/admin/api/reviews/${id}`, data);
    return res.data;
};
export const toggleReviewPublish = async (id) => {
    const res = await api.patch(`/admin/api/reviews/${id}/toggle-publish`);
    return res.data;
};
export const deleteReview = async (id) => {
    const res = await api.delete(`/admin/api/reviews/${id}`);
    return res.data;
};

// Categories
export const getCategories = async (params = {}) => {
    const res = await api.get('/admin/api/categories', { params });
    return res.data;
};

export const createCategory = async (data) => {
    const res = await api.post('/admin/api/categories', data);
    return res.data;
};

export const updateCategory = async (id, data) => {
    const res = await api.put(`/admin/api/categories/${id}`, data);
    return res.data;
};

export const deleteCategory = async (id) => {
    const res = await api.delete(`/admin/api/categories/${id}`);
    return res.data;
};

export default api;
