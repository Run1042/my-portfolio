import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ profile }) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const brandName = profile?.name ? `${profile.name}` : 'Brooklyn';
    const locale = window.__INITIAL_DATA__?.locale === 'km' ? 'kh' : (window.__INITIAL_DATA__?.locale || 'en');
    const globalT = window.__INITIAL_DATA__?.translations?.[window.__INITIAL_DATA__?.locale] || window.__INITIAL_DATA__?.translations?.en || {};
    const localT = {
        en: {
            allRights: 'All rights reserved.',
            builtWith: 'Built with Laravel 12 & React 19',
            backToTop: 'Back to top'
        },
        kh: {
            allRights: 'រក្សាសិទ្ធិគ្រប់យ៉ាង។',
            builtWith: 'បង្កើតដោយ Laravel 12 & React 19',
            backToTop: 'ត្រលប់ទៅលើវិញ'
        }
    }[locale] || {};
    const t = { ...localT, ...globalT };

    return (
        <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0B0F19] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">{brandName}</span>
                    <span>•</span>
                    <span>&copy; {new Date().getFullYear()} {t.allRights || 'All rights reserved.'}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:inline">{t.builtWith || 'Built with Laravel 12 & React 19'}</span>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={scrollToTop}
                        className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-[#8247e5] dark:hover:text-purple-400 transition font-medium"
                    >
                        <span>{t.backToTop || 'Back to top'}</span>
                        <ArrowUp className="w-4 h-4" />
                    </button>

                </div>
            </div>
        </footer>
    );
}
