import React, { useState, useEffect } from 'react';
import {
    Sliders,
    Globe,
    Search,
    Mail,
    Palette,
    Server,
    Save,
    RotateCcw,
    Check,
    CheckCircle2,
    AlertTriangle,
    Trash2,
    Download,
    RefreshCw,
    Shield,
    ExternalLink,
    Code2,
    Cpu,
    Database,
    Clock,
    Lock,
    Eye,
    Sparkles,
    User,
    UploadCloud,
} from 'lucide-react';
import { getSettings, updateSettings, clearSystemCache, exportPortfolioData, getAbout, updateAbout } from '../libs/api';

export default function SettingsPage({ onNotify, theme = 'dark', locale = 'en' }) {
    const t = {
        en: {
            title: 'System Settings', desc: 'Configure site identity, search engine optimization, email routing, and system maintenance.',
            discard: 'Discard', saving: 'Saving...', saved: 'Saved Successfully', save: 'Save Changes',
            maintenanceMode: 'Maintenance Mode is Active', maintenanceMsg: 'Public visitors will see your custom maintenance advisory. Admin access remains fully functional.',
            tabGeneral: 'General & Identity', tabSeo: 'SEO & Metadata', tabContact: 'Contact & Inquiries',
            tabAppearance: 'Theme & Styling', tabSystem: 'System & Maintenance',
            loading: 'Loading system settings...', siteIdentity: 'Site Identification', siteTitle: 'Site Title (Browser Tab & SEO Title)',
            brandName: 'Brand Name / Logo Text', footerCopy: 'Footer Copyright', siteTagline: 'Site Tagline',
            avatar: 'Profile Photo / Avatar', avatarDesc: 'This avatar will be used globally across your site.',
            changeAvatar: 'Change Avatar', uploadAvatar: 'Upload Avatar', remove: 'Remove',
            avatarReq: 'JPG, PNG, or WebP (max 2MB)', maintenance: 'Maintenance Mode', maintenanceDesc: 'Temporarily disable public access while updating databases or performing major deployments.',
            maintenanceNotice: 'Maintenance Notice Message', brandPreview: 'Brand Preview', brandPreviewDesc: 'Here is how your brand badge and title appear in navigation bars across the portfolio:',
            seo: 'Search Engine Optimization', metaDesc: 'Meta Description', chars: 'chars', metaDescHint: 'Optimal length is 140–160 characters. This summary appears below your link in Google search results.',
            metaKeywords: 'Meta Keywords (Comma separated)', canonical: 'Canonical Base URL', analytics: 'Google Analytics Measurement ID',
            allowIndex: 'Allow Search Engine Indexing', allowIndexHint: 'Emit <meta name="robots" content="index, follow"> tag',
            serp: 'Google Search Result Preview', serpDesc: 'Live simulation of your portfolio ranking in search engine query results:',
            contactInquiries: 'Contact Inquiries & Anti-Spam', notifEmail: 'Notification Recipient Email', notifEmailHint: 'Inquiries submitted through the public website will route notifications to this address.',
            contactActive: 'Public Contact Form Active', contactActiveHint: 'Allow visitors to submit messages directly from the portfolio',
            honeypot: 'Honeypot Anti-Spam Shield', honeypotHint: 'Silently traps automated bot submissions without annoying user captchas',
            emailAlerts: 'Email Dispatch on New Message', emailAlertsHint: 'Forward instant copy of inquiries to your notification email',
            maxMsg: 'Max Message Length (Characters)', themeStyling: 'Theme & Visual Styling', defaultAccent: 'Default Palette Accent',
            adminLang: 'Default Admin Language', dateFormat: 'Date Display Format',
            systemArch: 'System Architecture & Specifications', phpEngine: 'PHP Engine', framework: 'Framework',
            dbEngine: 'Database Engine', env: 'Environment', serverOs: 'Server Operating System',
            cacheStore: 'Default Cache Store', timezone: 'Timezone', purgeCache: 'Purge System Cache',
            purgeDesc: 'Clears compiled blade templates, route definitions, and configuration caches. Useful immediately after updating configuration or environment files.',
            purging: 'Purging Cache...', clearCache: 'Clear All Application Caches',
            exportBackup: 'Export Portfolio Backup', exportDesc: 'Generates a complete, structured JSON export of all your data (Profile, About, Projects, Skills, and System Settings) for safekeeping or migration.',
            exporting: 'Exporting Data...', downloadBackup: 'Download JSON Backup', errImageSize: 'Image size must be less than 2MB.',
            errLoad: 'Failed to load system settings.', errSave: 'Error saving settings. Please verify inputs.',
            successSave: 'System settings saved successfully!', successCache: 'System cache cleared successfully!',
            errCache: 'Failed to clear system cache.', successExport: 'Portfolio backup downloaded successfully!',
            errExport: 'Failed to export portfolio backup.', confirmCache: 'Are you sure you want to clear all system, view, and config caches?',
            reverted: 'Changes reverted to last saved state.'
        },
        kh: {
            title: 'ការកំណត់ប្រព័ន្ធ', desc: 'កំណត់អត្តសញ្ញាណគេហទំព័រ SEO អ៊ីមែល និងការថែទាំប្រព័ន្ធ។',
            discard: 'បោះបង់ការផ្លាស់ប្តូរ', saving: 'កំពុងរក្សាទុក...', saved: 'រក្សាទុកបានជោគជ័យ', save: 'រក្សាទុក',
            maintenanceMode: 'មុខងារថែទាំកំពុងដំណើរការ', maintenanceMsg: 'អ្នកទស្សនានឹងឃើញសារថែទាំរបស់អ្នក។ សិទ្ធិអ្នកគ្រប់គ្រងនៅតែអាចប្រើបានធម្មតា។',
            tabGeneral: 'ទូទៅ & អត្តសញ្ញាណ', tabSeo: 'SEO & ទិន្នន័យ', tabContact: 'ទំនាក់ទំនង & ការសាកសួរ',
            tabAppearance: 'ស្បែក & រចនាប័ទ្ម', tabSystem: 'ប្រព័ន្ធ & ការថែទាំ',
            loading: 'កំពុងទាញទិន្នន័យកំណត់...', siteIdentity: 'អត្តសញ្ញាណគេហទំព័រ', siteTitle: 'ចំណងជើងគេហទំព័រ',
            brandName: 'ឈ្មោះម៉ាក / ឡូហ្គោ', footerCopy: 'រក្សាសិទ្ធិនៅផ្នែកខាងក្រោម', siteTagline: 'ពាក្យស្លោក',
            avatar: 'រូបថតប្រវត្តិរូប', avatarDesc: 'រូបតំណាងនេះនឹងត្រូវបានប្រើទូទាំងគេហទំព័រ។',
            changeAvatar: 'ប្តូររូបថត', uploadAvatar: 'បញ្ចូលរូបថត', remove: 'លុបចេញ',
            avatarReq: 'JPG, PNG, WebP (អតិបរមា 2MB)', maintenance: 'មុខងារថែទាំ', maintenanceDesc: 'បិទការចូលមើលជាបណ្តោះអាសន្នពេលកែប្រែប្រព័ន្ធធំៗ។',
            maintenanceNotice: 'សារជូនដំណឹងអំពីការថែទាំ', brandPreview: 'មើលមុនម៉ាកសញ្ញា', brandPreviewDesc: 'នេះជារបៀបដែលម៉ាករបស់អ្នកបង្ហាញនៅលើគេហទំព័រ៖',
            seo: 'Search Engine Optimization (SEO)', metaDesc: 'ការពិពណ៌នាសង្ខេប (Meta)', chars: 'តួអក្សរ', metaDescHint: 'ប្រវែងល្អបំផុតគឺ 140–160 តួអក្សរ។ នេះបង្ហាញនៅខាងក្រោមតំណរបស់អ្នកក្នុងលទ្ធផលស្វែងរក។',
            metaKeywords: 'ពាក្យគន្លឹះ (បំបែកដោយសញ្ញាក្បៀស)', canonical: 'Canonical Base URL', analytics: 'Google Analytics Measurement ID',
            allowIndex: 'អនុញ្ញាតឱ្យ Search Engine ស្វែងរក', allowIndexHint: 'ប្រើប្រាស់ <meta name="robots" content="index, follow">',
            serp: 'មើលមុនលទ្ធផល Google', serpDesc: 'ការបង្ហាញរូបរាងលើលទ្ធផលស្វែងរក៖',
            contactInquiries: 'ការទំនាក់ទំនង & ការពារសាររំខាន', notifEmail: 'អ៊ីមែលទទួលការជូនដំណឹង', notifEmailHint: 'សារដែលផ្ញើពីគេហទំព័រនឹងចូលទៅអ៊ីមែលនេះ។',
            contactActive: 'បើកទម្រង់ទំនាក់ទំនង', contactActiveHint: 'អនុញ្ញាតឲ្យអ្នកចូលមើលផ្ញើសារមកអ្នកដោយផ្ទាល់',
            honeypot: 'មុខងារ Honeypot (ប្រឆាំង Spam)', honeypotHint: 'ចាប់ Bot ស្វ័យប្រវត្តិដោយមិនរំខានអ្នកប្រើប្រាស់ពិតប្រាកដ',
            emailAlerts: 'ការជូនដំណឹងតាមអ៊ីមែល', emailAlertsHint: 'ផ្ញើសារបន្ទាន់ពេលមានអ្នកសាកសួរ',
            maxMsg: 'ប្រវែងអត្ថបទអតិបរមា', themeStyling: 'ស្បែក & រចនាប័ទ្ម', defaultAccent: 'ពណ៌គោល',
            adminLang: 'ភាសាអ្នកគ្រប់គ្រង', dateFormat: 'ទម្រង់កាលបរិច្ឆេទ',
            systemArch: 'រចនាសម្ព័ន្ធប្រព័ន្ធ', phpEngine: 'PHP Engine', framework: 'Framework',
            dbEngine: 'Database Engine', env: 'Environment', serverOs: 'ប្រព័ន្ធប្រតិបត្តិការ (OS)',
            cacheStore: 'Cache Store', timezone: 'ម៉ោងតំបន់', purgeCache: 'សម្អាត Cache',
            purgeDesc: 'លុប cache ដែលបានចងក្រងទុកដើម្បីឲ្យការកំណត់ថ្មីមានប្រសិទ្ធភាព។',
            purging: 'កំពុងសម្អាត...', clearCache: 'សម្អាត Cache ទាំងអស់',
            exportBackup: 'ទាញយកទិន្នន័យ (Backup)', exportDesc: 'ទាញយកទិន្នន័យទាំងអស់ជា JSON សម្រាប់ទុកជាឯកសារយោង។',
            exporting: 'កំពុងទាញយក...', downloadBackup: 'ទាញយក JSON', errImageSize: 'ទំហំរូបភាពត្រូវតូចជាង 2MB។',
            errLoad: 'មិនអាចទាញយកការកំណត់បានទេ។', errSave: 'មានបញ្ហាក្នុងការរក្សាទុក។ សូមពិនិត្យទិន្នន័យម្តងទៀត។',
            successSave: 'រក្សាទុកការកំណត់បានជោគជ័យ!', successCache: 'សម្អាត cache បានជោគជ័យ!',
            errCache: 'មិនអាចសម្អាត cache បានទេ។', successExport: 'ទាញយកទិន្នន័យបានជោគជ័យ!',
            errExport: 'មិនអាចទាញយកទិន្នន័យបានទេ។', confirmCache: 'តើអ្នកប្រាកដជាចង់សម្អាត Cache ទាំងអស់មែនទេ?',
            reverted: 'បានត្រឡប់ទៅទិន្នន័យចាស់វិញ។'
        }
    }[locale] || {};

    const isDark = theme === 'dark';

    const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-sm';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const inputBg = isDark
        ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20';
    const labelColor = isDark ? 'text-slate-300' : 'text-slate-700';
    const dividerColor = isDark ? 'border-slate-800/80' : 'border-slate-200';

    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clearingCache, setClearingCache] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [avatarChanged, setAvatarChanged] = useState(false);

    // Initial and current settings form
    const [form, setForm] = useState({
        site_title: '',
        site_tagline: '',
        brand_name: '',
        footer_copyright: '',
        maintenance_mode: false,
        maintenance_message: '',
        site_description: '',
        site_keywords: '',
        allow_search_indexing: true,
        canonical_url: '',
        google_analytics_id: '',
        og_image_url: '',
        notification_email: '',
        enable_email_alerts: true,
        enable_contact_form: true,
        enable_honeypot: true,
        max_message_length: 3000,
        default_theme: 'dark',
        accent_color: 'indigo',
        default_language: 'en',
        date_format: 'YYYY-MM-DD',
    });

    const [originalForm, setOriginalForm] = useState({});
    const [systemInfo, setSystemInfo] = useState({});

    // Load settings from backend API
    const loadSettings = async () => {
        setLoading(true);
        try {
            const res = await getSettings();
            if (res && res.settings) {
                setForm(res.settings);
                setOriginalForm(res.settings);
                setHasUnsavedChanges(false);
            }
            const aboutRes = await getAbout();
            if (aboutRes && aboutRes.data) {
                if (aboutRes.data.avatar_url) {
                    setAvatarPreview(aboutRes.data.avatar_url);
                }
            }
            if (res && res.system) {
                setSystemInfo(res.system);
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
            if (onNotify) onNotify('error', t.errLoad || 'Failed to load system settings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    // Handle input change
    const handleChange = (key, value) => {
        setForm(prev => {
            const next = { ...prev, [key]: value };
            setHasUnsavedChanges(JSON.stringify(next) !== JSON.stringify(originalForm));
            return next;
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                if (onNotify) onNotify('error', t.errImageSize || 'Image size must be less than 2MB.');
                return;
            }
            setAvatarFile(file);
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
            setAvatarChanged(true);
            setHasUnsavedChanges(true);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview('');
        setAvatarChanged(true);
        setHasUnsavedChanges(true);
    };

    // Save settings
    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const res = await updateSettings(form);
            if (avatarChanged) {
                const formData = new FormData();
                if (avatarFile) {
                    formData.append('avatar', avatarFile);
                } else {
                    formData.append('avatar', '');
                }
                const aboutRes = await updateAbout(formData);
                if (aboutRes.data && aboutRes.data.avatar_url) {
                    setAvatarPreview(aboutRes.data.avatar_url);
                }
                setAvatarFile(null);
                setAvatarChanged(false);
                
                // Optional: Trigger a global user update if window.__ADMIN_USER__ is used
                if (window.__ADMIN_USER__ && aboutRes.data?.avatar_url !== undefined) {
                    window.__ADMIN_USER__.avatar_url = aboutRes.data.avatar_url;
                }
            }

            if (res && res.success) {
                setOriginalForm(res.settings || form);
                setHasUnsavedChanges(false);
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3000);
                if (onNotify) onNotify('success', t.successSave || 'System settings saved successfully!');
            }
        } catch (err) {
            console.error('Failed to save settings:', err);
            if (onNotify) onNotify('error', t.errSave || 'Error saving settings. Please verify inputs.');
        } finally {
            setSaving(false);
        }
    };

    // Reset to last saved
    const handleReset = () => {
        setForm(originalForm);
        setHasUnsavedChanges(false);
        if (onNotify) onNotify('info', t.reverted || 'Changes reverted to last saved state.');
    };

    // Clear system cache
    const handleClearCache = async () => {
        if (!confirm(t.confirmCache || 'Are you sure you want to clear all system, view, and config caches?')) return;
        setClearingCache(true);
        try {
            const res = await clearSystemCache();
            if (res && res.success) {
                if (onNotify) onNotify('success', res.message || (t.successCache || 'System cache cleared successfully!'));
            }
        } catch (err) {
            console.error('Failed to clear cache:', err);
            if (onNotify) onNotify('error', t.errCache || 'Failed to clear system cache.');
        } finally {
            setClearingCache(false);
        }
    };

    // Export portfolio data
    const handleExportData = async () => {
        setExporting(true);
        try {
            const res = await exportPortfolioData();
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute('href', dataStr);
            downloadAnchor.setAttribute('download', `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();

            if (onNotify) onNotify('success', t.successExport || 'Portfolio backup downloaded successfully!');
        } catch (err) {
            console.error('Export error:', err);
            if (onNotify) onNotify('error', t.errExport || 'Failed to export portfolio backup.');
        } finally {
            setExporting(false);
        }
    };

    const tabs = [
        { id: 'general', label: t.tabGeneral || 'General & Identity', icon: Globe },
        { id: 'seo', label: t.tabSeo || 'SEO & Metadata', icon: Search },
        { id: 'contact', label: t.tabContact || 'Contact & Inquiries', icon: Mail },
        { id: 'appearance', label: t.tabAppearance || 'Theme & Styling', icon: Palette },
        { id: 'system', label: t.tabSystem || 'System & Maintenance', icon: Server },
    ];

    const accentOptions = [
        { id: 'indigo', label: 'Indigo (Primary)', bg: 'bg-indigo-600', ring: 'ring-indigo-500' },
        { id: 'purple', label: 'Purple / Violet', bg: 'bg-purple-600', ring: 'ring-purple-500' },
        { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-600', ring: 'ring-emerald-500' },
        { id: 'cyan', label: 'Cyan Blue', bg: 'bg-cyan-600', ring: 'ring-cyan-500' },
        { id: 'rose', label: 'Rose Accent', bg: 'bg-rose-600', ring: 'ring-rose-500' },
        { id: 'amber', label: 'Amber Gold', bg: 'bg-amber-600', ring: 'ring-amber-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                    <span className="text-sm font-medium text-slate-400">{t.loading || 'Loading system settings...'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 w-full pb-16">
            {/* Header with Title and Global Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${titleColor}`}>
                        {t.title || 'System Settings'}
                    </h1>
                    <p className={`text-sm mt-1 ${subColor}`}>
                        {t.desc || 'Configure site identity, search engine optimization, email routing, and system maintenance.'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {hasUnsavedChanges && (
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={saving}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
                                isDark
                                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{t.discard || 'Discard'}</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition flex items-center gap-2 ${
                            savedSuccess
                                ? 'bg-emerald-600 shadow-emerald-600/30'
                                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25 active:scale-95'
                        }`}
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>{t.saving || 'Saving...'}</span>
                            </>
                        ) : savedSuccess ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                <span>{t.saved || 'Saved Successfully'}</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                <span>{t.save || 'Save Changes'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Maintenance Mode Alert Banner (if active) */}
            {form.maintenance_mode && (
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3.5 animate-fade-in">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-amber-300">{t.maintenanceMode || 'Maintenance Mode is Active'}</h4>
                        <p className="text-xs text-amber-400/90 mt-0.5">
                            {t.maintenanceMsg || 'Public visitors will see your custom maintenance advisory. Admin access remains fully functional.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className={`flex items-center gap-2 border-b ${dividerColor} overflow-x-auto pb-px`}>
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition duration-150 ${
                                isActive
                                    ? 'border-indigo-500 text-indigo-500'
                                    : isDark
                                    ? 'border-transparent text-slate-400 hover:text-slate-200'
                                    : 'border-transparent text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab 1: General & Site Identity */}
            {activeTab === 'general' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className={`p-6 sm:p-8 rounded-2xl border ${cardBg} space-y-6`}>
                            <h3 className={`text-base font-bold ${titleColor} flex items-center gap-2`}>
                                <Globe className="w-4 h-4 text-indigo-400" />
                                <span>{t.siteIdentity || 'Site Identification'}</span>
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                        {t.siteTitle || 'Site Title (Browser Tab & SEO Title)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.site_title || ''}
                                        onChange={(e) => handleChange('site_title', e.target.value)}
                                        placeholder="Alex Rivera | Senior Full-Stack Engineer"
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                    />
                                    <span className="text-[11px] text-slate-500 mt-1 block">
                                        Primary title displayed in web browsers and search engine snippet headers.
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                            {t.brandName || 'Brand Name / Logo Text'}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.brand_name || ''}
                                            onChange={(e) => handleChange('brand_name', e.target.value)}
                                            placeholder="Alex.dev"
                                            className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                            {t.footerCopy || 'Footer Copyright'}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.footer_copyright || ''}
                                            onChange={(e) => handleChange('footer_copyright', e.target.value)}
                                            placeholder="Alex Rivera. All rights reserved."
                                            className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                        {t.siteTagline || 'Site Tagline'}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.site_tagline || ''}
                                        onChange={(e) => handleChange('site_tagline', e.target.value)}
                                        placeholder="Architecting high-scale web platforms with precision & craft"
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                    />
                                </div>

                                <div className="space-y-1.5 pt-4 border-t border-slate-200/20">
                                    <label className={`block text-sm font-semibold ${labelColor}`}>
                                        {t.avatar || 'Profile Photo / Avatar'}
                                    </label>
                                    <p className={`text-xs ${subColor} mb-3`}>
                                        {t.avatarDesc || 'This avatar will be used globally across your site.'}
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                                        <div className={`w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/40 flex items-center justify-center shadow-xl shrink-0 ${
                                            isDark ? 'bg-indigo-950/40' : 'bg-indigo-50/80'
                                        }`}>
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-8 h-8 text-indigo-500 opacity-70" />
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col gap-3 w-full">
                                            <div className="flex items-center gap-2">
                                                <label
                                                    htmlFor="settings-avatar-upload"
                                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition duration-150"
                                                >
                                                    <UploadCloud className="w-4 h-4" />
                                                    <span>{avatarPreview || avatarFile ? (t.changeAvatar || 'Change Avatar') : (t.uploadAvatar || 'Upload Avatar')}</span>
                                                </label>
                                                
                                                <input
                                                    id="settings-avatar-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />

                                                {(avatarPreview || avatarFile) && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveAvatar}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                                                            isDark
                                                                ? 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
                                                                : 'border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700'
                                                        }`}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span>{t.remove || 'Remove'}</span>
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {avatarFile ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono self-start">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span className="truncate max-w-[150px]">{avatarFile.name}</span>
                                                </div>
                                            ) : (
                                                <span className={`text-[11px] ${subColor}`}>
                                                    {t.avatarReq || 'JPG, PNG, or WebP (max 2MB)'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Maintenance Mode Box */}
                        <div className={`p-6 sm:p-8 rounded-2xl border ${cardBg} space-y-5`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`text-base font-bold ${titleColor} flex items-center gap-2`}>
                                        <Shield className="w-4 h-4 text-amber-400" />
                                        <span>{t.maintenance || 'Maintenance Mode'}</span>
                                    </h3>
                                    <p className={`text-xs mt-1 ${subColor}`}>
                                        {t.maintenanceDesc || 'Temporarily disable public access while updating databases or performing major deployments.'}
                                    </p>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(form.maintenance_mode)}
                                        onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            {form.maintenance_mode && (
                                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                                    <label className={`text-xs font-semibold block ${labelColor}`}>
                                        {t.maintenanceNotice || 'Maintenance Notice Message'}
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={form.maintenance_message || ''}
                                        onChange={(e) => handleChange('maintenance_message', e.target.value)}
                                        placeholder="Portfolio is undergoing scheduled enhancements. Please check back shortly."
                                        className={`w-full p-3 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Info Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
                            <h4 className={`text-sm font-bold ${titleColor} flex items-center gap-2`}>
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span>{t.brandPreview || 'Brand Preview'}</span>
                            </h4>
                            <p className={`text-xs ${subColor}`}>
                                {t.brandPreviewDesc || 'Here is how your brand badge and title appear in navigation bars across the portfolio:'}
                            </p>

                            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                                isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                    <Code2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className={`font-bold tracking-tight text-sm block leading-none ${titleColor}`}>
                                        {form.brand_name || 'Alex.dev'}
                                    </span>
                                    <span className={`text-[11px] font-medium ${subColor}`}>
                                        {form.site_tagline || 'Software Engineer'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: SEO & Metadata */}
            {activeTab === 'seo' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <div className={`p-6 sm:p-8 rounded-2xl border ${cardBg} space-y-6`}>
                            <h3 className={`text-base font-bold ${titleColor} flex items-center gap-2`}>
                                <Search className="w-4 h-4 text-indigo-400" />
                                <span>{t.seo || 'Search Engine Optimization'}</span>
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className={`text-xs font-semibold ${labelColor}`}>
                                            {t.metaDesc || 'Meta Description'}
                                        </label>
                                        <span className={`text-[11px] font-mono ${
                                            (form.site_description?.length || 0) > 160 ? 'text-amber-400' : 'text-slate-500'
                                        }`}>
                                            {form.site_description?.length || 0} / 160 {t.chars || 'chars'}
                                        </span>
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={form.site_description || ''}
                                        onChange={(e) => handleChange('site_description', e.target.value)}
                                        placeholder="Portfolio showcasing production-grade Laravel & React web applications..."
                                        className={`w-full p-3 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                    />
                                    <span className="text-[11px] text-slate-500 mt-1 block">
                                        {t.metaDescHint || 'Optimal length is 140–160 characters. This summary appears below your link in Google search results.'}
                                    </span>
                                </div>

                                <div>
                                    <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                        {t.metaKeywords || 'Meta Keywords (Comma separated)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.site_keywords || ''}
                                        onChange={(e) => handleChange('site_keywords', e.target.value)}
                                        placeholder="Laravel 12, React 19, PHP 8.2, PostgreSQL, Cloud"
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                            {t.canonical || 'Canonical Base URL'}
                                        </label>
                                        <input
                                            type="url"
                                            value={form.canonical_url || ''}
                                            onChange={(e) => handleChange('canonical_url', e.target.value)}
                                            placeholder="https://alexrivera.dev"
                                            className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                            {t.analytics || 'Google Analytics Measurement ID'}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.google_analytics_id || ''}
                                            onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                                            placeholder="G-XXXXXXXXXX"
                                            className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                                    <div>
                                        <span className={`text-xs font-semibold block ${labelColor}`}>
                                            {t.allowIndex || 'Allow Search Engine Indexing'}
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            {t.allowIndexHint || 'Emit <meta name="robots" content="index, follow"> tag'}
                                        </span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(form.allow_search_indexing)}
                                            onChange={(e) => handleChange('allow_search_indexing', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Google SERP Preview Card */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
                            <h4 className={`text-sm font-bold ${titleColor} flex items-center gap-2`}>
                                <Eye className="w-4 h-4 text-indigo-400" />
                                <span>{t.serp || 'Google Search Result Preview'}</span>
                            </h4>
                            <p className={`text-xs ${subColor}`}>
                                {t.serpDesc || 'Live simulation of your portfolio ranking in search engine query results:'}
                            </p>

                            <div className={`p-4 rounded-xl border space-y-1.5 font-sans ${
                                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                                <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white">
                                        A
                                    </div>
                                    <span className={`font-mono text-[11px] truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {form.canonical_url || 'https://alexrivera.dev'}
                                    </span>
                                </div>

                                <h5 className={`text-sm font-semibold hover:underline cursor-pointer truncate ${
                                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                                }`}>
                                    {form.site_title || 'Alex Rivera | Senior Full-Stack Engineer'}
                                </h5>

                                <p className={`text-xs leading-relaxed line-clamp-2 ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    {form.site_description || 'Portfolio showcasing production-grade Laravel & React web applications, scalable cloud APIs, and modern architecture.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: Contact & Inquiries */}
            {activeTab === 'contact' && (
                <div className="w-full space-y-6">
                    <div className={`p-6 sm:p-8 rounded-2xl border ${cardBg} space-y-6`}>
                        <h3 className={`text-base font-bold ${titleColor} flex items-center gap-2`}>
                            <Mail className="w-4 h-4 text-indigo-400" />
                            <span>{t.contactInquiries || 'Contact Inquiries & Anti-Spam'}</span>
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                    {t.notifEmail || 'Notification Recipient Email'}
                                </label>
                                <input
                                    type="email"
                                    value={form.notification_email || ''}
                                    onChange={(e) => handleChange('notification_email', e.target.value)}
                                    placeholder="alex.rivera@devmail.test"
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                />
                                <span className="text-[11px] text-slate-500 mt-1 block">
                                    {t.notifEmailHint || 'Inquiries submitted through the public website will route notifications to this address.'}
                                </span>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                                <div>
                                    <span className={`text-xs font-semibold block ${labelColor}`}>
                                        {t.contactActive || 'Public Contact Form Active'}
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        {t.contactActiveHint || 'Allow visitors to submit messages directly from the portfolio'}
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(form.enable_contact_form)}
                                        onChange={(e) => handleChange('enable_contact_form', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                                <div>
                                    <span className={`text-xs font-semibold block ${labelColor}`}>
                                        {t.honeypot || 'Honeypot Anti-Spam Shield'}
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        {t.honeypotHint || 'Silently traps automated bot submissions without annoying user captchas'}
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(form.enable_honeypot)}
                                        onChange={(e) => handleChange('enable_honeypot', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                                <div>
                                    <span className={`text-xs font-semibold block ${labelColor}`}>
                                        {t.emailAlerts || 'Email Dispatch on New Message'}
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        {t.emailAlertsHint || 'Forward instant copy of inquiries to your notification email'}
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(form.enable_email_alerts)}
                                        onChange={(e) => handleChange('enable_email_alerts', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="pt-2">
                                <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                    {t.maxMsg || 'Max Message Length (Characters)'}
                                </label>
                                <input
                                    type="number"
                                    min="200"
                                    max="10000"
                                    value={form.max_message_length || 3000}
                                    onChange={(e) => handleChange('max_message_length', parseInt(e.target.value, 10) || 3000)}
                                    className={`w-full sm:w-48 px-4 py-2 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 4: Theme & Styling */}
            {activeTab === 'appearance' && (
                <div className="w-full space-y-6">
                    <div className={`p-6 sm:p-8 rounded-2xl border ${cardBg} space-y-6`}>
                        <h3 className={`text-base font-bold ${titleColor} flex items-center gap-2`}>
                            <Palette className="w-4 h-4 text-indigo-400" />
                            <span>{t.themeStyling || 'Theme & Visual Styling'}</span>
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className={`text-xs font-semibold block mb-3 ${labelColor}`}>
                                    {t.defaultAccent || 'Default Palette Accent'}
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {accentOptions.map(opt => {
                                        const isSelected = form.accent_color === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => handleChange('accent_color', opt.id)}
                                                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition ${
                                                    isSelected
                                                        ? 'border-indigo-500 bg-indigo-500/10'
                                                        : isDark
                                                        ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                                                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                                                }`}
                                            >
                                                <span className={`w-4 h-4 rounded-full ${opt.bg} shrink-0`} />
                                                <span className={`text-xs font-semibold truncate ${
                                                    isSelected
                                                        ? 'text-indigo-500'
                                                        : isDark ? 'text-slate-200' : 'text-slate-700'
                                                }`}>
                                                    {opt.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
                                <div>
                                    <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                        {t.adminLang || 'Default Admin Language'}
                                    </label>
                                    <select
                                        value={form.default_language || 'en'}
                                        onChange={(e) => handleChange('default_language', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                    >
                                        <option value="en">English (US / UK)</option>
                                        <option value="kh">ភាសាខ្មែរ (Khmer)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`text-xs font-semibold block mb-1.5 ${labelColor}`}>
                                        {t.dateFormat || 'Date Display Format'}
                                    </label>
                                    <select
                                        value={form.date_format || 'YYYY-MM-DD'}
                                        onChange={(e) => handleChange('date_format', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition ${inputBg}`}
                                    >
                                        <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-02)</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY (02/10/2026)</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY (10/02/2026)</option>
                                        <option value="MMM D, YYYY">Oct 2, 2026</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 5: System & Maintenance */}
            {activeTab === 'system' && (
                <div className="space-y-6">
                    {/* Server Environment Card */}
                    <div className={`p-6 sm:p-8 rounded-2xl border ${cardBg} space-y-6`}>
                        <h3 className={`text-base font-bold ${titleColor} flex items-center gap-2`}>
                            <Server className="w-4 h-4 text-indigo-400" />
                            <span>{t.systemArch || 'System Architecture & Specifications'}</span>
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={`text-[11px] font-semibold block mb-1 ${subColor}`}>{t.phpEngine || 'PHP Engine'}</span>
                                <span className={`text-sm font-bold font-mono ${titleColor}`}>{systemInfo.php_version || '8.2+'}</span>
                            </div>

                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={`text-[11px] font-semibold block mb-1 ${subColor}`}>{t.framework || 'Framework'}</span>
                                <span className="text-sm font-bold text-indigo-500 font-mono">Laravel {systemInfo.laravel_version || '12'}</span>
                            </div>

                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={`text-[11px] font-semibold block mb-1 ${subColor}`}>{t.dbEngine || 'Database Engine'}</span>
                                <span className="text-sm font-bold text-emerald-500 font-mono uppercase">{systemInfo.database_driver || 'PostgreSQL'}</span>
                            </div>

                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={`text-[11px] font-semibold block mb-1 ${subColor}`}>{t.env || 'Environment'}</span>
                                <span className="text-sm font-bold text-purple-500 font-mono capitalize">{systemInfo.environment || 'production'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${isDark ? 'bg-slate-950/50 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={subColor}>{t.serverOs || 'Server Operating System'}</span>
                                <span className={`font-semibold font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{systemInfo.server_os || 'Windows'}</span>
                            </div>

                            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${isDark ? 'bg-slate-950/50 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={subColor}>{t.cacheStore || 'Default Cache Store'}</span>
                                <span className={`font-semibold font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{systemInfo.cache_driver || 'Database'}</span>
                            </div>

                            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${isDark ? 'bg-slate-950/50 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={subColor}>{t.timezone || 'Timezone'}</span>
                                <span className={`font-semibold font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{systemInfo.timezone || 'UTC'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Clear Cache Card */}
                        <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col justify-between space-y-4`}>
                            <div>
                                <h4 className={`text-sm font-bold ${titleColor} flex items-center gap-2`}>
                                    <Trash2 className="w-4 h-4 text-amber-400" />
                                    <span>{t.purgeCache || 'Purge System Cache'}</span>
                                </h4>
                                <p className={`text-xs mt-1.5 leading-relaxed ${subColor}`}>
                                    {t.purgeDesc || 'Clears compiled blade templates, route definitions, and configuration caches. Useful immediately after updating configuration or environment files.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleClearCache}
                                disabled={clearingCache}
                                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                                    isDark
                                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                                        : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                }`}
                            >
                                {clearingCache ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>{t.purging || 'Purging Cache...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>{t.clearCache || 'Clear All Application Caches'}</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Export Data Backup Card */}
                        <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col justify-between space-y-4`}>
                            <div>
                                <h4 className={`text-sm font-bold ${titleColor} flex items-center gap-2`}>
                                    <Download className="w-4 h-4 text-indigo-400" />
                                    <span>{t.exportBackup || 'Export Portfolio Backup'}</span>
                                </h4>
                                <p className={`text-xs mt-1.5 leading-relaxed ${subColor}`}>
                                    {t.exportDesc || 'Generates a complete, structured JSON export of all your data (Profile, About, Projects, Skills, and System Settings) for safekeeping or migration.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleExportData}
                                disabled={exporting}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                            >
                                {exporting ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>{t.exporting || 'Exporting Data...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-3.5 h-3.5" />
                                        <span>{t.downloadBackup || 'Download JSON Backup'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
