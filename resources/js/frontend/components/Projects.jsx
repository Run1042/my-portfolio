import React, { useState, useEffect } from 'react';
import { ExternalLink, Search, Layers, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { GithubIcon } from '../ui/Icons';
import ProjectModal from './ProjectModal';

export default function Projects({ initialProjects = [] }) {
    const [projects, setProjects] = useState(initialProjects);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeProject, setActiveProject] = useState(null);

    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);

    const locale = window.__INITIAL_DATA__?.locale === 'km' ? 'kh' : (window.__INITIAL_DATA__?.locale || 'en');
    const globalT = window.__INITIAL_DATA__?.translations?.[window.__INITIAL_DATA__?.locale] || window.__INITIAL_DATA__?.translations?.en || {};
    const localT = {
        en: {
            portfolio: 'Portfolio',
            featuredProjects: 'Featured Projects',
            all: 'All',
            noMatch: 'No matching projects found.',
            addProject: 'Add Project in Admin',
            viewDetails: 'View Details'
        },
        kh: {
            portfolio: 'ផលប័ត្រ (Portfolio)',
            featuredProjects: 'គម្រោងលេចធ្លោ',
            all: 'ទាំងអស់',
            noMatch: 'រកមិនឃើញគម្រោងដែលត្រូវគ្នាទេ។',
            addProject: 'បន្ថែមគម្រោងក្នុងផ្នែកគ្រប់គ្រង',
            viewDetails: 'មើលព័ត៌មានលម្អិត'
        }
    }[locale] || {};
    const t = { ...localT, ...globalT };

    // Extract categories
    const categories = [t.all || 'All', ...new Set(projects.map(p => p.category).filter(Boolean))];

    // Filter projects
    const filteredProjects = projects.filter(project => {
        const matchesCategory = selectedCategory === (t.all || 'All') || project.category === selectedCategory;
        const matchesSearch = !searchQuery ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (project.tags && project.tags.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="text-sm font-bold text-[#8247e5] uppercase tracking-widest block mb-3">{t.portfolio || 'Portfolio'}</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {t.featuredProjects || 'Featured Projects'}
                </h2>
                <div className="w-24 h-1.5 bg-[#8247e5] mx-auto mt-6 rounded-full"></div>
            </motion.div>

            {/* Filter & Search Bar */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12"
            >
                {/* Category Pills */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 w-full sm:w-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition duration-200 shadow-sm ${
                                selectedCategory === cat
                                    ? 'bg-[#8247e5] text-white shadow-purple-500/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm">
                    <p className="text-gray-500 mb-6 font-medium">{t.noMatch || 'No matching projects found.'}</p>
                    <a
                        href="/admin/projects/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#8247e5] hover:bg-[#7034d6] text-white font-semibold rounded-xl transition shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        <span>{t.addProject || 'Add Project in Admin'}</span>
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            key={project.id}
                            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[20px] overflow-hidden flex flex-col group transition duration-300 hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-black/50 hover:-translate-y-1"
                        >
                            {/* Card Image */}
                            <div
                                className="relative h-48 sm:h-60 bg-gray-50 overflow-hidden cursor-pointer"
                                onClick={() => setActiveProject(project)}
                            >
                                {project.image_url ? (
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-mono text-2xl">
                                        &lt;Project Image /&gt;
                                    </div>
                                )}

                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 sm:p-6 flex-1 flex flex-col">
                                <h3
                                    onClick={() => setActiveProject(project)}
                                    className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#8247e5] dark:group-hover:text-purple-400 transition cursor-pointer mb-3"
                                >
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-2">
                                    {project.description}
                                </p>

                                {/* Card Footer Links */}
                                <div className="mt-auto pt-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between font-semibold">
                                    <button
                                        onClick={() => setActiveProject(project)}
                                        className="text-[#8247e5] hover:text-[#7034d6] transition text-sm flex items-center gap-1 group/btn"
                                    >
                                        <span>{t.viewDetails || 'View Details'}</span>
                                        <ExternalLink className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {activeProject && (
                <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
            )}
        </section>
    );
}
