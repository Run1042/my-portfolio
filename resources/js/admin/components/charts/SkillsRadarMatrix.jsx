import React from 'react';
import { Cpu, ArrowUpRight, Zap, Code2, Server, Terminal } from 'lucide-react';

const CATEGORY_ICONS = {
    'Frontend': Code2,
    'Backend': Server,
    'DevOps & Tools': Terminal,
};

const CATEGORY_COLORS = {
    'Frontend': {
        bar: 'from-indigo-500 to-cyan-400',
        badge: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        text: 'text-indigo-500',
    },
    'Backend': {
        bar: 'from-purple-500 to-indigo-500',
        badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        text: 'text-purple-500',
    },
    'DevOps & Tools': {
        bar: 'from-emerald-500 to-teal-400',
        badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        text: 'text-emerald-500',
    },
};

export default function SkillsRadarMatrix({ data = [], theme = 'dark', onViewSkills, locale = 'en' }) {
    const t = {
        en: {
            title: 'Tech Stack Competence',
            subtitle: 'Proficiency index across development domains',
            manageSkills: 'Manage Skills',
            skill: 'skill',
            skills: 'skills',
            totalActive: 'Total Active Skills:',
            industryStandard: 'Industry Standard'
        },
        kh: {
            title: 'កម្រិតសមត្ថភាពបច្ចេកវិទ្យា',
            subtitle: 'សន្ទស្សន៍ជំនាញតាមផ្នែកអភិវឌ្ឍន៍',
            manageSkills: 'គ្រប់គ្រងជំនាញ',
            skill: 'ជំនាញ',
            skills: 'ជំនាញ',
            totalActive: 'ជំនាញសកម្មសរុប៖',
            industryStandard: 'ស្តង់ដារឧស្សាហកម្ម'
        }
    }[locale] || {};
    const isDark = theme === 'dark';

    const items = data.length > 0 ? data : [
        { category: 'Frontend', count: 4, avg_proficiency: 92 },
        { category: 'Backend', count: 3, avg_proficiency: 88 },
        { category: 'DevOps & Tools', count: 2, avg_proficiency: 82 },
    ];

    const totalSkillsCount = items.reduce((acc, item) => acc + item.count, 0);

    return (
        <div className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between transition duration-150 ${
            isDark
                ? 'bg-slate-900/60 border-slate-800/80 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
            {/* Header */}
            <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center">
                            <Cpu className="w-4 h-4" />
                        </span>
                        <div>
                            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {t.title || 'Tech Stack Competence'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t.subtitle || 'Proficiency index across development domains'}
                            </p>
                        </div>
                    </div>

                    {onViewSkills && (
                        <button
                            onClick={onViewSkills}
                            className="p-1.5 text-slate-400 hover:text-cyan-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title={t.manageSkills || "Manage Skills"}
                        >
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Categories Stack */}
                <div className="space-y-4 py-5">
                    {items.map((cat) => {
                        const style = CATEGORY_COLORS[cat.category] || {
                            bar: 'from-indigo-500 to-purple-500',
                            badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                            text: 'text-indigo-400',
                        };
                        const IconComponent = CATEGORY_ICONS[cat.category] || Zap;
                        const proficiency = cat.avg_proficiency || 85;

                        return (
                            <div key={cat.category} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className={`p-1 rounded-md border ${style.badge}`}>
                                            <IconComponent className="w-3.5 h-3.5" />
                                        </span>
                                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            {cat.category}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-mono">
                                            ({cat.count} {cat.count === 1 ? (t.skill || 'skill') : (t.skills || 'skills')})
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 font-mono">
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                                            {proficiency}%
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Track */}
                                <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                                    isDark ? 'bg-slate-800/80' : 'bg-slate-100'
                                }`}>
                                    <div
                                        style={{ width: `${proficiency}%` }}
                                        className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-500 shadow-sm`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom summary */}
            <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
                <span>{t.totalActive || 'Total Active Skills:'} <strong className="font-mono text-cyan-500">{totalSkillsCount}</strong></span>
                <span className="text-[11px] font-mono text-emerald-500 font-semibold">&bull; {t.industryStandard || 'Industry Standard'}</span>
            </div>
        </div>
    );
}
