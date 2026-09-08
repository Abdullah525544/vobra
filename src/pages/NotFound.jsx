import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page not found — DELISOGA</title></Helmet>
      <section className="pt-20 sm:pt-28 pb-20">
        <div className="container-narrow text-center">
          <p className="eyebrow justify-center">404</p>
          <h1 className="mt-2 font-display text-display-xl text-ink-800 text-balance">We couldn’t find that page.</h1>
          <p className="mt-3 text-ink-600 max-w-md mx-auto text-pretty">
            The link may be broken or the page may have moved. Head back home to keep browsing.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/" className="btn-primary-lg">Back to home <ArrowRight size={16} /></Link>
            <Link to="/contact" className="btn-secondary">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
