import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-900/40 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${widths[size] || widths.md} bg-cream-100 rounded-t-3xl sm:rounded-3xl shadow-soft-xl border border-ink-100/60 max-h-[90vh] flex flex-col animate-scale-in`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <h3 className="font-display text-xl text-ink-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-ink-500 hover:text-ink-800 hover:bg-cream-200 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
