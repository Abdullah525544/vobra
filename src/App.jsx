import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ToastProvider } from './context/ToastContext';

import AnnouncementBar from './components/layout/AnnouncementBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';
import WhatsAppFloat from './components/layout/WhatsAppFloat';
import MobileOrderBar from './components/layout/MobileOrderBar';

import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQPage from './pages/FAQPage';
import ReviewsPage from './pages/ReviewsPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsPolicy from './pages/ReturnsPolicy';
import NotFound from './pages/NotFound';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import OrdersList from './admin/OrdersList';
import OrderDetail from './admin/OrderDetail';
import ReviewsManager from './admin/ReviewsManager';
import SettingsPage from './admin/Settings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function Storefront() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main" className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you/:orderId" element={<ThankYou />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/returns-policy" element={<ReturnsPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
      <MobileOrderBar />
    </>
  );
}

function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="reviews" element={<ReviewsManager />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <CartProvider>
          <AdminAuthProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="/*" element={<Storefront />} />
            </Routes>
          </AdminAuthProvider>
        </CartProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
