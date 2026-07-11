import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            id="modal-backdrop"
          />

          {/* Modal Content Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl border border-brand-border bg-brand-panel text-white shadow-2xl z-10 overflow-hidden"
            id="modal-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-border bg-black/20">
              <div>
                <h2 className="text-2xl font-display font-semibold tracking-wide text-brand-gold-light">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs text-gray-400 font-sans mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full border border-brand-border text-gray-400 hover:text-white hover:border-brand-gold hover:bg-brand-border/30 transition-all duration-200"
                aria-label="Close modal"
                id="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8" id="modal-body-scroll">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
