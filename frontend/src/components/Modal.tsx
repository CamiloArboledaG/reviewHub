'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { theme } from '@/lib/theme';

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
  const m = theme.components.newReview.modal;

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
      className={m.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={`${m.container} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className={m.header.container}>
            <div className={m.header.titleRow}>
              {title && (
                <div className={m.header.titleWrapper}>
                  {showBackButton && onBack && (
                    <button
                      onClick={onBack}
                      className={m.header.backButton}
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
                  <h2 id="modal-title" className={m.header.title}>{title}</h2>
                </div>
              )}
              <button
                onClick={onClose}
                className={m.header.closeButton}
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>
            {description && (
              <p id="modal-description" className={m.header.description}>{description}</p>
            )}
          </div>
        )}
        {!title && !description && (
          <div className="flex justify-end items-center px-6 pt-6 pb-4">
            <button
              onClick={onClose}
              className={m.header.closeButton}
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>
        )}
        <div className={m.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
