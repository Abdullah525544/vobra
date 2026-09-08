import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, RefreshCcw, Settings as SettingsIcon, Tag, MessageCircle, Megaphone, Phone, Globe, AlertTriangle } from 'lucide-react';
import { getSettings, saveSettings } from '../lib/settings';
import { useToast } from '../context/ToastContext';
import { formatPKR } from '../lib/format';
import Skeleton from '../components/ui/Skeleton';
import { initialSettings } from '../data/seedSettings';

export default function SettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await getSettings();
        if (alive) {
          setForm(s);
          setLoading(false);
        }
      } catch {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const update = (path, value) => {
    setForm((f) => {
      const next = JSON.parse(JSON.stringify(f));
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveSettings(form);
      toast.success('Settings saved.');
      setDirty(false);
    } catch {
      toast.error('Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setForm(initialSettings);
    setDirty(true);
    toast.info('Reverted to defaults. Click “Save settings” to apply.');
  };

  if (loading) {
    return (
      <div className="px-5 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-40 mb-6" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Settings — DELISOGA Admin</title></Helmet>
      <div className="px-5 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="eyebrow">Configure</p>
            <h1 className="mt-1 font-display text-3xl text-ink-800">Settings</h1>
            <p className="text-sm text-ink-500 mt-1">Update prices, delivery, contact info, and offers without changing code.</p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <button onClick={reset} className="btn-ghost">
              <RefreshCcw size={15} /> Reset to defaults
            </button>
            <button onClick={save} disabled={saving || !dirty} className="btn-primary">
              <Save size={15} /> {saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </header>

        {dirty && (
          <div className="mb-5 rounded-2xl border border-bamboo-200 bg-bamboo-50/60 p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-bamboo-500 flex-shrink-0" />
            <p className="text-sm text-ink-700">You have unsaved changes. Click “Save settings” to apply them to the live site.</p>
          </div>
        )}

        <div className="space-y-5">
          {/* Product & pricing */}
          <Section icon={Tag} title="Product & pricing" subtitle="The product details shown to customers and used at checkout.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product name">
                <input className="input-lg" value={form.product.name} onChange={(e) => update('product.name', e.target.value)} />
              </Field>
              <Field label="SKU">
                <input className="input-lg" value={form.product.sku} onChange={(e) => update('product.sku', e.target.value)} />
              </Field>
              <Field label={`Unit price (${formatPKR(form.product.unitPrice)})`}>
                <input type="number" min={0} className="input-lg" value={form.product.unitPrice}
                       onChange={(e) => update('product.unitPrice', Number(e.target.value))} />
              </Field>
              <Field label={`Delivery charge (${formatPKR(form.product.deliveryCharge)})`}>
                <input type="number" min={0} className="input-lg" value={form.product.deliveryCharge}
                       onChange={(e) => update('product.deliveryCharge', Number(e.target.value))} />
                <p className="help">Charged only when the order is below the free-delivery minimum.</p>
              </Field>
              <Field label="Free delivery minimum quantity">
                <input type="number" min={1} className="input-lg" value={form.product.freeDeliveryMinQty}
                       onChange={(e) => update('product.freeDeliveryMinQty', Math.max(1, Number(e.target.value)))} />
                <p className="help">Orders of this quantity or more ship free.</p>
              </Field>
              <Field label="Stock status">
                <label className="inline-flex items-center gap-2 h-12">
                  <input type="checkbox" checked={!!form.product.inStock} onChange={(e) => update('product.inStock', e.target.checked)} />
                  <span className="text-sm text-ink-700">In stock</span>
                </label>
              </Field>
              <Field label="Stock note" full>
                <input className="input-lg" value={form.product.stockNote || ''} onChange={(e) => update('product.stockNote', e.target.value)} />
              </Field>
            </div>
          </Section>

          {/* Offer */}
          <Section icon={Megaphone} title="Promotional offer" subtitle="Shown on the announcement bar and on the cart drawer.">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Offer headline">
                <input className="input-lg" value={form.offer.headline} onChange={(e) => update('offer.headline', e.target.value)} />
              </Field>
              <Field label="Offer subtext">
                <textarea rows={2} className="input-lg resize-none" value={form.offer.subtext} onChange={(e) => update('offer.subtext', e.target.value)} />
              </Field>
            </div>
          </Section>

          {/* Announcement bar */}
          <Section icon={Megaphone} title="Announcement bar" subtitle="Slim bar at the very top of the site.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Field label="Text">
                  <input className="input-lg" value={form.announcement.text} onChange={(e) => update('announcement.text', e.target.value)} />
                </Field>
              </div>
              <Field label="Show on site">
                <label className="inline-flex items-center gap-2 h-12">
                  <input type="checkbox" checked={!!form.announcement.enabled} onChange={(e) => update('announcement.enabled', e.target.checked)} />
                  <span className="text-sm text-ink-700">Enabled</span>
                </label>
              </Field>
            </div>
          </Section>

          {/* Contact */}
          <Section icon={Phone} title="Contact" subtitle="Used on the Contact page, WhatsApp button, and footer.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="WhatsApp number (with country code)">
                <input className="input-lg" value={form.contact.whatsapp} onChange={(e) => update('contact.whatsapp', e.target.value)} placeholder="+923001234567" />
              </Field>
              <Field label="Phone number">
                <input className="input-lg" value={form.contact.phone} onChange={(e) => update('contact.phone', e.target.value)} />
              </Field>
              <Field label="Email">
                <input type="email" className="input-lg" value={form.contact.email} onChange={(e) => update('contact.email', e.target.value)} />
              </Field>
              <Field label="Address">
                <input className="input-lg" value={form.contact.address} onChange={(e) => update('contact.address', e.target.value)} />
              </Field>
              <Field label="Business hours" full>
                <input className="input-lg" value={form.contact.businessHours} onChange={(e) => update('contact.businessHours', e.target.value)} />
              </Field>
            </div>
          </Section>

          {/* Brand & social */}
          <Section icon={Globe} title="Brand & social" subtitle="Shown in the header, footer, and meta tags.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Brand name">
                <input className="input-lg" value={form.brand.name} onChange={(e) => update('brand.name', e.target.value)} />
              </Field>
              <Field label="Brand tagline">
                <input className="input-lg" value={form.brand.tagline} onChange={(e) => update('brand.tagline', e.target.value)} />
              </Field>
              <Field label="Brand description" full>
                <textarea rows={3} className="input-lg resize-none" value={form.brand.description} onChange={(e) => update('brand.description', e.target.value)} />
              </Field>
              <Field label="Instagram URL">
                <input className="input-lg" value={form.social.instagram || ''} onChange={(e) => update('social.instagram', e.target.value)} placeholder="https://instagram.com/delisoga" />
              </Field>
              <Field label="Facebook URL">
                <input className="input-lg" value={form.social.facebook || ''} onChange={(e) => update('social.facebook', e.target.value)} placeholder="https://facebook.com/delisoga" />
              </Field>
            </div>
          </Section>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button onClick={reset} className="btn-ghost">Reset to defaults</button>
          <button onClick={save} disabled={saving || !dirty} className="btn-primary">
            <Save size={15} /> {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-bamboo-50 text-bamboo-600 inline-flex items-center justify-center flex-shrink-0">
          <Icon size={16} />
        </div>
        <div>
          <h2 className="font-display text-lg text-ink-800">{title}</h2>
          {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
