import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import TrustStrip from '../components/home/TrustStrip';
import ProductPurchase from '../components/home/ProductPurchase';
import WhyCustomersLoveIt from '../components/home/WhyCustomersLoveIt';
import PerfectForEveryDrink from '../components/home/PerfectForEveryDrink';
import Features from '../components/home/Features';
import WhyChooseDelisoga from '../components/home/WhyChooseDelisoga';
import Packaging from '../components/home/Packaging';
import Reviews from '../components/home/Reviews';
import FAQ from '../components/home/FAQ';
import CTABand from '../components/home/CTABand';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>DELISOGA — Glass Jar with Bamboo Lid & Glass Straw | PKR 1,000</title>
        <meta name="description" content="A premium glass jar with a natural bamboo lid and reusable glass straw. Perfect for water, juice, smoothies, iced coffee and daily hydration. PKR 1,000. Free delivery across Pakistan on orders of 2+ jars." />
        <link rel="canonical" href="https://delisoga.com/" />
      </Helmet>
      <Hero />
      <TrustStrip />
      <ProductPurchase />
      <WhyCustomersLoveIt />
      <PerfectForEveryDrink />
      <Features />
      <WhyChooseDelisoga />
      <Packaging />
      <Reviews />
      <FAQ />
      <CTABand />
    </>
  );
}
