import React from 'react';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    target,
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ...props
}) {
    const base = 'inline-flex items-center justify-center font-bold rounded-xl transition duration-200 active:scale-[0.98] select-none';

    const variants = {
        primary: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35',
        secondary: 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80',
        outline: 'border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/10 hover:border-indigo-400',
        ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/60',
    };

    const sizes = {
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
        lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5',
    };

    const combinedClasses = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

    if (href) {
        return (
            <a href={href} target={target} className={combinedClasses} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses} {...props}>
            {children}
        </button>
    );
}
