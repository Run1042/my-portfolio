import React, { useState, useEffect } from 'react';
import {
    Star,
    Trash2,
    CheckCircle,
    Circle,
    X,
    Edit,
    Plus,
} from 'lucide-react';
import {
    getReviews,
    createReview,
    updateReview,
    toggleReviewPublish,
    deleteReview,
} from '../libs/api';

export default function ReviewsPage({ onNotify, theme = 'dark', locale = 'en' }) {
    const t = {
        en: {
            title: 'Client Reviews', add: 'Add Review', loading: 'Loading reviews...',
            noReviews: 'No reviews found.', edit: 'Edit Review',
            reviewerName: 'Reviewer Name', role: 'Role / Company (Optional)',
            rating: 'Rating (1-5)', sortOrder: 'Sort Order', publishStatus: 'Publish Status',
            published: 'Published', hidden: 'Hidden', message: 'Review Message',
            save: 'Save Review', deleteConfirm: 'Delete review from',
            successUpdate: 'Review updated.', successCreate: 'Review created.',
            successDel: 'Review deleted.', errLoad: 'Failed to load reviews.',
            errSave: 'Failed to save review.', errStatus: 'Failed to update status.',
            errDel: 'Failed to delete review.', unpublish: 'Unpublish', publish: 'Publish',
            editBtn: 'Edit', deleteBtn: 'Delete'
        },
        kh: {
            title: 'មតិយោបល់អតិថិជន', add: 'បន្ថែមមតិយោបល់', loading: 'កំពុងទាញទិន្នន័យ...',
            noReviews: 'មិនមានមតិយោបល់ទេ។', edit: 'កែប្រែមតិយោបល់',
            reviewerName: 'ឈ្មោះអ្នកបញ្ចេញមតិ', role: 'តួនាទី / ក្រុមហ៊ុន (មិនចាំបាច់)',
            rating: 'ចំណាត់ថ្នាក់ (1-5)', sortOrder: 'លំដាប់បង្ហាញ', publishStatus: 'ស្ថានភាពបង្ហាញ',
            published: 'បង្ហាញ', hidden: 'លាក់', message: 'មាតិកាមតិយោបល់',
            save: 'រក្សាទុកមតិយោបល់', deleteConfirm: 'តើអ្នកប្រាកដជាចង់លុបមតិយោបល់ពី',
            successUpdate: 'មតិយោបល់ត្រូវបានកែប្រែ។', successCreate: 'មតិយោបល់ត្រូវបានបង្កើត។',
            successDel: 'មតិយោបល់ត្រូវបានលុប។', errLoad: 'មិនអាចទាញយកមតិយោបល់បានទេ។',
            errSave: 'មិនអាចរក្សាទុកមតិយោបល់បានទេ។', errStatus: 'មិនអាចផ្លាស់ប្តូរស្ថានភាពបានទេ។',
            errDel: 'មិនអាចលុបមតិយោបល់បានទេ។', unpublish: 'ឈប់បង្ហាញ', publish: 'បង្ហាញ',
            editBtn: 'កែប្រែ', deleteBtn: 'លុប'
        }
    }[locale] || {};
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeReview, setActiveReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const isDark = theme === 'dark';
    const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-sm';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const dividerColor = isDark ? 'divide-slate-800/80' : 'divide-slate-100';
    const rowHover = isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/80';
    const modalBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';
    const inputBg = isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500';

    const fetchReviewsList = async () => {
        setLoading(true);
        try {
            const data = await getReviews();
            setReviews(data || []);
        } catch (e) {
            onNotify('error', t.errLoad || 'Failed to load reviews.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviewsList();
    }, []);

    const handleSaveReview = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            role: formData.get('role'),
            rating: parseInt(formData.get('rating'), 10),
            message: formData.get('message'),
            is_published: formData.get('is_published') === 'true',
            sort_order: parseInt(formData.get('sort_order') || '0', 10),
        };

        try {
            if (activeReview?.id) {
                await updateReview(activeReview.id, data);
                onNotify('success', t.successUpdate || 'Review updated.');
            } else {
                await createReview(data);
                onNotify('success', t.successCreate || 'Review created.');
            }
            setActiveReview(null);
            setIsEditing(false);
            fetchReviewsList();
        } catch (err) {
            onNotify('error', t.errSave || 'Failed to save review.');
        }
    };

    const handleTogglePublish = async (review, e) => {
        if (e) e.stopPropagation();
        try {
            await toggleReviewPublish(review.id);
            onNotify('success', t.successUpdate || 'Review status updated.');
            fetchReviewsList();
        } catch (err) {
            onNotify('error', t.errStatus || 'Failed to update status.');
        }
    };

    const handleDelete = async (review, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm(`${t.deleteConfirm || 'Delete review from'} "${review.name}"?`)) return;

        try {
            await deleteReview(review.id);
            onNotify('success', t.successDel || 'Review deleted.');
            fetchReviewsList();
        } catch (err) {
            onNotify('error', t.errDel || 'Failed to delete review.');
        }
    };

    const openCreateModal = () => {
        setActiveReview({ rating: 5, is_published: true, sort_order: 0 });
        setIsEditing(true);
    };

    const openEditModal = (review, e) => {
        if (e) e.stopPropagation();
        setActiveReview(review);
        setIsEditing(true);
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${titleColor}`}>{t.title || 'Client Reviews'}</h2>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t.add || 'Add Review'}</span>
                </button>
            </div>

            {/* Reviews List */}
            <div className={`${cardBg} border rounded-2xl overflow-hidden transition duration-150`}>
                {loading ? (
                    <div className={`py-20 text-center text-xs ${subColor}`}>
                        {t.loading || 'Loading reviews...'}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className={`py-20 text-center text-sm ${subColor}`}>
                        {t.noReviews || 'No reviews found.'}
                    </div>
                ) : (
                    <div className={`divide-y ${dividerColor}`}>
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${rowHover} ${
                                    !review.is_published ? (isDark ? 'opacity-50' : 'bg-slate-50 opacity-60') : ''
                                }`}
                            >
                                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className={`text-sm font-bold ${titleColor}`}>
                                                {review.name}
                                            </span>
                                            <span className={`text-xs ${subColor}`}>
                                                {review.role}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            "{review.message}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                    <button
                                        onClick={(e) => handleTogglePublish(review, e)}
                                        className={`p-1.5 rounded-lg transition ${
                                            isDark
                                                ? 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800'
                                                : 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                                        }`}
                                        title={review.is_published ? (t.unpublish || 'Unpublish') : (t.publish || 'Publish')}
                                    >
                                        {review.is_published ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <Circle className="w-4 h-4" />
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={(e) => openEditModal(review, e)}
                                        className={`p-1.5 rounded-lg transition ${
                                            isDark
                                                ? 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800'
                                                : 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                                        }`}
                                        title={t.editBtn || "Edit"}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={(e) => handleDelete(review, e)}
                                        className={`p-1.5 rounded-lg transition ${
                                            isDark
                                                ? 'text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10'
                                                : 'text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50'
                                        }`}
                                        title={t.deleteBtn || "Delete"}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal (Create/Edit) */}
            {isEditing && activeReview && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        className={`${modalBg} border rounded-3xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold">
                                {activeReview.id ? (t.edit || 'Edit Review') : (t.add || 'Add Review')}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setActiveReview(null);
                                }}
                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveReview} className="space-y-4 text-sm">
                            <div>
                                <label className="block mb-1.5 font-medium">{t.reviewerName || 'Reviewer Name'}</label>
                                <input
                                    name="name"
                                    defaultValue={activeReview.name || ''}
                                    required
                                    className={`w-full px-3 py-2 border rounded-xl ${inputBg}`}
                                    placeholder="e.g. Sok Pisey"
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 font-medium">{t.role || 'Role / Company (Optional)'}</label>
                                <input
                                    name="role"
                                    defaultValue={activeReview.role || ''}
                                    className={`w-full px-3 py-2 border rounded-xl ${inputBg}`}
                                    placeholder="e.g. CEO, TechStart"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1.5 font-medium">{t.rating || 'Rating (1-5)'}</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        min="1"
                                        max="5"
                                        defaultValue={activeReview.rating || 5}
                                        required
                                        className={`w-full px-3 py-2 border rounded-xl ${inputBg}`}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1.5 font-medium">{t.sortOrder || 'Sort Order'}</label>
                                    <input
                                        type="number"
                                        name="sort_order"
                                        defaultValue={activeReview.sort_order || 0}
                                        className={`w-full px-3 py-2 border rounded-xl ${inputBg}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1.5 font-medium">{t.publishStatus || 'Publish Status'}</label>
                                <select
                                    name="is_published"
                                    defaultValue={activeReview.is_published ? 'true' : 'false'}
                                    className={`w-full px-3 py-2 border rounded-xl ${inputBg}`}
                                >
                                    <option value="true">{t.published || 'Published'}</option>
                                    <option value="false">{t.hidden || 'Hidden'}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1.5 font-medium">{t.message || 'Review Message'}</label>
                                <textarea
                                    name="message"
                                    defaultValue={activeReview.message || ''}
                                    required
                                    rows="4"
                                    className={`w-full px-3 py-2 border rounded-xl ${inputBg} resize-none`}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
                                >
                                    {t.save || 'Save Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
