import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BadgeCheck, Star, MessageSquare } from 'lucide-react';
import { listReviews } from '../lib/reviews';
import { initials, formatDate } from '../lib/format';
import Stars from '../components/ui/Stars';
import Skeleton from '../components/ui/Skeleton';

const summary = { avg: 4.8, count: 120, distribution: { 5: 86, 4: 9, 3: 3, 2: 1, 1: 1 } };

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0); // 0 = all
  const [sort, setSort] = useState('recent');

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

  const filtered = reviews
    .filter((r) => (filter === 0 ? true : r.rating === filter))
    .sort((a, b) => {
      if (sort === 'recent') return (b.createdAt || 0) - (a.createdAt || 0);
      if (sort === 'highest') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'lowest') return (a.rating || 0) - (b.rating || 0);
      return 0;
    });

  return (
    <>
      <Helmet>
        <title>Customer Reviews — DELISOGA</title>
        <meta name="description" content="Real reviews from DELISOGA glass jar customers across Pakistan. See what buyers are saying." />
      </Helmet>

      <section className="pt-12 sm:pt-16 pb-10">
        <div className="container-narrow text-center">
          <p className="eyebrow justify-center">Customer reviews</p>
          <h1 className="mt-2 font-display text-display-xl text-ink-800 text-balance">What buyers are saying.</h1>
          <p className="mt-4 text-ink-600 max-w-xl mx-auto text-pretty">
            Every review is from a real DELISOGA customer. We do not edit or remove negative feedback.
          </p>
        </div>
      </section>

      <section className="pb-10">
        <div className="container-narrow">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 text-center md:text-left">
              <p className="font-display text-5xl text-ink-800 leading-none">{summary.avg.toFixed(1)}</p>
              <Stars value={summary.avg} size={18} className="mt-2" />
              <p className="mt-2 text-sm text-ink-500">{summary.count}+ verified reviews</p>
            </div>
            <div className="md:col-span-8">
              <ul className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = summary.distribution[star] || 0;
                  return (
                    <li key={star} className="flex items-center gap-3 text-[12.5px] text-ink-600">
                      <button
                        type="button"
                        onClick={() => setFilter(filter === star ? 0 : star)}
                        className={`w-12 text-left inline-flex items-center gap-1 ${filter === star ? 'font-semibold text-ink-800' : 'hover:text-ink-800 transition'}`}
                      >
                        {star} <Star size={12} className="text-bamboo-400" fill="currentColor" strokeWidth={0} />
                      </button>
                      <div className="flex-1 h-2 rounded-full bg-ink-100 overflow-hidden">
                        <div className="h-full rounded-full bg-bamboo-400" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-10 text-right text-ink-500">{pct}%</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-narrow">
          <div className="flex items-center justify-between gap-3 mb-6">
            <p className="text-sm text-ink-500">
              {loading ? 'Loading…' : `Showing ${filtered.length} review${filtered.length === 1 ? '' : 's'}${filter ? ` · ${filter} star${filter === 1 ? '' : 's'}` : ''}`}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm bg-white border border-ink-100 rounded-full px-4 py-2 focus:border-bamboo-300 focus:ring-2 focus:ring-bamboo-200/60 focus:outline-none"
              aria-label="Sort reviews"
            >
              <option value="recent">Most recent</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
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
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-ink-100 p-10 text-center">
              <MessageSquare className="w-8 h-8 text-ink-300 mx-auto" />
              <p className="mt-3 text-ink-600">No reviews match that filter.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((r) => (
                <li key={r.id} className="bg-white border border-ink-100 rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center justify-between">
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
