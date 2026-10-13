import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";
import styles from "./Toast.module.css";

const ToastContext = createContext();

/**
 * PRODUCTION PATTERN: Global Toast Notification System
 *
 * Provides non-blocking UI feedback when users interact with the app
 * (e.g. toggling bookmarks, changing account settings, rating shows).
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastContainer} aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${
              toast.type === "success"
                ? styles.toastSuccess
                : toast.type === "info"
                ? styles.toastInfo
                : ""
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} color="#46d369" />
            ) : toast.type === "info" ? (
              <Info size={20} color="#54b9c5" />
            ) : (
              <AlertTriangle size={20} color="#e50914" />
            )}
            <span className={styles.toastText}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
