import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function WhatsAppFloat() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const wa = (settings?.contact?.whatsapp || '').replace(/[^\d+]/g, '');

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!wa || !show) return null;
  const msg = encodeURIComponent('Hi DELISOGA, I have a question about the glass jar.');
  const href = `https://wa.me/${wa.replace(/^\+/, '')}?text=${msg}`;

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-5 sm:right-5 z-40">
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-[280px] bg-white border border-ink-100 shadow-soft-xl rounded-2xl p-4 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-500 text-cream-100 inline-flex items-center justify-center flex-shrink-0">
              <MessageCircle size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink-800 text-sm">Chat with DELISOGA</p>
              <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">
                We usually reply within a few hours during business days.
              </p>
              <a
                href={href}
                target="_blank" rel="noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 px-3.5 py-2.5 rounded-full bg-sage-500 hover:bg-sage-600 text-cream-100 text-sm font-medium transition"
              >
                Open WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        {!open && (
          <span className="hidden md:inline-block bg-ink-800 text-cream-100 text-[12.5px] px-3 py-1.5 rounded-full shadow-soft-sm">
            Need help? Chat with us
          </span>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-sage-500 hover:bg-sage-600 text-cream-100 shadow-soft-lg inline-flex items-center justify-center transition touch-manipulation"
          aria-label={open ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
        >
          {open ? <X size={20} /> : <MessageCircle size={22} />}
        </button>
      </div>
    </div>
  );
}
