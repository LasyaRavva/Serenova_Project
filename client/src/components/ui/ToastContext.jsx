import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext({});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = "info" }) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastStack toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// ── Toast Stack UI ───────────────────────────────────────────────
const TOAST_STYLES = {
  success: "border-green-400/30 bg-green-400/10 text-green-400",
  error:   "border-red-400/30   bg-red-400/10   text-red-400",
  info:    "border-gold/30      bg-gold/10      text-gold",
};

const TOAST_ICONS = {
  success: "✓",
  error:   "✕",
  info:    "·",
};

function ToastStack({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 px-4 py-3 rounded-2xl border
            backdrop-blur-sm shadow-lg shadow-black/40
            animate-slide-up font-body text-sm
            ${TOAST_STYLES[toast.type] || TOAST_STYLES.info}
          `}
        >
          <span className="shrink-0 mt-0.5">
            {TOAST_ICONS[toast.type] || "·"}
          </span>
          <p className="flex-1 leading-snug">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-current opacity-50 hover:opacity-100 transition-opacity shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}