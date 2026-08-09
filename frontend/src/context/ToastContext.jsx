import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, "success", duration),
    error: (msg, duration) => addToast(msg, "error", duration),
    warning: (msg, duration) => addToast(msg, "warning", duration),
    info: (msg, duration) => addToast(msg, "info", duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((t) => {
          let bg = "bg-zinc-900 text-white border-zinc-700";
          let indicator = "bg-zinc-400";
          if (t.type === "success") {
            bg = "bg-zinc-950 text-white border-emerald-500/40";
            indicator = "bg-emerald-500";
          } else if (t.type === "error") {
            bg = "bg-zinc-950 text-white border-rose-500/40";
            indicator = "bg-rose-500";
          } else if (t.type === "warning") {
            bg = "bg-zinc-950 text-white border-amber-500/40";
            indicator = "bg-amber-500";
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center justify-between p-4 border shadow-xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${bg}`}
              style={{ borderRadius: "0px" }}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 shrink-0 ${indicator}`} />
                <p className="text-sm font-medium leading-snug">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-zinc-400 hover:text-white text-xs ml-3 px-1 py-0.5 border border-zinc-700 hover:border-zinc-500 transition-colors"
                style={{ borderRadius: "0px" }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
