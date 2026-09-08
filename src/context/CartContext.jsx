import { createContext, useContext, useEffect, useMemo, useReducer, useState, useCallback } from 'react';

const STORAGE_KEY = 'delisoga.cart.v1';

const initialState = { quantity: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, quantity: Math.max(1, Math.min(99, Number(action.value) || 1)) };
    case 'INC':
      return { ...state, quantity: Math.min(99, (state.quantity || 1) + 1) };
    case 'DEC':
      return { ...state, quantity: Math.max(1, (state.quantity || 1) - 1) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    if (typeof window === 'undefined') return init;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return init;
      const parsed = JSON.parse(raw);
      return { quantity: Math.max(1, Math.min(99, Number(parsed.quantity) || 1)) };
    } catch {
      return init;
    }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const setQuantity = useCallback((n) => dispatch({ type: 'SET', value: n }), []);
  const inc = useCallback(() => dispatch({ type: 'INC' }), []);
  const dec = useCallback(() => dispatch({ type: 'DEC' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({ quantity: state.quantity, setQuantity, inc, dec, reset, drawerOpen, openDrawer, closeDrawer }),
    [state.quantity, setQuantity, inc, dec, reset, drawerOpen, openDrawer, closeDrawer]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
