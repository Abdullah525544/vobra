import { Truck, ShieldCheck, Award, MessageCircle } from 'lucide-react';

const items = [
  { Icon: Truck, title: 'Free delivery on 2+', sub: 'Across Pakistan' },
  { Icon: ShieldCheck, title: 'Secure ordering', sub: 'Cash on Delivery' },
  { Icon: Award, title: 'Quality checked', sub: 'Inspected before dispatch' },
  { Icon: MessageCircle, title: 'Easy support', sub: 'WhatsApp & phone' },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-ink-100/80 bg-white/60">
      <div className="container-x py-5 sm:py-6">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 sm:gap-y-0">
          {items.map(({ Icon, title, sub }) => (
            <li key={title} className="flex items-center gap-3">
              <span className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-cream-200 text-ink-700">
                <Icon size={16} strokeWidth={1.6} />
              </span>
              <div className="leading-tight">
                <p className="text-[13.5px] font-semibold text-ink-800">{title}</p>
                <p className="text-[12px] text-ink-500">{sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
