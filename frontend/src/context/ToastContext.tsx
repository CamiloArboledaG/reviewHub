'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import NotificationToast from '@/components/NotificationToast';

type ToastVariant = 'default' | 'destructive';

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', variant: 'default' as ToastVariant });

  const showToast = (message: string, variant: ToastVariant = 'default') => {
    setToastConfig({ show: true, message, variant });
    setTimeout(() => {
      setToastConfig({ show: false, message: '', variant: 'default' });
    }, 3000); // El toast de error dura 3 segundos
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <NotificationToast 
        show={toastConfig.show} 
        message={toastConfig.message} 
        variant={toastConfig.variant}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 