import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAdminSession, signInAdmin as svcSignIn, signOutAdmin as svcSignOut, createFirstAdmin as svcCreateFirst } from '../lib/adminAuth';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getAdminSession());
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const s = await svcSignIn(email, password);
      setSession(s);
      return s;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFirstAdmin = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const s = await svcCreateFirst(email, password);
      setSession(s);
      return s;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await svcSignOut();
    setSession(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ session, loading, signIn, signOut, createFirstAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
