import { Package, Gift, Sparkles, Truck } from 'lucide-react';
import Image from '../ui/Image';

const includes = [
  { Icon: Package, t: '1× Glass jar (450ml)' },
  { Icon: Gift, t: '1× Natural bamboo lid' },
  { Icon: Sparkles, t: '1× Reusable glass straw' },
  { Icon: Truck, t: 'Protective packaging' },
];

export default function Packaging() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-cream-200 to-beige-100 shadow-soft-md">
              <Image
                src="/images/packaging.jpg"
                alt="DELISOGA glass jar packaging box with bamboo lid and glass straw"
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <p className="eyebrow">What’s in the box</p>
            <h2 className="mt-2 font-display text-display-lg text-ink-800 text-balance">
              Everything you need, nothing you don’t.
            </h2>
            <p className="mt-3 text-ink-600 text-pretty max-w-lg">
              Each DELISOGA glass jar arrives carefully packed with everything you need to start
              using it the moment it arrives.
            </p>

            <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {includes.map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-3 p-3.5 bg-white border border-ink-100 rounded-xl">
                  <span className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-bamboo-50 text-bamboo-600">
                    <Icon size={16} />
                  </span>
                  <span className="text-sm font-medium text-ink-800">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 p-5 rounded-2xl bg-cream-200/70 border border-cream-300 text-sm text-ink-700 leading-relaxed">
              <p>
                <span className="font-semibold text-ink-800">A small note:</span> bamboo is a natural
                material. Hand-wash the lid, towel-dry and let it air-dry upright to keep it looking
                its best for years.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
