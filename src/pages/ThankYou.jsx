import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Copy, MessageCircle, ArrowRight, Package } from 'lucide-react';
import { getOrder } from '../lib/orders';
import { useSettings } from '../context/SettingsContext';
import { formatPKR, formatDateTime } from '../lib/format';
import { useToast } from '../context/ToastContext';
import Image from '../components/ui/Image';

export default function ThankYou() {
  const { orderId } = useParams();
  const { settings } = useSettings();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const o = await getOrder(orderId);
        if (alive) setOrder(o);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [orderId]);

  const copy = () => {
    if (!order) return;
    navigator.clipboard?.writeText(order.orderId || orderId);
    toast.success('Order ID copied to clipboard.');
  };

  const c = settings?.contact || {};
  const wa = (c.whatsapp || '').replace(/[^\d+]/g, '');

  return (
    <>
      <Helmet><title>Thank you — DELISOGA</title></Helmet>
      <section className="pt-10 sm:pt-16 pb-24">
        <div className="container-narrow">
          <div className="text-center max-w-xl mx-auto">
            <div className="mx-auto w-16 h-16 rounded-full bg-sage-100 text-sage-600 inline-flex items-center justify-center">
              <CheckCircle2 size={32} strokeWidth={1.6} />
            </div>
            <h1 className="mt-5 font-display text-display-lg text-ink-800 text-balance">Thank you — your order is received.</h1>
            <p className="mt-3 text-ink-600 text-pretty">
              We’ve received your order and will reach out to confirm it shortly. Keep your Order ID handy for any follow-up.
            </p>
          </div>

          {loading ? (
            <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-6 animate-pulse h-48" />
          ) : !order ? (
            <div className="mt-10 rounded-2xl border border-ink-100 bg-white p-6 text-center">
              <p className="text-ink-600">We couldn’t find an order with that ID.</p>
              <Link to="/" className="btn-link mt-3 inline-flex">Back to home</Link>
            </div>
          ) : (
            <>
              <div className="mt-10 rounded-3xl border border-ink-100 bg-white p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-ink-400">Order ID</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-display text-2xl sm:text-3xl text-ink-800 tracking-tight">{order.orderId}</span>
                      <button onClick={copy} className="w-8 h-8 inline-flex items-center justify-center rounded-full text-ink-500 hover:text-ink-800 hover:bg-cream-200 transition" aria-label="Copy Order ID">
                        <Copy size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-ink-500 mt-1.5">Placed on {formatDateTime(order.createdAt)}</p>
                  </div>
                  <span className="badge-ink self-start sm:self-auto">{order.status}</span>
                </div>

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-ink-400">Name</p>
                    <p className="text-sm text-ink-800 font-medium mt-1">{order.customerName}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-ink-400">Delivery to</p>
                    <p className="text-sm text-ink-800 font-medium mt-1">{order.city}</p>
                    <p className="text-xs text-ink-500 mt-0.5 leading-snug">{order.address}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-ink-400">Payment</p>
                    <p className="text-sm text-ink-800 font-medium mt-1">{order.paymentMethod}</p>
                    <p className="text-xs text-ink-500 mt-0.5">Pay on delivery</p>
                  </div>
                </div>

                <div className="mt-7 pt-6 border-t border-ink-100 flex items-center gap-4">
                  <div className="w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-cream-200">
                    <Image src="/images/product-main.jpg" alt="DELISOGA glass jar" className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-ink-400">DELISOGA</p>
                    <p className="font-display text-[15px] text-ink-800 leading-snug">Glass Jar with Bamboo Lid & Glass Straw</p>
                    <p className="text-sm text-ink-500 mt-1">Quantity: {order.quantity}</p>
                  </div>
                </div>

                <dl className="mt-6 space-y-2 text-sm text-ink-600">
                  <div className="flex items-center justify-between"><dt>Subtotal</dt><dd>{formatPKR(order.subtotal)}</dd></div>
                  <div className="flex items-center justify-between"><dt>Delivery</dt><dd className={order.freeDelivery ? 'text-sage-600 font-medium' : ''}>{order.freeDelivery ? 'Free' : formatPKR(order.deliveryCharges)}</dd></div>
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-ink-100">
                    <dt className="text-ink-700 font-medium">Total</dt>
                    <dd className="font-display text-xl text-ink-800">{formatPKR(order.finalTotal)}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {wa && (
                  <a
                    href={`https://wa.me/${wa.replace(/^\+/, '')}?text=${encodeURIComponent(`Hi, I just placed an order (ID: ${order.orderId}). Could you confirm the dispatch?`)}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-sage-500 hover:bg-sage-600 text-cream-100 font-medium transition"
                  >
                    <MessageCircle size={18} /> Confirm on WhatsApp
                  </a>
                )}
                <Link to="/product" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-ink-800 text-cream-100 font-medium hover:bg-ink-700 transition">
                  <Package size={16} /> View product again <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
