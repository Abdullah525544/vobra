import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'What material is the jar made of?',
    a: 'The jar is made of thick, food-safe glass. The lid is natural bamboo with a food-safe inner ring. The straw is reusable glass.',
  },
  {
    q: 'What comes in the package?',
    a: 'Each order includes 1× glass jar (approx. 450ml), 1× bamboo lid, and 1× reusable glass straw. It arrives in protective packaging.',
  },
  {
    q: 'Is the bamboo lid leak-proof?',
    a: 'The bamboo lid has a snug fit designed for everyday carrying and tilting. It is not marketed as 100% leak-proof under pressure (e.g. being thrown in a bag upside down) — treat it like a quality takeaway cup.',
  },
  {
    q: 'How do I clean the jar and straw?',
    a: 'Hand-wash the glass jar and straw with warm water, mild soap and a brush. For the bamboo lid, wipe with a damp cloth, towel-dry, and let it air-dry upright. Do not soak the lid or put it in a dishwasher.',
  },
  {
    q: 'What drinks can I use it for?',
    a: 'Water, juices, iced coffee, smoothies, kombucha, fruit drinks and more. It is not designed for very hot liquids as a primary use — let hot drinks cool a little first.',
  },
  {
    q: 'How much is delivery?',
    a: 'Delivery is a flat fee on orders of 1 jar. Add 2 or more jars and delivery is free across Pakistan.',
  },
  {
    q: 'How do I pay?',
    a: 'Cash on Delivery. You pay the rider when your order arrives.',
  },
  {
    q: 'How will I know my order was received?',
    a: 'After checkout, you will see a Thank You page with your unique Order ID, and we’ll follow up with a confirmation message to confirm dispatch.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-cream-100">
      <div className="container-narrow">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow justify-center">Frequently asked questions</p>
          <h2 className="mt-2 font-display text-display-lg text-ink-800 text-balance">
            Quick answers before you order.
          </h2>
        </div>

        <div className="mt-10 space-y-2.5">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`rounded-2xl border transition-colors ${
                  isOpen ? 'bg-white border-ink-200 shadow-soft-sm' : 'bg-white border-ink-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-ink-800 text-[15px] sm:text-[16px]">{f.q}</span>
                  <span className={`w-8 h-8 inline-flex items-center justify-center rounded-full flex-shrink-0 transition ${
                    isOpen ? 'bg-ink-800 text-cream-100' : 'bg-cream-200 text-ink-700'
                  }`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 text-[14px] text-ink-600 leading-relaxed text-pretty">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to="/faq" className="btn-link">
            See all questions →
          </Link>
        </div>
      </div>
    </section>
  );
}
