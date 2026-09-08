import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/product', label: 'Product' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { quantity, openDrawer } = useCart();
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const brand = settings?.brand?.name || 'DELISOGA';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream-100/90 backdrop-blur-md border-b border-ink-100/80 shadow-soft-sm' : 'bg-cream-100 border-b border-transparent'
      }`}
    >
      <div className="container-x flex items-center justify-between h-16 sm:h-20">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label={`${brand} — Home`}>
          <span className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-ink-800 text-cream-100 shadow-soft-sm group-hover:shadow-soft-md transition">
            <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
              <rect x="6" y="5" width="20" height="3" rx="1" fill="#C8A47A" />
              <path d="M8 9h16v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V9z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M14 12h4v13a2 2 0 0 1-4 0V12z" fill="currentColor" opacity="0.45" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.15rem] sm:text-[1.25rem] tracking-tight text-ink-800">{brand}</span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-ink-400 mt-0.5">Glass · Bamboo</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3.5 py-2 text-[14.5px] font-medium rounded-full transition ${
                  isActive ? 'text-ink-900 bg-cream-200/60' : 'text-ink-500 hover:text-ink-900 hover:bg-cream-200/40'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openDrawer}
            className="relative inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-ink-100 text-ink-700 hover:text-ink-900 hover:border-ink-300 hover:shadow-soft-sm transition"
            aria-label={`Open cart (${quantity} item${quantity === 1 ? '' : 's'})`}
          >
            <ShoppingBag size={18} strokeWidth={1.6} />
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 inline-flex items-center justify-center rounded-full bg-ink-800 text-cream-100 text-[10px] font-semibold">
              {quantity}
            </span>
          </button>

          <Link
            to="/checkout"
            className="hidden sm:inline-flex btn-primary"
          >
            Order Now
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-ink-100 text-ink-700 hover:bg-cream-200 transition"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-ink-100 bg-cream-100 animate-fade-in-down">
          <nav className="container-x py-3 flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-3 text-[15px] font-medium rounded-xl transition ${
                    isActive ? 'text-ink-900 bg-cream-200' : 'text-ink-600 hover:text-ink-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/checkout"
              className="btn-primary mt-3 mb-2 w-full"
            >
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
