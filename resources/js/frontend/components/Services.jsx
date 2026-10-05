import React, { useMemo } from 'react';
import { Layout, Server, Database, Smartphone, PenTool, BarChart, Code2, Terminal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Services({ skills = [] }) {
    const locale = window.__INITIAL_DATA__?.locale === 'km' ? 'kh' : (window.__INITIAL_DATA__?.locale || 'en');
    const globalT = window.__INITIAL_DATA__?.translations?.[window.__INITIAL_DATA__?.locale] || window.__INITIAL_DATA__?.translations?.en || {};
    const localT = {
        en: {
            title: 'Services',
            heading: 'What I do?',
            coreTech: 'Core technologies:',
            specialized: 'Specialized domain engineering.',
            tailored: 'Designing and deploying scalable, production-ready solutions tailored to modern product standards.',
            defaultTitles: {
                webDev: 'Web Development',
                backend: 'Backend & Cloud APIs',
                db: 'Database Architecture',
                mobile: 'Mobile & Responsive Apps',
                devops: 'DevOps & CI/CD Pipelines',
                uiux: 'UI/UX & Product Design'
            },
            defaultDescs: {
                webDev: 'Crafting responsive, high-performance web applications using modern full-stack architectures and scalable technologies.',
                backend: 'Engineering robust REST APIs, authentication systems, queue workers, and automated cloud workflows.',
                db: 'Designing optimized relational and document databases with high availability, caching, and data integrity.',
                mobile: 'Building mobile-first, adaptive user interfaces optimized for fluid user interactions across all screens.',
                devops: 'Containerization, automated deployment pipelines, monitoring, and production server optimization.',
                uiux: 'Designing intuitive design systems, micro-interactions, dark modes, and modern accessible user experiences.'
            }
        },
        kh: {
            title: 'សេវាកម្ម',
            heading: 'តើខ្ញុំធ្វើអ្វីខ្លះ?',
            coreTech: 'បច្ចេកវិទ្យាស្នូល៖',
            specialized: 'វិស្វកម្មផ្នែកជំនាញពិសេស។',
            tailored: 'រចនា និងដាក់ឲ្យដំណើរការដំណោះស្រាយដែលអាចពង្រីកបាន និងត្រៀមសម្រាប់ផលិតកម្មស្របតាមស្តង់ដារផលិតផលទំនើប។',
            defaultTitles: {
                webDev: 'ការអភិវឌ្ឍគេហទំព័រ (Web Development)',
                backend: 'Backend & Cloud APIs',
                db: 'ស្ថាបត្យកម្មមូលដ្ឋានទិន្នន័យ (Database)',
                mobile: 'កម្មវិធីទូរស័ព្ទ និងកម្មវិធីឆ្លើយតប',
                devops: 'DevOps & CI/CD Pipelines',
                uiux: 'ការរចនា UI/UX និងផលិតផល'
            },
            defaultDescs: {
                webDev: 'បង្កើតកម្មវិធីគេហទំព័រឆ្លើយតប និងមានដំណើរការខ្ពស់ដោយប្រើស្ថាបត្យកម្ម full-stack ទំនើប និងបច្ចេកវិទ្យាដែលអាចពង្រីកបាន។',
                backend: 'វិស្វកម្ម REST APIs ដ៏រឹងមាំ ប្រព័ន្ធផ្ទៀងផ្ទាត់ ដំណើរការជាជួរ និងលំហូរការងារ cloud ដោយស្វ័យប្រវត្តិ។',
                db: 'រចនាមូលដ្ឋានទិន្នន័យដែលបានធ្វើឲ្យប្រសើរឡើង ជាមួយនឹងលទ្ធភាពទទួលបានខ្ពស់ ឃ្លាំងសម្ងាត់ និងភាពត្រឹមត្រូវនៃទិន្នន័យ។',
                mobile: 'ការបង្កើតចំណុចប្រទាក់អ្នកប្រើប្រាស់ដែលសម្របខ្លួនបាន ត្រូវបានកែលម្អសម្រាប់អន្តរកម្មរលូននៅលើគ្រប់អេក្រង់។',
                devops: 'Containerization, លំហូរដាក់ឲ្យដំណើរការដោយស្វ័យប្រវត្តិ ការត្រួតពិនិត្យ និងការបង្កើនប្រសិទ្ធភាពម៉ាស៊ីនមេផលិតកម្ម។',
                uiux: 'រចនាប្រព័ន្ធរចនាដែលងាយយល់ អន្តរកម្មតូចៗ dark mode និងបទពិសោធន៍អ្នកប្រើប្រាស់ទំនើប។'
            }
        }
    }[locale] || {};
    const t = { ...localT, ...globalT };

    // If the database has empty skills, we can fallback to a default list of services for the design
    const defaultServices = [
        { title: t.defaultTitles?.webDev || 'Web Development', desc: t.defaultDescs?.webDev || 'Crafting responsive, high-performance web applications using modern full-stack architectures and scalable technologies.', icon: <Layout className="w-8 h-8" /> },
        { title: t.defaultTitles?.backend || 'Backend & Cloud APIs', desc: t.defaultDescs?.backend || 'Engineering robust REST APIs, authentication systems, queue workers, and automated cloud workflows.', icon: <Server className="w-8 h-8" /> },
        { title: t.defaultTitles?.db || 'Database Architecture', desc: t.defaultDescs?.db || 'Designing optimized relational and document databases with high availability, caching, and data integrity.', icon: <Database className="w-8 h-8" /> },
        { title: t.defaultTitles?.mobile || 'Mobile & Responsive Apps', desc: t.defaultDescs?.mobile || 'Building mobile-first, adaptive user interfaces optimized for fluid user interactions across all screens.', icon: <Smartphone className="w-8 h-8" /> },
        { title: t.defaultTitles?.devops || 'DevOps & CI/CD Pipelines', desc: t.defaultDescs?.devops || 'Containerization, automated deployment pipelines, monitoring, and production server optimization.', icon: <Terminal className="w-8 h-8" /> },
        { title: t.defaultTitles?.uiux || 'UI/UX & Product Design', desc: t.defaultDescs?.uiux || 'Designing intuitive design systems, micro-interactions, dark modes, and modern accessible user experiences.', icon: <PenTool className="w-8 h-8" /> },
    ];

    // Safely group skills by category regardless of input shape
    const categoryMap = useMemo(() => {
        if (!skills) return {};
        if (Array.isArray(skills)) {
            return skills.reduce((acc, skill) => {
                if (!skill) return acc;
                const cat = skill.category || 'General';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(skill);
                return acc;
            }, {});
        }
        if (typeof skills === 'object') {
            const map = {};
            for (const [key, val] of Object.entries(skills)) {
                if (Array.isArray(val)) {
                    map[key] = val;
                } else if (val && typeof val === 'object' && val.name) {
                    const cat = val.category || 'General';
                    if (!map[cat]) map[cat] = [];
                    map[cat].push(val);
                }
            }
            return map;
        }
        return {};
    }, [skills]);

    const categories = Object.keys(categoryMap);
    
    // Map existing skill categories to services if present, otherwise use defaults
    const servicesToRender = useMemo(() => {
        if (categories.length === 0) return defaultServices;

        const iconList = [
            <Layout className="w-8 h-8" key="layout" />, 
            <Server className="w-8 h-8" key="server" />, 
            <Database className="w-8 h-8" key="db" />, 
            <Terminal className="w-8 h-8" key="term" />,
            <Code2 className="w-8 h-8" key="code" />,
            <Sparkles className="w-8 h-8" key="spark" />
        ];

        return categories.map((category, idx) => {
            const items = categoryMap[category] || [];
            const skillNames = items.map(s => (typeof s === 'object' ? s.name : s)).filter(Boolean);
            const skillsSummary = skillNames.length > 0 
                ? `${t.coreTech || 'Core technologies:'} ${skillNames.slice(0, 4).join(', ')}.` 
                : (t.specialized || 'Specialized domain engineering.');

            return {
                title: category,
                desc: `${skillsSummary} ${t.tailored || 'Designing and deploying scalable, production-ready solutions tailored to modern product standards.'}`,
                icon: iconList[idx % iconList.length]
            };
        });
    }, [categoryMap, categories]);

    return (
        <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="text-sm font-bold text-[#8247e5] uppercase tracking-widest block mb-3">{t.title || 'Services'}</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {t.heading || 'What I do?'}
                </h2>
                <div className="w-24 h-1.5 bg-[#8247e5] mx-auto mt-6 rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesToRender.map((service, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        key={service.title || idx} 
                        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[24px] p-6 sm:p-8 flex flex-col items-start justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/60 dark:hover:shadow-black/50 hover:-translate-y-2 group"
                    >
                        <div>
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-[#8247e5] mb-5 group-hover:bg-[#8247e5] group-hover:text-white transition-colors duration-300 shadow-sm">
                                {service.icon}
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {service.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
