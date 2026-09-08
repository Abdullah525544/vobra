import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Sparkles, ArrowRight, Star } from 'lucide-react';
import Image from '../components/ui/Image';
import ProductPurchase from '../components/home/ProductPurchase';
import Features from '../components/home/Features';
import WhyChooseDelisoga from '../components/home/WhyChooseDelisoga';
import Reviews from '../components/home/Reviews';
import FAQ from '../components/home/FAQ';
import { useSettings } from '../context/SettingsContext';
import { formatPKR } from '../lib/format';

const specs = [
  { k: 'Material', v: 'Food-safe glass, natural bamboo' },
  { k: 'Capacity', v: 'Approx. 450 ml' },
  { k: 'Lid', v: 'Natural bamboo with snug fit' },
  { k: 'Straw', v: 'Reusable glass' },
  { k: 'Care', v: 'Hand-wash glass, wipe lid — air dry upright' },
  { k: 'Ships from', v: 'Lahore, Pakistan' },
];

export default function Product() {
  const { settings } = useSettings();
  const unit = Number(settings?.product?.unitPrice || 1000);

  return (
    <>
      <Helmet>
        <title>The Glass Jar — DELISOGA</title>
        <meta name="description" content="A premium glass jar with bamboo lid and glass straw. Thick food-safe glass, natural bamboo lid, reusable glass straw. PKR 1,000." />
        <link rel="canonical" href="https://delisoga.com/product" />
      </Helmet>

      {/* Compact hero */}
      <section className="pt-10 sm:pt-14 pb-6">
        <div className="container-x">
          <nav className="text-[12.5px] text-ink-500 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-800 transition">Home</Link>
            <span className="mx-2 text-ink-300">/</span>
            <span className="text-ink-700">Product</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 sm:col-span-9 relative aspect-[4/3] rounded-3xl overflow-hidden bg-cream-200 shadow-soft-md">
                  <Image src="/images/hero-jar.jpg" alt="DELISOGA glass jar on a marble surface" className="w-full h-full" eager />
                </div>
                <div className="col-span-12 sm:col-span-3 grid grid-cols-3 sm:grid-cols-1 gap-3">
                  {[
                    '/images/feature-lid.jpg',
                    '/images/lifestyle-juice.jpg',
                    '/images/packaging.jpg',
                  ].map((src) => (
                    <div key={src} className="aspect-square rounded-2xl overflow-hidden bg-cream-200">
                      <Image src={src} alt="DELISOGA jar product photo" className="w-full h-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <p className="eyebrow">DELISOGA</p>
              <h1 className="mt-2 font-display text-display-lg text-ink-800 text-balance">Glass Jar with Bamboo Lid & Glass Straw</h1>
              <div className="mt-3 flex items-center gap-2 text-sm text-ink-500">
                <div className="flex items-center gap-0.5 text-bamboo-400">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                </div>
                <span className="font-medium text-ink-700">4.8</span>
                <span>· 120+ reviews</span>
              </div>
              <p className="mt-4 text-ink-600 text-pretty">
                A reusable glass jar with a natural bamboo lid and a reusable glass straw — designed
                for water, juice, smoothies and the drinks you reach for every day.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-ink-700">
                {[
                  'Thick, food-safe glass with a clear refined finish',
                  'Natural bamboo lid, snug fit',
                  'Reusable glass straw included',
                  'Perfect for water, juice, smoothies, iced coffee and more',
                  'Cash on Delivery across Pakistan',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-5 h-5 inline-flex items-center justify-center rounded-full bg-sage-100 text-sage-600 flex-shrink-0">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-baseline gap-2">
                <span className="font-display text-[2.25rem] text-ink-800 leading-none">{formatPKR(unit)}</span>
                <span className="text-sm text-ink-500">/ jar</span>
              </div>

              <div className="mt-5 p-4 rounded-2xl border border-bamboo-200 bg-bamboo-50/60 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-bamboo-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-ink-700">Free delivery on 2 or more jars. Order 1 jar at {formatPKR(unit)} + delivery.</p>
              </div>

              <Link to="/checkout" className="btn-primary-lg mt-6 w-full">
                Order Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink-800">Specifications</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {specs.map((s) => (
                <div key={s.k} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-bamboo-400 mt-2.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-ink-400">{s.k}</p>
                    <p className="text-sm text-ink-700 mt-0.5">{s.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductPurchase />
      <Features />
      <WhyChooseDelisoga />
      <Reviews />
      <FAQ />
    </>
  );
}
