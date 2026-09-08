import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BadgeCheck, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Stars from '../ui/Stars';
import { listReviews } from '../../lib/reviews';
import { initials, formatDate } from '../../lib/format';
import Skeleton from '../ui/Skeleton';

const summary = { avg: 4.8, count: 120, distribution: { 5: 86, 4: 9, 3: 3, 2: 1, 1: 1 } };

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await listReviews({ onlyApproved: true });
        if (alive) setReviews(r);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w < 640) setPerView(1);
      else if (w < 1024) setPerView(2);
      else setPerView(3);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const max = Math.max(0, reviews.length - perView);
  const next = () => setIndex((i) => Math.min(max, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-white border-y border-ink-100/80">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <p className="eyebrow">Customer reviews</p>
            <h2 className="mt-2 font-display text-display-lg text-ink-800 text-balance">
              What buyers are saying.
            </h2>

            <div className="mt-5 p-5 rounded-2xl border border-ink-100 bg-cream-100">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-ink-800">{summary.avg.toFixed(1)}</span>
                <span className="text-sm text-ink-500">/ 5</span>
              </div>
              <Stars value={summary.avg} size={18} className="mt-1" />
              <p className="mt-2 text-sm text-ink-600">Based on {summary.count}+ reviews from verified buyers across Pakistan.</p>

              <ul className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = summary.distribution[star] || 0;
                  return (
                    <li key={star} className="flex items-center gap-2 text-[12.5px] text-ink-500">
                      <span className="w-4 text-right">{star}</span>
                      <Star size={12} className="text-bamboo-400" fill="currentColor" strokeWidth={0} />
                      <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                        <div className="h-full rounded-full bg-bamboo-400" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right">{pct}%</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Link to="/reviews" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-800 hover:text-bamboo-600 transition">
              Read all reviews →
            </Link>
          </div>

          <div className="lg:col-span-8">
            <div className="relative">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-ink-100 p-5">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full mt-3" />
                      <Skeleton className="h-4 w-5/6 mt-2" />
                      <Skeleton className="h-4 w-3/4 mt-2" />
                      <div className="flex items-center gap-3 mt-5">
                        <Skeleton className="w-9 h-9 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-16 mt-1.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="rounded-2xl border border-ink-100 p-8 text-center text-ink-500">
                  No reviews yet — be the first to share your experience.
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out gap-4"
                    style={{ transform: `translateX(calc(-${index} * (100% / ${perView}) - ${index * 16}px))`, width: `calc(${(reviews.length / perView) * 100}% + ${((reviews.length - perView) * 16) / perView}px)` }}
                  >
                    {reviews.map((r) => (
                      <article
                        key={r.id}
                        className="bg-cream-100 border border-ink-100 rounded-2xl p-5 sm:p-6 flex-shrink-0"
                        style={{ width: `calc(${100 / reviews.length}% - ${(16 * (reviews.length - 1)) / reviews.length}px)` }}
                      >
                        <Quote className="w-5 h-5 text-bamboo-300" />
                        <div className="mt-3 flex items-center gap-2">
                          <Stars value={r.rating || 5} size={14} />
                          {r.verified && (
                            <span className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-wider text-sage-600 font-semibold">
                              <BadgeCheck size={12} /> Verified
                            </span>
                          )}
                        </div>
                        {r.title && <h3 className="mt-3 font-display text-[1.05rem] text-ink-800 leading-snug">{r.title}</h3>}
                        <p className="mt-1.5 text-[13.5px] text-ink-600 leading-relaxed text-pretty">{r.body}</p>
                        <div className="mt-5 flex items-center gap-3 pt-4 border-t border-ink-100">
                          <div className="w-9 h-9 rounded-full bg-bamboo-200 text-bamboo-700 inline-flex items-center justify-center text-[12px] font-semibold">
                            {initials(r.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink-800 truncate">{r.name}</p>
                            <p className="text-[11.5px] text-ink-500">{[r.city, formatDate(r.createdAt)].filter(Boolean).join(' · ')}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {reviews.length > perView && (
                <div className="mt-6 flex items-center justify-end gap-2">
                  <button
                    onClick={prev}
                    disabled={index === 0}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white border border-ink-100 text-ink-700 hover:border-ink-300 transition disabled:opacity-40"
                    aria-label="Previous reviews"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    disabled={index >= max}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white border border-ink-100 text-ink-700 hover:border-ink-300 transition disabled:opacity-40"
                    aria-label="Next reviews"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
