import React from 'react';

/**
 * High-definition vector SVG flag for Cambodia (ព្រះរាជាណាចក្រកម្ពុជា)
 */
export function FlagCambodia({ className = 'w-5 h-3.5', rounded = 'rounded-sm' }) {
    return (
        <svg
            viewBox="0 0 640 480"
            className={`${className} ${rounded} shadow-sm overflow-hidden inline-block shrink-0 align-middle border border-black/10`}
            aria-label="Cambodia Flag"
        >
            {/* Top Blue Stripe (1/4 height = 120) */}
            <rect width="640" height="120" fill="#032ea6" />
            {/* Middle Red Stripe (1/2 height = 240) */}
            <rect y="120" width="640" height="240" fill="#e00025" />
            {/* Bottom Blue Stripe (1/4 height = 120) */}
            <rect y="360" width="640" height="120" fill="#032ea6" />

            {/* Angkor Wat Silhouette in White */}
            <g fill="#ffffff" transform="translate(145, 140) scale(0.88)">
                {/* Base platform */}
                <path d="M0,195 L400,195 L392,180 L8,180 Z" />
                <path d="M15,180 L385,180 L378,166 L22,166 Z" />
                <path d="M30,166 L370,166 L362,150 L38,150 Z" />

                {/* Main Middle Tower */}
                <path d="M176,150 L176,46 L186,34 L194,22 L200,2 L206,22 L214,34 L224,46 L224,150 Z" />
                <path d="M162,150 L162,72 L170,62 L176,55 L176,150 Z" />
                <path d="M238,150 L238,72 L230,62 L224,55 L224,150 Z" />

                {/* Left Main Tower */}
                <path d="M96,150 L96,62 L104,50 L112,40 L118,24 L124,40 L132,50 L140,62 L140,150 Z" />
                {/* Left Outer Tower */}
                <path d="M52,150 L52,85 L60,74 L68,66 L74,54 L80,66 L86,74 L90,85 L90,150 Z" />

                {/* Right Main Tower */}
                <path d="M260,150 L260,62 L268,50 L276,40 L282,24 L288,40 L296,50 L304,62 L304,150 Z" />
                {/* Right Outer Tower */}
                <path d="M310,150 L310,85 L314,74 L320,66 L326,54 L332,66 L340,74 L348,85 L348,150 Z" />

                {/* Portico Entrance Pillars */}
                <rect x="188" y="166" width="24" height="29" fill="#e00025" />
                <path d="M184,166 L216,166 L200,152 Z" />
            </g>
        </svg>
    );
}

/**
 * High-definition vector SVG flag for United Kingdom (Great Britain)
 */
export function FlagUK({ className = 'w-5 h-3.5', rounded = 'rounded-sm' }) {
    return (
        <svg
            viewBox="0 0 60 30"
            className={`${className} ${rounded} shadow-sm overflow-hidden inline-block shrink-0 align-middle border border-black/10`}
            aria-label="United Kingdom Flag"
        >
            <clipPath id="uk-clip-s">
                <path d="M0,0 v30 h60 v-30 z" />
            </clipPath>
            <clipPath id="uk-clip-t">
                <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
            </clipPath>
            <g clipPath="url(#uk-clip-s)">
                <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </g>
        </svg>
    );
}

/**
 * Selector component for current flag
 */
export default function FlagIcon({ locale = 'en', className = 'w-5 h-3.5', rounded = 'rounded-sm' }) {
    if (locale === 'kh') {
        return <FlagCambodia className={className} rounded={rounded} />;
    }
    return <FlagUK className={className} rounded={rounded} />;
}
