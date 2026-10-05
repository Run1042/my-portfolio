import React, { useState, useId } from 'react';
import { TrendingUp, FolderGit2, Mail } from 'lucide-react';

export default function TrafficAreaChart({ initialData = [], theme = 'dark', locale = 'en' }) {
    const t = {
        en: {
            title: 'Activity — Last 14 Days',
            subtitle: 'Real projects & messages from database.',
            projects: 'Projects',
            messages: 'Messages',
            noActivity: 'No activity yet — add projects or receive messages to see data here.'
        },
        kh: {
            title: 'សកម្មភាព — ១៤ ថ្ងៃចុងក្រោយ',
            subtitle: 'គម្រោងពិត & សារពីមូលដ្ឋានទិន្នន័យ។',
            projects: 'គម្រោង',
            messages: 'សារ',
            noActivity: 'មិនទាន់មានសកម្មភាពទេ — បន្ថែមគម្រោង ឬទទួលសារដើម្បីមើលទិន្នន័យនៅទីនេះ។'
        }
    }[locale] || {};
    const isDark = theme === 'dark';
    const gradientIdProjects = useId();
    const gradientIdMessages = useId();
    const [hoverIndex, setHoverIndex] = useState(null);

    const activeData = initialData.length > 0 ? initialData : [];
    const totalProjects = activeData.reduce((a, d) => a + (d.projects || 0), 0);
    const totalMessages = activeData.reduce((a, d) => a + (d.messages || 0), 0);

    const width = 720;
    const height = 240;
    const padding = { top: 25, right: 25, bottom: 35, left: 35 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const maxVal = Math.max(...activeData.map((d) => Math.max(d.projects || 0, d.messages || 0)), 1) * 1.5;

    const getX = (i) => {
        if (activeData.length <= 1) return padding.left + chartW / 2;
        return padding.left + (i / (activeData.length - 1)) * chartW;
    };
    const getY = (val) => padding.top + chartH - (val / maxVal) * chartH;

    const pointsProjects = activeData.map((d, i) => ({ x: getX(i), y: getY(d.projects || 0) }));
    const pointsMessages = activeData.map((d, i) => ({ x: getX(i), y: getY(d.messages || 0) }));

    const generateSplinePath = (pts) => {
        if (!pts.length) return '';
        if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
        let path = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i === 0 ? 0 : i - 1];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2] || p2;
            const cp1x = p1.x + (p2.x - p0.x) / 5;
            const cp1y = p1.y + (p2.y - p0.y) / 5;
            const cp2x = p2.x - (p3.x - p1.x) / 5;
            const cp2y = p2.y - (p3.y - p1.y) / 5;
            path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
        }
        return path;
    };

    const strokeProjects = generateSplinePath(pointsProjects);
    const strokeMessages = generateSplinePath(pointsMessages);
    const areaProjects = pointsProjects.length
        ? `${strokeProjects} L ${pointsProjects[pointsProjects.length - 1].x} ${padding.top + chartH} L ${pointsProjects[0].x} ${padding.top + chartH} Z`
        : '';
    const areaMessages = pointsMessages.length
        ? `${strokeMessages} L ${pointsMessages[pointsMessages.length - 1].x} ${padding.top + chartH} L ${pointsMessages[0].x} ${padding.top + chartH} Z`
        : '';

    const activeItem = hoverIndex !== null ? activeData[hoverIndex] : null;
    const activePtP = hoverIndex !== null ? pointsProjects[hoverIndex] : null;
    const activePtM = hoverIndex !== null ? pointsMessages[hoverIndex] : null;

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * width;
        let closestIdx = 0, minDist = Infinity;
        pointsProjects.forEach((pt, idx) => {
            const dist = Math.abs(pt.x - mouseX);
            if (dist < minDist) { minDist = dist; closestIdx = idx; }
        });
        setHoverIndex(closestIdx);
    };

    const yTicksCount = 4;
    const yTicks = Array.from({ length: yTicksCount }, (_, i) => {
        const val = Math.round((maxVal / (yTicksCount - 1)) * i);
        return { val, y: getY(val) };
    });

    return (
        <div className={`p-5 sm:p-6 rounded-2xl border transition duration-150 ${
            isDark ? 'bg-slate-900/60 border-slate-800/80 shadow-xl' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
                isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}>
                <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                    </span>
                    <div>
                        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {t.title || 'Activity — Last 14 Days'}
                        </h3>
                        <p className="text-[11px] text-slate-500">{t.subtitle || 'Real projects & messages from database.'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-indigo-500 inline-block" />
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t.projects || 'Projects'}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{t.messages || 'Messages'}</span>
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 py-4">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${
                    isDark ? 'bg-indigo-500/8 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
                }`}>
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t.projects ? t.projects + ':' : 'Projects:'}</span>
                    <span className={`font-bold font-mono ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{totalProjects}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${
                    isDark ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                }`}>
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t.messages ? t.messages + ':' : 'Messages:'}</span>
                    <span className={`font-bold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{totalMessages}</span>
                </div>
            </div>

            {activeData.length === 0 ? (
                <div className={`flex items-center justify-center h-40 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.noActivity || 'No activity yet — add projects or receive messages to see data here.'}
                </div>
            ) : (
                <div className="relative w-full overflow-hidden cursor-crosshair select-none"
                    onMouseMove={handleMouseMove} onMouseLeave={() => setHoverIndex(null)}>
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52 sm:h-60" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id={gradientIdProjects} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={isDark ? '0.40' : '0.25'} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id={gradientIdMessages} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#34d399" stopOpacity={isDark ? '0.35' : '0.20'} />
                                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {yTicks.map((tick, i) => (
                            <g key={i}>
                                <line x1={padding.left} y1={tick.y} x2={width - padding.right} y2={tick.y}
                                    stroke={isDark ? 'rgba(51,65,85,0.4)' : 'rgba(226,232,240,0.9)'}
                                    strokeDasharray="4 4" strokeWidth="1" />
                                <text x={padding.left - 6} y={tick.y + 4} textAnchor="end"
                                    fontSize="10" fill={isDark ? '#64748b' : '#94a3b8'} fontFamily="monospace">
                                    {tick.val}
                                </text>
                            </g>
                        ))}

                        <path d={areaProjects} fill={`url(#${gradientIdProjects})`} />
                        <path d={areaMessages} fill={`url(#${gradientIdMessages})`} />
                        <path d={strokeProjects} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={strokeMessages} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                        {activeData.map((d, i) => (i % 2 === 0 || activeData.length <= 8) && (
                            <text key={i} x={getX(i)} y={height - 8} textAnchor="middle" fontSize="9.5"
                                fontWeight={hoverIndex === i ? 'bold' : 'normal'}
                                fill={hoverIndex === i ? '#6366f1' : isDark ? '#94a3b8' : '#64748b'}>
                                {d.date}
                            </text>
                        ))}

                        {hoverIndex !== null && activePtP && activePtM && (
                            <g>
                                <line x1={activePtP.x} y1={padding.top} x2={activePtP.x} y2={padding.top + chartH}
                                    stroke={isDark ? '#818cf8' : '#6366f1'} strokeWidth="1.5" strokeDasharray="3 3" />
                                <circle cx={activePtP.x} cy={activePtP.y} r="6" fill="#6366f1"
                                    stroke={isDark ? '#0f172a' : '#fff'} strokeWidth="2.5" />
                                <circle cx={activePtP.x} cy={activePtP.y} r="10" fill="#6366f1" opacity="0.2" />
                                <circle cx={activePtM.x} cy={activePtM.y} r="5.5" fill="#34d399"
                                    stroke={isDark ? '#0f172a' : '#fff'} strokeWidth="2.5" />
                                <circle cx={activePtM.x} cy={activePtM.y} r="9" fill="#34d399" opacity="0.2" />
                            </g>
                        )}
                    </svg>

                    {hoverIndex !== null && activeItem && activePtP && (
                        <div className={`absolute pointer-events-none z-20 px-3.5 py-2.5 rounded-xl border shadow-xl backdrop-blur-md text-xs ${
                            isDark ? 'bg-slate-950/90 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
                        }`} style={{
                            left: `${(activePtP.x / width) * 100}%`,
                            top: '10%',
                            transform: activePtP.x > width * 0.7 ? 'translate(-105%, 0)' : 'translate(10%, 0)',
                        }}>
                            <div className={`font-bold pb-1 mb-1 border-b text-indigo-500 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                                {activeItem.date}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="flex items-center gap-1.5 text-slate-500">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500" />{t.projects ? t.projects + ':' : 'Projects:'}
                                    </span>
                                    <span className="font-mono font-bold">{activeItem.projects ?? 0}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="flex items-center gap-1.5 text-slate-500">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />{t.messages ? t.messages + ':' : 'Messages:'}
                                    </span>
                                    <span className="font-mono font-bold">{activeItem.messages ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
