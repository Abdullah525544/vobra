import { Check, X, Sparkles, Leaf, Droplet, Crown, Repeat, Recycle } from 'lucide-react';
import Image from '../ui/Image';

const theirs = [
  { ok: false, text: 'Single-use, discarded after one drink' },
  { ok: false, text: 'Plastic or mixed materials, can hold flavours and stains' },
  { ok: false, text: 'Generic shape, no real character on a table' },
  { ok: false, text: 'No reusable straw' },
  { ok: false, text: 'No design for everyday re-use' },
];

const ours = [
  { ok: true, text: 'Reusable, built for daily use' },
  { ok: true, text: 'Thick, food-safe glass — neutral taste' },
  { ok: true, text: 'Warm bamboo lid with a real, natural grain' },
  { ok: true, text: 'Reusable glass straw included' },
  { ok: true, text: 'Designed for water, juice, coffee, smoothies and more' },
];

export default function WhyChooseDelisoga() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-cream-100 to-white">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow justify-center">Why choose DELISOGA</p>
          <h2 className="mt-2 font-display text-display-lg text-ink-800 text-balance">
            A smarter swap for everyday drinkware.
          </h2>
          <p className="mt-3 text-ink-600 text-pretty">
            Here’s how a DELISOGA glass jar compares to the disposable cups and low-quality
            drinkware you might be used to.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Ordinary */}
          <div className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-[12px] uppercase tracking-[0.18em] text-ink-400">Ordinary cups & low-quality drinkware</p>
              <span className="badge bg-cream-200 text-ink-600">Disposable</span>
            </div>
            <h3 className="mt-3 font-display text-2xl text-ink-700">Single-use, forgettable</h3>
            <ul className="mt-5 space-y-3">
              {theirs.map((row) => (
                <li key={row.text} className="flex items-start gap-3 text-[14px] text-ink-600">
                  <span className="mt-0.5 w-5 h-5 inline-flex items-center justify-center rounded-full bg-ink-100 text-ink-500 flex-shrink-0">
                    <X size={12} strokeWidth={2.5} />
                  </span>
                  <span>{row.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 relative aspect-[5/3] rounded-2xl overflow-hidden bg-cream-200/60">
              <div className="absolute inset-0 flex items-center justify-center text-ink-300">
                <svg viewBox="0 0 64 80" className="w-16 h-20 opacity-50">
                  <path d="M16 14h32v50a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V14z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 14h32l-4-6H20l-4 6z" fill="currentColor" opacity="0.4" />
                  <text x="32" y="48" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.4">DISPOSABLE</text>
                </svg>
              </div>
            </div>
          </div>

          {/* DELISOGA */}
          <div className="rounded-3xl border-2 border-ink-800 bg-ink-800 text-cream-100 p-6 sm:p-8 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{ background: 'radial-gradient(80% 50% at 80% 0%, rgba(200,164,122,0.5) 0%, rgba(31,27,22,0) 60%)' }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-[12px] uppercase tracking-[0.18em] text-bamboo-300">DELISOGA</p>
                <span className="badge bg-bamboo-400 text-ink-900">Built to last</span>
              </div>
              <h3 className="mt-3 font-display text-2xl text-cream-100">Reusable, intentional</h3>
              <ul className="mt-5 space-y-3">
                {ours.map((row) => (
                  <li key={row.text} className="flex items-start gap-3 text-[14px] text-cream-200/90">
                    <span className="mt-0.5 w-5 h-5 inline-flex items-center justify-center rounded-full bg-sage-500 text-cream-100 flex-shrink-0">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    <span>{row.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 relative aspect-[5/3] rounded-2xl overflow-hidden">
                <Image src="/images/product-main.jpg" alt="DELISOGA glass jar with bamboo lid and glass straw" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature badges row */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center text-[12.5px] text-ink-600">
          {[
            { Icon: Crown, t: 'Premium feel' },
            { Icon: Leaf, t: 'Bamboo lid' },
            { Icon: Droplet, t: 'Glass straw' },
            { Icon: Recycle, t: 'Reusable daily' },
          ].map(({ Icon, t }) => (
            <div key={t} className="bg-white border border-ink-100 rounded-2xl p-4 flex flex-col items-center gap-2">
              <Icon className="w-5 h-5 text-bamboo-500" />
              <span className="font-medium text-ink-700">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
