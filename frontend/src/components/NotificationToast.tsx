import React from 'react';

interface NotificationToastProps {
  message: string;
  variant: 'default' | 'destructive';
  show: boolean;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, variant, show }) => {
  if (!show) {
    return null;
  }

  const baseClasses = "fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in-0 slide-in-from-top-5 duration-500 font-semibold py-2 px-4 rounded-md shadow-lg";
  
  const variants = {
    default: "bg-foreground text-background",
    destructive: "bg-red-600 text-white",
  };

  return (
    <div className={`${baseClasses} ${variants[variant]}`}>
        <p>{message}</p>
    </div>
  );
};

export default NotificationToast; 