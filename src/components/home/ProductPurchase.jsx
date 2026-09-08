import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Minus, Plus, ShieldCheck, Star, Truck, Sparkles, Package, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { formatPKR } from '../../lib/format';
import Image from '../ui/Image';

const gallery = [
  '/images/product-main.jpg',
  '/images/feature-lid.jpg',
  '/images/lifestyle-juice.jpg',
  '/images/packaging.jpg',
];

export default function ProductPurchase() {
  const { settings } = useSettings();
  const { quantity, setQuantity, openDrawer } = useCart();
  const toast = useToast();
  const product = settings?.product || {};
  const unit = Number(product.unitPrice || 1000);
  const freeMin = Number(product.freeDeliveryMinQty || 2);
  const freeDelivery = quantity >= freeMin;
  const delivery = Number(product.deliveryCharge || 0);
  const subtotal = unit * quantity;
  const total = subtotal + (freeDelivery ? 0 : delivery);

  const [activeImg, setActiveImg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActiveImg((i) => (i + 1) % gallery.length), 5500);
    return () => clearInterval(id);
  }, []);

  const toGo = Math.max(0, freeMin - quantity);

  const onAddToCart = () => {
    openDrawer();
    toast.success(`Added ${quantity} jar${quantity === 1 ? '' : 's'} to your order.`);
  };

  return (
    <section id="product" className="py-16 sm:py-24 bg-cream-100">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-12 gap-3 sm:gap-4">
              {/* Main */}
              <div className="col-span-12 sm:col-span-9 relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-cream-200 to-beige-100 shadow-soft-md">
                <Image
                  key={gallery[activeImg]}
                  src={gallery[activeImg]}
                  alt="DELISOGA glass jar — product photo"
                  className="w-full h-full"
                  eager
                />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-medium text-ink-700 shadow-soft-sm">
                  <Sparkles size={12} className="text-bamboo-500" /> In stock — ready to ship
                </div>
              </div>
              {/* Thumbs */}
              <div className="col-span-12 sm:col-span-3 grid grid-cols-4 sm:grid-cols-1 gap-2 sm:gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border transition ${
                      activeImg === i ? 'border-ink-800 shadow-soft-sm' : 'border-ink-100 hover:border-ink-300'
                    }`}
                    aria-label={`Show product image ${i + 1}`}
                  >
                    <img src={g} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-below: features icons */}
            <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { Icon: ShieldCheck, t: 'Quality checked' },
                { Icon: Truck, t: 'COD available' },
                { Icon: Package, t: 'Secure packaging' },
                { Icon: Sparkles, t: 'Reusable design' },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-2 text-[12.5px] text-ink-600 bg-white border border-ink-100 rounded-xl px-3 py-2.5">
                  <Icon size={14} className="text-bamboo-500" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Purchase card */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <p className="eyebrow">DELISOGA · The Glass Jar</p>
              <h2 className="mt-2 font-display text-display-lg text-ink-800 leading-tight text-balance">
                Glass Jar with Bamboo Lid & Glass Straw
              </h2>
              <div className="mt-3 flex items-center gap-3 text-sm text-ink-500">
                <div className="flex items-center gap-0.5 text-bamboo-400">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                </div>
                <span className="font-medium text-ink-700">4.8</span>
                <span>· 120+ reviews</span>
              </div>

              <p className="mt-4 text-ink-600 leading-relaxed">
                A reusable glass jar designed for daily hydration. Comes with a natural bamboo lid and a
                reusable glass straw — a quiet upgrade to your everyday drink.
              </p>

              {/* Price block */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-[2.25rem] text-ink-800 leading-none">{formatPKR(unit)}</span>
                <span className="text-sm text-ink-500">/ jar</span>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="label !mb-0">Quantity</p>
                  <p className="text-xs text-ink-500">Stock: {product.inStock ? 'Available' : 'Out of stock'}</p>
                </div>
                <div className="inline-flex items-center bg-white border border-ink-100 rounded-full h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full inline-flex items-center justify-center text-ink-700 hover:bg-cream-100 transition disabled:opacity-40"
                    aria-label="Decrease"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-semibold text-ink-800 select-none">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="w-12 h-full inline-flex items-center justify-center text-ink-700 hover:bg-cream-100 transition"
                    aria-label="Increase"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Offer callout */}
              <div className={`mt-5 rounded-2xl border p-4 transition-colors ${
                freeDelivery ? 'border-sage-200 bg-sage-50' : 'border-bamboo-200 bg-bamboo-50/60'
              }`}>
                {freeDelivery ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sage-500 text-cream-100 inline-flex items-center justify-center flex-shrink-0">
                      <Check size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-sage-600">Free delivery unlocked</p>
                      <p className="text-[12.5px] text-ink-600 mt-0.5">You saved {formatPKR(delivery)} on this order.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-bamboo-200 text-bamboo-700 inline-flex items-center justify-center flex-shrink-0">
                      <Truck size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-800">Add {toGo} more for free delivery</p>
                      <p className="text-[12.5px] text-ink-600 mt-0.5">Orders of {freeMin}+ jars ship free across Pakistan.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              <dl className="mt-5 space-y-1.5 text-sm text-ink-600">
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPKR(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Delivery</dt>
                  <dd className={freeDelivery ? 'text-sage-600 font-medium' : ''}>
                    {freeDelivery ? 'Free' : formatPKR(delivery)}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-ink-100">
                  <dt className="text-ink-700 font-medium">Total</dt>
                  <dd className="font-display text-lg text-ink-800">{formatPKR(total)}</dd>
                </div>
              </dl>

              {/* CTAs */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button onClick={onAddToCart} className="btn-primary-lg">
                  Add to Order
                </button>
                <Link to="/checkout" className="btn-secondary !text-center">
                  Checkout
                  <ChevronRight size={16} />
                </Link>
              </div>

              <p className="mt-3 text-[12px] text-ink-500 text-center">
                Cash on Delivery · Free delivery on 2+ jars
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
