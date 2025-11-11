'use client';

import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg m-6 w-full max-w-[600px] overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-gray-200/50">
            <div className="flex justify-between items-start mb-2">
              {title && <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>}
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer ml-4 flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        )}
        {!title && !description && (
          <div className="flex justify-end items-center px-6 pt-6 pb-4">
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
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
