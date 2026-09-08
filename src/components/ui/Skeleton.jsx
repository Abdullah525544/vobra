export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden bg-ink-100/40 rounded-md ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
           style={{ backgroundSize: '1000px 100%' }} />
    </div>
  );
}
