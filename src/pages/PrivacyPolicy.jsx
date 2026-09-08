import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet><title>Privacy Policy — DELISOGA</title></Helmet>
      <section className="pt-10 sm:pt-16 pb-20">
        <div className="container-narrow">
          <nav className="text-[12.5px] text-ink-500 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-800 transition">Home</Link>
            <span className="mx-2 text-ink-300">/</span>
            <span className="text-ink-700">Privacy Policy</span>
          </nav>
          <p className="eyebrow">Last updated</p>
          <h1 className="mt-2 font-display text-display-xl text-ink-800 text-balance">Privacy Policy</h1>

          <div className="prose-policy mt-6">
            <p>
              This Privacy Policy describes how DELISOGA (“we”, “our”, “us”) collects, uses, and
              protects information when you visit our website or place an order with us.
            </p>

            <h2>1. Information we collect</h2>
            <p>To process your order and provide customer support, we collect:</p>
            <ul>
              <li>Your full name</li>
              <li>Phone number</li>
              <li>Delivery address and city</li>
              <li>Email address (only if you provide it)</li>
              <li>Order details (product, quantity, totals)</li>
              <li>Optional order notes</li>
            </ul>

            <h2>2. How we use your information</h2>
            <p>We use the information above to:</p>
            <ul>
              <li>Process and fulfil your order</li>
              <li>Contact you about your order (confirmation, delivery, support)</li>
              <li>Provide customer service and respond to enquiries</li>
              <li>Improve our products and service</li>
            </ul>
            <p>We do not sell your personal data to third parties.</p>

            <h2>3. Payments</h2>
            <p>
              We currently offer Cash on Delivery. We do not collect or store your card or bank
              details. Any future payment options will be communicated clearly at checkout.
            </p>

            <h2>4. Data storage and security</h2>
            <p>
              Your data is stored in secure cloud infrastructure (Firebase / Google Cloud). We
              follow reasonable technical and organisational measures to protect it from
              unauthorised access, disclosure, or loss.
            </p>

            <h2>5. Cookies</h2>
            <p>
              Our website may use minimal cookies or local storage to remember your cart and basic
              preferences. We do not use tracking cookies for advertising.
            </p>

            <h2>6. Your rights</h2>
            <p>You may request to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
            </ul>
            <p>To exercise any of these rights, please contact us using the details on our Contact page.</p>

            <h2>7. Updates to this policy</h2>
            <p>
              We may update this policy from time to time. Any changes will be posted on this page
              with a revised “Last updated” date.
            </p>

            <h2>8. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please visit our <Link to="/contact">Contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
