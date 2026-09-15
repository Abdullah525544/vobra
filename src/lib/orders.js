/**
 * Orders service — abstracts Firestore vs demo store.
 */
import { DATA_MODE, db } from './firebase';
import { demoListOrders, demoAddOrder, demoUpdateOrder } from './demoStore';
import { generateOrderId } from './format';

const COL = 'orders';

export const createOrder = async (form, settings) => {
  const product = settings.product;
  const quantity = Number(form.quantity) || 1;
  const unitPrice = Number(product.unitPrice) || 0;
  const subtotal = unitPrice * quantity;
  const freeDelivery = quantity >= Number(product.freeDeliveryMinQty || 2);
  const deliveryCharges = freeDelivery ? 0 : Number(product.deliveryCharge || 0);
  const finalTotal = subtotal + deliveryCharges;

  const orderId = generateOrderId();
  const now = Date.now();

  const order = {
    id: orderId,
    orderId,
    customerName: (form.customerName || '').trim(),
    phone: (form.phone || '').trim(),
    email: (form.email || '').trim() || null,
    address: (form.address || '').trim(),
    city: (form.city || '').trim(),
    quantity,
    unitPrice,
    subtotal,
    deliveryCharges,
    finalTotal,
    freeDelivery,
    paymentMethod: 'Cash on Delivery',
    notes: (form.notes || '').trim() || null,
    productName: product.name,
    productSku: product.sku,
    status: 'New',
    createdAt: now,
    updatedAt: now,
  };

  // Always mirror to localStorage as a fallback so the ThankYou page can
  // render without needing to read from Firestore (customers cannot read
  // /orders/{id} — security rules only allow admin reads).
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const KEY = 'delisoga.orders';
      const existing = JSON.parse(localStorage.getItem(KEY) || '[]');
      const dedup = existing.filter((o) => o.id !== order.id && o.orderId !== order.orderId);
      const next = [order, ...dedup].slice(0, 50);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch { /* ignore */ }
  }

  if (DATA_MODE !== 'live' || !db) {
    return order;
  }
  try {
    const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = doc(collection(db, COL), orderId);
    await setDoc(ref, {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return order;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[orders] createOrder failed, using demo:', e);
    return order;
  }
};

export const listOrders = async () => {
  if (DATA_MODE !== 'live' || !db) return demoListOrders();
  try {
    const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
    const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[orders] list failed, using demo:', e);
    return demoListOrders();
  }
};

export const updateOrderStatus = async (id, status) => {
  if (DATA_MODE !== 'live' || !db) return demoUpdateOrder(id, { status });
  try {
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() });
    return { id, status };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[orders] update failed, using demo:', e);
    return demoUpdateOrder(id, { status });
  }
};

export const deleteOrder = async (id) => {
  if (DATA_MODE !== 'live' || !db) {
    const all = await demoListOrders();
    const next = all.filter((o) => o.id !== id && o.orderId !== id);
    try { localStorage.setItem('delisoga.orders', JSON.stringify(next)); } catch { /* ignore */ }
    return true;
  }
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, COL, id));
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[orders] delete failed, using demo:', e);
    throw e;
  }
};

export const getOrder = async (id) => {
  if (DATA_MODE !== 'live' || !db) {
    const all = await demoListOrders();
    return all.find((o) => o.id === id || o.orderId === id) || null;
  }
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, COL, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[orders] get failed, using demo:', e);
    const all = await demoListOrders();
    return all.find((o) => o.id === id || o.orderId === id) || null;
  }
};

export const ORDER_STATUSES = [
  { value: 'New', label: 'New' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export const NEXT_STATUS = {
  New: 'Confirmed',
  Confirmed: 'Processing',
  Processing: 'Shipped',
  Shipped: 'Delivered',
};
