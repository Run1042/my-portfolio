import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck, Code2, Sun, Moon, Globe } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar({ profile }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });
    const [lang, setLang] = useState('en');

    // Toggle Dark Mode
    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const locale = window.__INITIAL_DATA__?.locale || 'en';
    const t = window.__INITIAL_DATA__?.translations?.[locale] || window.__INITIAL_DATA__?.translations?.en || {};

    const navItems = [
        { label: t.home || 'Home', href: '#home' },
        { label: t.about || 'About', href: '#about' },
        { label: t.projects || 'Portfolio', href: '#projects' },
        { label: t.services || 'Services', href: '#services' },
        { label: t.skills || 'Skills', href: '#skills' },
        { label: t.contact || 'Contact', href: '#contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Scroll spy
            const sections = navItems.map(item => item.href.substring(1));
            let current = 'home';
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If the top of the section is at or above the middle of the viewport, 
                    // and the bottom is below the middle of the viewport
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        current = section;
                    }
                }
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        // Call once on mount to set initial state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 py-4 shadow-sm' : 'bg-transparent py-6'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Brand */}
                <a href="#" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-[#8247e5] flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition duration-200">
                        {profile?.name ? profile.name.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div>
                        <span className="font-bold text-gray-900 dark:text-white tracking-tight text-xl block leading-none transition-colors">
                            {profile?.name || 'Brooklyn'}
                        </span>
                    </div>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`transition-colors duration-150 px-4 py-2 rounded-xl text-[15px] font-bold ${
                                activeSection === item.href.substring(1)
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="hidden sm:flex items-center gap-2 lg:gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                        title="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                    
                    {/* Language Switch */}
                    <a
                        href={`/lang/${locale === 'en' ? 'km' : 'en'}`}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                        title="Change Language"
                    >
                        <Globe className="w-4 h-4" />
                        <span className="uppercase">{locale === 'en' ? 'km' : 'en'}</span>
                    </a>

                    <a
                        href="#contact"
                        className="bg-[#8247e5] hover:bg-[#7034d6] text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-purple-500/20 transition-all ml-2"
                    >
                        Contact
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 px-6 py-6 space-y-4 shadow-xl">
                    <nav className="flex flex-col space-y-3">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-3 rounded-xl font-bold text-base transition duration-150 ${
                                    activeSection === item.href.substring(1)
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
                        <a href="#contact" onClick={() => setMobileOpen(false)} className="w-full text-center bg-[#8247e5] text-white px-6 py-3 rounded-lg font-semibold shadow-md">
                            Contact
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
