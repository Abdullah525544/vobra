import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Check, Truck, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPKR } from '../../lib/format';
import QuantitySelector from '../ui/QuantitySelector';

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, quantity, setQuantity, reset } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const product = settings?.product || {};
  const freeMin = Number(product.freeDeliveryMinQty || 2);
  const freeDelivery = quantity >= freeMin;
  const unit = Number(product.unitPrice || 0);
  const subtotal = unit * quantity;
  const delivery = freeDelivery ? 0 : Number(product.deliveryCharge || 0);
  const total = subtotal + delivery;

  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [drawerOpen]);

  const progress = useMemo(() => {
    if (freeDelivery) return 100;
    if (quantity <= 0) return 0;
    return Math.min(95, (quantity / freeMin) * 100);
  }, [quantity, freeDelivery, freeMin]);

  if (!drawerOpen) return null;
  const toGo = Math.max(0, freeMin - quantity);

  const goCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-[90] animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && closeDrawer()}
      role="dialog" aria-modal="true" aria-label="Cart"
    >
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" />
      <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-[440px] bg-cream-100 shadow-soft-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100">
          <div>
            <h2 className="font-display text-xl text-ink-800">Your order</h2>
            <p className="text-xs text-ink-500 mt-0.5">{quantity} jar{quantity === 1 ? '' : 's'}</p>
          </div>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-ink-500 hover:text-ink-800 hover:bg-cream-200 transition"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Free delivery progress */}
          {!freeDelivery && toGo > 0 && (
            <div className="rounded-2xl border border-bamboo-200/70 bg-gradient-to-br from-bamboo-50 to-cream-100 p-4">
              <div className="flex items-center gap-2.5 text-bamboo-600">
                <Sparkles size={16} className="text-bamboo-500" />
                <p className="text-[13px] font-semibold">
                  Add {toGo} more jar{toGo === 1 ? '' : 's'} to unlock free delivery
                </p>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-bamboo-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-bamboo-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11.5px] text-ink-500 mt-2">
                Free delivery automatically applies on orders of {freeMin}+ jars.
              </p>
            </div>
          )}

          {freeDelivery && (
            <div className="rounded-2xl border border-sage-200 bg-sage-50 p-4 flex items-center gap-3">
              <div className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-sage-500 text-cream-100">
                <Check size={16} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-sage-600">Free delivery unlocked</p>
                <p className="text-[11.5px] text-ink-500">Delivery is on us for your order.</p>
              </div>
            </div>
          )}

          {/* Line item */}
          <div className="flex gap-4 p-4 bg-white rounded-2xl border border-ink-100">
            <div className="w-20 h-24 flex-shrink-0 bg-cream-200 rounded-xl overflow-hidden">
              <img src="/images/product-main.jpg" alt="DELISOGA glass jar" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-ink-400">DELISOGA</p>
              <h3 className="font-display text-[15px] text-ink-800 leading-tight mt-0.5">Glass Jar with Bamboo Lid & Glass Straw</h3>
              <p className="text-sm text-ink-500 mt-1">{formatPKR(unit)} / jar</p>
              <div className="mt-3 flex items-center justify-between">
                <QuantitySelector value={quantity} onChange={setQuantity} size="sm" />
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-red-600 transition"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-2 gap-2.5 text-[12px] text-ink-600">
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-ink-100">
              <Truck size={14} className="text-bamboo-500" />
              Free delivery on 2+
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-ink-100">
              <ShieldCheck size={14} className="text-bamboo-500" />
              Cash on Delivery
            </div>
          </div>
        </div>

        {/* Footer summary */}
        <div className="border-t border-ink-100 bg-white px-6 py-5 space-y-2.5">
          <div className="flex items-center justify-between text-sm text-ink-600">
            <span>Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-ink-600">
            <span>Delivery</span>
            <span className={freeDelivery ? 'text-sage-500 font-medium' : ''}>
              {freeDelivery ? 'Free' : formatPKR(delivery)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-ink-100">
            <span className="text-sm font-medium text-ink-700">Total</span>
            <span className="text-lg font-display text-ink-800">{formatPKR(total)}</span>
          </div>
          <button onClick={goCheckout} className="btn-primary-lg w-full mt-3">
            Continue to checkout
          </button>
          <button onClick={closeDrawer} className="btn-ghost w-full">
            Keep shopping
          </button>
        </div>
      </aside>
    </div>
  );
}
