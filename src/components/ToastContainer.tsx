import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-start p-4 rounded-xl shadow-2xl glass-panel border border-[#27282D] relative overflow-hidden"
            >
              {/* Left Accent Bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isSuccess
                    ? 'bg-[#FFC600]'
                    : isError
                    ? 'bg-[#F81878]'
                    : isWarning
                    ? 'bg-amber-500'
                    : 'bg-[#7644C6]'
                }`}
              />

              <div className="mr-3 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#FFC600]" />}
                {isError && <AlertCircle className="w-5 h-5 text-[#F81878]" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-[#7644C6]" />}
              </div>

              <div className="flex-1 pr-3">
                <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
                {toast.description && (
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{toast.description}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
