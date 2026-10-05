import React from 'react';

export default function Badge({ children, variant = 'indigo', className = '' }) {
    const variants = {
        indigo: 'bg-indigo-950/50 text-indigo-300 border-indigo-800/50',
        purple: 'bg-purple-950/50 text-purple-300 border-purple-800/50',
        emerald: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50',
        amber: 'bg-amber-950/50 text-amber-300 border-amber-800/50',
        slate: 'bg-slate-900/60 text-slate-300 border-slate-700/60',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium border backdrop-blur-sm ${variants[variant] || variants.indigo} ${className}`}>
            {children}
        </span>
    );
}
