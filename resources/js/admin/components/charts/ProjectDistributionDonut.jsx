import React, { useState } from 'react';
import { PieChart, Layers, ArrowUpRight } from 'lucide-react';

const PALETTE = [
    { stroke: '#6366f1', fill: 'bg-indigo-500', text: 'text-indigo-500', name: 'Indigo' },
    { stroke: '#a855f7', fill: 'bg-purple-500', text: 'text-purple-500', name: 'Purple' },
    { stroke: '#06b6d4', fill: 'bg-cyan-500', text: 'text-cyan-500', name: 'Cyan' },
    { stroke: '#10b981', fill: 'bg-emerald-500', text: 'text-emerald-500', name: 'Emerald' },
    { stroke: '#f59e0b', fill: 'bg-amber-500', text: 'text-amber-500', name: 'Amber' },
    { stroke: '#ec4899', fill: 'bg-pink-500', text: 'text-pink-500', name: 'Pink' },
];

export default function ProjectDistributionDonut({ data = [], totalProjects = 0, theme = 'dark', onViewProjects, locale = 'en' }) {
    const t = {
        en: {
            title: 'Projects by Category',
            subtitle: 'Domain and technology distribution',
            manageProjects: 'Manage Projects',
            project: 'Project',
            projects: 'Projects',
            totalProjects: 'Total Projects'
        },
        kh: {
            title: 'គម្រោងតាមចំណាត់ថ្នាក់',
            subtitle: 'ការបែងចែកតាមផ្នែក និងបច្ចេកវិទ្យា',
            manageProjects: 'គ្រប់គ្រងគម្រោង',
            project: 'គម្រោង',
            projects: 'គម្រោង',
            totalProjects: 'គម្រោងសរុប'
        }
    }[locale] || {};
    const isDark = theme === 'dark';
    const [hoveredIdx, setHoveredIdx] = useState(null);

    // Fallback if data is empty
    const items = data.length > 0 ? data : [
        { category: 'Full-Stack Application', count: 1 },
        { category: 'AI & Automation', count: 1 },
        { category: 'Frontend & UI/UX', count: 1 },
    ];

    const sumCount = items.reduce((acc, item) => acc + item.count, 0) || totalProjects || 1;

    // SVG parameters
    const size = 220;
    const center = size / 2;
    const radius = 72;
    const strokeWidth = 26;
    const activeStrokeWidth = 32;
    const circumference = 2 * Math.PI * radius;

    // Build slices
    let currentOffset = 0;
    const slices = items.map((item, idx) => {
        const color = PALETTE[idx % PALETTE.length];
        const percentage = Math.round((item.count / sumCount) * 100);
        const strokeLength = (item.count / sumCount) * circumference;
        const offset = currentOffset;
        currentOffset += strokeLength;

        return {
            ...item,
            color,
            percentage,
            strokeLength,
            offset: -offset,
        };
    });

    const activeItem = hoveredIdx !== null ? slices[hoveredIdx] : null;

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
                        <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center">
                            <PieChart className="w-4 h-4" />
                        </span>
                        <div>
                            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {t.title || 'Projects by Category'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t.subtitle || 'Domain and technology distribution'}
                            </p>
                        </div>
                    </div>

                    {onViewProjects && (
                        <button
                            onClick={onViewProjects}
                            className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title={t.manageProjects || "Manage Projects"}
                        >
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Donut SVG container */}
                <div className="py-6 flex flex-col items-center justify-center relative">
                    <div className="relative w-56 h-56 flex items-center justify-center">
                        <svg
                            viewBox={`0 0 ${size} ${size}`}
                            className="w-full h-full -rotate-90 transform"
                        >
                            {/* Background track circle */}
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}
                                strokeWidth={strokeWidth}
                            />

                            {/* Donut segments */}
                            {slices.map((slice, idx) => {
                                const isHovered = hoveredIdx === idx;
                                return (
                                    <circle
                                        key={slice.category}
                                        cx={center}
                                        cy={center}
                                        r={radius}
                                        fill="none"
                                        stroke={slice.color.stroke}
                                        strokeWidth={isHovered ? activeStrokeWidth : strokeWidth}
                                        strokeDasharray={`${slice.strokeLength} ${circumference - slice.strokeLength}`}
                                        strokeDashoffset={slice.offset}
                                        strokeLinecap="round"
                                        className="transition-all duration-200 cursor-pointer"
                                        onMouseEnter={() => setHoveredIdx(idx)}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                        style={{
                                            filter: isHovered ? `drop-shadow(0 0 6px ${slice.color.stroke})` : 'none',
                                        }}
                                    />
                                );
                            })}
                        </svg>

                        {/* Center Information */}
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4"
                        >
                            {activeItem ? (
                                <div className="animate-in fade-in zoom-in-95 duration-150">
                                    <span className="text-2xl font-black font-mono" style={{ color: activeItem.color.stroke }}>
                                        {activeItem.percentage}%
                                    </span>
                                    <span className={`block text-xs font-semibold mt-0.5 truncate max-w-[110px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {activeItem.category}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-mono">
                                        {activeItem.count} {activeItem.count === 1 ? (t.project || 'Project') : (t.projects || 'Projects')}
                                    </span>
                                </div>
                            ) : (
                                <div>
                                    <span className={`text-3xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {sumCount}
                                    </span>
                                    <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                        {t.totalProjects || 'Total Projects'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Slices Legend List */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                {slices.map((slice, idx) => {
                    const isHovered = hoveredIdx === idx;
                    return (
                        <div
                            key={slice.category}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                                isHovered
                                    ? isDark ? 'bg-slate-800/60' : 'bg-slate-100'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                            }`}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: slice.color.stroke }}
                                />
                                <span className={`text-xs font-semibold truncate ${
                                    isHovered
                                        ? slice.color.text
                                        : isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                    {slice.category}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {slice.count}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono w-9 text-right">
                                    {slice.percentage}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
