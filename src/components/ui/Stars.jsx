import { Star, StarHalf } from 'lucide-react';

export default function Stars({ value = 0, size = 16, className = '' }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className={`inline-flex items-center gap-0.5 text-bamboo-400 ${className}`} aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={size} fill="currentColor" strokeWidth={0} />
      ))}
      {half && <StarHalf size={size} fill="currentColor" strokeWidth={0} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={size} className="text-ink-200" strokeWidth={1.5} />
      ))}
    </div>
  );
}
