import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Truck, ShieldCheck, Award } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatPKR } from '../../lib/format';
import Image from '../ui/Image';

export default function Hero() {
  const { settings } = useSettings();
  const product = settings?.product || {};
  const unit = Number(product.unitPrice || 1000);

  return (
    <section className="relative overflow-hidden">
      {/* Soft warm gradient backdrop */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(80% 60% at 80% 0%, rgba(200,164,122,0.18) 0%, rgba(250,247,242,0) 60%), radial-gradient(60% 50% at 0% 100%, rgba(122,143,110,0.10) 0%, rgba(250,247,242,0) 60%)',
        }}
      />

      <div className="container-x pt-10 sm:pt-14 lg:pt-20 pb-12 sm:pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="max-w-xl">
              <p className="eyebrow animate-fade-in-down">
                <Sparkles className="w-3.5 h-3.5" /> The everyday ritual, refined
              </p>

              <h1 className="mt-4 font-display text-display-2xl text-ink-800 text-balance animate-fade-in-up">
                A premium glass jar
                <span className="block text-bamboo-500">with a bamboo lid.</span>
              </h1>

              <p className="mt-5 sm:mt-6 text-[1.05rem] sm:text-[1.1rem] text-ink-600 leading-relaxed max-w-lg text-pretty animate-fade-in">
                Thick, food-safe glass. A natural bamboo lid with a snug seal. A reusable
                glass straw — ready for water, juice, smoothies and your morning iced coffee.
              </p>

              {/* Price + rating */}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[2rem] sm:text-[2.25rem] text-ink-800 leading-none">{formatPKR(unit)}</span>
                  <span className="text-sm text-ink-500">/ jar</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-600">
                  <div className="flex items-center gap-0.5 text-bamboo-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <span className="font-medium text-ink-700">4.8</span>
                  <span className="text-ink-400">· 120+ reviews</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link to="/checkout" className="btn-primary-lg group">
                  Order Now
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link to="/product" className="btn-secondary">
                  View Product
                </Link>
              </div>

              {/* Trust indicators */}
              <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-[13px] text-ink-600">
                <li className="flex items-center gap-2">
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-sage-100 text-sage-600">
                    <Truck size={14} />
                  </span>
                  Free delivery on 2+ jars
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-bamboo-100 text-bamboo-600">
                    <ShieldCheck size={14} />
                  </span>
                  Cash on Delivery
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-cream-200 text-ink-700">
                    <Award size={14} />
                  </span>
                  Quality checked
                </li>
              </ul>
            </div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative">
              {/* Top-left: price chip */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur border border-ink-100 shadow-soft-sm">
                <span className="text-[11px] uppercase tracking-wider text-ink-400">Only</span>
                <span className="text-sm font-display font-semibold text-ink-800">{formatPKR(unit)}</span>
              </div>

              {/* Top-right: offer pill */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-500 text-cream-100 shadow-soft-sm text-[11.5px] sm:text-[12px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-100" />
                Free 2+ jars
              </div>

              {/* Bottom-left: rating chip */}
              <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur border border-ink-100 shadow-soft-sm">
                <div className="flex items-center gap-0.5 text-bamboo-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-[11.5px] font-semibold text-ink-800">4.8</span>
                <span className="text-[10.5px] text-ink-500">120+</span>
              </div>

              {/* Bottom-right: bamboo + glass badge */}
              <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-800/90 backdrop-blur text-cream-100 shadow-soft-sm text-[11px] sm:text-[11.5px] font-medium">
                <Award size={11} className="text-bamboo-300" />
                <span>Premium</span>
              </div>

              {/* Main hero image */}
              <div className="relative aspect-[5/4] sm:aspect-[5/4] rounded-3xl overflow-hidden bg-gradient-to-br from-cream-200 to-beige-100 shadow-soft-lg">
                <Image
                  src="/images/hero-jar.jpg"
                  alt="DELISOGA glass jar with bamboo lid and reusable glass straw on a marble counter"
                  className="w-full h-full"
                  eager
                />
                {/* Subtle gradient for chip legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none" />
              </div>

              {/* Floating micro-card 1 — mobile (inside, on bottom) */}
              <div className="sm:hidden mt-3 flex items-center gap-2.5 bg-white rounded-2xl shadow-soft-sm border border-ink-100 px-3.5 py-2.5">
                <div className="w-9 h-9 rounded-full bg-sage-100 inline-flex items-center justify-center text-sage-600 flex-shrink-0">
                  <Sparkles size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10.5px] uppercase tracking-wider text-ink-400">Eco-friendly</p>
                  <p className="text-[13px] font-semibold text-ink-800 leading-tight">Reusable glass & bamboo</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-bamboo-100 inline-flex items-center justify-center text-bamboo-600 flex-shrink-0">
                  <Truck size={14} />
                </div>
              </div>

              {/* Floating micro-card 1 — desktop */}
              <div className="hidden sm:flex absolute -left-6 bottom-8 bg-white rounded-2xl shadow-soft-md border border-ink-100 px-4 py-3 items-center gap-3 max-w-[220px]">
                <div className="w-10 h-10 rounded-full bg-sage-100 inline-flex items-center justify-center text-sage-600">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-400">Eco-friendly</p>
                  <p className="text-sm font-semibold text-ink-800">Reusable design</p>
                </div>
              </div>

              {/* Floating micro-card 2 */}
              <div className="hidden sm:flex absolute -right-3 top-12 bg-white rounded-2xl shadow-soft-md border border-ink-100 px-4 py-3 items-center gap-3 max-w-[230px]">
                <div className="flex -space-x-1.5">
                  <div className="w-7 h-7 rounded-full bg-bamboo-200 border-2 border-white" />
                  <div className="w-7 h-7 rounded-full bg-sage-200 border-2 border-white" />
                  <div className="w-7 h-7 rounded-full bg-cream-300 border-2 border-white" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink-400">Loved by</p>
                  <p className="text-sm font-semibold text-ink-800">120+ happy customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
