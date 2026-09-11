/**
 * Meta Pixel tracking helpers.
 * Wraps the global fbq() function safely so it can be called from any page
 * without crashing if the Pixel has not loaded yet (e.g. on the dev server).
 */

const fbq = (...args) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
};

export const trackPageView = () => {
  fbq('track', 'PageView');
};

export const trackViewContent = (content = {}) => {
  fbq('track', 'ViewContent', {
    content_name: content.name,
    content_category: content.category,
    content_ids: content.ids,
    content_type: content.type || 'product',
    value: content.value,
    currency: content.currency || 'PKR',
  });
};

export const trackAddToCart = (item = {}) => {
  fbq('track', 'AddToCart', {
    content_name: item.name,
    content_ids: item.ids || ['DS-GLASS-JAR-01'],
    content_type: 'product',
    value: item.value,
    currency: item.currency || 'PKR',
    contents: item.contents,
  });
};

export const trackInitiateCheckout = (cart = {}) => {
  fbq('track', 'InitiateCheckout', {
    content_ids: cart.ids || ['DS-GLASS-JAR-01'],
    content_type: 'product',
    num_items: cart.num_items,
    value: cart.value,
    currency: cart.currency || 'PKR',
  });
};

export const trackPurchase = (order = {}) => {
  fbq('track', 'Purchase', {
    content_ids: order.ids || ['DS-GLASS-JAR-01'],
    content_type: 'product',
    num_items: order.num_items || order.quantity,
    value: order.value || order.finalTotal,
    currency: order.currency || 'PKR',
  });
};
