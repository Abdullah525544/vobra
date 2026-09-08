/**
 * Firebase initialization.
 * The site gracefully runs in DEMO mode (localStorage) when no Firebase
 * credentials are configured, so you can preview & test the entire flow
 * before wiring up a Firebase project.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const DATA_MODE = env.VITE_DATA_MODE === 'live' && env.VITE_FIREBASE_API_KEY
  ? 'live'
  : 'demo';

export const isFirebaseConfigured = Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID);

let app = null;
let db = null;
let auth = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[DELISOGA] Firebase init failed, falling back to demo mode:', e);
  }
}

export { app, db, auth, storage };
