import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Heart, Leaf, Package } from 'lucide-react';
import Image from '../components/ui/Image';

const principles = [
  { Icon: Sparkles, title: 'Considered design', body: 'Every detail — from the wall thickness to the bamboo grain to the straw diameter — was chosen with daily use in mind.' },
  { Icon: Leaf, title: 'Natural materials', body: 'Food-safe glass and real bamboo. No plastic, no metal, no unnecessary parts.' },
  { Icon: Heart, title: 'Built to be used', body: 'A jar you can use every day, not a piece that sits on a shelf. It is made for your kitchen counter, your desk, your bag.' },
  { Icon: Package, title: 'Packed with care', body: 'We inspect every order and pack it with protective packaging so it arrives in the condition we’d want for ourselves.' },
];

export default function About() {
  return (
    <>
      <Helmet><title>About — DELISOGA</title></Helmet>
      <section className="pt-12 sm:pt-16 pb-10">
        <div className="container-narrow">
          <p className="eyebrow justify-center">Our story</p>
          <h1 className="mt-2 font-display text-display-xl text-ink-800 text-center text-balance">A small studio, a single great jar.</h1>
          <p className="mt-5 text-[1.05rem] text-ink-600 text-center max-w-2xl mx-auto text-pretty">
            DELISOGA is a small Pakistan-based studio that focuses on one product done really well.
            We started with a simple idea: a glass jar that looks at home anywhere — your kitchen,
            your desk, your bag — and is genuinely pleasant to drink from, every day.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-cream-200 shadow-soft-md">
                <Image src="/images/lifestyle-kitchen.jpg" alt="A person holding the DELISOGA glass jar at home" className="w-full h-full" />
              </div>
            </div>
            <div className="lg:col-span-6">
              <h2 className="font-display text-display-lg text-ink-800 text-balance">Why we made it.</h2>
              <p className="mt-4 text-ink-600 text-pretty">
                We were tired of disposable cups, plastic tumblers, and jars that looked generic. So we
                designed one ourselves. Thick food-safe glass, a real bamboo lid with character, and a
                reusable glass straw — paired with the kind of warm, considered aesthetic you’d expect
                from a small independent brand.
              </p>
              <p className="mt-3 text-ink-600 text-pretty">
                DELISOGA ships from Pakistan and is built to be used, every day, by people who care
                about how their everyday things look and feel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">What we care about</p>
            <h2 className="mt-2 font-display text-display-lg text-ink-800 text-balance">Four principles behind every jar.</h2>
          </div>
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {principles.map(({ Icon, title, body }) => (
              <li key={title} className="bg-white border border-ink-100 rounded-2xl p-5 sm:p-6">
                <div className="w-11 h-11 rounded-xl bg-bamboo-50 text-bamboo-600 inline-flex items-center justify-center">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-display text-[1.05rem] text-ink-800">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <div className="rounded-3xl bg-cream-200/70 border border-cream-300 p-8 sm:p-12 text-center">
            <h2 className="font-display text-3xl sm:text-4xl text-ink-800 text-balance">Ready to try one?</h2>
            <p className="mt-3 text-ink-600 max-w-xl mx-auto text-pretty">
              PKR 1,000 per jar. Free delivery on 2+. Cash on Delivery across Pakistan.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/checkout" className="btn-primary-lg">Order Now</Link>
              <Link to="/product" className="btn-secondary">See the product</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
