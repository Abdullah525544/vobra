import { Outlet, NavLink, useNavigate, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Star, Settings, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';

const nav = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', Icon: Package },
  { to: '/admin/reviews', label: 'Reviews', Icon: Star },
  { to: '/admin/settings', label: 'Settings', Icon: Settings },
];

export default function AdminLayout() {
  const { session, signOut } = useAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!session) return <Navigate to="/admin/login" replace />;

  const onSignOut = async () => {
    await signOut();
    toast.info('Signed out.');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-cream-100 border-b border-ink-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setOpen(true)} className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white border border-ink-100" aria-label="Open menu">
          <Menu size={18} />
        </button>
        <p className="font-display text-lg text-ink-800">DELISOGA · Admin</p>
        <Link to="/" className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white border border-ink-100" aria-label="Back to site">
          <ArrowLeft size={16} />
        </Link>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-ink-800 text-cream-200 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-5 h-16 border-b border-cream-200/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cream-100 text-ink-800">
                <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
                  <rect x="6" y="5" width="20" height="3" rx="1" fill="#C8A47A" />
                  <path d="M8 9h16v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V9z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M14 12h4v13a2 2 0 0 1-4 0V12z" fill="currentColor" opacity="0.45" />
                </svg>
              </span>
              <div>
                <p className="font-display text-cream-100 text-lg leading-none">DELISOGA</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-cream-200/50 mt-1">Admin</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden w-8 h-8 inline-flex items-center justify-center rounded-full text-cream-200/70 hover:bg-cream-200/10">
              <X size={18} />
            </button>
          </div>
          <nav className="px-3 py-4 space-y-1">
            {nav.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14.5px] transition ${
                    isActive ? 'bg-cream-100/10 text-cream-100' : 'text-cream-200/70 hover:bg-cream-200/5 hover:text-cream-100'
                  }`
                }
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-cream-200/10 space-y-2">
            <Link to="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] text-cream-200/70 hover:bg-cream-200/5 hover:text-cream-100 transition">
              <ArrowLeft size={16} /> Back to site
            </Link>
            <button onClick={onSignOut} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] text-cream-200/70 hover:bg-cream-200/5 hover:text-cream-100 transition">
              <LogOut size={16} /> Sign out
            </button>
            <div className="px-3.5 pt-3 border-t border-cream-200/10 text-[11.5px] text-cream-200/50">
              <p className="truncate">{session.email}</p>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {open && <div className="fixed inset-0 z-30 bg-ink-900/50 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
