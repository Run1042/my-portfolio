import React, { useState, useEffect } from 'react';
import {
    UserCircle2,
    Save,
    UploadCloud,
    CheckCheck,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { getAbout, updateAbout } from '../libs/api';

export default function AboutPage({ onNotify, theme = 'dark', locale = 'en' }) {
    const isDark = theme === 'dark';

    const t = {
        en: {
            loading: 'Loading About Data...',
            title: 'About Page Configuration',
            desc: 'Customize your about section image and detailed story.',
            saving: 'Saving...',
            saved: 'Saved!',
            saveChanges: 'Save Changes',
            sectionImage: 'About Section Image',
            changeImage: 'Change About Image',
            removeImage: 'Remove Image',
            sectionContent: 'About Section Content',
            headline: 'About Section Title / Headline',
            story: 'Detailed Story / About Text',
            storyHint: 'This text appears in the "About Me" section on your frontend. Markdown is not supported yet, but line breaks will be preserved.',
            actionButtons: 'Action Buttons & Social Links',
            resumeLink: 'Resume / CV Download URL',
        },
        kh: {
            loading: 'កំពុងទាញទិន្នន័យ...',
            title: 'ការកំណត់ទំព័រ អំពីខ្ញុំ',
            desc: 'កែសម្រួលរូបភាព និងប្រវត្តិរូបសង្ខេបរបស់អ្នក។',
            saving: 'កំពុងរក្សាទុក...',
            saved: 'បានរក្សាទុក!',
            saveChanges: 'រក្សាទុក',
            sectionImage: 'រូបភាពផ្នែក អំពីខ្ញុំ',
            changeImage: 'ផ្លាស់ប្តូររូបភាព',
            removeImage: 'លុបរូបភាព',
            sectionContent: 'មាតិកាផ្នែក អំពីខ្ញុំ',
            headline: 'ចំណងជើងផ្នែក អំពីខ្ញុំ',
            story: 'ប្រវត្តិរូបសង្ខេប / អត្ថបទ អំពីខ្ញុំ',
            storyHint: 'អត្ថបទនេះនឹងបង្ហាញនៅលើទំព័រ "អំពីខ្ញុំ" របស់អ្នក។ វាអាចរក្សាបន្ទាត់ចុះក្រោមបានធម្មតា។',
            actionButtons: 'ប៊ូតុង និងតំណភ្ជាប់បណ្តាញសង្គម',
            resumeLink: 'តំណភ្ជាប់ទាញយក ប្រវត្តិរូបសង្ខេប (CV)',
        }
    }[locale] || {};

    const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-sm';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputBg = isDark
        ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20';

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    const [form, setForm] = useState({
        headline: '',
        about_text: '',
        about_image_url: '',
        resume_url: '',
        github_url: '',
        linkedin_url: '',
        website_url: '',
        email: '',
    });

    const [aboutImageFile, setAboutImageFile] = useState(null);
    const [aboutImagePreview, setAboutImagePreview] = useState('');

    const fetchAboutData = async () => {
        setLoading(true);
        try {
            const res = await getAbout();
            if (res && res.data) {
                setForm(prev => ({
                    ...prev,
                    headline: res.data.headline || '',
                    about_text: res.data.about_text || res.data.story || '',
                    about_image_url: res.data.about_image_url || '',
                    resume_url: res.data.resume_url || res.data.profile?.resume_url || '',
                    github_url: res.data.github_url || res.data.profile?.github_url || '',
                    linkedin_url: res.data.linkedin_url || res.data.profile?.linkedin_url || '',
                    website_url: res.data.website_url || res.data.profile?.website_url || '',
                    email: res.data.email || res.data.profile?.email || '',
                }));
                if (res.data.about_image_url) {
                    setAboutImagePreview(res.data.about_image_url);
                }
            }
        } catch (err) {
            console.error('Failed to load about profile:', err);
            if (onNotify) onNotify('error', 'Failed to load about profile data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAboutData();
    }, []);

    const handleAboutImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                if (onNotify) onNotify('error', 'Image size must be less than 5MB.');
                return;
            }
            setAboutImageFile(file);
            setAboutImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveAboutImage = () => {
        setAboutImageFile(null);
        setAboutImagePreview('');
        setForm((prev) => ({ ...prev, about_image_url: '' }));
        if (onNotify) onNotify('info', 'About Image cleared. Click "Save Changes" to apply.');
    };

    // Save changes
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('headline', form.headline);
            formData.append('about_text', form.about_text);
            formData.append('resume_url', form.resume_url);
            formData.append('github_url', form.github_url);
            formData.append('linkedin_url', form.linkedin_url);
            formData.append('website_url', form.website_url);
            formData.append('email', form.email);
            
            if (aboutImageFile) {
                formData.append('about_image', aboutImageFile);
            }

            const res = await updateAbout(formData);
            if (res && res.success) {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3000);
                if (onNotify) onNotify('success', 'About page updated successfully!');
                
                setForm(prev => ({ 
                    ...prev, 
                    about_image_url: res.data?.about?.about_image_url ?? res.data?.about_image_url ?? prev.about_image_url
                }));
                
                if (res.data?.about_image_url || res.data?.about?.about_image_url) {
                    setAboutImagePreview(res.data?.about?.about_image_url || res.data?.about_image_url);
                }
                
                setAboutImageFile(null);
            }
        } catch (err) {
            console.error('Failed to update about:', err);
            const msg = err.response?.data?.message || 'Error saving about details.';
            if (onNotify) onNotify('error', msg);
        } finally {
            setSaving(false);
        }
    };

    // Keyboard shortcut: Ctrl+S / Cmd+S
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [form, aboutImageFile]);

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className={`text-xs font-semibold uppercase tracking-wider ${subColor}`}>
                    {t.loading || 'Loading About Data...'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full pb-12">
            {/* Header with Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                            <UserCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${titleColor}`}>
                                {t.title || 'About Page Configuration'}
                            </h1>
                            <p className={`text-xs sm:text-sm ${subColor}`}>
                                {t.desc || 'Customize your about section image and detailed story.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition duration-150 ${
                            saving ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>{t.saving || 'Saving...'}</span>
                            </>
                        ) : savedSuccess ? (
                            <>
                                <CheckCheck className="w-4 h-4 text-emerald-300" />
                                <span>{t.saved || 'Saved!'}</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>{t.saveChanges || 'Save Changes'}</span>
                                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-indigo-700 text-[10px] font-mono opacity-80">
                                    Ctrl+S
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
                        <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                            {t.sectionImage || 'About Section Image'}
                        </h3>
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative group w-full">
                                <div className={`w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-indigo-500/40 flex items-center justify-center shadow-xl ${
                                    isDark ? 'bg-indigo-950/40' : 'bg-indigo-50/80'
                                }`}>
                                    <img
                                        src={aboutImagePreview || form.about_image_url || '/images/brooklyn.jpg'}
                                        alt="About preview"
                                        className={`w-full h-full object-cover ${!aboutImagePreview && !form.about_image_url ? 'opacity-80 grayscale' : ''}`}
                                    />
                                </div>
                                <label
                                    htmlFor="about-upload"
                                    className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition text-white text-xs font-bold gap-1"
                                >
                                    <UploadCloud className="w-5 h-5" />
                                    <span>{t.changeImage || 'Change About Image'}</span>
                                </label>
                                <input
                                    id="about-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAboutImageChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                {(aboutImagePreview || aboutImageFile) && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAboutImage}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition ${
                                            isDark
                                                ? 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
                                                : 'border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700'
                                        }`}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>{t.removeImage || 'Remove Image'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className={`p-6 rounded-2xl border space-y-5 ${cardBg}`}>
                        <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                            {t.sectionContent || 'About Section Content'}
                        </h3>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                {t.headline || 'About Section Title / Headline'}
                            </label>
                            <input
                                type="text"
                                value={form.headline || ''}
                                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                                placeholder="I am Professional User Experience Designer"
                                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition ${inputBg}`}
                            />
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                {t.story || 'Detailed Story / About Text'}
                            </label>
                            <p className={`text-[11px] mb-2 ${subColor} opacity-80`}>
                                {t.storyHint || 'This text appears in the "About Me" section on your frontend. Markdown is not supported yet, but line breaks will be preserved.'}
                            </p>
                            <textarea
                                value={form.about_text || ''}
                                onChange={(e) => setForm({ ...form, about_text: e.target.value })}
                                placeholder="Passionate about crafting elegant user experiences..."
                                rows={10}
                                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition resize-y ${inputBg} font-mono`}
                            />
                        </div>
                    </div>
                    
                    {/* Action Buttons & Social Links */}
                    <div className={`p-6 rounded-2xl border space-y-5 ${cardBg}`}>
                        <h3 className={`text-sm font-bold tracking-tight ${titleColor}`}>
                            {t.actionButtons || 'Action Buttons & Social Links'}
                        </h3>

                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold ${subColor}`}>
                                {t.resumeLink || 'Resume / CV Download URL'}
                            </label>
                            <input
                                type="text"
                                value={form.resume_url || ''}
                                onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
                                placeholder="/files/resume.pdf or Google Drive link"
                                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition ${inputBg}`}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/20">
                            <div className="space-y-1.5">
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    GitHub Profile URL
                                </label>
                                <input
                                    type="text"
                                    value={form.github_url || ''}
                                    onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    LinkedIn Profile URL
                                </label>
                                <input
                                    type="text"
                                    value={form.linkedin_url || ''}
                                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    Personal Website URL
                                </label>
                                <input
                                    type="text"
                                    value={form.website_url || ''}
                                    onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className={`block text-xs font-semibold ${subColor}`}>
                                    Email Address (Mailto link)
                                </label>
                                <input
                                    type="text"
                                    value={form.email || ''}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
