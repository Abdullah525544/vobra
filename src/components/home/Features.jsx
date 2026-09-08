import { useState } from 'react';
import { Layers, Droplet, Crown, Leaf, Repeat, Wrench } from 'lucide-react';
import Image from '../ui/Image';

const features = [
  {
    key: 'bamboo',
    Icon: Leaf,
    title: 'Natural bamboo lid',
    body:
      'A real bamboo lid with a snug, food-safe fit. Each lid carries a unique grain pattern — no two jars look exactly the same.',
    image: '/images/feature-lid.jpg',
    alt: 'Close-up of the natural bamboo lid with a glass straw inserted',
  },
  {
    key: 'straw',
    Icon: Droplet,
    title: 'Reusable glass straw',
    body:
      'A matched glass straw that goes wherever the jar goes. Smooth sipping for juices, iced coffee and smoothies — with no plastic taste.',
    image: '/images/product-main.jpg',
    alt: 'Glass straw inserted through the bamboo lid of the DELISOGA jar',
  },
  {
    key: 'glass',
    Icon: Layers,
    title: 'Thick, food-safe glass',
    body:
      'A balanced wall thickness — sturdy in the hand, light enough to carry every day. Clear, refined, and easy to wash.',
    image: '/images/product-alt-1.jpg',
    alt: 'Detail of the DELISOGA glass jar body and DELISOGA label',
  },
  {
    key: 'design',
    Icon: Crown,
    title: 'Designed to last',
    body:
      'A wide mouth for ice and fruit, a stable base, and proportions that feel right at a desk, on a counter, or at the table.',
    image: '/images/product-alt-2.jpg',
    alt: 'DELISOGA glass jar styled with a soft neutral background',
  },
];

export default function Features() {
  const [active, setActive] = useState(features[0].key);
  const current = features.find((f) => f.key === active);

  return (
    <section className="py-16 sm:py-24 bg-cream-100">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Close-up features</p>
          <h2 className="mt-2 font-display text-display-lg text-ink-800 text-balance">
            The details you can see — and the ones you can feel.
          </h2>
          <p className="mt-3 text-ink-600 text-pretty">
            Glass that feels solid in your hand. A bamboo lid that doesn’t wobble. A straw that’s
            actually a pleasure to drink from. Every part earned its place.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Image */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-cream-200 to-beige-100 shadow-soft-md">
              <Image
                key={current.image}
                src={current.image}
                alt={current.alt}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Feature list */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <ul className="space-y-2">
              {features.map((f) => {
                const isActive = f.key === active;
                return (
                  <li key={f.key}>
                    <button
                      type="button"
                      onClick={() => setActive(f.key)}
                      className={`w-full text-left flex gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? 'bg-white border-ink-200 shadow-soft-md'
                          : 'bg-transparent border-transparent hover:bg-white/60 hover:border-ink-100'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? 'bg-bamboo-100 text-bamboo-600' : 'bg-cream-200 text-ink-500'
                      }`}>
                        <f.Icon size={20} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-display text-[1.05rem] ${isActive ? 'text-ink-800' : 'text-ink-700'}`}>
                          {f.title}
                        </h3>
                        <p className={`mt-1 text-[13.5px] leading-relaxed text-ink-600 transition-all duration-300 ${
                          isActive ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0 overflow-hidden sm:max-h-40 sm:opacity-70'
                        }`}>
                          {f.body}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
