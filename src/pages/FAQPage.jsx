import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const groups = [
  {
    title: 'Product',
    items: [
      { q: 'What material is the jar made of?', a: 'The jar is made of thick, food-safe glass. The lid is natural bamboo with a snug fit. The straw is reusable glass.' },
      { q: 'What comes in the package?', a: 'Each order includes 1× glass jar, 1× bamboo lid, and 1× reusable glass straw. It arrives in protective packaging.' },
      { q: 'Is the bamboo lid leak-proof?', a: 'The bamboo lid has a snug fit designed for everyday carrying and tilting. It is not marketed as 100% leak-proof under pressure (e.g. being thrown in a bag upside down).' },
      { q: 'How do I clean the jar and straw?', a: 'Hand-wash the glass jar and straw with warm water, mild soap and a brush. For the bamboo lid, wipe with a damp cloth, towel-dry, and let it air-dry upright. Do not soak the lid or put it in a dishwasher.' },
      { q: 'What drinks can I use it for?', a: 'Water, juices, iced coffee, smoothies, kombucha, fruit drinks and more. For very hot liquids, let them cool a little first.' },
      { q: 'How big is the jar?', a: 'Approximately 450ml — comfortable in the hand, generous enough for a smoothie or a full iced coffee.' },
    ],
  },
  {
    title: 'Ordering & delivery',
    items: [
      { q: 'How much is delivery?', a: 'Delivery is a flat fee on orders of 1 jar. Add 2 or more jars and delivery is free across Pakistan.' },
      { q: 'How do I pay?', a: 'Cash on Delivery. You pay the rider when your order arrives.' },
      { q: 'How will I know my order was received?', a: 'After checkout, you will see a Thank You page with your unique Order ID. We will follow up to confirm dispatch.' },
      { q: 'Can I change my order after placing it?', a: 'Please message us on WhatsApp as soon as possible with your Order ID. We will do our best to help before dispatch.' },
      { q: 'Where do you deliver?', a: 'We currently deliver across Pakistan.' },
    ],
  },
  {
    title: 'Returns & quality',
    items: [
      { q: 'What if my order arrives damaged?', a: 'Please send us a photo of the issue on WhatsApp within 48 hours of receiving the order. We will work with you to make it right.' },
      { q: 'Do you offer a warranty?', a: 'We stand behind the quality of our packaging. If something arrives damaged, reach out and we will help.' },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);
  const { settings } = useSettings();
  const c = settings?.contact || {};
  const wa = (c.whatsapp || '').replace(/[^\d+]/g, '');

  return (
    <>
      <Helmet>
        <title>FAQ — DELISOGA</title>
        <meta name="description" content="Frequently asked questions about the DELISOGA glass jar — materials, care, ordering, delivery, and returns." />
      </Helmet>
      <section className="pt-12 sm:pt-16 pb-12">
        <div className="container-narrow text-center">
          <p className="eyebrow justify-center">Help center</p>
          <h1 className="mt-2 font-display text-display-xl text-ink-800 text-balance">Frequently asked questions.</h1>
          <p className="mt-4 text-ink-600 max-w-xl mx-auto text-pretty">
            Everything you need to know about the jar, ordering, delivery, and care. Can’t find your answer? Reach us directly.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-narrow space-y-10">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="font-display text-2xl text-ink-800 mb-4">{g.title}</h2>
              <div className="space-y-2.5">
                {g.items.map((f, i) => {
                  const idx = groups.slice(0, groups.indexOf(g)).reduce((acc, x) => acc + x.items.length, 0) + i;
                  const isOpen = open === idx;
                  return (
                    <div key={f.q} className={`rounded-2xl border transition-colors ${
                      isOpen ? 'bg-white border-ink-200 shadow-soft-sm' : 'bg-white border-ink-100'
                    }`}>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? -1 : idx)}
                        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-ink-800 text-[15px]">{f.q}</span>
                        <span className={`w-8 h-8 inline-flex items-center justify-center rounded-full flex-shrink-0 transition ${
                          isOpen ? 'bg-ink-800 text-cream-100' : 'bg-cream-200 text-ink-700'
                        }`}>
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <p className="px-5 sm:px-6 pb-5 text-[14px] text-ink-600 leading-relaxed text-pretty">{f.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-ink-100 bg-cream-100 p-6 sm:p-8 text-center">
            <p className="font-display text-xl text-ink-800">Still have a question?</p>
            <p className="mt-2 text-ink-600 text-pretty max-w-md mx-auto">We usually reply within a few hours during business days.</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              {wa && (
                <a href={`https://wa.me/${wa.replace(/^\+/, '')}`} target="_blank" rel="noreferrer" className="btn-primary !bg-sage-500 hover:!bg-sage-600">
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              )}
              <Link to="/contact" className="btn-secondary">Send a message</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
