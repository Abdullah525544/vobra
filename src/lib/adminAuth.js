/**
 * Admin authentication.
 *
 * Strategy:
 *   1. Try Firebase Auth client SDK first (signInWithEmailAndPassword)
 *   2. If that fails for any reason, fall back to the public REST API
 *      (signInWithPassword endpoint) — this works even when the client
 *      SDK has a config/origin/CORS hiccup.
 *   3. After successful auth, make sure /admins/{uid} exists in Firestore.
 *   4. Persist a local admin session in localStorage so the rest of the
 *      admin app can use it.
 *
 * The "Create admin account" flow is exposed only via an explicit
 * "create first admin" call, never shown as a regular login option.
 */
import { DATA_MODE, db, auth } from './firebase';
import { demoAdminSignIn, demoAdminSignOut, demoAdminSession } from './demoStore';

export const ADMIN_EMAIL = 'mrabdullah1028@gmail.com';
export const ADMIN_PASSWORD = 'Abdullah1028@';

const isLive = () => DATA_MODE === 'live' && !!auth && !!db;

/* ------------------------------------------------------------
 * REST API sign-in fallback
 * ----------------------------------------------------------- */
const restSignIn = async (email, password) => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) throw new Error('Firebase API key is not configured.');
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) {
    const code = data?.error?.message || '';
    if (code.includes('INVALID_PASSWORD') || code.includes('EMAIL_NOT_FOUND') || code.includes('INVALID_LOGIN_CREDENTIALS')) {
      const err = new Error('Invalid email or password.');
      err.code = 'auth/invalid-credential';
      throw err;
    }
    if (code.includes('TOO_MANY_ATTEMPTS')) {
      const err = new Error('Too many attempts. Please try again later.');
      err.code = 'auth/too-many-requests';
      throw err;
    }
    const err = new Error(code || 'Could not sign in.');
    err.code = 'auth/unknown';
    throw err;
  }
  return data; // { localId, email, idToken, refreshToken, expiresIn }
};

/* ------------------------------------------------------------
 * Sync client SDK auth with REST idToken (best effort)
 * ----------------------------------------------------------- */
const syncClientAuth = async (email, password) => {
  // Try up to 3 times with small backoff — handles transient issues
  // on cold loads (e.g., the Firebase SDK hasn't finished init).
  let lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
      // Verify the SDK actually has the session
      if (auth.currentUser && auth.currentUser.email === email) {
        return true;
      }
    } catch (e) {
      lastErr = e;
      // eslint-disable-next-line no-console
      console.warn(`[adminAuth] syncClientAuth attempt ${attempt} failed:`, e?.code, e?.message);
    }
    await new Promise((r) => setTimeout(r, 400 * attempt));
  }
  // eslint-disable-next-line no-console
  console.warn('[adminAuth] syncClientAuth gave up:', lastErr?.code, lastErr?.message);
  return false;
};

/* ------------------------------------------------------------
 * Ensure the /admins/{uid} doc exists.
 *   1) Try the client SDK first (it carries proper auth state)
 *   2) Fall back to the REST API
 * ----------------------------------------------------------- */
const ensureAdminDoc = async (uid, email) => {
  if (!db) return;
  // 1) Client SDK
  try {
    const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = doc(db, 'admins', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return;
    await setDoc(ref, { email, role: 'admin', createdAt: serverTimestamp() });
    return;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[adminAuth] ensureAdminDoc client SDK failed, trying REST:', e);
  }

  // 2) REST API fallback (uses the latest idToken)
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const cred = await signInWithEmailAndPassword(auth, email, import.meta.env.VITE_FIREBASE_API_KEY ? '' : '');
    const idToken = await cred.user.getIdToken();
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${uid}`;
    const body = {
      fields: {
        email: { stringValue: email },
        role: { stringValue: 'admin' },
        createdAt: { timestampValue: new Date().toISOString() },
      },
    };
    await fetch(docUrl + '?documentId=' + uid, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[adminAuth] ensureAdminDoc REST failed:', e);
  }
};

/* ------------------------------------------------------------
 * Public: sign in
 *
 * Order:
 *   1) Try client SDK signInWithEmailAndPassword first — this sets
 *      up the auth state that Firestore security rules check.
 *   2) If the SDK path fails, fall back to REST for password check,
 *      then aggressively retry the client SDK to establish session.
 *   3) If neither path yields a working client SDK session, throw
 *      a clear error so the UI can show it.
 * ----------------------------------------------------------- */
export const signInAdmin = async (email, password) => {
  if (!isLive()) {
    return demoAdminSignIn(email, password, { requiredPassword: ADMIN_PASSWORD });
  }

  // 1) Client SDK first — preferred because it establishes the session
  //    that Firestore rules use to gate /orders reads.
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // Make sure /admins/{uid} exists (create if first time)
    const ref = doc(db, 'admins', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      try {
        await setDoc(ref, { email: cred.user.email, role: 'admin', createdAt: serverTimestamp() });
      } catch { /* tolerate — non-fatal */ }
    }
    return { uid, email: cred.user.email, isAdmin: true, createdAt: Date.now() };
  } catch (sdkErr) {
    // eslint-disable-next-line no-console
    console.warn('[adminAuth] client SDK signin failed, falling back to REST:', sdkErr?.code, sdkErr?.message);
  }

  // 2) Fall back to REST for password verification
  let restData;
  try {
    restData = await restSignIn(email, password);
  } catch (restErr) {
    throw restErr;
  }
  const { localId: uid, email: confirmedEmail } = restData;

  // 3) Aggressively retry client SDK sync — the REST idToken alone
  //    cannot drive Firestore reads (rules check client SDK auth).
  const synced = await syncClientAuth(email, password);
  if (!synced) {
    throw new Error(
      'Sign-in verified but the Firebase client session could not be ' +
      'established. Please refresh the page and try again. If the issue ' +
      'persists, open the browser console (F12) for details.'
    );
  }

  // 4) Make sure /admins/{uid} exists
  await ensureAdminDoc(uid, confirmedEmail);

  return { uid, email: confirmedEmail, isAdmin: true, createdAt: Date.now() };
};

/* ------------------------------------------------------------
 * Public: create first admin (one-time setup)
 * ----------------------------------------------------------- */
export const createFirstAdmin = async (email, password) => {
  if (!isLive()) {
    return demoAdminSignIn(email, password, { requiredPassword: ADMIN_PASSWORD });
  }
  // Just try to sign in. If the account doesn't exist, this will throw.
  // Account creation must be done out-of-band (Console or REST signup).
  return signInAdmin(email, password);
};

/* ------------------------------------------------------------
 * Public: sign out
 * ----------------------------------------------------------- */
export const signOutAdmin = async () => {
  if (!isLive()) return demoAdminSignOut();
  try {
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
  } catch { /* ignore */ }
  return demoAdminSignOut();
};

export const getAdminSession = () => demoAdminSession();
