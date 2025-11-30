'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  titleIcon?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children, className = '', titleIcon, showBackButton = false, onBack }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={`bg-white rounded-lg shadow-lg m-6 w-full max-w-[600px] overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-gray-200/50">
            <div className="flex justify-between items-start mb-2">
              {title && (
                <div className="flex items-center gap-3">
                  {showBackButton && onBack && (
                    <button
                      onClick={onBack}
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 cursor-pointer group flex-shrink-0"
                      title="Volver"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-200 group-hover:-translate-x-1"
                      >
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                    </button>
                  )}
                  {titleIcon && <div className="flex-shrink-0">{titleIcon}</div>}
                  <h2 id="modal-title" className="text-2xl font-semibold text-gray-900">{title}</h2>
                </div>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 cursor-pointer ml-4 flex-shrink-0"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>
            {description && (
              <p id="modal-description" className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        )}
        {!title && !description && (
          <div className="flex justify-end items-center px-6 pt-6 pb-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
