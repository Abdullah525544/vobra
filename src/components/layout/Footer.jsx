import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const brand = settings?.brand?.name || 'DELISOGA';
  const c = settings?.contact || {};
  const social = settings?.social || {};
  const year = new Date().getFullYear();

  const wa = (c.whatsapp || '').replace(/[^\d+]/g, '');

  return (
    <footer className="mt-24 sm:mt-32 bg-ink-800 text-cream-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
      <div className="relative">
        {/* Newsletter / contact band */}
        <div className="border-b border-cream-200/10">
          <div className="container-x py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="eyebrow text-bamboo-300 mb-3">Get in touch</p>
              <h2 className="font-display text-3xl sm:text-4xl text-cream-100 text-balance leading-tight">
                Questions about your order, the jar, or delivery in Pakistan?
              </h2>
              <p className="mt-3 text-cream-200/70 max-w-xl">
                Reach out and we’ll get back to you the same business day. We’re a small team that genuinely cares about every order.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 lg:justify-end">
              {wa && (
                <a
                  href={`https://wa.me/${wa.replace(/^\+/, '')}`}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-sage-500 hover:bg-sage-600 text-cream-100 font-medium transition"
                >
                  <MessageCircle size={18} strokeWidth={1.6} /> WhatsApp us
                </a>
              )}
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-cream-200/20 hover:border-cream-200/40 text-cream-100 font-medium transition">
                Contact page
              </Link>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="container-x py-14 sm:py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cream-100 text-ink-800">
                <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
                  <rect x="6" y="5" width="20" height="3" rx="1" fill="#C8A47A" />
                  <path d="M8 9h16v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V9z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M14 12h4v13a2 2 0 0 1-4 0V12z" fill="currentColor" opacity="0.45" />
                </svg>
              </span>
              <span className="font-display text-xl text-cream-100">{brand}</span>
            </div>
            <p className="mt-4 text-sm text-cream-200/70 max-w-xs">
              {settings?.brand?.tagline || 'Premium glassware for everyday rituals.'}
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-cream-200/80">
              {c.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-bamboo-300 flex-shrink-0" />
                  <a href={`mailto:${c.email}`} className="hover:text-cream-100 transition break-all">{c.email}</a>
                </li>
              )}
              {c.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-bamboo-300 flex-shrink-0" />
                  <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="hover:text-cream-100 transition">{c.phone}</a>
                </li>
              )}
              {c.address && (
                <li className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-bamboo-300 flex-shrink-0" />
                  <span>{c.address}</span>
                </li>
              )}
              {c.businessHours && (
                <li className="text-cream-200/50 text-xs">{c.businessHours}</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.18em] text-bamboo-300 mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li><Link to="/" className="hover:text-cream-100 transition">Home</Link></li>
              <li><Link to="/product" className="hover:text-cream-100 transition">Product</Link></li>
              <li><Link to="/reviews" className="hover:text-cream-100 transition">Reviews</Link></li>
              <li><Link to="/checkout" className="hover:text-cream-100 transition">Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.18em] text-bamboo-300 mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li><Link to="/faq" className="hover:text-cream-100 transition">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-cream-100 transition">Contact</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-cream-100 transition">Shipping</Link></li>
              <li><Link to="/returns-policy" className="hover:text-cream-100 transition">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.18em] text-bamboo-300 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li><Link to="/about" className="hover:text-cream-100 transition">About</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-cream-100 transition">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-cream-100 transition">Terms</Link></li>
            </ul>
            {(social.instagram || social.facebook) && (
              <div className="mt-5 flex items-center gap-2">
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noreferrer"
                     className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-cream-200/15 hover:border-cream-200/40 transition text-cream-200/80 hover:text-cream-100">
                    <Instagram size={16} />
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noreferrer"
                     className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-cream-200/15 hover:border-cream-200/40 transition text-cream-200/80 hover:text-cream-100">
                    <Facebook size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-cream-200/10">
          <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-cream-200/50">
            <p>© {year} {brand}. All rights reserved.</p>
            <p className="flex items-center gap-3 flex-wrap justify-center">
              <span>Crafted in Pakistan</span>
              <span className="hidden sm:inline">·</span>
              <span>Cash on Delivery</span>
              <span className="hidden sm:inline">·</span>
              <span>Free delivery on 2+ jars</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
