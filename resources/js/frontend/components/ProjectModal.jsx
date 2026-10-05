import React from 'react';
import { X, ExternalLink, Calendar, Tag } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { GithubIcon } from '../ui/Icons';

export default function ProjectModal({ project, onClose }) {
    if (!project) return null;

    const locale = window.__INITIAL_DATA__?.locale === 'km' ? 'kh' : (window.__INITIAL_DATA__?.locale || 'en');
    const globalT = window.__INITIAL_DATA__?.translations?.[window.__INITIAL_DATA__?.locale] || window.__INITIAL_DATA__?.translations?.en || {};
    const localT = {
        en: {
            techUsed: 'Technologies Used',
            launchLive: 'Launch Live App',
            repo: 'Repository',
            closePreview: 'Close Preview'
        },
        kh: {
            techUsed: 'បច្ចេកវិទ្យាដែលបានប្រើ',
            launchLive: 'បើកកម្មវិធីផ្ទាល់',
            repo: 'កូដ',
            closePreview: 'បិទការមើលជាមុន'
        }
    }[locale] || {};
    const t = { ...localT, ...globalT };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div
                className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Image */}
                <div className="relative h-64 bg-slate-950 overflow-hidden rounded-t-3xl">
                    {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-900 to-indigo-950/60 font-mono text-slate-600 text-3xl">
                            &lt;code /&gt;
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <Badge variant="indigo">{project.category}</Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
                    </div>

                    {project.content && (
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                            {project.content}
                        </div>
                    )}

                    {/* Tech Stack */}
                    {project.tags_list && project.tags_list.length > 0 && (
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                                {t.techUsed || 'Technologies Used'}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {project.tags_list.map((tag, idx) => (
                                    <span key={idx} className="text-xs px-3 py-1 bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 rounded-xl">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {project.demo_url && (
                                <Button variant="primary" size="md" href={project.demo_url} target="_blank">
                                    <span>{t.launchLive || 'Launch Live App'}</span>
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            )}
                            {project.github_url && (
                                <Button variant="secondary" size="md" href={project.github_url} target="_blank">
                                    <GithubIcon className="w-4 h-4" />
                                    <span>{t.repo || 'Repository'}</span>
                                </Button>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="text-xs font-semibold text-slate-400 hover:text-white transition"
                        >
                            {t.closePreview || 'Close Preview'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
