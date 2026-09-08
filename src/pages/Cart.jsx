import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, ArrowRight, Check, Truck, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatPKR } from '../lib/format';
import QuantitySelector from '../components/ui/QuantitySelector';

export default function Cart() {
  const { settings } = useSettings();
  const { quantity, setQuantity, reset } = useCart();
  const product = settings?.product || {};
  const unit = Number(product.unitPrice || 0);
  const freeMin = Number(product.freeDeliveryMinQty || 2);
  const freeDelivery = quantity >= freeMin;
  const delivery = Number(product.deliveryCharge || 0);
  const subtotal = unit * quantity;
  const total = subtotal + (freeDelivery ? 0 : delivery);
  const toGo = Math.max(0, freeMin - quantity);

  return (
    <>
      <Helmet><title>Your Order — DELISOGA</title></Helmet>
      <section className="pt-10 sm:pt-14 pb-20">
        <div className="container-x">
          <nav className="text-[12.5px] text-ink-500 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-800 transition">Home</Link>
            <span className="mx-2 text-ink-300">/</span>
            <span className="text-ink-700">Your order</span>
          </nav>

          <h1 className="font-display text-display-lg text-ink-800 text-balance">Your order</h1>
          <p className="mt-2 text-ink-600 text-pretty">Review your selection before completing your details on the next step.</p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery callout */}
              {!freeDelivery && toGo > 0 ? (
                <div className="rounded-2xl border border-bamboo-200 bg-bamboo-50/60 p-4 sm:p-5 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-bamboo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-ink-800 text-[15px]">Add {toGo} more for free delivery</p>
                    <p className="text-sm text-ink-600 mt-0.5">Orders of {freeMin}+ jars ship free across Pakistan.</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-sage-200 bg-sage-50 p-4 sm:p-5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-sage-500 text-cream-100 inline-flex items-center justify-center flex-shrink-0">
                    <Check size={14} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-semibold text-sage-600 text-[15px]">Free delivery unlocked</p>
                    <p className="text-sm text-ink-600 mt-0.5">You saved {formatPKR(delivery)} on this order.</p>
                  </div>
                </div>
              )}

              {/* Line item */}
              <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6 flex gap-4 sm:gap-5">
                <div className="w-24 sm:w-28 h-28 sm:h-32 flex-shrink-0 bg-cream-200 rounded-xl overflow-hidden">
                  <img src="/images/product-main.jpg" alt="DELISOGA glass jar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <p className="text-[11px] uppercase tracking-wider text-ink-400">DELISOGA</p>
                  <h2 className="font-display text-[1.1rem] text-ink-800 leading-tight mt-0.5">Glass Jar with Bamboo Lid & Glass Straw</h2>
                  <p className="text-sm text-ink-500 mt-1">{formatPKR(unit)} per jar</p>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <QuantitySelector value={quantity} onChange={setQuantity} />
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px] text-ink-600">
                <div className="flex items-center gap-2 p-3.5 bg-white border border-ink-100 rounded-xl">
                  <Truck size={16} className="text-bamboo-500" /> Free delivery on 2+ jars
                </div>
                <div className="flex items-center gap-2 p-3.5 bg-white border border-ink-100 rounded-xl">
                  <ShieldCheck size={16} className="text-bamboo-500" /> Secure ordering
                </div>
                <div className="flex items-center gap-2 p-3.5 bg-white border border-ink-100 rounded-xl">
                  <Check size={16} className="text-bamboo-500" /> Quality checked
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
                <h3 className="font-display text-lg text-ink-800">Order summary</h3>
                <dl className="mt-5 space-y-2.5 text-sm text-ink-600">
                  <div className="flex items-center justify-between">
                    <dt>Subtotal ({quantity} jar{quantity === 1 ? '' : 's'})</dt>
                    <dd>{formatPKR(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Delivery</dt>
                    <dd className={freeDelivery ? 'text-sage-600 font-medium' : ''}>
                      {freeDelivery ? 'Free' : formatPKR(delivery)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-ink-100">
                    <dt className="text-ink-700 font-medium">Total</dt>
                    <dd className="font-display text-xl text-ink-800">{formatPKR(total)}</dd>
                  </div>
                </dl>
                <Link to="/checkout" className="btn-primary-lg w-full mt-5">
                  Continue to checkout <ArrowRight size={18} />
                </Link>
                <Link to="/" className="btn-ghost w-full mt-2">Keep shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
