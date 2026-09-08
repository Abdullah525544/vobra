/**
 * Reviews service — abstracts Firestore vs demo store.
 */
import { DATA_MODE, db } from './firebase';
import {
  demoListReviews,
  demoAddReview,
  demoUpdateReview,
  demoDeleteReview,
} from './demoStore';

const COL = 'reviews';

export const listReviews = async ({ onlyApproved = true } = {}) => {
  if (DATA_MODE !== 'live' || !db) return demoListReviews({ onlyApproved });
  try {
    const { collection, getDocs, orderBy, query, where } = await import('firebase/firestore');
    const ref = collection(db, COL);
    const q = onlyApproved
      ? query(ref, where('approved', '==', true), orderBy('createdAt', 'desc'))
      : query(ref, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[reviews] list failed, using demo:', e);
    return demoListReviews({ onlyApproved });
  }
};

export const addReview = async (review) => {
  if (DATA_MODE !== 'live' || !db) return demoAddReview(review);
  try {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = await addDoc(collection(db, COL), {
      ...review,
      createdAt: serverTimestamp(),
      approved: review.approved ?? true,
    });
    return { id: ref.id, ...review };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[reviews] add failed, using demo:', e);
    return demoAddReview(review);
  }
};

export const updateReview = async (id, patch) => {
  if (DATA_MODE !== 'live' || !db) return demoUpdateReview(id, patch);
  try {
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    await updateDoc(doc(db, COL, id), { ...patch, updatedAt: serverTimestamp() });
    return { id, ...patch };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[reviews] update failed, using demo:', e);
    return demoUpdateReview(id, patch);
  }
};

export const deleteReview = async (id) => {
  if (DATA_MODE !== 'live' || !db) return demoDeleteReview(id);
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, COL, id));
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[reviews] delete failed, using demo:', e);
    return demoDeleteReview(id);
  }
};
