import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Truck, MapPin, Clock, Package } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <>
      <Helmet><title>Shipping & Delivery — DELISOGA</title></Helmet>
      <section className="pt-10 sm:pt-16 pb-20">
        <div className="container-narrow">
          <nav className="text-[12.5px] text-ink-500 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-800 transition">Home</Link>
            <span className="mx-2 text-ink-300">/</span>
            <span className="text-ink-700">Shipping &amp; Delivery</span>
          </nav>
          <p className="eyebrow">Shipping &amp; Delivery</p>
          <h1 className="mt-2 font-display text-display-xl text-ink-800 text-balance">How we get your order to you.</h1>
          <p className="mt-4 text-ink-600 text-pretty max-w-2xl">
            We currently ship across Pakistan. Below is what to expect after you place your order.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { Icon: MapPin, t: 'Where we ship', d: 'Across Pakistan. We are working on expanding soon.' },
              { Icon: Package, t: 'Packaging', d: 'Each order is packed with protective packaging to keep your jar safe in transit.' },
              { Icon: Clock, t: 'Dispatch time', d: 'We aim to dispatch confirmed orders within 1–2 business days.' },
              { Icon: Truck, t: 'Delivery time', d: 'Delivery times vary by city and are shared with you on order confirmation.' },
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
            <h2>Delivery charges</h2>
            <ul>
              <li>Orders of 2 or more jars: <strong>Free delivery</strong> across Pakistan.</li>
              <li>Orders of 1 jar: A flat delivery fee is added at checkout.</li>
            </ul>
            <p>
              The exact delivery fee is shown at checkout and is configurable by us. If it changes
              after you have placed an order, the original fee on your order remains — we never
              retroactively change order totals.
            </p>

            <h2>Order tracking</h2>
            <p>
              We will share dispatch and delivery updates with you via phone call, SMS, or
              WhatsApp. If you do not hear from us within 2 business days of placing your order,
              please reach out.
            </p>

            <h2>Delivery issues</h2>
            <p>
              If your order has not arrived within a reasonable time of the expected window, or if
              there is any issue with the delivery, please contact us as soon as possible with
              your Order ID and we will help.
            </p>

            <h2>Unsuccessful delivery attempts</h2>
            <p>
              Our delivery partner may attempt delivery more than once. If a delivery cannot be
              completed due to incorrect or unreachable address details, the order may be returned
              to us. We will then reach out to arrange redelivery.
            </p>

            <h2>Damaged in transit</h2>
            <p>
              If your order arrives damaged, please send us a photo of the issue on WhatsApp
              within 48 hours of receipt and we will make it right. See our <Link to="/returns-policy">Returns Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
