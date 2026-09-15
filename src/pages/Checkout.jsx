import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, ShieldCheck, Truck, Sparkles, Check, ChevronRight, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { formatPKR } from '../lib/format';
import { validateCheckout, normalizePhone } from '../lib/validation';
import { createOrder } from '../lib/orders';
import Image from '../components/ui/Image';
import QuantitySelector from '../components/ui/QuantitySelector';

export default function Checkout() {
  const { settings } = useSettings();
  const { quantity, setQuantity } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const product = settings?.product || {};
  const unit = Number(product.unitPrice || 0);
  const freeMin = Number(product.freeDeliveryMinQty || 2);
  const freeDelivery = quantity >= freeMin;
  const delivery = Number(product.deliveryCharge || 0);
  const subtotal = unit * quantity;
  const total = subtotal + (freeDelivery ? 0 : delivery);

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    quantity,
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitToken, setSubmitToken] = useState(0); // prevent double submit

  const refs = {
    customerName: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    address: useRef(null),
    city: useRef(null),
    quantity: useRef(null),
  };

  useEffect(() => { setForm((f) => ({ ...f, quantity })); }, [quantity]);

  const c = settings?.contact || {};
  const wa = (c.whatsapp || '').replace(/[^\d+]/g, '');

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitToken((t) => t + 1);
    // Normalize phone before validation
    const submitForm = { ...form, phone: normalizePhone(form.phone) };
    const v = validateCheckout(submitForm);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      // Find the first error field and scroll + focus it
      const order = ['customerName', 'phone', 'email', 'address', 'city', 'quantity'];
      const firstKey = order.find((k) => v[k]);
      if (firstKey && refs[firstKey]?.current) {
        const el = refs[firstKey].current;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // delay focus so the scroll can settle
        setTimeout(() => el.focus?.(), 350);
      }
      const firstError = firstKey ? v[firstKey] : null;
      toast.error(firstError || 'Please fix the highlighted fields.');
      return;
    }
    // Use the normalised form (with cleaned phone) when creating the order
    setForm(submitForm);
    setSubmitting(true);
    try {
      const order = await createOrder(submitForm, settings);
      toast.success('Order placed! Redirecting…');
      // Pass the full order via navigation state so the Thank You page can
      // render without needing to read it back from Firestore (customers
      // cannot read /orders/{id} per security rules — only admins can).
      navigate(`/thank-you/${order.orderId}`, { state: { order }, replace: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ['Your details', 'Review', 'Done'];

  return (
    <>
      <Helmet><title>Checkout — DELISOGA</title></Helmet>
      <section className="pt-8 sm:pt-12 pb-24">
        <div className="container-x">
          <nav className="text-[12.5px] text-ink-500 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-800 transition">Home</Link>
            <span className="mx-2 text-ink-300">/</span>
            <Link to="/cart" className="hover:text-ink-800 transition">Your order</Link>
            <span className="mx-2 text-ink-300">/</span>
            <span className="text-ink-700">Checkout</span>
          </nav>

          {/* Steps */}
          <ol className="flex items-center gap-3 sm:gap-5 text-[12px] sm:text-[13px] text-ink-500 mb-6">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2 sm:gap-3">
                <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-[11px] font-semibold ${
                  i === 0 ? 'bg-ink-800 text-cream-100' : i === 1 ? 'bg-bamboo-200 text-bamboo-700' : 'bg-cream-200 text-ink-500'
                }`}>
                  {i === 0 ? '1' : i === 1 ? '2' : '3'}
                </span>
                <span className={i === 0 ? 'text-ink-800 font-medium' : ''}>{s}</span>
                {i < steps.length - 1 && <ChevronRight size={14} className="text-ink-300" />}
              </li>
            ))}
          </ol>

          <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8" noValidate>
            <div className="lg:col-span-7 space-y-5">
              {/* Contact */}
              <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-7">
                <h2 className="font-display text-xl text-ink-800">Your details</h2>
                <p className="text-sm text-ink-500 mt-1">We use this to confirm your order and arrange delivery.</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="customerName">Full name *</label>
                    <input id="customerName" ref={refs.customerName} className="input-lg" placeholder="e.g. Ayesha Khan" autoComplete="name"
                           value={form.customerName} onChange={update('customerName')} />
                    {errors.customerName && <p className="error">{errors.customerName}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">Phone number *</label>
                    <input id="phone" ref={refs.phone} className="input-lg" placeholder="03XX XXXXXXX" inputMode="tel" autoComplete="tel"
                           value={form.phone} onChange={update('phone')} />
                    {errors.phone && <p className="error">{errors.phone}</p>}
                    <p className="help">Pakistani mobile number (e.g. 0300 1234567 or +92 300 1234567).</p>
                  </div>
                  <div>
                    <label className="label" htmlFor="email">Email (optional)</label>
                    <input id="email" ref={refs.email} type="email" className="input-lg" placeholder="you@example.com" autoComplete="email"
                           value={form.email} onChange={update('email')} />
                    {errors.email && <p className="error">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="address">Complete delivery address *</label>
                    <textarea id="address" ref={refs.address} rows={3} className="input-lg resize-none" placeholder="House / flat, street, area, landmark"
                              value={form.address} onChange={update('address')} />
                    {errors.address && <p className="error">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="city">City *</label>
                    <input id="city" ref={refs.city} className="input-lg" placeholder="e.g. Lahore" autoComplete="address-level2"
                           value={form.city} onChange={update('city')} />
                    {errors.city && <p className="error">{errors.city}</p>}
                  </div>
                  <div ref={refs.quantity}>
                    <label className="label" htmlFor="quantity">Quantity</label>
                    <QuantitySelector value={quantity} onChange={setQuantity} size="lg" />
                    {errors.quantity && <p className="error">{errors.quantity}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="notes">Order notes (optional)</label>
                    <textarea id="notes" rows={2} className="input-lg resize-none" placeholder="Any delivery instructions, landmark, preferred time"
                              value={form.notes} onChange={update('notes')} />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-7">
                <h2 className="font-display text-xl text-ink-800">Payment method</h2>
                <div className="mt-4 p-4 rounded-xl border border-ink-100 bg-cream-100 flex items-center gap-3">
                  <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-sage-100 text-sage-600">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-800">Cash on Delivery</p>
                    <p className="text-xs text-ink-500 mt-0.5">Pay the rider when your order arrives.</p>
                  </div>
                  <span className="badge-sage">Selected</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
                  <h3 className="font-display text-lg text-ink-800">Order summary</h3>
                  <div className="mt-4 flex gap-3 sm:gap-4">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 bg-cream-200 rounded-xl overflow-hidden">
                      <Image src="/images/product-main.jpg" alt="DELISOGA glass jar" className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-ink-400">DELISOGA</p>
                      <p className="font-display text-[14.5px] text-ink-800 leading-snug mt-0.5">Glass Jar with Bamboo Lid & Glass Straw</p>
                      <p className="text-xs text-ink-500 mt-1">{quantity} × {formatPKR(unit)}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-ink-100 space-y-2 text-sm text-ink-600">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>{formatPKR(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delivery</span>
                      <span className={freeDelivery ? 'text-sage-600 font-medium' : ''}>
                        {freeDelivery ? 'Free' : formatPKR(delivery)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-ink-100">
                      <span className="text-ink-700 font-medium">Total</span>
                      <span className="font-display text-xl text-ink-800">{formatPKR(total)}</span>
                    </div>
                  </div>

                  {!freeDelivery && (
                    <div className="mt-4 p-3 rounded-xl bg-bamboo-50/60 border border-bamboo-200 text-[12.5px] text-ink-700 flex items-start gap-2">
                      <Truck className="w-4 h-4 text-bamboo-500 flex-shrink-0 mt-0.5" />
                      Add {Math.max(0, freeMin - quantity)} more jar{Math.max(0, freeMin - quantity) === 1 ? '' : 's'} for free delivery.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary-lg w-full mt-5"
                    data-submit-token={submitToken}
                  >
                    {submitting ? 'Placing order…' : (
                      <>
                        <Lock size={16} /> Place order — {formatPKR(total)}
                      </>
                    )}
                  </button>
                  <p className="text-[11.5px] text-ink-500 text-center mt-2.5">
                    By placing this order you agree to our <Link to="/terms" className="underline hover:text-ink-800">Terms</Link>.
                  </p>
                </div>

                {/* Help */}
                <div className="rounded-2xl border border-ink-100 bg-white p-5">
                  <p className="text-[11px] uppercase tracking-wider text-ink-400">Need help?</p>
                  <p className="text-sm text-ink-700 mt-1.5">We’re happy to help before you place your order.</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {c.phone && (
                      <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="text-sm font-medium text-ink-800 hover:text-bamboo-600">
                        {c.phone}
                      </a>
                    )}
                    {wa && (
                      <a
                        href={`https://wa.me/${wa.replace(/^\+/, '')}?text=${encodeURIComponent('Hi, I have a question about the DELISOGA glass jar before ordering.')}`}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:text-sage-700"
                      >
                        <MessageCircle size={14} /> Chat on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
