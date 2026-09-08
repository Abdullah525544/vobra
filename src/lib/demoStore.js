/**
 * Demo storage layer — uses localStorage when no Firebase project is configured.
 * Mirrors the public API of the Firestore-backed modules so the rest of the app
 * stays unaware of the swap.
 */
import { initialSettings } from '../data/seedSettings';
import { initialReviews } from '../data/seedReviews';

const KEY = {
  settings: 'delisoga.settings',
  reviews: 'delisoga.reviews',
  orders: 'delisoga.orders',
  products: 'delisoga.products',
  adminSession: 'delisoga.adminSession',
};

const read = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};
const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[demoStore] write failed', e);
  }
};

/* ---------- Settings ---------- */
export const demoGetSettings = async () => {
  const stored = read(KEY.settings, null);
  if (stored) return stored;
  write(KEY.settings, initialSettings);
  return initialSettings;
};
export const demoSaveSettings = async (next) => {
  write(KEY.settings, next);
  return next;
};

/* ---------- Reviews ---------- */
export const demoListReviews = async ({ onlyApproved = true } = {}) => {
  const stored = read(KEY.reviews, null);
  const list = stored ?? initialReviews;
  if (!stored) write(KEY.reviews, list);
  return onlyApproved ? list.filter((r) => r.approved !== false) : list;
};
export const demoAddReview = async (r) => {
  const list = read(KEY.reviews, initialReviews);
  const id = `rv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const next = [{ id, createdAt: Date.now(), approved: true, ...r }, ...list];
  write(KEY.reviews, next);
  return { id, ...r };
};
export const demoUpdateReview = async (id, patch) => {
  const list = read(KEY.reviews, initialReviews);
  const next = list.map((r) => (r.id === id ? { ...r, ...patch } : r));
  write(KEY.reviews, next);
  return next.find((r) => r.id === id);
};
export const demoDeleteReview = async (id) => {
  const list = read(KEY.reviews, initialReviews);
  const next = list.filter((r) => r.id !== id);
  write(KEY.reviews, next);
  return true;
};

/* ---------- Orders ---------- */
export const demoListOrders = async () => {
  return read(KEY.orders, []);
};
export const demoAddOrder = async (order) => {
  const list = read(KEY.orders, []);
  write(KEY.orders, [order, ...list]);
  return order;
};
export const demoUpdateOrder = async (id, patch) => {
  const list = read(KEY.orders, []);
  const next = list.map((o) => (o.id === id ? { ...o, ...patch, updatedAt: Date.now() } : o));
  write(KEY.orders, next);
  return next.find((o) => o.id === id);
};

/* ---------- Admin session (demo only) ---------- */
export const demoAdminSignIn = async (email, password, opts = {}) => {
  if (!email || !password) throw new Error('Email and password are required');
  // Default to the configured admin password; allow override for tests.
  const required = opts.requiredPassword || 'Abdullah1028@';
  if (password !== required) throw new Error('Invalid email or password.');
  const session = {
    uid: `demo_${btoa(email).slice(0, 12)}`,
    email,
    isAdmin: true,
    createdAt: Date.now(),
  };
  write(KEY.adminSession, session);
  return session;
};
export const demoAdminSignOut = async () => {
  localStorage.removeItem(KEY.adminSession);
  return true;
};
export const demoAdminSession = () => read(KEY.adminSession, null);

/* ---------- Seed helpers (reset demo) ---------- */
export const demoReset = () => {
  Object.values(KEY).forEach((k) => localStorage.removeItem(k));
};
