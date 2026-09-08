/**
 * Initial website settings — used as the default and as the seed for the
 * demo store. The admin can update these from /admin/settings.
 */
export const initialSettings = {
  brand: {
    name: 'DELISOGA',
    tagline: 'Premium Glassware for Everyday Rituals',
    description:
      'A premium glass jar with a natural bamboo lid and a reusable glass straw — designed for water, juices, iced coffee, smoothies and the moments in between.',
  },
  product: {
    name: 'Glass Jar with Bamboo Lid & Glass Straw',
    sku: 'DS-GLASS-JAR-01',
    unitPrice: 1000, // PKR
    deliveryCharge: 250, // PKR (overridable from admin)
    freeDeliveryMinQty: 2,
    inStock: true,
    stockNote: 'In stock — ready to ship',
  },
  offer: {
    headline: 'Free delivery on 2 or more jars',
    subtext: 'Order 1 jar at PKR 1,000. Order 2+ jars and delivery is on us.',
  },
  contact: {
    whatsapp: '+923279500025',
    phone: '+923279500025',
    email: 'info.abdullah1027@gmail.com',
    address: 'Faisalabad, Pakistan',
    businessHours: 'Mon–Sat, 10:00–19:00 PKT',
  },
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  announcement: {
    enabled: true,
    text: 'Free delivery across Pakistan on orders of 2 or more jars',
  },
  policy: {
    paymentMethods: ['Cash on Delivery'],
    shippingNote: 'We currently ship within Pakistan.',
  },
};
