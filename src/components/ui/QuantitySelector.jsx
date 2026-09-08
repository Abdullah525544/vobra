import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  const sizeCls = size === 'lg' ? 'h-12 text-base' : 'h-10 text-sm';
  const btnSize = size === 'lg' ? 'w-12' : 'w-10';
  const iconSize = size === 'lg' ? 18 : 16;

  return (
    <div className={`inline-flex items-center bg-white border border-ink-100 rounded-full overflow-hidden ${sizeCls}`}>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${btnSize} h-full flex items-center justify-center text-ink-600 hover:bg-cream-100 transition disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Minus size={iconSize} strokeWidth={1.5} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ''), 10);
          if (Number.isNaN(n)) return;
          onChange(Math.max(min, Math.min(max, n)));
        }}
        aria-label="Quantity"
        className="w-12 h-full text-center bg-transparent border-0 outline-none font-semibold text-ink-800 focus:ring-0"
      />
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${btnSize} h-full flex items-center justify-center text-ink-600 hover:bg-cream-100 transition disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Plus size={iconSize} strokeWidth={1.5} />
      </button>
    </div>
  );
}
