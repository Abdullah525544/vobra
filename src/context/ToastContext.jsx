import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let _id = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((opts) => {
    const id = ++_id;
    const toast = {
      id,
      type: opts.type || 'info',
      title: opts.title,
      message: opts.message,
      duration: opts.duration ?? 4000,
    };
    setToasts((t) => [...t, toast]);
    if (toast.duration) {
      setTimeout(() => dismiss(id), toast.duration);
    }
    return id;
  }, [dismiss]);

  const value = {
    success: (message, title) => push({ type: 'success', message, title }),
    error: (message, title) => push({ type: 'error', message, title, duration: 5000 }),
    info: (message, title) => push({ type: 'info', message, title }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto animate-fade-in-down flex items-start gap-3 bg-white border border-ink-100 shadow-soft-lg rounded-2xl px-4 py-3 min-w-[280px] max-w-[400px]"
            role="status"
          >
            <div className="mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-sage-500" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-bamboo-500" />}
            </div>
            <div className="flex-1">
              {t.title && <div className="text-sm font-semibold text-ink-800">{t.title}</div>}
              {t.message && <div className="text-sm text-ink-600">{t.message}</div>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-ink-300 hover:text-ink-700 transition p-1 -mr-1 -mt-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
