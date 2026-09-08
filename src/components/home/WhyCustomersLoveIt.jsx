import { Sparkles, Leaf, Droplets, Coffee, Palette, Repeat, Heart, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    Icon: Sparkles,
    title: 'Premium glass quality',
    body: 'Thick, food-safe glass with a clear, refined finish that looks at home on any counter or table.',
  },
  {
    Icon: Droplets,
    title: 'Reusable glass straw',
    body: 'A matched glass straw — not plastic. Smooth drinking and easy to clean with the included brush.',
  },
  {
    Icon: Leaf,
    title: 'Natural bamboo lid',
    body: 'Each lid is made from real bamboo, with a snug fit and warm natural grain that pairs with the glass.',
  },
  {
    Icon: Coffee,
    title: 'For every drink',
    body: 'Water, juices, iced coffee, smoothies, fruit drinks, kombucha — one jar for your daily rotation.',
  },
  {
    Icon: Repeat,
    title: 'Reusable, not disposable',
    body: 'Built to be used every day. Replace single-use plastic cups and bottles with one lasting piece.',
  },
  {
    Icon: Palette,
    title: 'Designed to look good',
    body: 'A quiet, elegant silhouette that feels intentional in your kitchen, on your desk, or at the table.',
  },
  {
    Icon: Heart,
    title: 'Made for daily life',
    body: 'A comfortable hold, a wide mouth for ice and fruit, and a stable base that doesn’t tip easily.',
  },
  {
    Icon: ShieldCheck,
    title: 'Quality checked',
    body: 'Each jar is inspected before dispatch. We ship only what we’d happily keep on our own counters.',
  },
];

export default function WhyCustomersLoveIt() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Why customers love it</p>
          <h2 className="mt-2 font-display text-display-lg text-ink-800 text-balance">
            Designed around how you actually drink.
          </h2>
          <p className="mt-3 text-ink-600 text-pretty">
            Every detail — from the glass thickness to the bamboo lid to the included straw — was chosen to make daily hydration feel a little more considered.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {benefits.map(({ Icon, title, body }) => (
            <li
              key={title}
              className="group relative bg-white border border-ink-100 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-ink-200 hover:shadow-soft-md"
            >
              <div className="w-11 h-11 rounded-xl bg-bamboo-50 text-bamboo-600 inline-flex items-center justify-center transition-colors group-hover:bg-bamboo-100">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-display text-[1.05rem] text-ink-800">{title}</h3>
              <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
