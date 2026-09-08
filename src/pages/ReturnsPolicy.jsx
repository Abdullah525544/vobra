import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, MessageCircle, Package } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function ReturnsPolicy() {
  const { settings } = useSettings();
  const c = settings?.contact || {};
  const wa = (c.whatsapp || '').replace(/[^\d+]/g, '');

  return (
    <>
      <Helmet><title>Returns & Refunds — DELISOGA</title></Helmet>
      <section className="pt-10 sm:pt-16 pb-20">
        <div className="container-narrow">
          <nav className="text-[12.5px] text-ink-500 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-800 transition">Home</Link>
            <span className="mx-2 text-ink-300">/</span>
            <span className="text-ink-700">Returns &amp; Refunds</span>
          </nav>
          <p className="eyebrow">Returns &amp; Refunds</p>
          <h1 className="mt-2 font-display text-display-xl text-ink-800 text-balance">Our promise if something isn’t right.</h1>
          <p className="mt-4 text-ink-600 text-pretty max-w-2xl">
            We inspect every order before dispatch. If something arrives damaged or isn’t right, we’ll make it right.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { Icon: ShieldCheck, t: 'Quality checked', d: 'Each order is inspected before it leaves our studio.' },
              { Icon: Package, t: 'Packed with care', d: 'Protective packaging designed for glass in transit.' },
              { Icon: MessageCircle, t: 'Real human help', d: 'Reach us on WhatsApp — we’ll respond quickly.' },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-ink-100 bg-white p-5">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-600">
                  <Icon size={18} />
                </div>
                <h2 className="mt-3 font-display text-[1.05rem] text-ink-800">{t}</h2>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          <div className="prose-policy mt-10">
            <h2>Damaged or incorrect orders</h2>
            <p>
              If your order arrives damaged, or you received the wrong item, please contact us
              within <strong>48 hours of receiving the order</strong>. Send us your Order ID and a
              photo of the issue on WhatsApp or email and we will arrange a replacement or refund.
            </p>

            <h2>Change of mind</h2>
            <p>
              Because our product is a single glass jar and we keep stock small, we are unable to
              accept returns for change of mind on opened or used items. If your order is
              unopened and in its original packaging, please contact us within 48 hours of
              delivery to discuss options.
            </p>

            <h2>Order not received</h2>
            <p>
              If your order has not arrived within a reasonable time of the expected window,
              please reach out with your Order ID. We will follow up with our delivery partner
              and keep you updated.
            </p>

            <h2>Refunds</h2>
            <p>
              Approved refunds for Cash on Delivery orders are issued via bank transfer to a
              Pakistani account you provide. Refunds are typically processed within a few business
              days after approval.
            </p>

            <h2>How to reach us</h2>
            <p>
              The fastest way to reach us is WhatsApp. Please include your Order ID, a brief
              description of the issue, and a photo if applicable.
            </p>
            {wa && (
              <p>
                <a href={`https://wa.me/${wa.replace(/^\+/, '')}`} className="btn-primary !bg-sage-500 hover:!bg-sage-600 mt-2">
                  Chat on WhatsApp
                </a>
              </p>
            )}
            <p className="mt-4">You can also visit our <Link to="/contact">Contact page</Link> for other ways to reach us.</p>
          </div>
        </div>
      </section>
    </>
  );
}
