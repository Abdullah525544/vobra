import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <>
      <Helmet><title>Terms & Conditions — DELISOGA</title></Helmet>
      <section className="pt-10 sm:pt-16 pb-20">
        <div className="container-narrow">
          <nav className="text-[12.5px] text-ink-500 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink-800 transition">Home</Link>
            <span className="mx-2 text-ink-300">/</span>
            <span className="text-ink-700">Terms &amp; Conditions</span>
          </nav>
          <p className="eyebrow">Last updated</p>
          <h1 className="mt-2 font-display text-display-xl text-ink-800 text-balance">Terms &amp; Conditions</h1>

          <div className="prose-policy mt-6">
            <p>
              By accessing or using the DELISOGA website and placing an order, you agree to the
              following terms. Please read them carefully.
            </p>

            <h2>1. About us</h2>
            <p>
              DELISOGA is a Pakistan-based studio selling a single product — the DELISOGA glass jar
              with bamboo lid and glass straw — through this website.
            </p>

            <h2>2. Orders</h2>
            <ul>
              <li>By placing an order, you confirm that the information you provide is accurate and complete.</li>
              <li>We reserve the right to cancel an order if we cannot verify the details or if the order appears fraudulent.</li>
              <li>Orders are confirmed once you see the Thank You page with your unique Order ID.</li>
            </ul>

            <h2>3. Pricing</h2>
            <ul>
              <li>All prices are listed in Pakistani Rupees (PKR) and include any applicable taxes unless otherwise stated.</li>
              <li>Delivery charges are calculated at checkout and depend on your order quantity.</li>
            </ul>

            <h2>4. Delivery</h2>
            <ul>
              <li>We currently deliver across Pakistan.</li>
              <li>Delivery is free on orders of 2 or more jars. A flat delivery fee applies to single-jar orders.</li>
              <li>Estimated delivery times will be communicated to you after your order is confirmed.</li>
            </ul>

            <h2>5. Payment</h2>
            <p>
              We currently accept Cash on Delivery. You pay the rider when your order arrives.
            </p>

            <h2>6. Cancellations</h2>
            <p>
              You may request to cancel an order before it is dispatched by contacting us on
              WhatsApp with your Order ID. Once dispatched, the order cannot be cancelled but
              may be eligible for return under our Returns Policy.
            </p>

            <h2>7. Product use &amp; care</h2>
            <p>
              The DELISOGA glass jar is intended for everyday use. Bamboo is a natural material —
              please hand-wash and air-dry the lid as described in the FAQ to keep it in good
              condition. We are not responsible for damage caused by misuse, dishwasher use, or
              thermal shock.
            </p>

            <h2>8. Intellectual property</h2>
            <p>
              All content on this website, including product photos, the DELISOGA name, and logos,
              is the property of DELISOGA and may not be copied or reproduced without permission.
            </p>

            <h2>9. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, DELISOGA is not liable for any indirect,
              incidental, or consequential damages arising from your use of our products or website.
            </p>

            <h2>10. Changes to these terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the website after
              changes constitutes acceptance of the updated terms.
            </p>

            <h2>11. Contact</h2>
            <p>
              Questions about these terms? Please visit our <Link to="/contact">Contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
