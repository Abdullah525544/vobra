import { useState } from 'react';

/**
 * Image with graceful loading + fade-in. Uses native lazy-loading for below-fold
 * images and async decoding to keep the page responsive.
 */
export default function Image({ src, alt, className = '', eager = false, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-cream-200/70 animate-pulse-soft" />
      )}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`block w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...rest}
      />
    </div>
  );
}
