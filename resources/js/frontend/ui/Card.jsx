import React from 'react';

export default function Card({ children, className = '', hover = true, ...props }) {
    return (
        <div
            className={`bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl ${
                hover ? 'hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/5 transition duration-300' : ''
            } ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
