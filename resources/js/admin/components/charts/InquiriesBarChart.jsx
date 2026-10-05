import React, { useState } from 'react';
import { Mail, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';

export default function InquiriesBarChart({ data = [], theme = 'dark', onViewMessages, locale = 'en' }) {
    const t = {
        en: {
            title: 'Client Inquiries Pipeline',
            subtitle: '6-month message volume & resolution rate',
            openInbox: 'Open Inbox',
            totalReceived: 'Total Received',
            inquiries: 'inquiries',
            responseRate: 'Response Rate',
            high: 'High',
            received: 'Received',
            responded: 'Responded',
            total: 'total',
            replied: 'replied',
            avgReplyTime: 'Average reply time: ~2 hours',
            months: {
                Jan: 'Jan', Feb: 'Feb', Mar: 'Mar', Apr: 'Apr', May: 'May', Jun: 'Jun',
                Jul: 'Jul', Aug: 'Aug', Sep: 'Sep', Oct: 'Oct', Nov: 'Nov', Dec: 'Dec'
            }
        },
        kh: {
            title: 'លំហូរសារទំនាក់ទំនងពីអតិថិជន',
            subtitle: 'បរិមាណសារ និងអត្រាដោះស្រាយក្នុងរយៈពេល ៦ខែ',
            openInbox: 'បើកប្រអប់សារ',
            totalReceived: 'ទទួលបានសរុប',
            inquiries: 'សារ',
            responseRate: 'អត្រាឆ្លើយតប',
            high: 'ខ្ពស់',
            received: 'ទទួលបាន',
            responded: 'បានឆ្លើយតប',
            total: 'សរុប',
            replied: 'បានឆ្លើយ',
            avgReplyTime: 'ពេលឆ្លើយតបជាមធ្យម៖ ~២ ម៉ោង',
            months: {
                Jan: 'មករា', Feb: 'កុម្ភៈ', Mar: 'មីនា', Apr: 'មេសា', May: 'ឧសភា', Jun: 'មិថុនា',
                Jul: 'កក្កដា', Aug: 'សីហា', Sep: 'កញ្ញា', Oct: 'តុលា', Nov: 'វិច្ឆិកា', Dec: 'ធ្នូ'
            }
        }
    }[locale] || {};
    const isDark = theme === 'dark';
    const [hoveredMonth, setHoveredMonth] = useState(null);

    // Fallback if data is empty
    const items = data.length > 0 ? data : [
        { month: 'Jan', year: '2026', total: 4, resolved: 3 },
        { month: 'Feb', year: '2026', total: 6, resolved: 5 },
        { month: 'Mar', year: '2026', total: 9, resolved: 7 },
        { month: 'Apr', year: '2026', total: 14, resolved: 12 },
        { month: 'May', year: '2026', total: 11, resolved: 9 },
        { month: 'Jun', year: '2026', total: 8, resolved: 7 },
    ];

    const maxVal = Math.max(...items.map((d) => d.total)) * 1.25 || 15;
    const totalAllInquiries = items.reduce((acc, d) => acc + d.total, 0);
    const totalResolved = items.reduce((acc, d) => acc + d.resolved, 0);
    const responseRate = totalAllInquiries > 0 ? Math.round((totalResolved / totalAllInquiries) * 100) : 100;

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
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                            <Mail className="w-4 h-4" />
                        </span>
                        <div>
                            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {t.title || 'Client Inquiries Pipeline'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t.subtitle || '6-month message volume & resolution rate'}
                            </p>
                        </div>
                    </div>

                    {onViewMessages && (
                        <button
                            onClick={onViewMessages}
                            className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title={t.openInbox || "Open Inbox"}
                        >
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Substats */}
                <div className="grid grid-cols-2 gap-3 py-4">
                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200/60'}`}>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                            {t.totalReceived || 'Total Received'}
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className={`text-xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {totalAllInquiries}
                            </span>
                            <span className="text-[11px] text-indigo-400 font-semibold">{t.inquiries || 'inquiries'}</span>
                        </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200/60'}`}>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                            {t.responseRate || 'Response Rate'}
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className={`text-xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {responseRate}%
                            </span>
                            <span className="text-[11px] text-emerald-500 font-semibold">{t.high || 'High'}</span>
                        </div>
                    </div>
                </div>

                {/* Bar Chart Bars */}
                <div className="py-2">
                    {/* Legend */}
                    <div className="flex items-center justify-end gap-4 text-xs pb-3 font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-2 rounded bg-indigo-500"></span>
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t.received || 'Received'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-2 rounded bg-emerald-500"></span>
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t.responded || 'Responded'}</span>
                        </div>
                    </div>

                    {/* Bars Container */}
                    <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-1">
                        {items.map((item, idx) => {
                            const totalHeightPct = Math.max(8, Math.round((item.total / maxVal) * 100));
                            const resolvedHeightPct = Math.max(6, Math.round((item.resolved / maxVal) * 100));
                            const isHovered = hoveredMonth === idx;

                            return (
                                <div
                                    key={item.month}
                                    onMouseEnter={() => setHoveredMonth(idx)}
                                    onMouseLeave={() => setHoveredMonth(null)}
                                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                                >
                                    {/* Tooltip on hover */}
                                    {isHovered && (
                                        <div
                                            className={`absolute -top-12 z-20 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono whitespace-nowrap shadow-lg ${
                                                isDark
                                                    ? 'bg-slate-950 border-slate-700 text-white'
                                                    : 'bg-white border-slate-200 text-slate-800 shadow-slate-200'
                                            }`}
                                        >
                                            <span className="text-indigo-500 font-bold">{item.total} {t.total || 'total'}</span> /{' '}
                                            <span className="text-emerald-500 font-bold">{item.resolved} {t.replied || 'replied'}</span>
                                        </div>
                                    )}

                                    {/* Background Track + Pair of Bars */}
                                    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-32 relative">
                                        {/* Total Bar */}
                                        <div
                                            style={{ height: `${totalHeightPct}%` }}
                                            className={`w-3 sm:w-4 rounded-t-md transition-all duration-200 ${
                                                isHovered
                                                    ? 'bg-indigo-400 shadow-md shadow-indigo-500/40'
                                                    : 'bg-indigo-600 dark:bg-indigo-500'
                                            }`}
                                        />

                                        {/* Resolved Bar */}
                                        <div
                                            style={{ height: `${resolvedHeightPct}%` }}
                                            className={`w-3 sm:w-4 rounded-t-md transition-all duration-200 ${
                                                isHovered
                                                    ? 'bg-emerald-400 shadow-md shadow-emerald-500/40'
                                                    : 'bg-emerald-600 dark:bg-emerald-500'
                                            }`}
                                        />
                                    </div>

                                    {/* Month Label */}
                                    <span className={`text-[11px] font-medium mt-2 transition ${
                                        isHovered
                                            ? 'text-indigo-500 font-bold'
                                            : isDark ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                        {t.months?.[item.month] || item.month}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Status */}
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
                isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t.avgReplyTime || 'Average reply time: ~2 hours'}</span>
                </div>
                <span className="font-mono text-indigo-500 font-semibold">100% SLA</span>
            </div>
        </div>
    );
}
