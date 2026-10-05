import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const avatarColors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-emerald-400 to-teal-400',
    'from-orange-400 to-rose-400',
    'from-violet-400 to-purple-400',
    'from-amber-400 to-orange-400',
    'from-sky-400 to-blue-400',
    'from-pink-400 to-rose-400',
];

function ReviewCard({ review, index }) {
    const colorClass = avatarColors[index % avatarColors.length];
    return (
        <div className="flex-shrink-0 w-60 sm:w-72 bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-gray-800/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-300 hover:-translate-y-1 mx-2 sm:mx-3">
            <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                &ldquo;{review.message}&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {review.name.charAt(0)}
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{review.name}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">{review.role}</p>
                </div>
            </div>
        </div>
    );
}

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const locale = window.__INITIAL_DATA__?.locale === 'km' ? 'kh' : (window.__INITIAL_DATA__?.locale || 'en');
    const globalT = window.__INITIAL_DATA__?.translations?.[window.__INITIAL_DATA__?.locale] || window.__INITIAL_DATA__?.translations?.en || {};
    const localT = {
        en: {
            testimonials: 'Testimonials',
            whatClientsSay: 'What Clients Say',
            trustedBy: 'Trusted by {count}+ clients across various industries worldwide.'
        },
        kh: {
            testimonials: 'មតិយោបល់',
            whatClientsSay: 'អ្វីដែលអតិថិជននិយាយ',
            trustedBy: 'ទទួលបានការទុកចិត្តពីអតិថិជនជាង {count} នៅទូទាំងពិភពលោក។'
        }
    }[locale] || {};
    const t = { ...localT, ...globalT };

    useEffect(() => {
        fetch('/api/reviews')
            .then(res => res.json())
            .then(data => {
                setReviews(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading || reviews.length === 0) return null;

    const row1 = reviews.slice(0, Math.ceil(reviews.length / 2));
    const row2 = reviews.slice(Math.ceil(reviews.length / 2));

    return (
        <section id="reviews" className="pb-8 sm:pb-10 pt-4 overflow-hidden relative">
            {/* Heading */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <p className="text-sm font-semibold text-purple-500 uppercase tracking-widest mb-2">{t.testimonials || 'Testimonials'}</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    {t.whatClientsSay || 'What Clients Say'}
                </h2>
                <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base">
                    {(t.trustedBy || 'Trusted by {count}+ clients across various industries worldwide.').replace('{count}', reviews.length)}
                </p>
            </div>

            {/* Row 1 — scroll left */}
            <div className="relative mb-5 overflow-hidden">
                <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#fcfcfd] dark:from-[#0B0F19] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#fcfcfd] dark:from-[#0B0F19] to-transparent z-10 pointer-events-none" />
                <div className="flex animate-reviews-left" style={{ width: 'max-content' }}>
                    {[...row1, ...row1].map((review, idx) => (
                        <ReviewCard key={`r1-${idx}`} review={review} index={idx} />
                    ))}
                </div>
            </div>

            {/* Row 2 — scroll right — hidden on mobile */}
            <div className="relative overflow-hidden hidden sm:block">
                <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#fcfcfd] dark:from-[#0B0F19] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#fcfcfd] dark:from-[#0B0F19] to-transparent z-10 pointer-events-none" />
                <div className="flex animate-reviews-right" style={{ width: 'max-content' }}>
                    {[...row2, ...row2].map((review, idx) => (
                        <ReviewCard key={`r2-${idx}`} review={review} index={idx + row1.length} />
                    ))}
                </div>
            </div>
        </section>
    );
}
