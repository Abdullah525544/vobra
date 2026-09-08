import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSettings } from '../lib/settings';
import { initialSettings } from '../data/seedSettings';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await getSettings();
        if (alive) setSettings(s);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[Settings] load failed, using defaults', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const refresh = useCallback(async () => {
    const s = await getSettings();
    setSettings(s);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
