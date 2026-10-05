import React from 'react';
import { FileText, Download, Globe, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

export default function About({ profile = {}, about = {} }) {
    const aboutImage = about?.about_image_url || profile?.avatar_url || profile?.avatar || '/images/brooklyn.jpg';
    const resumeUrl = profile?.resume_url || '#';
    const story = about?.story || about?.bio || profile?.bio ||
        'I design and develop services for customers specializing creating stylish, modern websites, web services and online stores. My passion is to design digital user experiences.';

    const paragraphs = story.split('\n\n').filter(Boolean);

    const locale = window.__INITIAL_DATA__?.locale === 'km' ? 'kh' : (window.__INITIAL_DATA__?.locale || 'en');
    const globalT = window.__INITIAL_DATA__?.translations?.[window.__INITIAL_DATA__?.locale] || window.__INITIAL_DATA__?.translations?.en || {};
    const localT = {
        en: {
            myProjects: 'My Projects',
            downloadCV: 'Download CV'
        },
        kh: {
            myProjects: 'គម្រោងរបស់ខ្ញុំ',
            downloadCV: 'ទាញយកប្រវត្តិរូប'
        }
    }[locale] || {};
    const t = { ...localT, ...globalT };

    return (
        <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="bg-white dark:bg-gray-800/50 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-5 sm:p-8 md:p-12 border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto"
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    
                    {/* Left Column: Portrait & Social Dock */}
                    <div className="md:col-span-5 flex flex-col items-center">
                        <div className="w-full relative">
                            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-[3/2] sm:aspect-[4/5] shadow-inner max-h-64 sm:max-h-none">
                                <img
                                    src={aboutImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bio & Content */}
                    <div className="md:col-span-7 mt-8 md:mt-0">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
                            {about?.headline || 'I am Professional User Experience Designer'}
                        </h2>
                        
                        <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed space-y-4 mb-7">
                            {paragraphs.map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))}
                            {paragraphs.length === 1 && (
                                <p>I design and develop services for customers specializing creating stylish, modern websites, web services.</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                            <a href="#projects" className="bg-[#8247e5] hover:bg-[#7034d6] text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-purple-500/25 transition-all inline-block">
                                {t.myProjects || 'My Projects'}
                            </a>
                            <a href={resumeUrl} target="_blank" rel="noreferrer" className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-8 py-3.5 rounded-xl font-semibold transition-all inline-flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                {t.downloadCV || 'Download CV'}
                            </a>
                            
                            {/* Social Icons */}
                            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700 h-8">
                                <a href={profile?.github_url || '#'} className="text-gray-400 hover:text-[#8247e5] transition" title="GitHub">
                                    <GithubIcon className="w-5 h-5" />
                                </a>
                                <a href={profile?.linkedin_url || '#'} className="text-gray-400 hover:text-[#8247e5] transition" title="LinkedIn">
                                    <LinkedinIcon className="w-5 h-5" />
                                </a>
                                <a href={profile?.website_url || '#'} className="text-gray-400 hover:text-[#8247e5] transition" title="Website">
                                    <Globe className="w-5 h-5" />
                                </a>
                                <a href={`mailto:${profile?.email || '#'}`} className="text-gray-400 hover:text-[#8247e5] transition" title="Email">
                                    <Mail className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}
