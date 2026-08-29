import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

const ESTILOS = {
  success: 'bg-brand-600',
  error: 'bg-red-600',
  info: 'bg-gray-800'
};

function Toasts({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${ESTILOS[t.tipo] || ESTILOS.info} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg animate-[fadeIn_0.2s_ease]`}
        >
          {t.mensaje}
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const push = useCallback((tipo, mensaje) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, tipo, mensaje }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toast = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toasts toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
