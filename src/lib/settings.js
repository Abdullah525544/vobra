/**
 * Settings service — abstracts Firestore vs demo store.
 */
import { DATA_MODE, db } from './firebase';
import { demoGetSettings, demoSaveSettings } from './demoStore';
import { initialSettings } from '../data/seedSettings';

const COL = 'settings';
const DOC_ID = 'site';

export const getSettings = async () => {
  if (DATA_MODE !== 'live' || !db) return demoGetSettings();
  try {
    const { doc, getDoc, setDoc } = await import('firebase/firestore');
    const ref = doc(db, COL, DOC_ID);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
    await setDoc(ref, initialSettings);
    return initialSettings;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[settings] getSettings failed, using demo:', e);
    return demoGetSettings();
  }
};

export const saveSettings = async (next) => {
  if (DATA_MODE !== 'live' || !db) return demoSaveSettings(next);
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = doc(db, COL, DOC_ID);
    await setDoc(ref, { ...next, updatedAt: serverTimestamp() }, { merge: true });
    return next;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[settings] saveSettings failed, using demo:', e);
    return demoSaveSettings(next);
  }
};
