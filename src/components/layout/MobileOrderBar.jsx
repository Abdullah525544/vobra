import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPKR } from '../../lib/format';

export default function MobileOrderBar() {
  const { quantity, openDrawer } = useCart();
  const { settings } = useSettings();
  const loc = useLocation();
  const product = settings?.product || {};
  const unit = Number(product.unitPrice || 0);
  const total = unit * quantity;

  // Hide on the checkout/thank-you pages (they have their own CTAs)
  if (loc.pathname.startsWith('/checkout') || loc.pathname.startsWith('/thank-you')) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden safe-bottom">
      <div className="mx-3 mb-3 rounded-2xl bg-ink-800 text-cream-100 shadow-soft-xl border border-ink-700/50">
        <div className="flex items-center justify-between p-2 pl-4">
          <button onClick={openDrawer} className="flex items-center gap-2 text-left touch-manipulation min-h-[44px] px-1">
            <div className="relative">
              <ShoppingBag size={20} className="text-bamboo-300" />
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-bamboo-400 text-ink-900 text-[10px] font-bold">
                {quantity}
              </span>
            </div>
            <div className="leading-tight">
              <p className="text-[11px] text-cream-200/60">Total</p>
              <p className="text-sm font-display">{formatPKR(total)}</p>
            </div>
          </button>
          <Link to="/checkout" className="btn-primary !px-5 !py-3 !text-[13px] bg-bamboo-400 !text-ink-900 hover:!bg-bamboo-300 touch-manipulation">
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
