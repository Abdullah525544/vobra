import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatPKR } from '../../lib/format';

export default function CTABand() {
  const { settings } = useSettings();
  const unit = Number(settings?.product?.unitPrice || 1000);

  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-ink-800 text-cream-100 px-6 sm:px-10 lg:px-14 py-12 sm:py-16">
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{ background: 'radial-gradient(60% 80% at 90% 0%, rgba(200,164,122,0.45) 0%, rgba(31,27,22,0) 60%), radial-gradient(40% 60% at 0% 100%, rgba(122,143,110,0.25) 0%, rgba(31,27,22,0) 60%)' }}
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="eyebrow text-bamboo-300">Order today</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-cream-100 text-balance leading-tight">
                Bring a quiet upgrade to your everyday drink — for {formatPKR(unit)}.
              </h2>
              <p className="mt-4 text-cream-200/80 max-w-2xl text-pretty">
                Order 1 jar at {formatPKR(unit)} + delivery, or 2+ jars and delivery is on us. Cash on Delivery across Pakistan.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
              <Link to="/checkout" className="btn-primary-lg bg-bamboo-400 !text-ink-900 hover:!bg-bamboo-300">
                Order Now <ArrowRight size={18} />
              </Link>
              <Link to="/product" className="btn-secondary !bg-transparent !text-cream-100 !border-cream-100/30 hover:!bg-cream-100/10 hover:!border-cream-100/50 justify-center">
                <Sparkles size={16} className="text-bamboo-300" /> See the details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
