import { Coffee, GlassWater, Cherry, IceCreamCone, Laptop, Sun, Briefcase, Home } from 'lucide-react';
import Image from '../ui/Image';

const scenes = [
  {
    src: '/images/lifestyle-juice.jpg',
    alt: 'DELISOGA glass jar with fresh orange juice on a marble counter',
    label: 'Fresh juice',
    Icon: Cherry,
  },
  {
    src: '/images/lifestyle-kitchen.jpg',
    alt: 'A woman holding a DELISOGA glass jar in a sunlit kitchen',
    label: 'Home & kitchen',
    Icon: Home,
  },
  {
    src: '/images/lifestyle-desk.jpg',
    alt: 'A man sipping from a DELISOGA glass jar at his desk with a laptop',
    label: 'Office & desk',
    Icon: Briefcase,
  },
];

/* Secondary small chips — shown as inline lifestyle tags */
const occasions = [
  { Icon: Coffee, label: 'Iced coffee' },
  { Icon: GlassWater, label: 'Water' },
  { Icon: Cherry, label: 'Juice' },
  { Icon: IceCreamCone, label: 'Smoothies' },
  { Icon: Sun, label: 'Breakfast' },
  { Icon: Laptop, label: 'Desk' },
];

export default function PerfectForEveryDrink() {
  return (
    <section className="py-16 sm:py-24 bg-white border-y border-ink-100/80">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
          <div className="lg:col-span-5">
            <p className="eyebrow">Perfect for every drink</p>
            <h2 className="mt-2 font-display text-display-lg text-ink-800 text-balance">
              From your morning pour to your evening wind-down.
            </h2>
            <p className="mt-4 text-ink-600 max-w-md text-pretty">
              A wide mouth for ice and fruit. A comfortable hold. A reusable straw for smoothies and
              iced coffee. One jar that quietly fits into your day.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {occasions.map(({ Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 border border-ink-100 text-[13px] text-ink-700">
                  <Icon size={14} className="text-bamboo-500" /> {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-12 gap-3 sm:gap-4">
              {/* Tall primary image */}
              <div className="col-span-7 relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-200 shadow-soft-md">
                <Image src={scenes[0].src} alt={scenes[0].alt} className="w-full h-full" />
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[12px] font-medium text-ink-700">
                  {(() => { const Icon = scenes[0].Icon; return <Icon size={13} className="text-bamboo-500" />; })()} {scenes[0].label}
                </div>
              </div>
              {/* Two stacked */}
              <div className="col-span-5 grid grid-rows-2 gap-3 sm:gap-4">
                {scenes.slice(1).map((s) => {
                  const Icon = s.Icon;
                  return (
                    <div key={s.label} className="relative rounded-3xl overflow-hidden bg-cream-200 shadow-soft-sm">
                      <Image src={s.src} alt={s.alt} className="w-full h-full" />
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[11.5px] font-medium text-ink-700">
                        <Icon size={12} className="text-bamboo-500" /> {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
