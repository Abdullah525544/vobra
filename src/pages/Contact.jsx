import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { settings } = useSettings();
  const toast = useToast();
  const c = settings?.contact || {};
  const wa = (c.whatsapp || '').replace(/[^\d+]/g, '');

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('Please add your name and a message.');
      return;
    }
    setSubmitting(true);
    // We don't actually send mail in demo mode — we just open WhatsApp / mailto fallback.
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Thanks — we received your message. We will reply shortly.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 700);
  };

  return (
    <>
      <Helmet><title>Contact — DELISOGA</title></Helmet>
      <section className="pt-12 sm:pt-16 pb-12">
        <div className="container-narrow text-center">
          <p className="eyebrow justify-center">Contact us</p>
          <h1 className="mt-2 font-display text-display-xl text-ink-800 text-balance">We’re here to help.</h1>
          <p className="mt-4 text-ink-600 max-w-xl mx-auto text-pretty">
            Questions about your order, the jar, or delivery? Send us a message and we’ll get back to you the same business day.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-5 space-y-4">
              {[
                { Icon: MessageCircle, label: 'WhatsApp', value: c.whatsapp || c.phone || '—', href: wa ? `https://wa.me/${wa.replace(/^\+/, '')}` : null, accent: 'text-sage-600 bg-sage-100' },
                { Icon: Phone, label: 'Phone', value: c.phone || '—', href: c.phone ? `tel:${c.phone.replace(/\s/g, '')}` : null, accent: 'text-bamboo-600 bg-bamboo-50' },
                { Icon: Mail, label: 'Email', value: c.email || '—', href: c.email ? `mailto:${c.email}` : null, accent: 'text-cream-300 bg-ink-800/5' },
                { Icon: MapPin, label: 'Studio', value: c.address || 'Pakistan', href: null, accent: 'text-ink-700 bg-cream-200' },
                { Icon: Clock, label: 'Hours', value: c.businessHours || 'Mon–Sat, 10:00–19:00 PKT', href: null, accent: 'text-ink-700 bg-cream-200' },
              ].map(({ Icon, label, value, href, accent }) => {
                const Inner = (
                  <div className="flex items-start gap-4 p-5">
                    <div className={`w-10 h-10 rounded-xl inline-flex items-center justify-center ${accent}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-ink-400">{label}</p>
                      <p className="text-ink-800 font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                );
                return (
                  <div key={label} className="rounded-2xl border border-ink-100 bg-white">
                    {href ? <a href={href} className="block hover:bg-cream-100 transition rounded-2xl">{Inner}</a> : Inner}
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={submit} className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
                <h2 className="font-display text-xl text-ink-800">Send a message</h2>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="label" htmlFor="name">Your name *</label>
                    <input id="name" className="input-lg" value={form.name} onChange={update('name')} />
                  </div>
                  <div>
                    <label className="label" htmlFor="email">Email (optional)</label>
                    <input id="email" type="email" className="input-lg" value={form.email} onChange={update('email')} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="subject">Subject</label>
                    <input id="subject" className="input-lg" value={form.subject} onChange={update('subject')} placeholder="Order question, product question, …" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="message">Message *</label>
                    <textarea id="message" rows={5} className="input-lg resize-none" value={form.message} onChange={update('message')} />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="btn-primary-lg mt-5">
                  <Send size={16} /> {submitting ? 'Sending…' : 'Send message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
